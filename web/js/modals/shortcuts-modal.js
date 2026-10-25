/* =========================================================================
   SubRadar — Power-User Keyboard Shortcuts Handler (? Key, T, S, L, C, D)
   ========================================================================= */

(function () {
  'use strict';

  function initShortcuts() {
    var modal = document.getElementById('shortcuts-modal-backdrop');
    var closeBtn = document.getElementById('shortcuts-modal-close');
    var doneBtn = document.getElementById('shortcuts-done-btn');

    function openModal() {
      if (!modal) return;
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      try { document.body.style.overflow = 'hidden'; } catch (e) {}
      if (window.srAudio && window.srAudio.playToggle) window.srAudio.playToggle();
    }

    function closeModal() {
      if (!modal) return;
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      try { document.body.style.overflow = ''; } catch (e) {}
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (doneBtn) doneBtn.addEventListener('click', closeModal);
    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === modal) closeModal();
      });
    }

    // Expose open helper
    window.srOpenShortcutsModal = openModal;

    // Global Key Listener
    document.addEventListener('keydown', function (e) {
      // Ignore if user is typing in an input, textarea, or select
      var tag = (e.target && e.target.tagName ? e.target.tagName.toLowerCase() : '');
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || (e.target && e.target.isContentEditable)) {
        return;
      }

      // '?' key -> open shortcuts
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        if (modal && !modal.classList.contains('hidden')) {
          closeModal();
        } else {
          openModal();
        }
        return;
      }

      // 'Escape' closes shortcut modal if open
      if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
        closeModal();
        return;
      }

      // 'T' -> toggle theme
      if (e.key === 't' || e.key === 'T') {
        var themeBtn = document.getElementById('theme-toggle');
        if (themeBtn) themeBtn.click();
        return;
      }

      // 'S' -> toggle sound
      if (e.key === 's' || e.key === 'S') {
        if (window.srAudio && window.srAudio.toggle) {
          window.srAudio.toggle();
        }
        return;
      }

      // 'C' -> cycle currency
      if (e.key === 'c' || e.key === 'C') {
        var curOrder = ['USD', 'EUR', 'TRY'];
        var currentCur = typeof srCurrency !== 'undefined' ? srCurrency : 'USD';
        var nextIdx = (curOrder.indexOf(currentCur) + 1) % curOrder.length;
        var nextBtn = document.querySelector('.currency-btn[data-currency="' + curOrder[nextIdx] + '"]');
        if (nextBtn) nextBtn.click();
        return;
      }

      // 'L' -> cycle language
      if (e.key === 'l' || e.key === 'L') {
        var langOrder = ['tr', 'en', 'de'];
        var currentLang = typeof srLang !== 'undefined' ? srLang : 'tr';
        var nextLangIdx = (langOrder.indexOf(currentLang) + 1) % langOrder.length;
        var nextLangBtn = document.querySelector('.lang-btn[data-lang="' + langOrder[nextLangIdx] + '"]');
        if (nextLangBtn) nextLangBtn.click();
        return;
      }

      // 'D' -> open download modal
      if (e.key === 'd' || e.key === 'D') {
        var dlBtn = document.querySelector('.download-trigger-btn');
        if (dlBtn) dlBtn.click();
        return;
      }

      // 'R' -> replay Originkit Tiles Loader
      if (e.key === 'r' || e.key === 'R') {
        if (typeof window.srPlayTilesLoader === 'function') {
          window.srPlayTilesLoader();
        }
        return;
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initShortcuts);
  } else {
    initShortcuts();
  }
})();
