/**
 * SubRadar — Reclaim Capital Modal Controller
 */
export function initReclaimModal() {
  const reclaimBtn = document.getElementById('reclaim-btn');
  const reclaimModal = document.getElementById('reclaim-modal-backdrop');
  const reclaimClose = document.getElementById('reclaim-modal-close');
  const cliCopyBtn = document.getElementById('cli-copy-btn');
  let reclaimOpener = null;

  function srLockScroll() { document.body.style.overflow = 'hidden'; }
  function srUnlockScroll() {
    const ids = ['download-modal-backdrop', 'reclaim-modal-backdrop', 'cmd-palette-backdrop', 'ent-modal-backdrop'];
    const anyOpen = ids.some(id => {
      const m = document.getElementById(id);
      return m && !m.classList.contains('hidden');
    });
    if (!anyOpen) document.body.style.overflow = '';
  }

  function openReclaimModal() {
    reclaimOpener = document.activeElement;
    if (reclaimModal) {
      reclaimModal.classList.remove('hidden');
      reclaimModal.classList.add('flex');
    }
    srLockScroll();
    if (reclaimClose) reclaimClose.focus();
  }

  function closeReclaimModal() {
    if (reclaimModal) {
      reclaimModal.classList.add('hidden');
      reclaimModal.classList.remove('flex');
    }
    srUnlockScroll();
    if (reclaimOpener && reclaimOpener.focus) {
      try { reclaimOpener.focus(); } catch (e) {}
      reclaimOpener = null;
    }
  }

  if (reclaimBtn) reclaimBtn.addEventListener('click', openReclaimModal);
  if (reclaimClose) reclaimClose.addEventListener('click', closeReclaimModal);
  if (reclaimModal) {
    reclaimModal.addEventListener('click', e => {
      if (e.target === reclaimModal) closeReclaimModal();
    });
    reclaimModal.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeReclaimModal();
    });
  }

  if (cliCopyBtn) {
    cliCopyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('curl -sSL subradar.dev/cli | sh').then(() => {
        cliCopyBtn.innerHTML = `<span class="material-symbols-outlined text-[14px] text-emerald-400" aria-hidden="true">check</span><span class="text-emerald-400">${typeof t === 'function' ? t('Panoya kopyalandı') : 'Panoya kopyalandı'}</span>`;
        setTimeout(() => {
          cliCopyBtn.innerHTML = `<span class="material-symbols-outlined text-[14px]" aria-hidden="true">content_copy</span><span>curl -sSL subradar.dev/cli | sh</span>`;
        }, 3000);
      });
    });
  }
}
