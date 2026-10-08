/**
 * SubRadar Desktop — Add / Edit Subscription Modal
 */

const PRESET_SERVICES = {
  netflix: { name: 'Netflix', category: 'Eğlence', plan: 'Standart / 4K', price: 299.99, currency: 'TRY', color: '#E50914', icon: 'movie', cancelUrl: 'https://www.netflix.com/youraccount' },
  spotify: { name: 'Spotify', category: 'Müzik & Ses', plan: 'Premium Bireysel', price: 59.99, currency: 'TRY', color: '#1DB954', icon: 'headphones', cancelUrl: 'https://www.spotify.com/account/subscription/' },
  youtube: { name: 'YouTube Premium', category: 'Eğlence', plan: 'Bireysel Üyelik', price: 79.99, currency: 'TRY', color: '#FF0000', icon: 'play_circle', cancelUrl: 'https://www.youtube.com/paid_memberships' },
  chatgpt: { name: 'ChatGPT Plus', category: 'Yapay Zekâ', plan: 'Plus (GPT-4o)', price: 20.00, currency: 'USD', color: '#10A37F', icon: 'psychology', cancelUrl: 'https://chatgpt.com/#settings/Subscription' },
  claude: { name: 'Claude Pro', category: 'Yapay Zekâ', plan: 'Anthropic Pro', price: 20.00, currency: 'USD', color: '#D97706', icon: 'smart_toy', cancelUrl: 'https://claude.ai/settings/billing' },
  adobe: { name: 'Adobe Creative Cloud', category: 'Tasarım', plan: 'Tek Uygulama / Paket', price: 1150.00, currency: 'TRY', color: '#FF0000', icon: 'palette', cancelUrl: 'https://account.adobe.com/plans' },
  github: { name: 'GitHub Copilot', category: 'Yazılım', plan: 'Individual', price: 10.00, currency: 'USD', color: '#2ea44f', icon: 'terminal', cancelUrl: 'https://github.com/settings/copilot' },
  icloud: { name: 'iCloud+ (Apple)', category: 'Bulut & Depolama', plan: '200 GB Plan', price: 79.99, currency: 'TRY', color: '#0284C7', icon: 'cloud', cancelUrl: 'https://support.apple.com/billing' },
  prime: { name: 'Amazon Prime', category: 'Eğlence & Alışveriş', plan: 'Aylık Üyelik', price: 39.00, currency: 'TRY', color: '#00A8E1', icon: 'shopping_bag', cancelUrl: 'https://www.amazon.com.tr/mc/manage' }
};

class AddSubModal {
  constructor() {
    this.modalEl = document.getElementById('add-modal');
    this.form = document.getElementById('add-sub-form');
    this.init();
  }

  init() {
    // Açma & Kapatma Butonları
    document.getElementById('btn-open-add-modal')?.addEventListener('click', () => this.open());
    document.getElementById('btn-close-add-modal')?.addEventListener('click', () => this.close());
    document.getElementById('btn-cancel-add')?.addEventListener('click', () => this.close());

    // Hızlı Şablon Seçici
    document.getElementById('preset-selector')?.addEventListener('change', (e) => {
      const key = e.target.value;
      if (key && PRESET_SERVICES[key]) {
        this.fillPreset(PRESET_SERVICES[key]);
      }
    });

    // Form Gönderimi
    this.form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.save();
    });
  }

  open() {
    this.form?.reset();
    // Varsayılan tarihi 30 gün sonraya ayarla
    const nextMonth = new Date();
    nextMonth.setDate(nextMonth.getDate() + 30);
    const dateInput = document.getElementById('form-billing-date');
    if (dateInput) dateInput.value = nextMonth.toISOString().split('T')[0];

    this.modalEl?.classList.add('active');
  }

  close() {
    this.modalEl?.classList.remove('active');
  }

  fillPreset(preset) {
    document.getElementById('form-name').value = preset.name;
    document.getElementById('form-category').value = preset.category;
    document.getElementById('form-plan').value = preset.plan;
    document.getElementById('form-price').value = preset.price;
    document.getElementById('form-currency').value = preset.currency;
    document.getElementById('form-cancel-url').value = preset.cancelUrl || '';
    document.getElementById('form-color').value = preset.color || '#6366f1';
  }

  async save() {
    const name = document.getElementById('form-name').value.trim();
    if (!name) return;

    const category = document.getElementById('form-category').value || 'Diğer';
    const plan = document.getElementById('form-plan').value.trim() || 'Abonelik';
    const price = parseFloat(document.getElementById('form-price').value) || 0;
    const currency = document.getElementById('form-currency').value || 'TRY';
    const cycle = document.getElementById('form-cycle').value || 'monthly';
    const nextBillingDate = document.getElementById('form-billing-date').value || new Date().toISOString().split('T')[0];
    const isTrial = document.getElementById('form-trial').checked;
    const cancelUrl = document.getElementById('form-cancel-url').value.trim();
    const color = document.getElementById('form-color').value || '#6366f1';

    const subData = {
      name,
      category,
      plan,
      price,
      currency,
      cycle,
      nextBillingDate,
      trial: isTrial,
      cancelUrl,
      color,
      icon: 'star',
      status: 'active',
      riskLevel: isTrial ? 'danger' : 'none',
      riskReason: isTrial ? 'Deneme sürümü tespit edildi! Yenilenmeden önce kontrol edin.' : ''
    };

    await window.subStore.add(subData);
    this.close();
    window.showToast(`✅ '${name}' aboneliği güvenli yerel kasaya eklendi.`);
  }
}

window.addSubModal = new AddSubModal();
