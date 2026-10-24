/**
 * SubRadar — Enterprise Modal Controller (Loading states & inline validation)
 */
import { srSubmitEnterpriseInquiry } from '../supabase.js';

export function initEnterpriseModal() {
  const backdrop = document.getElementById('ent-modal-backdrop');
  const formView = document.getElementById('ent-view-form');
  const doneView = document.getElementById('ent-view-done');
  let opener = null;

  const nameInput = document.getElementById('ent-name');
  const emailInput = document.getElementById('ent-email');
  const companyInput = document.getElementById('ent-company');
  const nameErr = document.getElementById('ent-name-err');
  const emailErr = document.getElementById('ent-email-err');
  const companyErr = document.getElementById('ent-company-err');

  function clearErrors() {
    [nameInput, emailInput, companyInput].forEach(el => {
      if (el) {
        el.classList.remove('form-field-invalid', 'shake-anim');
        el.removeAttribute('aria-invalid');
      }
    });
    [nameErr, emailErr, companyErr].forEach(el => {
      if (el) el.classList.add('hidden');
    });
  }

  // Clear error on input
  [nameInput, emailInput, companyInput].forEach(el => {
    if (el) {
      el.addEventListener('input', () => {
        el.classList.remove('form-field-invalid');
        el.removeAttribute('aria-invalid');
        const err = document.getElementById(el.id + '-err');
        if (err) err.classList.add('hidden');
      });
    }
  });

  function openEntModal() {
    opener = document.activeElement;
    clearErrors();
    if (formView) formView.classList.remove('hidden');
    if (doneView) doneView.classList.add('hidden');
    if (backdrop) { backdrop.classList.remove('hidden'); backdrop.classList.add('flex'); }
    try { document.body.style.overflow = 'hidden'; } catch (e) {}
    if (nameInput) setTimeout(() => nameInput.focus(), 60);
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
  const submitText = document.getElementById('ent-submit-text');

  if (applyBtn) applyBtn.addEventListener('click', openEntModal);
  if (closeBtn) closeBtn.addEventListener('click', closeEntModal);
  if (doneClose) doneClose.addEventListener('click', closeEntModal);
  if (backdrop) backdrop.addEventListener('click', e => { if (e.target === backdrop) closeEntModal(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && backdrop && !backdrop.classList.contains('hidden')) closeEntModal();
  });

  if (submit) {
    submit.addEventListener('click', () => {
      clearErrors();
      let hasError = false;

      const nameVal = (nameInput ? nameInput.value : '').trim();
      const emailVal = (emailInput ? emailInput.value : '').trim();
      const companyVal = (companyInput ? companyInput.value : '').trim();

      if (nameVal.length < 2) {
        if (nameInput) {
          nameInput.classList.add('form-field-invalid', 'shake-anim');
          nameInput.setAttribute('aria-invalid', 'true');
        }
        if (nameErr) nameErr.classList.remove('hidden');
        hasError = true;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        if (emailInput) {
          emailInput.classList.add('form-field-invalid', 'shake-anim');
          emailInput.setAttribute('aria-invalid', 'true');
        }
        if (emailErr) emailErr.classList.remove('hidden');
        hasError = true;
      }

      if (companyVal.length < 2) {
        if (companyInput) {
          companyInput.classList.add('form-field-invalid', 'shake-anim');
          companyInput.setAttribute('aria-invalid', 'true');
        }
        if (companyErr) companyErr.classList.remove('hidden');
        hasError = true;
      }

      if (hasError) return;

      // Item 12: Loading State
      submit.disabled = true;
      if (submitText) {
        submitText.innerHTML = '<span class="sr-spinner mr-2"></span> Gönderiliyor...';
      }

      const generatedRef = 'Takip Kodu: #SR-2026-' + Math.floor(1000 + Math.random() * 9000);

      srSubmitEnterpriseInquiry({
        name: nameVal,
        email: emailVal,
        company: companyVal,
        refCode: generatedRef
      }).catch(err => {
        console.warn('[SubRadar] Supabase enterprise save fallback:', err);
      }).finally(() => {
        submit.disabled = false;
        if (submitText) submitText.textContent = 'Başvuruyu Gönder';
        
        // Item 14: Dynamic reference code
        const refCodeEl = document.getElementById('ent-ref-code');
        if (refCodeEl) {
          refCodeEl.textContent = generatedRef;
        }

        if (formView) formView.classList.add('hidden');
        if (doneView) doneView.classList.remove('hidden');
        if (doneClose) doneClose.focus();

        if (window.srAnalytics && window.srAnalytics.track) {
          window.srAnalytics.track('enterprise_apply');
        }
      });
    });
  }
}
