/**
 * SubRadar — Privacy & Storage Consent Banner Controller
 */

(function () {
  'use strict';

  var STORAGE_KEY = 'sr-privacy-dismissed';

  function initPrivacyBanner() {
    var banner = document.getElementById('sr-privacy-banner');
    if (!banner) return;

    var dismissed = false;
    try {
      dismissed = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('sr-privacy-consent');
    } catch (e) {}

    if (!dismissed) {
      setTimeout(function () {
        banner.classList.add('show');
      }, 1200);
    }

    var acceptBtn = document.getElementById('sr-privacy-accept');
    var closeBtn = document.getElementById('sr-privacy-close');

    function dismiss(mode) {
      banner.classList.remove('show');
      try {
        localStorage.setItem(STORAGE_KEY, mode || 'acknowledged');
        localStorage.setItem('sr-privacy-consent', mode || 'acknowledged');
      } catch (e) {}

      if (window.srAudio) {
        if (mode === 'accepted' && typeof window.srAudio.click === 'function') {
          window.srAudio.click();
        } else if (typeof window.srAudio.toggle === 'function') {
          window.srAudio.toggle();
        }
      }

      if (window.srAnalytics && typeof window.srAnalytics.track === 'function') {
        window.srAnalytics.track('privacy_banner_dismiss', { mode: mode });
      }

      if (mode === 'accepted' && typeof window.srShowToast === 'function') {
        var msg = (typeof window.t === 'function') 
          ? window.t('Gizlilik tercihi kaydedildi: Sıfır çerez, sıfır telemetri.')
          : 'Gizlilik tercihi kaydedildi: Sıfır çerez, sıfır telemetri.';
        window.srShowToast(msg);
      }
    }

    if (acceptBtn) {
      acceptBtn.addEventListener('click', function () {
        dismiss('accepted');
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        dismiss('closed');
      });
    }

    window.srOpenPrivacyBanner = function () {
      if (banner) {
        banner.classList.add('show');
        if (window.srAudio && typeof window.srAudio.open === 'function') {
          window.srAudio.open();
        }
      }
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPrivacyBanner);
  } else {
    initPrivacyBanner();
  }
})();
