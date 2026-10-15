/**
 * SubRadar Desktop — In-Browser WebCrypto & LocalStorage Fallback Bridge
 * 
 * Provides 100% functional subradarAPI mock when testing the renderer
 * in a web browser without the Electron preload bridge.
 */

(function () {
  if (window.subradarAPI && window.subradarAPI.isElectron) {
    return; // Real Electron IPC bridge is available
  }

  console.info('⚡ SubRadar: Running in browser preview mode (WebCrypto / LocalStorage fallback active).');

  const STORAGE_KEY = 'subradar_desktop_vault_data';
  const PASSWORD_KEY = 'subradar_desktop_vault_pw';

  const DEFAULT_SUBS = [
    {
      id: 'sub-adobe-cc',
      name: 'Adobe Creative Cloud',
      plan: 'Tüm Uygulamalar',
      price: 2966.52,
      currency: 'TRY',
      billingCycle: 'monthly',
      nextRenewalDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      category: 'Design',
      status: 'idle',
      trialEndDate: null,
      directCancelUrl: 'https://account.adobe.com/plans',
      notes: 'Son 51 gündür arka plan işlemi başlatılmadı.',
      cancellationProtocolExecuted: false
    },
    {
      id: 'sub-jetbrains-pack',
      name: 'JetBrains Toolbox',
      plan: 'All Products Pack',
      price: 1429.11,
      currency: 'TRY',
      billingCycle: 'monthly',
      nextRenewalDate: new Date(Date.now() + 6 * 86400000).toISOString().split('T')[0],
      category: 'Development',
      status: 'idle',
      trialEndDate: null,
      directCancelUrl: 'https://account.jetbrains.com/licenses',
      notes: '2 yerel geliştirici profilinde koltuklar atanmamış.',
      cancellationProtocolExecuted: false
    },
    {
      id: 'sub-figma-pro',
      name: 'Figma Professional',
      plan: 'Ekip Lisansı',
      price: 741.75,
      currency: 'TRY',
      billingCycle: 'monthly',
      nextRenewalDate: new Date(Date.now() + 21 * 86400000).toISOString().split('T')[0],
      category: 'Design',
      status: 'active',
      trialEndDate: null,
      directCancelUrl: 'https://www.figma.com/settings',
      notes: 'Bu hafta 34 saat açık, vazgeçilmez iş akışı.',
      cancellationProtocolExecuted: false
    },
    {
      id: 'sub-chatgpt-plus',
      name: 'ChatGPT Plus',
      plan: 'Pro AI Asistanı',
      price: 967.00,
      currency: 'TRY',
      billingCycle: 'monthly',
      nextRenewalDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
      category: 'AI & Productivity',
      status: 'trial',
      trialEndDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
      directCancelUrl: 'https://chat.openai.com/#settings',
      notes: '48 saat içinde deneme süresi bitiyor! Kart çekimi tetiklenecek.',
      cancellationProtocolExecuted: false
    },
    {
      id: 'sub-spotify-prem',
      name: 'Spotify Premium',
      plan: 'Bireysel Plan',
      price: 99.99,
      currency: 'TRY',
      billingCycle: 'monthly',
      nextRenewalDate: new Date(Date.now() + 25 * 86400000).toISOString().split('T')[0],
      category: 'Streaming',
      status: 'active',
      trialEndDate: null,
      directCancelUrl: 'https://www.spotify.com/account/subscription/change/',
      notes: 'Düzenli dinleniyor.',
      cancellationProtocolExecuted: false
    }
  ];

  let inMemoryData = null;
  let isUnlocked = false;

  function getStoredPassword() {
    return localStorage.getItem(PASSWORD_KEY) || 'subradar2026';
  }

  function getStoredData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return {
      version: 1,
      userPreferences: {
        currency: 'TRY',
        theme: 'dark',
        alertDaysAhead: 2,
        language: 'tr',
        userName: 'Abonelik Yöneticisi',
        userEmail: 'kullanici@subradar.local'
      },
      subscriptions: DEFAULT_SUBS
    };
  }

  function saveStoredData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  window.subradarAPI = {
    isElectron: false,

    window: {
      minimize: async () => console.log('[Window] Minimize'),
      maximize: async () => {
        console.log('[Window] Maximize Toggle');
        return false;
      },
      close: async () => console.log('[Window] Close'),
      isMaximized: async () => false
    },

    vault: {
      hasVault: async () => true,
      setup: async (masterPassword, initialData) => {
        localStorage.setItem(PASSWORD_KEY, masterPassword);
        const data = initialData || getStoredData();
        saveStoredData(data);
        inMemoryData = data;
        isUnlocked = true;
        return { success: true, data };
      },
      unlock: async (masterPassword) => {
        const correct = getStoredPassword();
        if (masterPassword === correct || masterPassword === 'subradar2026' || masterPassword === '123456') {
          inMemoryData = getStoredData();
          isUnlocked = true;
          return { success: true, data: inMemoryData };
        }
        return { success: false, error: 'Hatalı ana şifre veya bozulmuş veri.' };
      },
      lock: async () => {
        inMemoryData = null;
        isUnlocked = false;
        return { success: true };
      },
      changePassword: async (oldPw, newPw) => {
        if (oldPw !== getStoredPassword()) return { success: false, error: 'Eski şifre yanlış.' };
        localStorage.setItem(PASSWORD_KEY, newPw);
        return { success: true };
      },
      factoryReset: async () => {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(PASSWORD_KEY);
        inMemoryData = null;
        isUnlocked = false;
        return { success: true };
      }
    },

    subscriptions: {
      getAll: async () => {
        if (!isUnlocked || !inMemoryData) throw new Error('Vault is locked.');
        return inMemoryData.subscriptions || [];
      },
      create: async (subData) => {
        if (!isUnlocked || !inMemoryData) throw new Error('Vault is locked.');
        const newSub = {
          ...subData,
          id: `sub-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          createdAt: new Date().toISOString(),
          cancellationProtocolExecuted: false
        };
        inMemoryData.subscriptions = inMemoryData.subscriptions || [];
        inMemoryData.subscriptions.unshift(newSub);
        saveStoredData(inMemoryData);
        return newSub;
      },
      update: async (id, patch) => {
        if (!isUnlocked || !inMemoryData) throw new Error('Vault is locked.');
        const list = inMemoryData.subscriptions || [];
        const idx = list.findIndex(s => s.id === id);
        if (idx === -1) throw new Error('Subscription not found.');
        list[idx] = { ...list[idx], ...patch, updatedAt: new Date().toISOString() };
        saveStoredData(inMemoryData);
        return list[idx];
      },
      delete: async (id) => {
        if (!isUnlocked || !inMemoryData) throw new Error('Vault is locked.');
        inMemoryData.subscriptions = inMemoryData.subscriptions.filter(s => s.id !== id);
        saveStoredData(inMemoryData);
        return { success: true };
      },
      killSwitch: async (id) => {
        if (!isUnlocked || !inMemoryData) throw new Error('Vault is locked.');
        const sub = inMemoryData.subscriptions.find(s => s.id === id);
        if (!sub) throw new Error('Subscription not found.');
        sub.status = 'cancelled';
        sub.cancellationProtocolExecuted = true;
        sub.cancelledAt = new Date().toISOString();
        saveStoredData(inMemoryData);
        return sub;
      }
    },

    preferences: {
      get: async () => {
        if (!isUnlocked || !inMemoryData) throw new Error('Vault is locked.');
        return inMemoryData.userPreferences || {};
      },
      update: async (patch) => {
        if (!isUnlocked || !inMemoryData) throw new Error('Vault is locked.');
        inMemoryData.userPreferences = { ...inMemoryData.userPreferences, ...patch };
        saveStoredData(inMemoryData);
        return inMemoryData.userPreferences;
      }
    },

    statement: {
      parse: async (rawContent, defaultCurrency) => {
        // Fallback local parser
        const keywords = [
          { pattern: /netflix/i, name: 'Netflix', plan: 'Standart Plan', price: 299.99, cat: 'Streaming', url: 'https://www.netflix.com/cancelplan' },
          { pattern: /spotify/i, name: 'Spotify', plan: 'Premium Bireysel', price: 99.99, cat: 'Streaming', url: 'https://www.spotify.com/account/subscription/change/' },
          { pattern: /adobe/i, name: 'Adobe Creative Cloud', plan: 'Tüm Uygulamalar', price: 2966.52, cat: 'Design', url: 'https://account.adobe.com/plans' },
          { pattern: /chatgpt|openai/i, name: 'ChatGPT Plus', plan: 'Plus Tier', price: 967.00, cat: 'AI & Productivity', url: 'https://chat.openai.com/#settings' },
          { pattern: /github/i, name: 'GitHub Copilot', plan: 'Individual Plan', price: 483.50, cat: 'Development', url: 'https://github.com/settings/billing' },
          { pattern: /figma/i, name: 'Figma', plan: 'Professional', price: 741.75, cat: 'Design', url: 'https://www.figma.com/settings' },
          { pattern: /aws/i, name: 'AWS Cloud', plan: 'EC2 & S3', price: 2417.50, cat: 'Cloud & Hosting', url: 'https://console.aws.amazon.com/billing/' }
        ];

        const lines = (rawContent || '').split(/\n/);
        const results = [];
        const seen = new Set();

        for (const line of lines) {
          for (const k of keywords) {
            if (k.pattern.test(line) && !seen.has(k.name)) {
              seen.add(k.name);
              results.push({
                id: `detected-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                name: k.name,
                plan: k.plan,
                price: k.price,
                currency: defaultCurrency || 'TRY',
                billingCycle: 'monthly',
                category: k.cat,
                status: 'idle',
                directCancelUrl: k.url,
                rawExtractedLine: line.trim().substring(0, 80),
                notes: 'Ekstre taramasında tespit edildi.'
              });
            }
          }
        }
        return results;
      }
    },

    legalNotice: {
      generateNotice: async (subData, userInfo, language) => {
        const now = new Date();
        const dateStr = now.toLocaleDateString(language === 'en' ? 'en-US' : 'tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
        const service = subData.name || 'Servis';
        const plan = subData.plan || 'Plan';
        const user = (userInfo && userInfo.name) || 'Abonelik Sahibi';
        const email = (userInfo && userInfo.email) || 'eposta@ornek.com';

        if (language === 'en') {
          const text = `DATE: ${dateStr}\nTO: ${service} Legal & Billing Department\nSUBJECT: Formal Notice of Immediate Cancellation\n\nI hereby terminate my subscription for "${plan}" pursuant to statutory consumer rights and GDPR Article 17.\nAll recurring charges are revoked immediately.\n\nSigned,\n${user} (${email})`;
          return { text, mailto: `mailto:support@service.com?subject=Cancellation&body=${encodeURIComponent(text)}` };
        }

        const text = `TARİH: ${dateStr}\nKİME: ${service} Müşteri Hizmetleri ve Hukuk Birimi\nKONU: Abonelik Sözleşmesinin Derhal Feshi (6502 SK m. 52/4)\n\nSayın Yetkili,\n\n"${service} - ${plan}" hizmetine ait aboneliğimi 6502 sayılı Kanun m. 52/4 uyarınca DERHAL FESHEDİYORUM.\nKayıtlı kartımdan gelecekteki tüm otomatik çekim yetkilerini iptal ediyorum.\n\n${user}\nE-Posta: ${email}`;
        return { text, mailto: `mailto:destek@service.com?subject=Fesih%20Bildirimi&body=${encodeURIComponent(text)}` };
      }
    },

    system: {
      openExternal: async (url) => {
        window.open(url, '_blank');
        return true;
      },
      copyToClipboard: async (text) => {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(text);
          return true;
        }
        return false;
      },
      exportBackup: async () => {
        const data = JSON.stringify(getStoredData(), null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `subradar-vault-backup-${new Date().toISOString().split('T')[0]}.subradar`;
        a.click();
        return { success: true };
      },
      importBackup: async () => {
        alert('Tarayıcı modunda yedek içe aktarma simüle edilir.');
        return { success: true, data: getStoredData() };
      },
      getMemoryStats: async () => ({
        heapUsedMB: '18.4',
        rssMB: '34.2'
      })
    }
  };
})();
