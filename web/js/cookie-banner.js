/**
 * SubRadar — Apple Minimalist Cookie & User Tracking Banner Controller
 */

(function () {
  'use strict';

  var STORAGE_KEY = 'sr-cookie-consent';

  function initCookieBanner() {
    var banner = document.getElementById('sr-privacy-banner');
    if (!banner) return;

    var consent = null;
    try {
      consent = localStorage.getItem(STORAGE_KEY);
    } catch (e) {}

    // Site açılınca kendi çıksın (Kullanıcı henüz onay vermediyse veya oturum başlangıcında)
    if (!consent) {
      setTimeout(function () {
        banner.classList.add('show');
      }, 500);
    }

    var acceptBtn = document.getElementById('sr-privacy-accept');
    var rejectBtn = document.getElementById('sr-privacy-reject');
    var closeBtn = document.getElementById('sr-privacy-close');

    function dismiss(mode) {
      banner.classList.remove('show');

      try {
        localStorage.setItem(STORAGE_KEY, mode);
      } catch (e) {}

      if (window.srAudio && typeof window.srAudio.click === 'function') {
        window.srAudio.click();
      }

      if (window.srAnalytics && typeof window.srAnalytics.track === 'function') {
        window.srAnalytics.track('cookie_consent', { mode: mode });
      }

      if (typeof window.srShowToast === 'function') {
        var msg = mode === 'accepted'
          ? 'Çerezler kabul edildi: Canlı etkileşim analitiği devrede.'
          : 'Çerezler reddedildi: Temel oturum modu aktif.';
        window.srShowToast(msg);
      }
    }

    if (acceptBtn) {
      acceptBtn.addEventListener('click', function () {
        dismiss('accepted');
      });
    }

    if (rejectBtn) {
      rejectBtn.addEventListener('click', function () {
        dismiss('rejected');
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        banner.classList.remove('show');
        if (window.srAudio && typeof window.srAudio.pop === 'function') {
          window.srAudio.pop();
        }
      });
    }

    window.srOpenPrivacyBanner = function () {
      if (banner) banner.classList.add('show');
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCookieBanner);
  } else {
    initCookieBanner();
  }
})();
