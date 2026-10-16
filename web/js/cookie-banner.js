/**
 * SubRadar — Privacy & Storage Consent Banner Controller
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'sr-privacy-consent';

  document.addEventListener('DOMContentLoaded', () => {
    const banner = document.getElementById('sr-privacy-banner');
    if (!banner) return;

    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) {
      setTimeout(() => {
        banner.classList.add('show');
      }, 1000);
    }

    const acceptBtn = document.getElementById('sr-privacy-accept');
    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => {
        try { localStorage.setItem(STORAGE_KEY, 'accepted'); } catch {}
        banner.classList.remove('show');
      });
    }

    const closeBtn = document.getElementById('sr-privacy-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        try { localStorage.setItem(STORAGE_KEY, 'dismissed'); } catch {}
        banner.classList.remove('show');
      });
    }
  });
})();
