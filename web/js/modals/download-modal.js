/**
 * SubRadar — Download Modal & Architecture Simulation Controller
 */
export function initDownloadModal() {
  const dlModal = document.getElementById('download-modal-backdrop');
  const dlClose = document.getElementById('dl-modal-close');
  const dlCancel = document.getElementById('dl-modal-cancel');
  const dlInstall = document.getElementById('dl-modal-install');
  const dlTitle = document.getElementById('dl-modal-title');
  const dlSubtitle = document.getElementById('dl-modal-subtitle');
  const dlProgressBar = document.getElementById('dl-progress-bar');
  const dlPercentage = document.getElementById('dl-percentage');
  const dlStatusText = document.getElementById('dl-status-text');
  const dlTriggerBtns = document.querySelectorAll('.download-trigger-btn');
  const archArmBtn = document.getElementById('arch-arm');
  const archX86Btn = document.getElementById('arch-x86');
  const dlSpeedNum = document.getElementById('dl-speed-num');
  const dlSizeNum = document.getElementById('dl-size-num');

  let downloadInterval = null;
  let dlOpener = null;
  let dlTargetOS = 'macOS';
  let dlArchIdx = 0;
  let dlTotalMB = 48.2;
  const DL_SIZES = { macOS: [48.2, 51.7], Windows: [52.6, 49.8] };
  const DL_FILES = {
    macOS: ['SubRadar-1.4.2-arm64.dmg', 'SubRadar-1.4.2-x64.dmg'],
    Windows: ['SubRadar-Setup-1.4.2-x64.exe', 'SubRadar-Setup-1.4.2-arm64.msi']
  };
  let dlFileName = DL_FILES.macOS[0];

  function srMB(v) {
    const s = Number(v).toFixed(1);
    const lang = document.documentElement.lang || 'tr';
    return (lang === 'en' ? s : s.replace('.', ',')) + ' MB';
  }

  function srDlNumbers(speed, doneMB) {
    if (dlSpeedNum) dlSpeedNum.textContent = srMB(speed) + (typeof t === 'function' ? t('/sn') : '/sn');
    if (dlSizeNum) dlSizeNum.textContent = doneMB === null ? srMB(dlTotalMB) : `${srMB(doneMB)} / ${srMB(dlTotalMB)}`;
  }

  function srLockScroll() { document.body.style.overflow = 'hidden'; }
  function srUnlockScroll() {
    const ids = ['download-modal-backdrop', 'reclaim-modal-backdrop', 'cmd-palette-backdrop', 'ent-modal-backdrop'];
    const anyOpen = ids.some(id => {
      const m = document.getElementById(id);
      return m && !m.classList.contains('hidden');
    });
    if (!anyOpen) document.body.style.overflow = '';
  }

  function srPaintArchButtons() {
    const on = 'arch-btn py-2 px-3 rounded-lg border border-white/20 bg-white/10 text-white font-medium text-center hover:border-white/40 transition-all cursor-pointer min-h-[44px]';
    const off = 'arch-btn py-2 px-3 rounded-lg border border-white/10 bg-transparent text-white/60 font-medium text-center hover:border-white/30 transition-all cursor-pointer min-h-[44px]';
    if (archArmBtn) {
      archArmBtn.className = dlArchIdx === 0 ? on : off;
      archArmBtn.setAttribute('aria-pressed', String(dlArchIdx === 0));
    }
    if (archX86Btn) {
      archX86Btn.className = dlArchIdx === 1 ? on : off;
      archX86Btn.setAttribute('aria-pressed', String(dlArchIdx === 1));
    }
  }

  function srPaintDlSteps(phase) {
    document.querySelectorAll('#dl-steps .dl-step').forEach(li => {
      const s = parseInt(li.dataset.step || '0', 10);
      li.classList.remove('text-white/40', 'text-white', 'font-semibold', 'text-emerald-400');
      if (s < phase) li.classList.add('text-emerald-400');
      else if (s === phase) li.classList.add('text-white', 'font-semibold');
      else li.classList.add('text-white/40');
    });
  }

  function srPaintDlFile() {
    const el = document.getElementById('dl-file-name');
    if (el) el.textContent = dlFileName;
    const sha = document.getElementById('dl-sha-val');
    if (sha) {
      const isArm = dlArchIdx === 0;
      sha.textContent = dlTargetOS === 'macOS'
        ? (isArm ? 'sha256: 4f1a...c89e (Apple Silicon)' : 'sha256: e82b...110a (Intel x86_64)')
        : (isArm ? 'sha256: d91c...774b (Windows x64)' : 'sha256: 30bb...a2c1 (Windows ARM64)');
    }
  }

  function srPaintOsButtons() {
    document.querySelectorAll('.os-pick-btn').forEach(b => {
      const isPick = b.dataset.osbtn === dlTargetOS;
      b.classList.toggle('os-pick', isPick);
      b.setAttribute('aria-pressed', String(isPick));
    });
  }

  function srApplyDlOs() {
    if (!dlTitle || !archArmBtn || !archX86Btn) return;
    if (dlTargetOS === 'macOS') {
      dlTitle.textContent = typeof t === 'function' ? t('SubRadar macOS İstemcisi') : 'SubRadar macOS İstemcisi';
      archArmBtn.textContent = 'Apple Silicon (M1/M2/M3/M4)';
      archX86Btn.textContent = 'Intel (x86_64)';
    } else {
      dlTitle.textContent = typeof t === 'function' ? t('SubRadar Windows İstemcisi') : 'SubRadar Windows İstemcisi';
      archArmBtn.textContent = typeof t === 'function' ? t('Windows x64 (.exe)') : 'Windows x64 (.exe)';
      archX86Btn.textContent = typeof t === 'function' ? t('Windows ARM64 (.msi)') : 'Windows ARM64 (.msi)';
    }
    srPaintOsButtons();
  }

  function srBeginDlSim() {
    clearInterval(downloadInterval);
    let progress = 0;
    if (dlProgressBar) dlProgressBar.style.width = '0%';
    if (dlPercentage) dlPercentage.textContent = '0%';
    if (dlStatusText) dlStatusText.textContent = typeof t === 'function' ? t('Doğrudan indirme başlatılıyor...') : 'Doğrudan indirme başlatılıyor...';
    if (dlInstall) dlInstall.disabled = true;
    srPaintDlSteps(1);

    downloadInterval = setInterval(() => {
      progress += Math.floor(Math.random() * 9) + 4;
      if (progress > 100) progress = 100;
      if (dlProgressBar) dlProgressBar.style.width = `${progress}%`;
      if (dlPercentage) dlPercentage.textContent = `${progress}%`;

      const doneMB = (progress / 100) * dlTotalMB;
      srDlNumbers(18.4, doneMB);

      if (progress < 40) {
        if (dlStatusText) dlStatusText.textContent = typeof t === 'function' ? t('Yerel paket sunucusundan aktarılıyor...') : 'Yerel paket sunucusundan aktarılıyor...';
        srPaintDlSteps(1);
      } else if (progress < 90) {
        if (dlStatusText) dlStatusText.textContent = typeof t === 'function' ? t('İkili dosya indiriliyor ve doğrulanıyor...') : 'İkili dosya indiriliyor ve doğrulanıyor...';
        srPaintDlSteps(2);
      } else if (progress < 100) {
        if (dlStatusText) dlStatusText.textContent = typeof t === 'function' ? t('SHA-256 bütünlük kontrolü yapılıyor...') : 'SHA-256 bütünlük kontrolü yapılıyor...';
        srPaintDlSteps(2);
      } else {
        clearInterval(downloadInterval);
        if (dlStatusText) dlStatusText.textContent = typeof t === 'function' ? t('İndirme tamamlandı • Kuruluma hazır') : 'İndirme tamamlandı • Kuruluma hazır';
        srPaintDlSteps(3);
        srDlNumbers(0, dlTotalMB);
        if (dlInstall) {
          dlInstall.disabled = false;
          dlInstall.focus();
        }
      }
    }, 120);
  }

  function openDownloadModal(os) {
    dlOpener = document.activeElement;
    if (!dlModal) return;
    dlModal.classList.remove('hidden');
    dlModal.classList.add('flex');
    srLockScroll();

    dlTargetOS = os;
    if (os === 'auto') {
      const isMac = navigator.userAgent.toUpperCase().indexOf('MAC') >= 0;
      dlTargetOS = isMac ? 'macOS' : 'Windows';
    }
    dlArchIdx = 0;
    dlTotalMB = (DL_SIZES[dlTargetOS] || DL_SIZES.macOS)[0];

    srApplyDlOs();
    dlFileName = (DL_FILES[dlTargetOS] || DL_FILES.macOS)[dlArchIdx];
    srPaintDlFile();
    srPaintArchButtons();
    const dlMain = document.getElementById('dl-view-main');
    const dlDone = document.getElementById('dl-view-done');
    const dlFoot = document.getElementById('dl-foot-main');
    if (dlMain) dlMain.classList.remove('hidden');
    if (dlDone) dlDone.classList.add('hidden');
    if (dlFoot) dlFoot.classList.remove('hidden');
    srBeginDlSim();
    if (dlClose) dlClose.focus();
  }

  function closeDownloadModal() {
    clearInterval(downloadInterval);
    if (!dlModal) return;
    dlModal.classList.add('hidden');
    dlModal.classList.remove('flex');
    srUnlockScroll();
    if (dlOpener && dlOpener.focus) {
      try { dlOpener.focus(); } catch (e) {}
      dlOpener = null;
    }
  }

  dlTriggerBtns.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      openDownloadModal(btn.dataset.os || 'macOS');
    });
  });

  if (dlClose) dlClose.addEventListener('click', closeDownloadModal);
  if (dlCancel) dlCancel.addEventListener('click', closeDownloadModal);
  if (dlModal) {
    dlModal.addEventListener('click', e => {
      if (e.target === dlModal) closeDownloadModal();
    });
    dlModal.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeDownloadModal();
    });
  }

  if (dlInstall) {
    dlInstall.addEventListener('click', () => {
      if (dlInstall.disabled) return;
      const dlMain = document.getElementById('dl-view-main');
      const dlDone = document.getElementById('dl-view-done');
      const dlFoot = document.getElementById('dl-foot-main');
      const dlDoneInstall = document.getElementById('dl-done-install');
      srPaintDlFile();
      srPaintDlSteps(4);
      if (dlMain) dlMain.classList.add('hidden');
      if (dlFoot) dlFoot.classList.add('hidden');
      if (dlDone) dlDone.classList.remove('hidden');
      if (dlDoneInstall) dlDoneInstall.focus();
    });
  }

  const dlDoneCloseBtn = document.getElementById('dl-done-close');
  if (dlDoneCloseBtn) dlDoneCloseBtn.addEventListener('click', closeDownloadModal);
  const dlDoneInstallBtn = document.getElementById('dl-done-install');
  if (dlDoneInstallBtn) dlDoneInstallBtn.addEventListener('click', closeDownloadModal);

  // OS pick buttons in modal
  document.querySelectorAll('.os-pick-btn').forEach(b => {
    b.addEventListener('click', () => {
      if (!DL_FILES[b.dataset.osbtn]) return;
      dlTargetOS = b.dataset.osbtn;
      dlArchIdx = 0;
      dlTotalMB = (DL_SIZES[dlTargetOS] || DL_SIZES.macOS)[0];
      dlFileName = (DL_FILES[dlTargetOS] || DL_FILES.macOS)[0];
      srApplyDlOs();
      srPaintArchButtons();
      srPaintDlFile();
      srBeginDlSim();
    });
  });

  if (archArmBtn && archX86Btn) {
    archArmBtn.addEventListener('click', () => {
      dlArchIdx = 0;
      dlTotalMB = (DL_SIZES[dlTargetOS] || DL_SIZES.macOS)[0];
      dlFileName = (DL_FILES[dlTargetOS] || DL_FILES.macOS)[0];
      srPaintArchButtons();
      srPaintDlFile();
      srBeginDlSim();
    });
    archX86Btn.addEventListener('click', () => {
      dlArchIdx = 1;
      dlTotalMB = (DL_SIZES[dlTargetOS] || DL_SIZES.macOS)[1];
      dlFileName = (DL_FILES[dlTargetOS] || DL_FILES.macOS)[1];
      srPaintArchButtons();
      srPaintDlFile();
      srBeginDlSim();
    });
  }
}
