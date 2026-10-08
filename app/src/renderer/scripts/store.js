/**
 * SubRadar Desktop — Store & State Management
 */

const FX_RATES = {
  TRY: 1.0,
  USD: 34.25,
  EUR: 37.10,
  GBP: 44.50
};

class SubStore {
  constructor() {
    this.subscriptions = [];
    this.activeFilter = 'all'; // all, active, risk, trial, cancelled
    this.searchQuery = '';
    this.currency = 'TRY';
    this.listeners = [];
  }

  // API veya LocalStorage üzerinden verileri yükle
  async init() {
    if (window.subradar && window.subradar.getSubscriptions) {
      this.subscriptions = await window.subradar.getSubscriptions();
    } else {
      // Browser fallback (yerel test için)
      const saved = localStorage.getItem('subradar_vault');
      if (saved) {
        this.subscriptions = JSON.parse(saved);
      } else {
        this.subscriptions = [];
      }
    }
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  notify() {
    this.listeners.forEach(fn => fn(this));
  }

  // Harcama Hesaplamaları
  getMonthlyCostInTry(sub) {
    const rate = FX_RATES[sub.currency] || 1;
    let monthlyPrice = sub.price * rate;
    if (sub.cycle === 'yearly') {
      monthlyPrice = monthlyPrice / 12;
    }
    return monthlyPrice;
  }

  getMetrics() {
    let totalMonthlyTry = 0;
    let activeCount = 0;
    let wasteTry = 0;
    let riskCount = 0;

    this.subscriptions.forEach(sub => {
      if (sub.status === 'active') {
        activeCount++;
        const monthly = this.getMonthlyCostInTry(sub);
        totalMonthlyTry += monthly;

        if (sub.riskLevel === 'danger' || sub.riskLevel === 'warning') {
          wasteTry += monthly;
          riskCount++;
        }
      }
    });

    const totalYearlyTry = totalMonthlyTry * 12;

    return {
      monthly: Math.round(totalMonthlyTry),
      yearly: Math.round(totalYearlyTry),
      activeCount,
      waste: Math.round(wasteTry),
      riskCount
    };
  }

  // Filtrelenmiş Liste
  getFiltered() {
    return this.subscriptions.filter(sub => {
      // Metin Arama
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        const matchName = sub.name.toLowerCase().includes(q);
        const matchPlan = (sub.plan || '').toLowerCase().includes(q);
        const matchCat = (sub.category || '').toLowerCase().includes(q);
        if (!matchName && !matchPlan && !matchCat) return false;
      }

      // Kategori/Sekme Filtresi
      if (this.activeFilter === 'active') {
        return sub.status === 'active';
      }
      if (this.activeFilter === 'risk') {
        return sub.status === 'active' && (sub.riskLevel === 'danger' || sub.riskLevel === 'warning');
      }
      if (this.activeFilter === 'trial') {
        return sub.status === 'active' && sub.trial;
      }
      if (this.activeFilter === 'cancelled') {
        return sub.status === 'cancelled';
      }

      return true; // 'all'
    });
  }

  // CRUD İşlemleri
  async add(subData) {
    if (window.subradar) {
      const added = await window.subradar.addSubscription(subData);
      this.subscriptions.unshift(added);
    } else {
      const added = { id: 'sub-' + Date.now(), status: 'active', ...subData };
      this.subscriptions.unshift(added);
      localStorage.setItem('subradar_vault', JSON.stringify(this.subscriptions));
    }
    this.notify();
  }

  async cancel(id) {
    if (window.subradar) {
      await window.subradar.cancelSubscription(id);
    }
    const target = this.subscriptions.find(s => s.id === id);
    if (target) {
      target.status = 'cancelled';
      target.riskLevel = 'none';
      if (!window.subradar) {
        localStorage.setItem('subradar_vault', JSON.stringify(this.subscriptions));
      }
    }
    this.notify();
  }

  async delete(id) {
    if (window.subradar) {
      await window.subradar.deleteSubscription(id);
    }
    this.subscriptions = this.subscriptions.filter(s => s.id !== id);
    if (!window.subradar) {
      localStorage.setItem('subradar_vault', JSON.stringify(this.subscriptions));
    }
    this.notify();
  }

  async resetDemo() {
    if (window.subradar) {
      this.subscriptions = await window.subradar.resetDemo();
    }
    this.notify();
  }
}

window.subStore = new SubStore();
