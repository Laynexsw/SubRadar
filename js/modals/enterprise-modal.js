/**
 * SubRadar — Enterprise Modal Controller
 */
export function initEnterpriseModal() {
  const backdrop = document.getElementById('ent-modal-backdrop');
  const formView = document.getElementById('ent-view-form');
  const doneView = document.getElementById('ent-view-done');
  let opener = null;

  function openEntModal() {
    opener = document.activeElement;
    if (formView) formView.classList.remove('hidden');
    if (doneView) doneView.classList.add('hidden');
    if (backdrop) { backdrop.classList.remove('hidden'); backdrop.classList.add('flex'); }
    try { document.body.style.overflow = 'hidden'; } catch (e) {}
    const n = document.getElementById('ent-name');
    if (n) setTimeout(() => n.focus(), 60);
  }

  function closeEntModal() {
    if (!backdrop) return;
    backdrop.classList.add('hidden');
    backdrop.classList.remove('flex');
    try { document.body.style.overflow = ''; } catch (e) {}
    if (opener && opener.focus) { try { opener.focus(); } catch (e) {} opener = null; }
  }

  const applyBtn = document.getElementById('ent-apply-btn');
  const closeBtn = document.getElementById('ent-modal-close');
  const doneClose = document.getElementById('ent-done-close');
  const submit = document.getElementById('ent-submit');

  if (applyBtn) applyBtn.addEventListener('click', openEntModal);
  if (closeBtn) closeBtn.addEventListener('click', closeEntModal);
  if (doneClose) doneClose.addEventListener('click', closeEntModal);
  if (backdrop) backdrop.addEventListener('click', e => { if (e.target === backdrop) closeEntModal(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && backdrop && !backdrop.classList.contains('hidden')) closeEntModal();
  });

  if (submit) {
    submit.addEventListener('click', () => {
      const name = (document.getElementById('ent-name') || {}).value || '';
      const email = (document.getElementById('ent-email') || {}).value || '';
      const company = (document.getElementById('ent-company') || {}).value || '';
      const ok = name.trim().length > 1 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && company.trim().length > 1;
      const err = document.getElementById('ent-error');
      if (!ok) {
        if (err) err.classList.remove('hidden');
        return;
      }
      if (err) err.classList.add('hidden');
      if (formView) formView.classList.add('hidden');
      if (doneView) doneView.classList.remove('hidden');
      const dc = document.getElementById('ent-done-close');
      if (dc) dc.focus();
    });
  }
}
