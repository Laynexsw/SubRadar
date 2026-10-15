/**
 * SubRadar Desktop — Core Application & State Controller (app.js)
 * Impeccable Craft • Zero-Knowledge • 100% Offline Reactive Architecture
 */

(function () {
  'use strict';

  // -------------------------------------------------------------------------
  // Global State
  // -------------------------------------------------------------------------
  const state = {
    isUnlocked: false,
    activeTab: 'dashboard',
    subscriptions: [],
    preferences: {
      currency: 'TRY',
      theme: 'dark',
      language: 'tr',
      userName: 'Abonelik Yöneticisi',
      userEmail: 'kullanici@subradar.local'
    },
    rates: {
      TRY: 1,
      USD: 1 / 48.35,
      EUR: 1 / 52.10
    },
    filterStatus: 'all',
    filterCategory: 'all',
    searchQuery: '',
    editingSubId: null,
    currentNoticeSub: null
  };

  // -------------------------------------------------------------------------
  // Currency Formatting & Conversion
  // -------------------------------------------------------------------------
  function formatCurrency(amountTRY, targetCurrency = state.preferences.currency) {
    let rate = 1;
    let symbol = '₺';

    if (targetCurrency === 'USD') {
      rate = state.rates.USD;
      symbol = '$';
    } else if (targetCurrency === 'EUR') {
      rate = state.rates.EUR;
      symbol = '€';
    }

    const converted = amountTRY * rate;
    const formatted = converted.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `${symbol}${formatted}`;
  }

  // -------------------------------------------------------------------------
  // Toast Notifications
  // -------------------------------------------------------------------------
  let toastTimer = null;
  function showToast(message, icon = '✓') {
    const toast = document.getElementById('app-toast');
    if (!toast) return;
    toast.innerHTML = `<span style="color: var(--accent-emerald); font-weight: bold;">${icon}</span> <span>${message}</span>`;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  // -------------------------------------------------------------------------
  // DOM References
  // -------------------------------------------------------------------------
  const DOM = {
    // Titlebar
    btnClose: document.getElementById('btn-win-close'),
    btnMin: document.getElementById('btn-win-min'),
    btnMax: document.getElementById('btn-win-max'),
    vaultBadge: document.getElementById('vault-status-badge'),
    btnCmdTrigger: document.getElementById('btn-cmd-trigger'),
    currencySelect: document.getElementById('header-currency-select'),
    btnNewSub: document.getElementById('btn-new-sub'),

    // Nav
    navItems: document.querySelectorAll('.nav-item'),
    viewPanels: document.querySelectorAll('.view-panel'),
    subsCountBadge: document.getElementById('subs-count-badge'),
    navRiskBadge: document.getElementById('nav-risk-badge'),
    statMemVal: document.getElementById('stat-mem-val'),
    statPingVal: document.getElementById('stat-ping-val'),

    // Gate Screen
    gateScreen: document.getElementById('vault-gate-screen'),
    gateTitle: document.getElementById('gate-title'),
    gateSubtitle: document.getElementById('gate-subtitle'),
    gateForm: document.getElementById('gate-form'),
    gateInput: document.getElementById('gate-password-input'),
    gateBtn: document.getElementById('gate-submit-btn'),
    gateError: document.getElementById('gate-error-msg'),
    btnTogglePw: document.getElementById('btn-toggle-pw'),
    btnQuickDemo: document.getElementById('btn-quick-demo-unlock'),

    // Dashboard KPIs
    kpiBurn: document.getElementById('kpi-burn-val'),
    kpiLeaks: document.getElementById('kpi-leaks-val'),
    kpiRecover: document.getElementById('kpi-recover-val'),
    kpiHygiene: document.getElementById('kpi-hygiene-val'),
    kpiHygieneDesc: document.getElementById('kpi-hygiene-desc'),
    kpiActiveSubsCount: document.getElementById('kpi-active-subs-count'),
    dashboardTrialAlert: document.getElementById('dashboard-trial-alert'),
    btnGotoRadar: document.getElementById('btn-goto-radar'),
    dashboardRecentSubs: document.getElementById('dashboard-recent-subs'),
    btnViewAllSubs: document.getElementById('btn-view-all-subs'),

    // Subscriptions View
    btnAddSubTrigger: document.getElementById('btn-add-sub-trigger'),
    filterPills: document.querySelectorAll('.filter-pill'),
    subCategoryFilter: document.getElementById('sub-category-filter'),
    subSearchInput: document.getElementById('sub-search-input'),
    subsTableBody: document.getElementById('subs-table-body'),

    // Risk Radar View
    radarLiveCount: document.getElementById('radar-live-count'),
    riskRadarItems: document.getElementById('risk-radar-items'),

    // Kill Switch View
    killSwitchCardsContainer: document.getElementById('kill-switch-cards-container'),

    // Statement Scanner View
    statementTextInput: document.getElementById('statement-text-input'),
    btnLoadSampleStatement: document.getElementById('btn-load-sample-statement'),
    btnRunStatementScan: document.getElementById('btn-run-statement-scan'),
    statementResultsContainer: document.getElementById('statement-results-container'),
    detectedCount: document.getElementById('detected-count'),
    detectedSubsBody: document.getElementById('detected-subs-body'),
    btnImportAllDetected: document.getElementById('btn-import-all-detected'),

    // Vault Settings View
    btnLockVaultNow: document.getElementById('btn-lock-vault-now'),
    btnExportBackup: document.getElementById('btn-export-backup'),
    btnImportBackup: document.getElementById('btn-import-backup'),
    prefUserName: document.getElementById('pref-user-name'),
    prefUserEmail: document.getElementById('pref-user-email'),
    btnSavePrefs: document.getElementById('btn-save-prefs'),
    btnFactoryReset: document.getElementById('btn-factory-reset'),

    // Modals
    modalSubBackdrop: document.getElementById('modal-sub-backdrop'),
    modalSubTitle: document.getElementById('modal-sub-title'),
    btnCloseSubModal: document.getElementById('btn-close-sub-modal'),
    btnCancelSubModal: document.getElementById('btn-cancel-sub-modal'),
    btnSaveSub: document.getElementById('btn-save-sub'),
    presetChipsContainer: document.getElementById('preset-chips-container'),

    // Modal Form Inputs
    inputSubName: document.getElementById('input-sub-name'),
    inputSubPlan: document.getElementById('input-sub-plan'),
    inputSubCategory: document.getElementById('input-sub-category'),
    inputSubPrice: document.getElementById('input-sub-price'),
    inputSubCurrency: document.getElementById('input-sub-currency'),
    inputSubCycle: document.getElementById('input-sub-cycle'),
    inputSubRenewal: document.getElementById('input-sub-renewal'),
    inputSubStatus: document.getElementById('input-sub-status'),
    inputSubCancelUrl: document.getElementById('input-sub-cancel-url'),
    inputSubNotes: document.getElementById('input-sub-notes'),

    // Modal Legal Notice
    modalLegalBackdrop: document.getElementById('modal-legal-backdrop'),
    btnCloseLegalModal: document.getElementById('btn-close-legal-modal'),
    legalNoticePreview: document.getElementById('legal-notice-preview'),
    btnOpenDirectPortal: document.getElementById('btn-open-direct-portal'),
    btnCopyLegalNotice: document.getElementById('btn-copy-legal-notice'),

    // Command Palette
    modalCmdPalette: document.getElementById('modal-cmd-palette'),
    cmdPaletteInput: document.getElementById('cmd-palette-input'),
    cmdPaletteResults: document.getElementById('cmd-palette-results')
  };

  // -------------------------------------------------------------------------
  // Window Titlebar Controls
  // -------------------------------------------------------------------------
  DOM.btnClose.addEventListener('click', () => window.subradarAPI.window.close());
  DOM.btnMin.addEventListener('click', () => window.subradarAPI.window.minimize());
  DOM.btnMax.addEventListener('click', async () => {
    const isMax = await window.subradarAPI.window.maximize();
    DOM.btnMax.title = isMax ? 'Geri Yükle' : 'Büyüt';
  });

  // -------------------------------------------------------------------------
  // Tab Switching
  // -------------------------------------------------------------------------
  function switchTab(tabId) {
    state.activeTab = tabId;
    DOM.navItems.forEach(item => {
      item.classList.toggle('active', item.dataset.tab === tabId);
    });
    DOM.viewPanels.forEach(panel => {
      panel.style.display = panel.id === `view-${tabId}` ? 'block' : 'none';
    });
  }

  DOM.navItems.forEach(item => {
    item.addEventListener('click', () => switchTab(item.dataset.tab));
  });

  DOM.btnGotoRadar?.addEventListener('click', () => switchTab('risk-radar'));
  DOM.btnViewAllSubs?.addEventListener('click', () => switchTab('subscriptions'));

  // -------------------------------------------------------------------------
  // Calculations & KPI Updates
  // -------------------------------------------------------------------------
  function recalculateKPIs() {
    const subs = state.subscriptions;
    let monthlyBurnTRY = 0;
    let leaksCount = 0;
    let trialsCount = 0;
    let recoverableWasteTRY = 0;
    let activeSubsCount = 0;

    subs.forEach(s => {
      if (s.status === 'cancelled') return;

      // Normalize price to TRY
      let priceTRY = parseFloat(s.price) || 0;
      if (s.currency === 'USD') priceTRY *= 48.35;
      else if (s.currency === 'EUR') priceTRY *= 52.10;

      // Handle billing cycle
      let monthlyEquivalent = priceTRY;
      if (s.billingCycle === 'yearly') monthlyEquivalent /= 12;
      else if (s.billingCycle === 'weekly') monthlyEquivalent *= 4.33;

      monthlyBurnTRY += monthlyEquivalent;

      if (s.status === 'active') {
        activeSubsCount++;
      } else if (s.status === 'idle') {
        leaksCount++;
        recoverableWasteTRY += (monthlyEquivalent * 12);
      } else if (s.status === 'trial') {
        trialsCount++;
        recoverableWasteTRY += (monthlyEquivalent * 12);
      }
    });

    // Update KPI UI
    DOM.kpiBurn.textContent = formatCurrency(monthlyBurnTRY);
    DOM.kpiActiveSubsCount.textContent = `${activeSubsCount} aktif servis`;

    DOM.kpiLeaks.textContent = leaksCount;
    DOM.kpiRecover.textContent = formatCurrency(recoverableWasteTRY);

    // Sidebar Badges
    DOM.subsCountBadge.textContent = subs.filter(s => s.status !== 'cancelled').length;
    if (leaksCount + trialsCount > 0) {
      DOM.navRiskBadge.style.display = 'inline-block';
      DOM.navRiskBadge.textContent = leaksCount + trialsCount;
    } else {
      DOM.navRiskBadge.style.display = 'none';
    }

    // Trial Warning Alert
    if (trialsCount > 0) {
      DOM.dashboardTrialAlert.style.display = 'flex';
    } else {
      DOM.dashboardTrialAlert.style.display = 'none';
    }

    // Financial Hygiene Score
    if (leaksCount === 0 && trialsCount === 0) {
      DOM.kpiHygiene.textContent = 'A+';
      DOM.kpiHygiene.style.color = 'var(--accent-emerald)';
      DOM.kpiHygieneDesc.textContent = 'Mükemmel hijyen • Sıfır sızıntı';
    } else if (leaksCount <= 1 && trialsCount <= 1) {
      DOM.kpiHygiene.textContent = 'B+';
      DOM.kpiHygiene.style.color = 'var(--accent-amber)';
      DOM.kpiHygieneDesc.textContent = 'İyi durumda • 1-2 inceleme gerek';
    } else {
      DOM.kpiHygiene.textContent = 'C-';
      DOM.kpiHygiene.style.color = 'var(--accent-rose)';
      DOM.kpiHygieneDesc.textContent = 'Kritik kaçak riski • Derhal denetle';
    }
  }

  // -------------------------------------------------------------------------
  // Render: Subscriptions Table
  // -------------------------------------------------------------------------
  function renderSubscriptionsTable() {
    let list = [...state.subscriptions];

    // Filter by status
    if (state.filterStatus !== 'all') {
      list = list.filter(s => s.status === state.filterStatus);
    }

    // Filter by category
    if (state.filterCategory !== 'all') {
      list = list.filter(s => s.category === state.filterCategory);
    }

    // Search query
    if (state.searchQuery) {
      const q = state.searchQuery.toLowerCase();
      list = list.filter(s => 
        (s.name && s.name.toLowerCase().includes(q)) ||
        (s.plan && s.plan.toLowerCase().includes(q)) ||
        (s.notes && s.notes.toLowerCase().includes(q))
      );
    }

    if (list.length === 0) {
      DOM.subsTableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 40px; color: var(--text-muted);">
            Kayıtlı abonelik bulunamadı veya arama kriterine uymuyor.
          </td>
        </tr>
      `;
      return;
    }

    DOM.subsTableBody.innerHTML = list.map(sub => {
      // Find preset color if available
      const preset = (typeof SAAS_PRESETS !== 'undefined') ? SAAS_PRESETS.find(p => p.name.toLowerCase() === sub.name.toLowerCase()) : null;
      const avatarColor = preset?.brandColor || '#6366f1';
      const avatarLetters = preset?.iconLetter || sub.name.substring(0, 2).toUpperCase();

      // Price formatted in user preference
      let priceTRY = parseFloat(sub.price) || 0;
      if (sub.currency === 'USD') priceTRY *= 48.35;
      else if (sub.currency === 'EUR') priceTRY *= 52.10;
      const displayPrice = formatCurrency(priceTRY);

      // Status badge class
      let badgeClass = 'badge-active';
      let badgeLabel = 'Aktif';
      if (sub.status === 'trial') {
        badgeClass = 'badge-trial';
        badgeLabel = 'Deneme Süresi';
      } else if (sub.status === 'idle') {
        badgeClass = 'badge-idle';
        badgeLabel = 'Atıl / Hayalet';
      } else if (sub.status === 'cancelled') {
        badgeClass = 'badge-cancelled';
        badgeLabel = 'İptal Edildi';
      }

      const renewalDisplay = sub.nextRenewalDate || 'Belirtilmemiş';

      return `
        <tr data-sub-id="${sub.id}">
          <td>
            <div class="sub-brand-col">
              <div class="sub-avatar" style="background: ${avatarColor};">${avatarLetters}</div>
              <div>
                <div class="sub-name">${escapeHTML(sub.name)}</div>
                <div class="sub-plan">${escapeHTML(sub.plan || 'Standart Plan')}</div>
              </div>
            </div>
          </td>
          <td>
            <span style="font-size: 11px; color: var(--text-secondary); background: rgba(255,255,255,0.05); padding: 3px 8px; border-radius: 6px; border: 1px solid var(--border-subtle);">${escapeHTML(sub.category || 'Diğer')}</span>
          </td>
          <td class="font-mono" style="font-size: 12px; color: var(--text-secondary);">${renewalDisplay}</td>
          <td class="price" style="font-weight: 600; font-size: 13px; color: #fff;">${displayPrice}<span style="font-size: 10px; color: var(--text-muted); font-weight: normal;"> / ${sub.billingCycle === 'yearly' ? 'yıl' : 'ay'}</span></td>
          <td><span class="badge ${badgeClass}">${badgeLabel}</span></td>
          <td style="text-align: right;">
            <div style="display: inline-flex; align-items: center; gap: 6px;">
              ${sub.status !== 'cancelled' ? `
                <button type="button" class="btn btn-secondary action-direct-kill" data-id="${sub.id}" title="Doğrudan İptal Portalı ve Protokolü" style="padding: 4px 10px; font-size: 11px;">
                  ⚡ İptal Et
                </button>
              ` : `
                <button type="button" class="btn btn-secondary action-legal-notice" data-id="${sub.id}" title="Fesih İhtarnamesini Gör" style="padding: 4px 10px; font-size: 11px;">
                  📄 Fesih İhtarı
                </button>
              `}
              <button type="button" class="btn btn-secondary btn-icon action-edit" data-id="${sub.id}" title="Düzenle" style="width: 28px; height: 28px; font-size: 11px;">✏️</button>
              <button type="button" class="btn btn-danger btn-icon action-delete" data-id="${sub.id}" title="Sil" style="width: 28px; height: 28px; font-size: 11px;">🗑️</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Attach actions
    DOM.subsTableBody.querySelectorAll('.action-direct-kill').forEach(btn => {
      btn.addEventListener('click', () => handleDirectKill(btn.dataset.id));
    });

    DOM.subsTableBody.querySelectorAll('.action-legal-notice').forEach(btn => {
      btn.addEventListener('click', () => openLegalNoticeModal(btn.dataset.id));
    });

    DOM.subsTableBody.querySelectorAll('.action-edit').forEach(btn => {
      btn.addEventListener('click', () => openEditSubModal(btn.dataset.id));
    });

    DOM.subsTableBody.querySelectorAll('.action-delete').forEach(btn => {
      btn.addEventListener('click', () => handleDeleteSub(btn.dataset.id));
    });
  }

  // -------------------------------------------------------------------------
  // Render: Dashboard Recent View
  // -------------------------------------------------------------------------
  function renderDashboardRecent() {
    const list = state.subscriptions.slice(0, 5);
    if (list.length === 0) {
      DOM.dashboardRecentSubs.innerHTML = `
        <div style="padding: 30px; text-align: center; color: var(--text-muted); font-size: 13px;">
          Henüz kayıtlı abonelik yok. "+ Yeni Abonelik" butonuna tıklayarak ilk servisinizi ekleyin.
        </div>
      `;
      return;
    }

    DOM.dashboardRecentSubs.innerHTML = `
      <table class="sub-table">
        <tbody>
          ${list.map(s => {
            let priceTRY = parseFloat(s.price) || 0;
            if (s.currency === 'USD') priceTRY *= 48.35;
            else if (s.currency === 'EUR') priceTRY *= 52.10;
            return `
              <tr>
                <td>
                  <div class="sub-brand-col">
                    <div class="sub-avatar" style="background: #6366f1;">${s.name.substring(0, 2).toUpperCase()}</div>
                    <div>
                      <div class="sub-name">${escapeHTML(s.name)}</div>
                      <div class="sub-plan">${escapeHTML(s.plan || '')} • ${s.notes ? escapeHTML(s.notes) : ''}</div>
                    </div>
                  </div>
                </td>
                <td class="font-mono text-white" style="font-weight: 600;">${formatCurrency(priceTRY)}</td>
                <td style="text-align: right;">
                  ${s.status === 'idle' ? `
                    <button type="button" class="btn btn-danger action-quick-kill" data-id="${s.id}" style="padding: 4px 12px; font-size: 11px;">Hemen İptal Et</button>
                  ` : s.status === 'cancelled' ? `
                    <span class="badge badge-cancelled">Sonlandırıldı</span>
                  ` : `
                    <span class="badge badge-active">Korumalı</span>
                  `}
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;

    DOM.dashboardRecentSubs.querySelectorAll('.action-quick-kill').forEach(btn => {
      btn.addEventListener('click', () => handleDirectKill(btn.dataset.id));
    });
  }

  // -------------------------------------------------------------------------
  // Render: Risk & Trial Radar
  // -------------------------------------------------------------------------
  function renderRiskRadar() {
    const highRisks = state.subscriptions.filter(s => s.status === 'idle' || s.status === 'trial');
    DOM.radarLiveCount.textContent = `● ${highRisks.length} Kritik Risk Tespit Edildi`;

    if (highRisks.length === 0) {
      DOM.riskRadarItems.innerHTML = `
        <div style="padding: 40px; text-align: center; color: var(--accent-emerald); font-size: 13px;">
          ✓ Tebrikler! Hiçbir atıl lisans veya unutulmuş deneme tuzağı bulunamadı. Kasanız tamamen temiz.
        </div>
      `;
      return;
    }

    DOM.riskRadarItems.innerHTML = highRisks.map(sub => {
      let priceTRY = parseFloat(sub.price) || 0;
      if (sub.currency === 'USD') priceTRY *= 48.35;
      else if (sub.currency === 'EUR') priceTRY *= 52.10;

      const isTrial = sub.status === 'trial';
      const warningText = isTrial 
        ? '⚠️ Deneme süresi yakında sona eriyor! Otomatik kart çekimi yapılacak.'
        : `⚠️ Atıl Lisans: ${sub.notes || 'Haftalardır arka plan işlemi başlatılmadı.'}`;

      return `
        <div class="glass-card" style="padding: 16px 20px; border-color: ${isTrial ? 'rgba(245, 158, 11, 0.3)' : 'rgba(244, 63, 94, 0.3)'};">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 18px;">${isTrial ? '⏳' : '🛑'}</span>
              <span style="font-weight: 600; color: #fff; font-size: 14px;">${escapeHTML(sub.name)}</span>
              <span class="badge ${isTrial ? 'badge-trial' : 'badge-idle'}">${isTrial ? 'Deneme Tuzağı' : 'Hayalet Lisans'}</span>
            </div>
            <span class="font-mono text-white" style="font-weight: 700; font-size: 15px;">${formatCurrency(priceTRY)}/ay</span>
          </div>
          <p style="font-size: 12px; color: var(--text-secondary); margin-bottom: 12px;">${warningText}</p>
          <div style="display: flex; gap: 8px;">
            <button type="button" class="btn btn-primary action-kill-now" data-id="${sub.id}" style="font-size: 11px; padding: 5px 14px;">⚡ Karanlık Deseni Atla & İptal Et</button>
            <button type="button" class="btn btn-secondary action-view-legal" data-id="${sub.id}" style="font-size: 11px; padding: 5px 14px;">📄 Fesih İhtarnamesi Üret</button>
          </div>
        </div>
      `;
    }).join('');

    DOM.riskRadarItems.querySelectorAll('.action-kill-now').forEach(btn => {
      btn.addEventListener('click', () => handleDirectKill(btn.dataset.id));
    });
    DOM.riskRadarItems.querySelectorAll('.action-view-legal').forEach(btn => {
      btn.addEventListener('click', () => openLegalNoticeModal(btn.dataset.id));
    });
  }

  // -------------------------------------------------------------------------
  // Render: Kill Switch (Tek Tıkla İptal Merkezi)
  // -------------------------------------------------------------------------
  function renderKillSwitch() {
    const activeSubs = state.subscriptions.filter(s => s.status !== 'cancelled');
    if (activeSubs.length === 0) {
      DOM.killSwitchCardsContainer.innerHTML = `
        <div style="grid-column: 1/-1; padding: 40px; text-align: center; color: var(--text-muted);">
          İptal edilecek aktif abonelik bulunmuyor.
        </div>
      `;
      return;
    }

    DOM.killSwitchCardsContainer.innerHTML = activeSubs.map(s => {
      let priceTRY = parseFloat(s.price) || 0;
      if (s.currency === 'USD') priceTRY *= 48.35;
      else if (s.currency === 'EUR') priceTRY *= 52.10;

      return `
        <div class="glass-card" style="padding: 20px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
              <h3 style="font-size: 15px; font-weight: 600; color: #fff;">${escapeHTML(s.name)}</h3>
              <span class="font-mono text-white" style="font-weight: 700;">${formatCurrency(priceTRY)}</span>
            </div>
            <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 16px;">
              ${escapeHTML(s.plan || 'Standart')} • ${escapeHTML(s.category || 'Hizmet')}
            </div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <button type="button" class="btn btn-primary action-launch-portal" data-id="${s.id}" data-url="${s.directCancelUrl || ''}">
              🔗 İptal Sayfasına Git
            </button>
            <button type="button" class="btn btn-secondary action-legal-trigger" data-id="${s.id}">
              📄 Yasal Fesih İhtarı Üret
            </button>
            <button type="button" class="btn btn-danger action-mark-cancelled" data-id="${s.id}" style="font-size: 11px; padding: 4px;">
              ✕ İptal Edildi Olarak İşaretle
            </button>
          </div>
        </div>
      `;
    }).join('');

    DOM.killSwitchCardsContainer.querySelectorAll('.action-launch-portal').forEach(btn => {
      btn.addEventListener('click', () => {
        const url = btn.dataset.url;
        if (url && (url.startsWith('https://') || url.startsWith('http://'))) {
          window.subradarAPI.system.openExternal(url);
          showToast('Doğrudan iptal portalı varsayılan tarayıcınızda açıldı.');
        } else {
          showToast('Bu servis için doğrudan URL kayıtlı değil. Fesih ihtarnamesini kullanın.', '⚠️');
        }
      });
    });

    DOM.killSwitchCardsContainer.querySelectorAll('.action-legal-trigger').forEach(btn => {
      btn.addEventListener('click', () => openLegalNoticeModal(btn.dataset.id));
    });

    DOM.killSwitchCardsContainer.querySelectorAll('.action-mark-cancelled').forEach(btn => {
      btn.addEventListener('click', () => handleDirectKill(btn.dataset.id));
    });
  }

  // -------------------------------------------------------------------------
  // Direct Kill & Legal Notice Handlers
  // -------------------------------------------------------------------------
  async function handleDirectKill(subId) {
    try {
      const updated = await window.subradarAPI.subscriptions.killSwitch(subId);
      const idx = state.subscriptions.findIndex(s => s.id === subId);
      if (idx !== -1) {
        state.subscriptions[idx] = updated;
      }
      recalculateKPIs();
      renderAllViews();
      showToast(`${updated.name} üyeliği sonlandırıldı. Tasarruf kasaya eklendi.`);
    } catch (err) {
      showToast(`Hata: ${err.message}`, '✕');
    }
  }

  async function openLegalNoticeModal(subId) {
    const sub = state.subscriptions.find(s => s.id === subId);
    if (!sub) return;
    state.currentNoticeSub = sub;

    const notice = await window.subradarAPI.legalNotice.generateNotice(sub, state.preferences, 'tr');
    DOM.legalNoticePreview.value = notice.text;
    DOM.modalLegalBackdrop.style.display = 'flex';
  }

  DOM.btnCloseLegalModal?.addEventListener('click', () => {
    DOM.modalLegalBackdrop.style.display = 'none';
  });

  DOM.btnCopyLegalNotice?.addEventListener('click', async () => {
    const text = DOM.legalNoticePreview.value;
    await window.subradarAPI.system.copyToClipboard(text);
    showToast('Fesih metni panoya kopyalandı.');
  });

  DOM.btnOpenDirectPortal?.addEventListener('click', () => {
    if (state.currentNoticeSub?.directCancelUrl) {
      window.subradarAPI.system.openExternal(state.currentNoticeSub.directCancelUrl);
      showToast('Sağlayıcı iptal portalı açıldı.');
    } else {
      showToast('Kayıtlı iptal URL adresi bulunmuyor.', '⚠️');
    }
  });

  // -------------------------------------------------------------------------
  // Statement Scanner Logic (%100 Local)
  // -------------------------------------------------------------------------
  DOM.btnLoadSampleStatement?.addEventListener('click', () => {
    DOM.statementTextInput.value = `12.10.2026 14:22 ADOBE SYSTEMS INC CREATIVE CLD 2966.52 TRY
10.10.2026 09:15 NETFLIX.COM INTERNET ISTANBUL 299.99 TL
08.10.2026 18:40 SPOTIFY TURKIYE 99.99 TRY
04.10.2026 11:02 OPENAI *CHATGPT PLUS 967.00 TL
02.10.2026 04:30 AMAZON WEB SERVICES AWS CLOUD 2417.50 TRY
01.10.2026 19:12 YOUTUBE PREMIUM GOOGLE STORAGE 115.99 TL`;
    showToast('Örnek banka ekstresi yüklendi.');
  });

  let detectedList = [];

  DOM.btnRunStatementScan?.addEventListener('click', async () => {
    const text = DOM.statementTextInput.value.trim();
    if (!text) {
      showToast('Lütfen taranacak ekstre metnini girin.', '⚠️');
      return;
    }

    detectedList = await window.subradarAPI.statement.parse(text, state.preferences.currency);
    DOM.detectedCount.textContent = detectedList.length;

    if (detectedList.length === 0) {
      showToast('Herhangi bir yinelenen abonelik kalıbı eşleşmedi.', 'ℹ️');
      DOM.statementResultsContainer.style.display = 'none';
      return;
    }

    DOM.detectedSubsBody.innerHTML = detectedList.map((d, index) => {
      return `
        <tr>
          <td style="font-weight: 600; color: #fff;">${escapeHTML(d.name)}</td>
          <td style="color: var(--text-secondary);">${escapeHTML(d.plan)}</td>
          <td class="font-mono text-white" style="font-weight: 600;">₺${parseFloat(d.price).toFixed(2)}</td>
          <td class="font-mono" style="font-size: 11px; color: var(--text-muted);">${escapeHTML(d.rawExtractedLine)}</td>
          <td style="text-align: right;">
            <button type="button" class="btn btn-secondary action-add-single-detected" data-index="${index}" style="padding: 4px 10px; font-size: 11px;">+ Kasaya Ekle</button>
          </td>
        </tr>
      `;
    }).join('');

    DOM.detectedSubsBody.querySelectorAll('.action-add-single-detected').forEach(btn => {
      btn.addEventListener('click', async () => {
        const item = detectedList[parseInt(btn.dataset.index, 10)];
        if (item) {
          const created = await window.subradarAPI.subscriptions.create(item);
          state.subscriptions.unshift(created);
          recalculateKPIs();
          renderAllViews();
          btn.disabled = true;
          btn.textContent = '✓ Eklendi';
          showToast(`${item.name} kasanıza eklendi.`);
        }
      });
    });

    DOM.statementResultsContainer.style.display = 'block';
    showToast(`${detectedList.length} adet abonelik yerel RAM'de yakalandı!`);
  });

  DOM.btnImportAllDetected?.addEventListener('click', async () => {
    for (const item of detectedList) {
      const created = await window.subradarAPI.subscriptions.create(item);
      state.subscriptions.unshift(created);
    }
    recalculateKPIs();
    renderAllViews();
    DOM.statementResultsContainer.style.display = 'none';
    showToast(`${detectedList.length} adet abonelik kasanıza aktarıldı!`);
    switchTab('subscriptions');
  });

  // -------------------------------------------------------------------------
  // Preset Chips Populator
  // -------------------------------------------------------------------------
  function populatePresetChips() {
    if (typeof SAAS_PRESETS === 'undefined') return;
    DOM.presetChipsContainer.innerHTML = SAAS_PRESETS.map(preset => `
      <button type="button" class="btn btn-secondary preset-chip-btn" data-preset-id="${preset.id}" style="padding: 3px 8px; font-size: 11px;">
        <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: ${preset.brandColor}; margin-right: 4px;"></span>
        ${escapeHTML(preset.name)}
      </button>
    `).join('');

    DOM.presetChipsContainer.querySelectorAll('.preset-chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = SAAS_PRESETS.find(x => x.id === btn.dataset.presetId);
        if (p) {
          DOM.inputSubName.value = p.name;
          DOM.inputSubPlan.value = p.defaultPlan;
          DOM.inputSubCategory.value = p.category;
          DOM.inputSubPrice.value = p.defaultPrice;
          DOM.inputSubCurrency.value = p.defaultCurrency;
          DOM.inputSubCycle.value = p.billingCycle;
          DOM.inputSubCancelUrl.value = p.directCancelUrl;
          DOM.inputSubNotes.value = p.notes;
          showToast(`${p.name} şablonu uygulandı.`);
        }
      });
    });
  }

  // -------------------------------------------------------------------------
  // Add / Edit Subscription Modal
  // -------------------------------------------------------------------------
  DOM.btnAddSubTrigger?.addEventListener('click', () => openNewSubModal());
  DOM.btnNewSub?.addEventListener('click', () => openNewSubModal());

  function openNewSubModal() {
    state.editingSubId = null;
    DOM.modalSubTitle.textContent = 'Yeni Abonelik Ekle';
    document.getElementById('form-sub').reset();
    DOM.inputSubCurrency.value = state.preferences.currency;
    DOM.inputSubRenewal.value = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];
    DOM.modalSubBackdrop.style.display = 'flex';
    DOM.inputSubName.focus();
  }

  function openEditSubModal(subId) {
    const sub = state.subscriptions.find(s => s.id === subId);
    if (!sub) return;
    state.editingSubId = subId;
    DOM.modalSubTitle.textContent = 'Aboneliği Düzenle';

    DOM.inputSubName.value = sub.name || '';
    DOM.inputSubPlan.value = sub.plan || '';
    DOM.inputSubCategory.value = sub.category || 'Design';
    DOM.inputSubPrice.value = sub.price || '';
    DOM.inputSubCurrency.value = sub.currency || 'TRY';
    DOM.inputSubCycle.value = sub.billingCycle || 'monthly';
    DOM.inputSubRenewal.value = sub.nextRenewalDate || '';
    DOM.inputSubStatus.value = sub.status || 'active';
    DOM.inputSubCancelUrl.value = sub.directCancelUrl || '';
    DOM.inputSubNotes.value = sub.notes || '';

    DOM.modalSubBackdrop.style.display = 'flex';
  }

  function closeSubModal() {
    DOM.modalSubBackdrop.style.display = 'none';
  }

  DOM.btnCloseSubModal?.addEventListener('click', closeSubModal);
  DOM.btnCancelSubModal?.addEventListener('click', closeSubModal);

  DOM.btnSaveSub?.addEventListener('click', async () => {
    const name = DOM.inputSubName.value.trim();
    const price = parseFloat(DOM.inputSubPrice.value);

    if (!name || isNaN(price)) {
      showToast('Lütfen servis adı ve geçerli bir tutar girin.', '⚠️');
      return;
    }

    const payload = {
      name,
      plan: DOM.inputSubPlan.value.trim(),
      category: DOM.inputSubCategory.value,
      price,
      currency: DOM.inputSubCurrency.value,
      billingCycle: DOM.inputSubCycle.value,
      nextRenewalDate: DOM.inputSubRenewal.value || null,
      status: DOM.inputSubStatus.value,
      directCancelUrl: DOM.inputSubCancelUrl.value.trim(),
      notes: DOM.inputSubNotes.value.trim()
    };

    try {
      if (state.editingSubId) {
        const updated = await window.subradarAPI.subscriptions.update(state.editingSubId, payload);
        const idx = state.subscriptions.findIndex(s => s.id === state.editingSubId);
        if (idx !== -1) state.subscriptions[idx] = updated;
        showToast(`${updated.name} güncellendi.`);
      } else {
        const created = await window.subradarAPI.subscriptions.create(payload);
        state.subscriptions.unshift(created);
        showToast(`${created.name} kasanıza kaydedildi.`);
      }

      recalculateKPIs();
      renderAllViews();
      closeSubModal();
    } catch (err) {
      showToast(`Kayıt hatası: ${err.message}`, '✕');
    }
  });

  async function handleDeleteSub(subId) {
    if (!confirm('Bu aboneliği kasadan kalıcı olarak silmek istediğinize emin misiniz?')) return;
    try {
      await window.subradarAPI.subscriptions.delete(subId);
      state.subscriptions = state.subscriptions.filter(s => s.id !== subId);
      recalculateKPIs();
      renderAllViews();
      showToast('Abonelik silindi.');
    } catch (err) {
      showToast(`Hata: ${err.message}`, '✕');
    }
  }

  // -------------------------------------------------------------------------
  // Vault Settings Actions
  // -------------------------------------------------------------------------
  DOM.btnLockVaultNow?.addEventListener('click', async () => {
    await window.subradarAPI.vault.lock();
    state.isUnlocked = false;
    DOM.vaultBadge.innerHTML = '<span>🔒 AES-256 Kilitli</span>';
    DOM.vaultBadge.classList.remove('unlocked');
    DOM.gateInput.value = '';
    DOM.gateScreen.style.display = 'flex';
    DOM.gateInput.focus();
    showToast('Kasa kilitlendi. Bellek temizlendi.');
  });

  DOM.btnExportBackup?.addEventListener('click', async () => {
    try {
      const res = await window.subradarAPI.system.exportBackup();
      if (res.success) {
        showToast('Şifreli kasa yedeği başarıyla dışa aktarıldı.');
      }
    } catch (err) {
      showToast(`Yedekleme hatası: ${err.message}`, '✕');
    }
  });

  DOM.btnImportBackup?.addEventListener('click', async () => {
    const pw = prompt('İçe aktarılacak yedeğin ana şifresini girin:');
    if (!pw) return;
    try {
      const res = await window.subradarAPI.system.importBackup(pw);
      if (res.success) {
        state.subscriptions = res.data.subscriptions || [];
        state.preferences = res.data.userPreferences || state.preferences;
        recalculateKPIs();
        renderAllViews();
        showToast('Yedek başarıyla içe aktarıldı ve çözüldü!');
      } else {
        showToast(`Hata: ${res.error || 'İçe aktarılamadı.'}`, '✕');
      }
    } catch (err) {
      showToast(`Hata: ${err.message}`, '✕');
    }
  });

  DOM.btnSavePrefs?.addEventListener('click', async () => {
    try {
      const patch = {
        userName: DOM.prefUserName.value.trim(),
        userEmail: DOM.prefUserEmail.value.trim()
      };
      state.preferences = await window.subradarAPI.preferences.update(patch);
      showToast('Kullanıcı tercihleri kaydedildi.');
    } catch (err) {
      showToast(`Hata: ${err.message}`, '✕');
    }
  });

  DOM.btnFactoryReset?.addEventListener('click', async () => {
    if (!confirm('UYARI: Tüm yerel şifrelenmiş veriler silinecek! Devam etmek istiyor musunuz?')) return;
    try {
      await window.subradarAPI.vault.factoryReset();
      location.reload();
    } catch (err) {
      showToast(`Sıfırlama hatası: ${err.message}`, '✕');
    }
  });

  // -------------------------------------------------------------------------
  // Currency Select Switcher
  // -------------------------------------------------------------------------
  DOM.currencySelect?.addEventListener('change', async (e) => {
    state.preferences.currency = e.target.value;
    try {
      await window.subradarAPI.preferences.update({ currency: state.preferences.currency });
    } catch (err) {}
    recalculateKPIs();
    renderAllViews();
    showToast(`Para birimi ${state.preferences.currency} olarak güncellendi.`);
  });

  // -------------------------------------------------------------------------
  // Filtering & Search Listeners
  // -------------------------------------------------------------------------
  DOM.filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      DOM.filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.filterStatus = pill.dataset.filter;
      renderSubscriptionsTable();
    });
  });

  DOM.subCategoryFilter?.addEventListener('change', (e) => {
    state.filterCategory = e.target.value;
    renderSubscriptionsTable();
  });

  DOM.subSearchInput?.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    renderSubscriptionsTable();
  });

  // -------------------------------------------------------------------------
  // Command Palette (Ctrl+K)
  // -------------------------------------------------------------------------
  function openCmdPalette() {
    DOM.modalCmdPalette.style.display = 'flex';
    DOM.cmdPaletteInput.value = '';
    renderCmdPalette('');
    DOM.cmdPaletteInput.focus();
  }

  function closeCmdPalette() {
    DOM.modalCmdPalette.style.display = 'none';
  }

  DOM.btnCmdTrigger?.addEventListener('click', openCmdPalette);

  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (DOM.modalCmdPalette.style.display === 'flex') closeCmdPalette();
      else openCmdPalette();
    } else if (e.key === 'Escape') {
      closeCmdPalette();
      closeSubModal();
      if (DOM.modalLegalBackdrop) DOM.modalLegalBackdrop.style.display = 'none';
    }
  });

  DOM.modalCmdPalette?.addEventListener('click', (e) => {
    if (e.target === DOM.modalCmdPalette) closeCmdPalette();
  });

  DOM.cmdPaletteInput?.addEventListener('input', (e) => {
    renderCmdPalette(e.target.value);
  });

  function renderCmdPalette(q) {
    const query = q.toLowerCase();
    const staticCommands = [
      { title: 'Genel Bakış Ekranına Git', action: () => switchTab('dashboard'), icon: '📊' },
      { title: 'Abonelikler Listesini Aç', action: () => switchTab('subscriptions'), icon: '💳' },
      { title: 'Risk Radarı ve Deneme Uyarılarını İncele', action: () => switchTab('risk-radar'), icon: '⚠️' },
      { title: 'Tek Tıkla İptal Merkezini Aç', action: () => switchTab('kill-switch'), icon: '⚡' },
      { title: 'Banka Ekstresi Tara (100% Yerel)', action: () => switchTab('statement-scanner'), icon: '📄' },
      { title: 'Kasa Güvenlik Ayarlarına Git', action: () => switchTab('vault-settings'), icon: '⚙️' },
      { title: '+ Yeni Abonelik Ekle', action: () => openNewSubModal(), icon: '➕' },
      { title: 'Kasayı Hemen Kilitle', action: () => DOM.btnLockVaultNow.click(), icon: '🔒' },
      { title: 'Şifreli Yedek Dışa Aktar (.subradar)', action: () => DOM.btnExportBackup.click(), icon: '💾' }
    ];

    const matchedSubs = state.subscriptions.filter(s => s.name.toLowerCase().includes(query)).map(s => ({
      title: `${s.name} İptal & Fesih Detayı`,
      action: () => openLegalNoticeModal(s.id),
      icon: '⚡'
    }));

    const all = [...staticCommands.filter(c => c.title.toLowerCase().includes(query)), ...matchedSubs];

    if (all.length === 0) {
      DOM.cmdPaletteResults.innerHTML = `<div style="padding: 16px; color: var(--text-muted); font-size: 13px;">Eşleşen komut bulunamadı.</div>`;
      return;
    }

    DOM.cmdPaletteResults.innerHTML = all.map((item, idx) => `
      <div class="cmd-item" data-idx="${idx}" style="padding: 10px 14px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 10px; font-size: 13px; color: #fff;">
        <span>${item.icon}</span>
        <span>${escapeHTML(item.title)}</span>
      </div>
    `).join('');

    DOM.cmdPaletteResults.querySelectorAll('.cmd-item').forEach(el => {
      el.addEventListener('mouseenter', () => {
        DOM.cmdPaletteResults.querySelectorAll('.cmd-item').forEach(x => x.style.background = 'transparent');
        el.style.background = 'rgba(255,255,255,0.08)';
      });
      el.addEventListener('click', () => {
        closeCmdPalette();
        const cmd = all[parseInt(el.dataset.idx, 10)];
        if (cmd) cmd.action();
      });
    });
  }

  // -------------------------------------------------------------------------
  // Render All Views
  // -------------------------------------------------------------------------
  function renderAllViews() {
    renderSubscriptionsTable();
    renderDashboardRecent();
    renderRiskRadar();
    renderKillSwitch();
  }

  // -------------------------------------------------------------------------
  // Gate Screen: Unlock & Setup Logic
  // -------------------------------------------------------------------------
  DOM.btnTogglePw?.addEventListener('click', () => {
    DOM.gateInput.type = DOM.gateInput.type === 'password' ? 'text' : 'password';
  });

  DOM.btnQuickDemo?.addEventListener('click', () => {
    DOM.gateInput.value = 'subradar2026';
    DOM.gateForm.dispatchEvent(new Event('submit'));
  });

  DOM.gateForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const pw = DOM.gateInput.value;
    DOM.gateError.style.display = 'none';

    try {
      const hasVault = await window.subradarAPI.vault.hasVault();
      let res;
      if (hasVault) {
        res = await window.subradarAPI.vault.unlock(pw);
      } else {
        res = await window.subradarAPI.vault.setup(pw);
      }

      if (res && res.success) {
        state.isUnlocked = true;
        DOM.gateScreen.style.display = 'none';

        // Load data into state
        state.subscriptions = await window.subradarAPI.subscriptions.getAll();
        state.preferences = await window.subradarAPI.preferences.get();

        // Update preferences in DOM
        if (state.preferences.currency) {
          DOM.currencySelect.value = state.preferences.currency;
        }
        if (state.preferences.userName) DOM.prefUserName.value = state.preferences.userName;
        if (state.preferences.userEmail) DOM.prefUserEmail.value = state.preferences.userEmail;

        DOM.vaultBadge.innerHTML = '<span>🔓 AES-256 Açık</span>';
        DOM.vaultBadge.classList.add('unlocked');

        recalculateKPIs();
        renderAllViews();
        showToast('Kasa başarıyla açıldı. AES-256 koruması devrede.');
      } else {
        DOM.gateError.textContent = res.error || 'Hatalı ana şifre veya bozulmuş veri.';
        DOM.gateError.style.display = 'block';
      }
    } catch (err) {
      DOM.gateError.textContent = err.message || 'Kasa açılırken beklenmeyen bir hata oluştu.';
      DOM.gateError.style.display = 'block';
    }
  });

  // -------------------------------------------------------------------------
  // Initialization Check
  // -------------------------------------------------------------------------
  async function initApp() {
    populatePresetChips();

    // Check memory stats periodically
    try {
      const stats = await window.subradarAPI.system.getMemoryStats();
      if (stats && stats.heapUsedMB) {
        DOM.statMemVal.textContent = `${stats.heapUsedMB} MB`;
      }
    } catch (e) {}

    // Check if vault already exists or needs setup
    try {
      const hasVault = await window.subradarAPI.vault.hasVault();
      if (!hasVault) {
        DOM.gateTitle.textContent = 'Yeni Kasa Kurulumu';
        DOM.gateSubtitle.textContent = 'Verilerinizi AES-256 ile şifreleyecek bir ana parola belirleyin.';
        DOM.gateBtn.textContent = 'Yeni Kasa Oluştur';
      }
    } catch (e) {}

    DOM.gateInput.focus();
  }

  // Escape HTML helper
  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Start
  initApp();

})();
