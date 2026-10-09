/**
 * SubRadar Desktop — In-Browser WebCrypto Fallback Bridge
 * 
 * Activated only when running outside Electron (e.g. testing in browser preview).
 * Implements PBKDF2 + AES-GCM over window.crypto.subtle with localStorage persistence.
 */

(function () {
  if (window.subradarAPI) {
    // Native Electron bridge is already present
    return;
  }

  console.info('[SubRadar] Running in browser preview mode. Initializing WebCrypto simulation bridge.');

  const STORAGE_KEY = 'subradar_browser_vault_envelope';
  let memoryData = null;
  let isUnlocked = false;

  async function deriveKey(password, salt) {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      enc.encode(password),
      'PBKDF2',
      false,
      ['deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  async function encryptWeb(data, password) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await deriveKey(password, salt);

    const encoded = new TextEncoder().encode(JSON.stringify(data));
    const cipherBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoded
    );

    return {
      salt: Array.from(salt),
      iv: Array.from(iv),
      ciphertext: Array.from(new Uint8Array(cipherBuffer)),
      createdAt: new Date().toISOString()
    };
  }

  async function decryptWeb(envelope, password) {
    const salt = new Uint8Array(envelope.salt);
    const iv = new Uint8Array(envelope.iv);
    const ciphertext = new Uint8Array(envelope.ciphertext);

    const key = await deriveKey(password, salt);
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ciphertext
    );

    return JSON.parse(new TextDecoder().decode(decrypted));
  }

  const initialMockData = {
    version: 1,
    createdAt: new Date().toISOString(),
    userPreferences: { currency: 'USD', theme: 'dark', language: 'tr', alertDaysAhead: 2 },
    subscriptions: [
      {
        id: 'sub-adobe-cc',
        name: 'Adobe Creative Cloud',
        plan: 'All Apps',
        price: 54.99,
        currency: 'USD',
        billingCycle: 'monthly',
        nextRenewalDate: new Date(Date.now() + 18 * 86400000).toISOString().split('T')[0],
        category: 'Design',
        status: 'idle',
        trialEndDate: null,
        directCancelUrl: 'https://account.adobe.com/plans',
        notes: 'Son 45 gündür hiç Illustrator/Photoshop açılmadı.',
        cancellationProtocolExecuted: false
      },
      {
        id: 'sub-jetbrains-pack',
        name: 'JetBrains Toolbox',
        plan: 'All Products Pack',
        price: 28.90,
        currency: 'USD',
        billingCycle: 'monthly',
        nextRenewalDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
        category: 'Development',
        status: 'idle',
        trialEndDate: null,
        directCancelUrl: 'https://account.jetbrains.com/licenses',
        notes: 'Ekip profilinde boşta duruyor.',
        cancellationProtocolExecuted: false
      },
      {
        id: 'sub-figma-pro',
        name: 'Figma Professional',
        plan: 'Editor Seat',
        price: 15.00,
        currency: 'USD',
        billingCycle: 'monthly',
        nextRenewalDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
        category: 'Design',
        status: 'trial',
        trialEndDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
        directCancelUrl: 'https://www.figma.com/settings',
        notes: '14 günlük deneme sürümü 2 gün içinde faturaya dönüşecek.',
        cancellationProtocolExecuted: false
      },
      {
        id: 'sub-chatgpt-plus',
        name: 'ChatGPT Plus',
        plan: 'GPT-4o & Canvas',
        price: 20.00,
        currency: 'USD',
        billingCycle: 'monthly',
        nextRenewalDate: new Date(Date.now() + 22 * 86400000).toISOString().split('T')[0],
        category: 'AI & Productivity',
        status: 'active',
        trialEndDate: null,
        directCancelUrl: 'https://chatgpt.com/#settings/Subscription',
        notes: 'Vazgeçilmez günlük akış.',
        cancellationProtocolExecuted: false
      }
    ]
  };

  // Mock subradarAPI
  window.subradarAPI = {
    isElectron: false,
    platform: navigator.platform.includes('Mac') ? 'darwin' : 'win32',

    window: {
      minimize: async () => console.log('[Mock] Window minimize'),
      maximize: async () => console.log('[Mock] Window maximize'),
      close: async () => alert('Pencereyi kapatmak için tarayıcı sekmesini kapatabilirsiniz.'),
      isMaximized: async () => false
    },

    vault: {
      hasVaultFile: async () => !!localStorage.getItem(STORAGE_KEY),
      setupVault: async (masterPassword) => {
        const env = await encryptWeb(initialMockData, masterPassword);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(env));
        memoryData = JSON.parse(JSON.stringify(initialMockData));
        isUnlocked = true;
        return { success: true, data: memoryData };
      },
      unlock: async (masterPassword) => {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return { success: false, error: 'Vault bulunamadı.' };
        try {
          const env = JSON.parse(raw);
          const data = await decryptWeb(env, masterPassword);
          memoryData = data;
          isUnlocked = true;
          return { success: true, data };
        } catch (e) {
          return { success: false, error: 'Hatalı ana şifre veya bozulmuş veri.' };
        }
      },
      lock: async () => {
        memoryData = null;
        isUnlocked = false;
        return { success: true };
      },
      isUnlocked: async () => isUnlocked
    },

    subscriptions: {
      list: async () => {
        if (!isUnlocked) throw new Error('Kasa kilitli.');
        return memoryData.subscriptions || [];
      },
      add: async (subData) => {
        if (!isUnlocked) throw new Error('Kasa kilitli.');
        const newSub = {
          ...subData,
          id: 'sub-' + Date.now().toString(36),
          createdAt: new Date().toISOString()
        };
        memoryData.subscriptions.unshift(newSub);
        return newSub;
      },
      update: async (id, subData) => {
        if (!isUnlocked) throw new Error('Kasa kilitli.');
        const idx = memoryData.subscriptions.findIndex(s => s.id === id);
        if (idx !== -1) {
          memoryData.subscriptions[idx] = { ...memoryData.subscriptions[idx], ...subData };
          return memoryData.subscriptions[idx];
        }
        throw new Error('Abonelik bulunamadı.');
      },
      delete: async (id) => {
        if (!isUnlocked) throw new Error('Kasa kilitli.');
        memoryData.subscriptions = memoryData.subscriptions.filter(s => s.id !== id);
        return { success: true };
      },
      executeKill: async (id) => {
        if (!isUnlocked) throw new Error('Kasa kilitli.');
        const sub = memoryData.subscriptions.find(s => s.id === id);
        if (sub) {
          sub.status = 'cancelled';
          sub.cancellationProtocolExecuted = true;
          sub.cancelledAt = new Date().toISOString();
          return sub;
        }
        throw new Error('Abonelik bulunamadı.');
      }
    },

    preferences: {
      get: async () => (memoryData ? memoryData.userPreferences : { currency: 'USD', theme: 'dark' }),
      update: async (prefs) => {
        if (memoryData) memoryData.userPreferences = { ...memoryData.userPreferences, ...prefs };
        return prefs;
      }
    },

    legalNotice: {
      generate: async (subData, userInfo) => {
        const dateStr = new Date().toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' });
        return `RESMİ ABONELİK FESİH VE İPTAL BİLDİRİMİ\n\nTarih: ${dateStr}\nKime: ${subData.name} Müşteri Hizmetleri\nKonu: Abonelik İptali ve Otomatik Yenilemenin Durdurulması\n\n6502 sayılı Tüketicinin Korunması Hakkında Kanun uyarınca "${subData.name}" hizmetimin derhal iptal edilmesini ve kayıtlı kartımdan yeni çekim yapılmamasını talep ediyorum.\n\nAbone: ${(userInfo && userInfo.name) || 'Kullanıcı'}\nPlan: ${subData.plan || 'Standart'}\nTutar: ${subData.price} ${subData.currency}\n\nOluşturan: SubRadar Masaüstü Yerel Kasa`;
      }
    },

    system: {
      openExternal: async (url) => { window.open(url, '_blank'); return true; },
      copyToClipboard: (text) => { navigator.clipboard.writeText(text); return true; },
      exportBackup: async () => {
        const raw = localStorage.getItem(STORAGE_KEY) || JSON.stringify(initialMockData);
        const blob = new Blob([raw], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `subradar-backup-${new Date().toISOString().split('T')[0]}.subradar`;
        a.click();
        return { success: true };
      },
      importBackup: async () => alert('Yedek dosyasını geri yüklemek için masaüstü Electron uygulamasını kullanabilirsiniz.'),
      getMemoryStats: async () => ({ heapUsedMB: '14.2', rssMB: '18.4' })
    }
  };
})();
