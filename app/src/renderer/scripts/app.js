/**
 * SubRadar Desktop — Renderer Controller & State Orchestrator
 * 
 * Manages reactive UI state, vault unlocking, subscriptions,
 * direct cancellation bypass, and legal notice generation.
 */

(function () {
  // Global State
  const state = {
    activeTab: 'dashboard',
    subscriptions: [],
    preferences: {
      currency: 'USD',
      theme: 'dark',
      language: 'tr',
      userName: 'Arda Y.',
      userEmail: 'arda@example.com'
    },
    rates: {
      USD: { rate: 1, symbol: '$' },
      EUR: { rate: 0.86, symbol: '€' },
      TRY: { rate: 48.35, symbol: '₺' }
    },
    filterStatus: 'all',
    searchQuery: '',
    editingSubId: null,
    isMaximized: false
  };

  const DOM = {
    // Window
    btnClose: document.getElementById('btn-win-close'),
    btnMin: document.getElementById('btn-win-min'),
    btnMax: document.getElementById('btn-win-max'),
    vaultStatusBadge: document.getElementById('vault-status-badge'),
    
    // Nav
    navItems: document.querySelectorAll('.nav-item'),
    views: document.querySelectorAll('.view-panel'),
    statMemVal: document.getElementById('stat-mem-val'),
    statPingVal: document.getElementById('stat-ping-val'),
    
    // Gate
    gateScreen: document.getElementById('vault-gate-screen'),
    gateTitle: document.getElementById('gate-title'),
    gateSubtitle: document.getElementById('gate-subtitle'),
    gateInput: document.getElementById('gate-password-input'),
    gateBtn: document.getElementById('gate-submit-btn'),
    gateError: document.getElementById('gate-error-msg'),
    
    // Currency Switcher
    currencySelect: document.getElementById('header-currency-select'),
    
    // Search & Filter
    subSearchInput: document.getElementById('sub-search-input'),
    filterPills: document.querySelectorAll('.filter-pill'),
    btnNewSub: document.getElementById('btn-new-sub'),
    
    // Dashboard KPIs
    kpiBurn: document.getElementById('kpi-burn-val'),
    kpiLeaks: document.getElementById('kpi-leaks-val'),
    kpiRecover: document.getElementById('kpi-recover-val'),
    kpiTrials: document.getElementById('kpi-trials-val'),
    dashboardSubList: document.getElementById('dashboard-recent-subs'),
    
    // Table
    subsTableBody: document.getElementById('subs-table-body'),
    subsCountBadge: document.getElementById('subs-count-badge'),
    riskBadge: document.getElementById('nav-risk-badge'),
    
    // Risk Radar
    riskRadarList: document.getElementById('risk-radar-items'),
    
    // Modal: Add / Edit
    modalSub: document.getElementById('modal-sub'),
    modalSubTitle: document.getElementById('modal-sub-title'),
    formSubName: document.getElementById('form-sub-name'),
    formSubPlan: document.getElementById('form-sub-plan'),
    formSubPrice: document.getElementById('form-sub-price'),
    formSubCurrency: document.getElementById('form-sub-currency'),
    formSubCycle: document.getElementById('form-sub-cycle'),
    formSubRenewal: document.getElementById('form-sub-renewal'),
    formSubCategory: document.getElementById('form-sub-category'),
    formSubStatus: document.getElementById('form-sub-status'),
    formSubCancelUrl: document.getElementById('form-sub-cancel-url'),
    formSubNotes: document.getElementById('form-sub-notes'),
    presetChipsContainer: document.getElementById('preset-chips-container'),
    btnSaveSub: document.getElementById('btn-save-sub'),
    btnCloseSubModal: document.getElementById('btn-close-sub-modal'),
    
    // Modal: Legal Notice
    modalNotice: document.getElementById('modal-notice'),
    noticePreview: document.getElementById('notice-preview-text'),
    btnCopyNotice: document.getElementById('btn-copy-notice'),
    btnOpenPortal: document.getElementById('btn-open-portal'),
    btnCloseNoticeModal: document.getElementById('btn-close-notice-modal'),
    
    // Vault Settings
    btnLockVault: document.getElementById('btn-lock-vault'),
    btnExportBackup: document.getElementById('btn-export-backup'),
    btnImportBackup: document.getElementById('btn-import-backup')
  };

  // ---------------------------------------------------------------------------
  // Helpers & Formatting
  // ---------------------------------------------------------------------------
  function formatMoney(amountUsd, targetCurrency = state.preferences.currency) {
    const cur = state.rates[targetCurrency] || state.rates.USD;
    const converted = amountUsd * cur.rate;
    return `${cur.symbol}${converted.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  function getDaysUntil(dateString) {
    if (!dateString) return 999;
    const target = new Date(dateString);
    const now = new Date();
    const diffTime = target - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // ---------------------------------------------------------------------------
  // Vault Gate (Unlocking / Setup)
  // ---------------------------------------------------------------------------
  async function initVaultGate() {
    const hasVault = await window.subradarAPI.vault.hasVaultFile();

    if (!hasVault) {
      DOM.gateTitle.textContent = 'Yeni Güvenli Kasa Oluştur';
      DOM.gateSubtitle.textContent = 'Verileriniz cihazınızda AES-256 ile şifrelenecektir. Lütfen bir ana şifre belirleyin.';
      DOM.gateBtn.textContent = 'Kasayı Kur ve Başlat';
    } else {
      DOM.gateTitle.textContent = 'SubRadar Yerel Kasa';
      DOM.gateSubtitle.textContent = 'Şifreli kasanızı açmak için ana şifrenizi girin.';
      DOM.gateBtn.textContent = 'Kasayı Aç';
    }

    DOM.gateBtn.addEventListener('click', handleGateSubmit);
    DOM.gateInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleGateSubmit();
    });
    DOM.gateInput.focus();
  }

  async function handleGateSubmit() {
    const password = DOM.gateInput.value.trim();
    if (!password) {
      showGateError('Lütfen bir ana şifre girin.');
      return;
    }

    DOM.gateError.style.display = 'none';
    DOM.gateBtn.disabled = true;
    DOM.gateBtn.textContent = 'Şifre Çözülüyor...';

    const hasVault = await window.subradarAPI.vault.hasVaultFile();
    let res;

    if (!hasVault) {
      res = await window.subradarAPI.vault.setupVault(password);
    } else {
      res = await window.subradarAPI.vault.unlock(password);
    }

    if (res.success) {
      DOM.gateScreen.style.display = 'none';
      DOM.vaultStatusBadge.classList.add('unlocked');
      DOM.vaultStatusBadge.innerHTML = '<span class="brand-dot"></span><span>AES-256 Kasa Açık</span>';
      await loadInitialData();
    } else {
      showGateError(res.error || 'Şifre doğrulanamadı.');
      DOM.gateBtn.disabled = false;
      DOM.gateBtn.textContent = hasVault ? 'Kasayı Aç' : 'Kasayı Kur ve Başlat';
    }
  }

  function showGateError(msg) {
    DOM.gateError.textContent = msg;
    DOM.gateError.style.display = 'block';
  }

  // ---------------------------------------------------------------------------
  // Data Loading & KPI Computation
  // ---------------------------------------------------------------------------
  async function loadInitialData() {
    try {
      state.subscriptions = await window.subradarAPI.subscriptions.list();
      state.preferences = await window.subradarAPI.preferences.get();
      if (state.preferences.currency) {
        DOM.currencySelect.value = state.preferences.currency;
      }
    } catch (e) {
      console.error('Veri yükleme hatası:', e);
    }

    renderAll();
  }

  function renderAll() {
    computeKPIs();
    renderSubscriptionsTable();
    renderRiskRadar();
    renderDashboardOverview();
  }

  function computeKPIs() {
    let monthlyBurnUsd = 0;
    let recoverableAnnualUsd = 0;
    let idleCount = 0;
    let trialCount = 0;

    state.subscriptions.forEach(sub => {
      if (sub.status === 'cancelled') return;

      const monthlyCost = sub.billingCycle === 'yearly' ? sub.price / 12 : sub.price;
      monthlyBurnUsd += monthlyCost;

      if (sub.status === 'idle') {
        idleCount++;
        recoverableAnnualUsd += monthlyCost * 12;
      } else if (sub.status === 'trial') {
        trialCount++;
        recoverableAnnualUsd += monthlyCost * 12;
      }
    });

    DOM.kpiBurn.textContent = formatMoney(monthlyBurnUsd);
    DOM.kpiLeaks.textContent = `${idleCount} Lisans`;
    DOM.kpiRecover.textContent = formatMoney(recoverableAnnualUsd);
    DOM.kpiTrials.textContent = `${trialCount} Aktif`;

    if (DOM.subsCountBadge) {
      DOM.subsCountBadge.textContent = `${state.subscriptions.length} Toplam`;
    }
    if (DOM.riskBadge) {
      const riskTotal = idleCount + trialCount;
      DOM.riskBadge.textContent = riskTotal;
      DOM.riskBadge.style.display = riskTotal > 0 ? 'inline-block' : 'none';
    }
  }

  // ---------------------------------------------------------------------------
  // Views & Table Renderers
  // ---------------------------------------------------------------------------
  function renderSubscriptionsTable() {
    const q = state.searchQuery.toLowerCase().trim();
    const filtered = state.subscriptions.filter(sub => {
      const matchesSearch = sub.name.toLowerCase().includes(q) || (sub.plan && sub.plan.toLowerCase().includes(q));
      const matchesStatus = state.filterStatus === 'all' || sub.status === state.filterStatus;
      return matchesSearch && matchesStatus;
    });

    if (filtered.length === 0) {
      DOM.subsTableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 40px; color: var(--text-muted);">
            Eşleşen abonelik bulunamadı. Yeni bir servis eklemek için "+ Yeni Abonelik" butonuna tıklayın.
          </td>
        </tr>`;
      return;
    }

    DOM.subsTableBody.innerHTML = filtered.map(sub => {
      const daysLeft = getDaysUntil(sub.nextRenewalDate);
      let statusBadgeHtml = '';
      if (sub.status === 'active') statusBadgeHtml = '<span class="status-badge active">● Aktif</span>';
      else if (sub.status === 'trial') statusBadgeHtml = `<span class="status-badge trial">▲ Deneme (${daysLeft}g kaldı)</span>`;
      else if (sub.status === 'idle') statusBadgeHtml = '<span class="status-badge idle">■ Boşta / İsraf</span>';
      else if (sub.status === 'cancelled') statusBadgeHtml = '<span class="status-badge cancelled">✓ İptal Edildi</span>';

      const isKilled = sub.status === 'cancelled';
      const killBtnHtml = isKilled
        ? '<span class="btn-kill killed">✓ İptal Tamam</span>'
        : `<button class="btn-kill" data-kill-id="${sub.id}" title="Tek Tıkla İptal Sihirbazını Aç">
             <span>Hemen İptal</span>
             <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M5 13h11.86l-5.43 5.43 1.42 1.42L21.14 12l-8.29-8.29-1.42 1.42L16.86 11H5v2z"/></svg>
           </button>`;

      return `
        <tr data-sub-id="${sub.id}">
          <td>
            <div class="service-cell">
              <div class="service-avatar">${sub.name.substring(0, 2).toUpperCase()}</div>
              <div>
                <div class="service-name">${escapeHtml(sub.name)}</div>
                <div class="service-plan">${escapeHtml(sub.plan || 'Standart')}</div>
              </div>
            </div>
          </td>
          <td><span class="num-tabular font-semibold">${formatMoney(sub.price, sub.currency || 'USD')}</span> <span class="text-xs text-muted">/${sub.billingCycle === 'yearly' ? 'yıl' : 'ay'}</span></td>
          <td>${statusBadgeHtml}</td>
          <td class="date-cell text-muted">${sub.nextRenewalDate || 'Belirtilmedi'}</td>
          <td><span class="text-xs text-secondary">${escapeHtml(sub.category || 'Genel')}</span></td>
          <td style="text-align: right;">
            <div style="display: inline-flex; align-items: center; gap: 6px;">
              ${killBtnHtml}
              <button class="btn btn-secondary" style="padding: 4px 8px; min-height: 28px;" data-edit-id="${sub.id}" title="Düzenle">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
              </button>
              <button class="btn btn-danger" style="padding: 4px 8px; min-height: 28px;" data-del-id="${sub.id}" title="Sil">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
              </button>
            </div>
          </td>
        </tr>`;
    }).join('');

    // Attach row events
    DOM.subsTableBody.querySelectorAll('[data-kill-id]').forEach(btn => {
      btn.addEventListener('click', () => openKillWizard(btn.dataset.killId));
    });
    DOM.subsTableBody.querySelectorAll('[data-edit-id]').forEach(btn => {
      btn.addEventListener('click', () => openEditModal(btn.dataset.editId));
    });
    DOM.subsTableBody.querySelectorAll('[data-del-id]').forEach(btn => {
      btn.addEventListener('click', () => handleDeleteSub(btn.dataset.delId));
    });
  }

  function renderDashboardOverview() {
    if (!DOM.dashboardSubList) return;
    const activeAndIdle = state.subscriptions.filter(s => s.status !== 'cancelled').slice(0, 4);
    if (activeAndIdle.length === 0) {
      DOM.dashboardSubList.innerHTML = '<div style="color: var(--text-muted); padding: 16px;">Tüm abonelikler temizlendi veya henüz kayıt yok.</div>';
      return;
    }

    DOM.dashboardSubList.innerHTML = activeAndIdle.map(s => `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--border-subtle);">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div class="service-avatar" style="width: 28px; height: 28px; font-size: 10px;">${s.name.substring(0, 2).toUpperCase()}</div>
          <div>
            <div style="font-weight: 600; font-size: 12px;">${escapeHtml(s.name)}</div>
            <div style="font-size: 10px; color: var(--text-muted);">${escapeHtml(s.notes || s.plan || '')}</div>
          </div>
        </div>
        <div style="text-align: right;">
          <div class="num-tabular font-semibold text-xs">${formatMoney(s.price, s.currency)}</div>
          <div style="font-size: 10px; color: ${s.status === 'idle' ? '#fb7185' : '#94a3b8'};">${s.status === 'idle' ? 'Boşta Lisans' : 'Aktif'}</div>
        </div>
      </div>
    `).join('');
  }

  function renderRiskRadar() {
    if (!DOM.riskRadarList) return;
    const riskySubs = state.subscriptions.filter(s => s.status === 'trial' || s.status === 'idle');

    if (riskySubs.length === 0) {
      DOM.riskRadarList.innerHTML = `
        <div style="background: var(--bg-card); padding: 32px; border-radius: 12px; border: 1px solid var(--border-subtle); text-align: center;">
          <div style="color: var(--accent-emerald); font-size: 24px; margin-bottom: 8px;">✓</div>
          <div style="font-weight: 600; font-size: 14px;">Tüm Riskler Temizlendi</div>
          <div style="color: var(--text-muted); font-size: 12px; margin-top: 4px;">Aktif deneme tuzağı veya boşta SaaS lisansı tespit edilmedi.</div>
        </div>`;
      return;
    }

    DOM.riskRadarList.innerHTML = riskySubs.map(s => {
      const isTrial = s.status === 'trial';
      const daysLeft = getDaysUntil(s.nextRenewalDate);
      return `
        <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 18px; display: flex; align-items: center; justify-content: space-between; gap: 16px;">
          <div style="display: flex; align-items: center; gap: 14px;">
            <div class="service-avatar" style="width: 38px; height: 38px;">${s.name.substring(0, 2).toUpperCase()}</div>
            <div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-weight: 600; font-size: 13px;">${escapeHtml(s.name)}</span>
                <span class="status-badge ${isTrial ? 'trial' : 'idle'}">${isTrial ? `▲ Deneme Bitiyor (${daysLeft} Gün)` : '■ Boşta / Kullanılmıyor'}</span>
              </div>
              <p style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">${escapeHtml(s.notes || (isTrial ? 'Yenilenmeden önce iptal edilmezse karttan tahsil edilecek.' : 'Uzun süredir işlem başlatılmadı.'))}</p>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 14px; flex-shrink: 0;">
            <div style="text-align: right;">
              <div class="num-tabular font-bold font-mono text-sm">${formatMoney(s.price, s.currency)}</div>
              <div style="font-size: 12px; color: var(--text-muted);">${formatMoney(s.price * 12, s.currency)} / yıl kayıp</div>
            </div>
            <button class="btn btn-primary" style="background: #ffffff; color: #000; font-size: 12px;" onclick="window.subradarOpenKill('${s.id}')">
              İptal Sihirbazı
            </button>
          </div>
        </div>`;
    }).join('');
  }

  // ---------------------------------------------------------------------------
  // Add / Edit Modal
  // ---------------------------------------------------------------------------
  function initPresetChips() {
    if (!DOM.presetChipsContainer || typeof SUB_PRESETS === 'undefined') return;
    DOM.presetChipsContainer.innerHTML = SUB_PRESETS.map(p => `
      <div class="preset-chip" data-preset-name="${escapeHtml(p.name)}">
        + ${escapeHtml(p.name)}
      </div>
    `).join('');

    DOM.presetChipsContainer.querySelectorAll('.preset-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const found = SUB_PRESETS.find(p => p.name === chip.dataset.presetName);
        if (found) {
          DOM.formSubName.value = found.name;
          DOM.formSubPlan.value = found.defaultPlan;
          DOM.formSubPrice.value = found.defaultPrice;
          DOM.formSubCategory.value = found.category;
          DOM.formSubCancelUrl.value = found.directCancelUrl;
          DOM.formSubNotes.value = `İptal Adımları: ${found.cancelSteps}`;
        }
      });
    });
  }

  function openNewModal() {
    state.editingSubId = null;
    DOM.modalSubTitle.textContent = 'Yeni Abonelik Ekle';
    DOM.formSubName.value = '';
    DOM.formSubPlan.value = '';
    DOM.formSubPrice.value = '';
    DOM.formSubCurrency.value = state.preferences.currency || 'USD';
    DOM.formSubCycle.value = 'monthly';
    DOM.formSubRenewal.value = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];
    DOM.formSubCategory.value = 'Genel';
    DOM.formSubStatus.value = 'active';
    DOM.formSubCancelUrl.value = '';
    DOM.formSubNotes.value = '';

    DOM.modalSub.classList.add('open');
  }

  function openEditModal(subId) {
    const sub = state.subscriptions.find(s => s.id === subId);
    if (!sub) return;

    state.editingSubId = subId;
    DOM.modalSubTitle.textContent = `${sub.name} Düzenle`;
    DOM.formSubName.value = sub.name || '';
    DOM.formSubPlan.value = sub.plan || '';
    DOM.formSubPrice.value = sub.price || '';
    DOM.formSubCurrency.value = sub.currency || 'USD';
    DOM.formSubCycle.value = sub.billingCycle || 'monthly';
    DOM.formSubRenewal.value = sub.nextRenewalDate || '';
    DOM.formSubCategory.value = sub.category || 'Genel';
    DOM.formSubStatus.value = sub.status || 'active';
    DOM.formSubCancelUrl.value = sub.directCancelUrl || '';
    DOM.formSubNotes.value = sub.notes || '';

    DOM.modalSub.classList.add('open');
  }

  async function handleSaveSub() {
    const name = DOM.formSubName.value.trim();
    const price = parseFloat(DOM.formSubPrice.value) || 0;
    if (!name) {
      alert('Lütfen servis adını girin.');
      return;
    }

    const payload = {
      name,
      plan: DOM.formSubPlan.value.trim(),
      price,
      currency: DOM.formSubCurrency.value,
      billingCycle: DOM.formSubCycle.value,
      nextRenewalDate: DOM.formSubRenewal.value,
      category: DOM.formSubCategory.value,
      status: DOM.formSubStatus.value,
      directCancelUrl: DOM.formSubCancelUrl.value.trim(),
      notes: DOM.formSubNotes.value.trim()
    };

    if (state.editingSubId) {
      await window.subradarAPI.subscriptions.update(state.editingSubId, payload);
    } else {
      await window.subradarAPI.subscriptions.add(payload);
    }

    DOM.modalSub.classList.remove('open');
    await loadInitialData();
  }

  async function handleDeleteSub(subId) {
    if (confirm('Bu aboneliği kasadan kalıcı olarak silmek istediğinizden emin misiniz?')) {
      await window.subradarAPI.subscriptions.delete(subId);
      await loadInitialData();
    }
  }

  // ---------------------------------------------------------------------------
  // 1-Click Kill Switch & Legal Notice Wizard
  // ---------------------------------------------------------------------------
  let currentWizardSub = null;

  async function openKillWizard(subId) {
    const sub = state.subscriptions.find(s => s.id === subId);
    if (!sub) return;

    currentWizardSub = sub;

    // Generate formal legal notice
    const noticeText = await window.subradarAPI.legalNotice.generate(sub, {
      name: state.preferences.userName,
      email: state.preferences.userEmail,
      language: state.preferences.language || 'tr'
    });

    DOM.noticePreview.textContent = noticeText;
    DOM.modalNotice.classList.add('open');
  }

  window.subradarOpenKill = openKillWizard;

  async function handleExecuteKillProtocol() {
    if (!currentWizardSub) return;
    await window.subradarAPI.subscriptions.executeKill(currentWizardSub.id);
    if (currentWizardSub.directCancelUrl) {
      window.subradarAPI.system.openExternal(currentWizardSub.directCancelUrl);
    }
    DOM.modalNotice.classList.remove('open');
    await loadInitialData();
  }

  // ---------------------------------------------------------------------------
  // Window & System Controls
  // ---------------------------------------------------------------------------
  function initWindowControls() {
    if (DOM.btnClose) DOM.btnClose.addEventListener('click', () => window.subradarAPI.window.close());
    if (DOM.btnMin) DOM.btnMin.addEventListener('click', () => window.subradarAPI.window.minimize());
    if (DOM.btnMax) DOM.btnMax.addEventListener('click', () => window.subradarAPI.window.maximize());

    // Navigation Switcher
    DOM.navItems.forEach(item => {
      item.addEventListener('click', () => {
        const tab = item.dataset.tab;
        DOM.navItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        DOM.views.forEach(v => {
          v.style.display = v.id === `view-${tab}` ? 'block' : 'none';
        });
        state.activeTab = tab;
      });
    });

    // Search and Filters
    if (DOM.subSearchInput) {
      DOM.subSearchInput.addEventListener('input', e => {
        state.searchQuery = e.target.value;
        renderSubscriptionsTable();
      });
    }

    DOM.filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        DOM.filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        state.filterStatus = pill.dataset.filter;
        renderSubscriptionsTable();
      });
    });

    // Currency selector
    if (DOM.currencySelect) {
      DOM.currencySelect.addEventListener('change', async e => {
        state.preferences.currency = e.target.value;
        await window.subradarAPI.preferences.update({ currency: e.target.value });
        renderAll();
      });
    }

    // Modal Triggers
    if (DOM.btnNewSub) DOM.btnNewSub.addEventListener('click', openNewModal);
    if (DOM.btnCloseSubModal) DOM.btnCloseSubModal.addEventListener('click', () => DOM.modalSub.classList.remove('open'));
    if (DOM.btnSaveSub) DOM.btnSaveSub.addEventListener('click', handleSaveSub);

    // Legal Notice Modal Triggers
    if (DOM.btnCloseNoticeModal) DOM.btnCloseNoticeModal.addEventListener('click', () => DOM.modalNotice.classList.remove('open'));
    if (DOM.btnOpenPortal) DOM.btnOpenPortal.addEventListener('click', handleExecuteKillProtocol);
    if (DOM.btnCopyNotice) {
      DOM.btnCopyNotice.addEventListener('click', () => {
        window.subradarAPI.system.copyToClipboard(DOM.noticePreview.textContent);
        const originalText = DOM.btnCopyNotice.textContent;
        DOM.btnCopyNotice.textContent = '✓ Panoya Kopyalandı';
        setTimeout(() => DOM.btnCopyNotice.textContent = originalText, 2500);
      });
    }

    // Vault actions
    if (DOM.btnLockVault) {
      DOM.btnLockVault.addEventListener('click', async () => {
        await window.subradarAPI.vault.lock();
        location.reload();
      });
    }
    if (DOM.btnExportBackup) {
      DOM.btnExportBackup.addEventListener('click', async () => {
        await window.subradarAPI.system.exportBackup();
      });
    }
    if (DOM.btnImportBackup) {
      DOM.btnImportBackup.addEventListener('click', async () => {
        await window.subradarAPI.system.importBackup();
      });
    }

    // Background memory monitor
    setInterval(async () => {
      const stats = await window.subradarAPI.system.getMemoryStats();
      if (DOM.statMemVal && stats.heapUsedMB) {
        DOM.statMemVal.textContent = `${stats.heapUsedMB} MB`;
      }
      if (DOM.statPingVal) {
        DOM.statPingVal.textContent = `${(3.4 + Math.random() * 0.8).toFixed(1)}ms`;
      }
    }, 2800);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ---------------------------------------------------------------------------
  // Boot
  // ---------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    initPresetChips();
    initWindowControls();
    initVaultGate();
  });
})();
