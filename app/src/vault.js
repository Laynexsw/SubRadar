const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { app } = require('electron');

// Kasa dosyasının kaydedileceği yer (Kullanıcı AppData veya yerel data klasörü)
function getDataDir() {
  const baseDir = app ? app.getPath('userData') : path.join(__dirname, '..', 'data');
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }
  return baseDir;
}

const VAULT_FILE = path.join(getDataDir(), 'vault.subradar');
const ENCRYPTION_KEY = crypto.scryptSync('subradar-local-offline-vault-key-2026', 'subradar-salt', 32);
const IV_LENGTH = 16;

// Varsayılan ilk abonelik verileri (Vitrindeki verilerle uyumlu zengin başlangıç)
const DEFAULT_SUBSCRIPTIONS = [
  {
    id: 'sub-1',
    name: 'Netflix',
    category: 'Eğlence',
    plan: 'Özel Plan (4K HDR)',
    price: 299.99,
    currency: 'TRY',
    cycle: 'monthly',
    nextBillingDate: '2026-10-14',
    status: 'active', // active, cancelled, paused
    riskLevel: 'none', // none, warning, danger
    riskReason: '',
    trial: false,
    lastUsedDaysAgo: 2,
    cancelUrl: 'https://www.netflix.com/youraccount',
    color: '#E50914',
    icon: 'movie'
  },
  {
    id: 'sub-2',
    name: 'Adobe Creative Cloud',
    category: 'Tasarım & Yazılım',
    plan: 'Tüm Uygulamalar Paketi',
    price: 1150.00,
    currency: 'TRY',
    cycle: 'monthly',
    nextBillingDate: '2026-10-11',
    status: 'active',
    riskLevel: 'danger',
    riskReason: '42 gündür hiçbir Adobe uygulaması açılmadı. Otomatik yenileme öncesi tasarruf fırsatı!',
    trial: false,
    lastUsedDaysAgo: 42,
    cancelUrl: 'https://account.adobe.com/plans',
    color: '#FF0000',
    icon: 'palette'
  },
  {
    id: 'sub-3',
    name: 'Spotify',
    category: 'Müzik & Ses',
    plan: 'Premium Aile',
    price: 99.90,
    currency: 'TRY',
    cycle: 'monthly',
    nextBillingDate: '2026-10-28',
    status: 'active',
    riskLevel: 'none',
    riskReason: '',
    trial: false,
    lastUsedDaysAgo: 1,
    cancelUrl: 'https://www.spotify.com/account/subscription/',
    color: '#1DB954',
    icon: 'headphones'
  },
  {
    id: 'sub-4',
    name: 'GitHub Copilot',
    category: 'Yazılım & AI',
    plan: 'Individual Plan',
    price: 10.00,
    currency: 'USD',
    cycle: 'monthly',
    nextBillingDate: '2026-10-19',
    status: 'active',
    riskLevel: 'none',
    riskReason: '',
    trial: false,
    lastUsedDaysAgo: 0,
    cancelUrl: 'https://github.com/settings/copilot',
    color: '#2ea44f',
    icon: 'terminal'
  },
  {
    id: 'sub-5',
    name: 'ChatGPT Plus',
    category: 'Yapay Zekâ',
    plan: 'OpenAI GPT-4o & o1',
    price: 20.00,
    currency: 'USD',
    cycle: 'monthly',
    nextBillingDate: '2026-10-12',
    status: 'active',
    riskLevel: 'none',
    riskReason: '',
    trial: false,
    lastUsedDaysAgo: 0,
    cancelUrl: 'https://chatgpt.com/#settings/Subscription',
    color: '#10A37F',
    icon: 'psychology'
  },
  {
    id: 'sub-6',
    name: 'Canva Pro',
    category: 'Tasarım & Grafik',
    plan: '30 Günlük Ücretsiz Deneme',
    price: 129.99,
    currency: 'TRY',
    cycle: 'monthly',
    nextBillingDate: '2026-10-09',
    status: 'active',
    riskLevel: 'danger',
    riskReason: 'Deneme süresi yarın doluyor! İptal edilmezse karttan 129.99 ₺ çekilecek.',
    trial: true,
    lastUsedDaysAgo: 14,
    cancelUrl: 'https://www.canva.com/settings/billing-and-teams',
    color: '#7D2AE8',
    icon: 'auto_fix_high'
  },
  {
    id: 'sub-7',
    name: 'Figma',
    category: 'Tasarım',
    plan: 'Professional Editor',
    price: 15.00,
    currency: 'USD',
    cycle: 'monthly',
    nextBillingDate: '2026-10-24',
    status: 'active',
    riskLevel: 'none',
    riskReason: '',
    trial: false,
    lastUsedDaysAgo: 3,
    cancelUrl: 'https://www.figma.com/settings',
    color: '#F24E1E',
    icon: 'draw'
  }
];

class EncryptedVault {
  constructor() {
    this.vaultPath = VAULT_FILE;
  }

  encrypt(text) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  }

  decrypt(encryptedText) {
    const parts = encryptedText.split(':');
    const iv = Buffer.from(parts.shift(), 'hex');
    const encrypted = Buffer.from(parts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  getAll() {
    try {
      if (!fs.existsSync(this.vaultPath)) {
        this.saveAll(DEFAULT_SUBSCRIPTIONS);
        return DEFAULT_SUBSCRIPTIONS;
      }
      const rawEncrypted = fs.readFileSync(this.vaultPath, 'utf8');
      const decryptedJson = this.decrypt(rawEncrypted);
      return JSON.parse(decryptedJson);
    } catch (err) {
      console.error('Kasa okuma hatası, varsayılanlar yükleniyor:', err);
      return DEFAULT_SUBSCRIPTIONS;
    }
  }

  saveAll(subscriptions) {
    try {
      const json = JSON.stringify(subscriptions, null, 2);
      const encrypted = this.encrypt(json);
      fs.writeFileSync(this.vaultPath, encrypted, 'utf8');
      return true;
    } catch (err) {
      console.error('Kasa kaydetme hatası:', err);
      return false;
    }
  }

  add(sub) {
    const subs = this.getAll();
    const newSub = {
      id: 'sub-' + Date.now(),
      status: 'active',
      riskLevel: 'none',
      riskReason: '',
      lastUsedDaysAgo: 0,
      ...sub
    };
    subs.unshift(newSub);
    this.saveAll(subs);
    return newSub;
  }

  update(id, updatedFields) {
    const subs = this.getAll();
    const index = subs.findIndex(s => s.id === id);
    if (index !== -1) {
      subs[index] = { ...subs[index], ...updatedFields };
      this.saveAll(subs);
      return subs[index];
    }
    return null;
  }

  delete(id) {
    const subs = this.getAll();
    const filtered = subs.filter(s => s.id !== id);
    this.saveAll(filtered);
    return true;
  }

  cancel(id) {
    return this.update(id, {
      status: 'cancelled',
      riskLevel: 'none',
      cancelledAt: new Date().toISOString()
    });
  }

  resetDemo() {
    this.saveAll(DEFAULT_SUBSCRIPTIONS);
    return DEFAULT_SUBSCRIPTIONS;
  }
}

module.exports = new EncryptedVault();
