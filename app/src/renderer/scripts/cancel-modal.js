/**
 * SubRadar Desktop — One-Click Cancel Wizard Controller
 */

class CancelWizard {
  constructor() {
    this.modalEl = document.getElementById('cancel-modal');
    this.currentSub = null;
    this.init();
  }

  init() {
    // Kapatma butonları
    document.getElementById('btn-close-cancel-modal')?.addEventListener('click', () => this.close());
    document.getElementById('btn-cancel-modal-dismiss')?.addEventListener('click', () => this.close());

    // Doğrudan Web Sayfasına Git
    document.getElementById('btn-open-cancel-portal')?.addEventListener('click', () => {
      if (this.currentSub && this.currentSub.cancelUrl) {
        if (window.subradar && window.subradar.openExternal) {
          window.subradar.openExternal(this.currentSub.cancelUrl);
        } else {
          window.open(this.currentSub.cancelUrl, '_blank');
        }
        window.showToast(`'${this.currentSub.name}' iptal sayfası tarayıcınızda açıldı.`);
      }
    });

    // Dilekçe / E-posta Metnini Kopyala
    document.getElementById('btn-copy-cancel-letter')?.addEventListener('click', () => {
      const letterText = document.getElementById('cancel-letter-text')?.value;
      if (letterText) {
        if (window.subradar && window.subradar.copyToClipboard) {
          window.subradar.copyToClipboard(letterText);
        } else {
          navigator.clipboard.writeText(letterText);
        }
        window.showToast('Resmi iptal başvuru metni panoya kopyalandı.');
      }
    });

    // İptali Onayla ve Kasada İşaretle
    document.getElementById('btn-confirm-cancellation')?.addEventListener('click', async () => {
      if (this.currentSub) {
        await window.subStore.cancel(this.currentSub.id);
        this.close();
        window.showToast(`🎉 ${this.currentSub.name} başarıyla iptal edildi! Tasarruf hanenize eklendi.`);
      }
    });
  }

  open(sub) {
    this.currentSub = sub;
    const nameEl = document.getElementById('cancel-modal-sub-name');
    const planEl = document.getElementById('cancel-modal-sub-plan');
    const priceEl = document.getElementById('cancel-modal-sub-price');
    const avatarEl = document.getElementById('cancel-modal-sub-avatar');
    const letterEl = document.getElementById('cancel-letter-text');

    if (nameEl) nameEl.textContent = sub.name;
    if (planEl) planEl.textContent = sub.plan || 'Standart Plan';
    if (priceEl) priceEl.textContent = `${sub.price} ${sub.currency} / ${sub.cycle === 'yearly' ? 'yıl' : 'ay'}`;
    if (avatarEl) {
      avatarEl.style.backgroundColor = sub.color || '#6366f1';
      avatarEl.textContent = sub.name.substring(0, 1).toUpperCase();
    }

    // Kişiselleştirilmiş İptal E-posta Metni Oluştur
    const today = new Date().toLocaleDateString('tr-TR');
    const letter = `Konu: ${sub.name} Aboneliğimin İptali ve Otomatik Yenilemenin Durdurulması Talebi

Sayın ${sub.name} Müşteri Hizmetleri,

Hesabıma bağlı "${sub.plan || sub.name}" aboneliğimin ${today} tarihi itibarıyla derhal sonlandırılmasını, kayıtlı ödeme yöntemimden yapılacak gelecekteki tüm otomatik çekimlerin iptal edilmesini talep ediyorum.

Hizmet Şartları ve Tüketici Hakları uyarınca talebimin işleme alınarak tarafıma e-posta ile onay bilgisi iletilmesini rica ederim.

Saygılarımla,
SubRadar Güvenli Masaüstü İptal Asistanı`;

    if (letterEl) letterEl.value = letter;

    this.modalEl?.classList.add('active');
  }

  close() {
    this.modalEl?.classList.remove('active');
    this.currentSub = null;
  }
}

window.cancelWizard = new CancelWizard();
