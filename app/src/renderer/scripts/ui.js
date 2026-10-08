/**
 * SubRadar Desktop — UI DOM Renderer & Visual Controllers
 */

// Toast Bildirimi Gösterici
window.showToast = function (message, icon = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span class="material-symbols-outlined" style="color:#6366f1;font-size:18px;">${icon}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.2s ease';
    setTimeout(() => toast.remove(), 200);
  }, 3200);
};

class UIRenderer {
  constructor() {
    this.grid = document.getElementById('subs-grid');
    this.kpiMonthly = document.getElementById('kpi-monthly');
    this.kpiYearly = document.getElementById('kpi-yearly');
    this.kpiActive = document.getElementById('kpi-active');
    this.kpiWaste = document.getElementById('kpi-waste');
    this.initEvents();
  }

  initEvents() {
    // Sekme Filtreleri
    document.querySelectorAll('.filter-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        window.subStore.activeFilter = tab.dataset.filter || 'all';
        window.subStore.notify();
      });
    });

    // Arama Girişi
    const searchInput = document.getElementById('search-input');
    searchInput?.addEventListener('input', (e) => {
      window.subStore.searchQuery = e.target.value.trim();
      window.subStore.notify();
    });

    // Kasa Sıfırlama Butonu (Demo Yenileme)
    document.getElementById('btn-reset-demo')?.addEventListener('click', async () => {
      if (confirm('Abonelik verileri varsayılan örnek kasaya sıfırlansın mı?')) {
        await window.subStore.resetDemo();
        window.showToast('Demo kasası başarıyla sıfırlandı.');
      }
    });
  }

  render(store) {
    this.renderKPIs(store);
    this.renderGrid(store);
  }

  renderKPIs(store) {
    const metrics = store.getMetrics();
    if (this.kpiMonthly) this.kpiMonthly.textContent = `₺${metrics.monthly.toLocaleString('tr-TR')}`;
    if (this.kpiYearly) this.kpiYearly.textContent = `₺${metrics.yearly.toLocaleString('tr-TR')}`;
    if (this.kpiActive) this.kpiActive.textContent = `${metrics.activeCount} Aktif`;
    if (this.kpiWaste) this.kpiWaste.textContent = `₺${metrics.waste.toLocaleString('tr-TR')}`;
  }

  renderGrid(store) {
    if (!this.grid) return;
    const items = store.getFiltered();

    if (items.length === 0) {
      this.grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <span class="material-symbols-outlined">search_off</span>
          <h3 style="font-size:16px;color:#fff;margin-bottom:6px;">Abonelik Bulunamadı</h3>
          <p style="font-size:13px;">Arama kriterinize veya filtrenize uygun kayıt mevcut değil.</p>
        </div>
      `;
      return;
    }

    this.grid.innerHTML = items.map(sub => this.createCardHTML(sub)).join('');

    // Kart İçi Buton Olaylarını Bağla
    items.forEach(sub => {
      // İptal Butonu
      const btnCancel = document.getElementById(`btn-cancel-${sub.id}`);
      btnCancel?.addEventListener('click', () => {
        window.cancelWizard.open(sub);
      });

      // Silme Butonu
      const btnDelete = document.getElementById(`btn-delete-${sub.id}`);
      btnDelete?.addEventListener('click', async () => {
        if (confirm(`'${sub.name}' kaydını kalıcı olarak silmek istiyor musunuz?`)) {
          await window.subStore.delete(sub.id);
          window.showToast(`'${sub.name}' kaydı silindi.`);
        }
      });

      // Dış Bağlantı Açma
      const btnOpen = document.getElementById(`btn-open-${sub.id}`);
      btnOpen?.addEventListener('click', () => {
        if (sub.cancelUrl) {
          if (window.subradar && window.subradar.openExternal) {
            window.subradar.openExternal(sub.cancelUrl);
          } else {
            window.open(sub.cancelUrl, '_blank');
          }
        }
      });
    });
  }

  createCardHTML(sub) {
    const isCancelled = sub.status === 'cancelled';
    const hasRisk = !isCancelled && (sub.riskLevel === 'danger' || sub.riskLevel === 'warning');

    // Kalan Gün Hesaplama
    let daysLeftText = '';
    let isUrgent = false;
    if (sub.nextBillingDate && !isCancelled) {
      const today = new Date();
      const billing = new Date(sub.nextBillingDate);
      const diffTime = billing - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 0) {
        daysLeftText = 'Bugün yenileniyor';
        isUrgent = true;
      } else if (diffDays === 1) {
        daysLeftText = 'Yarın yenileniyor';
        isUrgent = true;
      } else if (diffDays <= 3) {
        daysLeftText = `${diffDays} gün kaldı (Acil)`;
        isUrgent = true;
      } else {
        daysLeftText = `${diffDays} gün kaldı`;
      }
    }

    const currencySymbol = sub.currency === 'USD' ? '$' : sub.currency === 'EUR' ? '€' : sub.currency === 'GBP' ? '£' : '₺';

    return `
      <div class="sub-card ${isCancelled ? 'cancelled' : ''}" id="card-${sub.id}">
        <div class="sub-card-top">
          <div class="sub-brand">
            <div class="sub-avatar" style="background-color: ${sub.color || '#6366f1'};">
              <span class="material-symbols-outlined" style="font-size:24px;">${sub.icon || 'star'}</span>
            </div>
            <div class="sub-info">
              <h3>${sub.name}</h3>
              <div class="sub-plan">${sub.plan || 'Standart'} &bull; <span style="color:#64748b;">${sub.category || 'Genel'}</span></div>
            </div>
          </div>
          <div class="sub-pricing">
            <div class="sub-amount">${currencySymbol}${sub.price}</div>
            <div class="sub-cycle">${sub.cycle === 'yearly' ? 'Yıllık' : 'Aylık'}</div>
          </div>
        </div>

        ${hasRisk ? `
          <div class="sub-risk-banner ${sub.trial ? 'trial' : ''}">
            <span class="material-symbols-outlined" style="font-size:18px;flex-shrink:0;">
              ${sub.trial ? 'hourglass_top' : 'warning'}
            </span>
            <span>${sub.riskReason || 'Olası israf veya deneme süresi uyarısı.'}</span>
          </div>
        ` : ''}

        <div class="sub-meta-row">
          <div class="billing-badge">
            <span class="material-symbols-outlined" style="font-size:15px;color:#64748b;">event</span>
            <span>${isCancelled ? 'İptal Tarihi' : 'Sonraki Yenileme'}: ${sub.nextBillingDate || 'Belirtilmedi'}</span>
          </div>
          ${!isCancelled && daysLeftText ? `
            <span class="days-left-pill ${isUrgent ? 'urgent' : ''}">${daysLeftText}</span>
          ` : ''}
        </div>

        <div class="sub-actions-row">
          ${!isCancelled ? `
            <button class="btn-cancel-instant" id="btn-cancel-${sub.id}">
              <span class="material-symbols-outlined" style="font-size:16px;">bolt</span>
              <span>Tek Tıkla İptal</span>
            </button>
            ${sub.cancelUrl ? `
              <button class="btn-icon-action" id="btn-open-${sub.id}" title="İptal Portalını Aç">
                <span class="material-symbols-outlined">open_in_new</span>
              </button>
            ` : ''}
          ` : `
            <div class="cancelled-status-badge">
              <span class="material-symbols-outlined" style="color:#10b981;font-size:18px;">check_circle</span>
              <span>İptal Edildi — Tasarruf Sağlandı</span>
            </div>
          `}
          <button class="btn-icon-action" id="btn-delete-${sub.id}" title="Kaydı Sil" style="margin-left:auto;">
            <span class="material-symbols-outlined" style="font-size:16px;">delete</span>
          </button>
        </div>
      </div>
    `;
  }
}

window.uiRenderer = new UIRenderer();
