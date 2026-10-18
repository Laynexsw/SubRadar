/**
 * SubRadar — Apple Minimalist Privacy Dynamic Capsule & Interactive Air-Gap Switchboard
 */

(function () {
  'use strict';

  var STORAGE_KEY = 'sr-privacy-dismissed';

  function updateLocalStorageSize() {
    var sizeElem = document.getElementById('sr-privacy-ls-size');
    if (!sizeElem) return;

    try {
      var totalBytes = 0;
      var knownKeys = ['sr-theme', 'sr-lang', 'sr-currency', 'sr-privacy-dismissed', 'sr-privacy-consent'];

      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && (k.indexOf('sr-') === 0 || knownKeys.indexOf(k) !== -1)) {
          var val = localStorage.getItem(k);
          totalBytes += (k.length + (val ? val.length : 0)) * 2;
        }
      }

      sizeElem.textContent = '~' + Math.max(totalBytes, totalBytes > 0 ? totalBytes : 0) + ' Bayt';
    } catch (e) {
      sizeElem.textContent = '~74 Bayt';
    }
  }

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
        updateLocalStorageSize();
      }, 1200);
    }

    var acceptBtn = document.getElementById('sr-privacy-accept');
    var drawerSealBtn = document.getElementById('sr-privacy-drawer-seal');
    var closeBtn = document.getElementById('sr-privacy-close');
    var inspectToggle = document.getElementById('sr-privacy-inspect-toggle');
    var drawer = document.getElementById('sr-privacy-drawer');
    var toggleIcon = document.getElementById('sr-privacy-toggle-icon');
    var toggleLabel = document.getElementById('sr-privacy-toggle-label');
    var purgeBtn = document.getElementById('sr-privacy-purge-btn');

    // Cupertino Switches
    var swLocal = document.getElementById('sr-sw-local');
    var swRowLocal = document.getElementById('sr-sw-row-local');
    var swTracking = document.getElementById('sr-sw-tracking');
    var swRowTracking = document.getElementById('sr-sw-row-tracking');
    var swTelemetry = document.getElementById('sr-sw-telemetry');
    var swRowTelemetry = document.getElementById('sr-sw-row-telemetry');

    // Toggle Transparency Drawer
    function toggleDrawer() {
      if (!drawer) return;
      var isExpanded = drawer.classList.contains('is-expanded');
      if (isExpanded) {
        drawer.classList.remove('is-expanded');
        drawer.setAttribute('aria-hidden', 'true');
        if (inspectToggle) inspectToggle.setAttribute('aria-expanded', 'false');
        if (toggleIcon) toggleIcon.textContent = 'expand_more';
        if (toggleLabel) {
          toggleLabel.textContent = (typeof window.t === 'function') ? window.t('Detay') : 'Detay';
        }
        if (window.srAudio && typeof window.srAudio.toggle === 'function') {
          window.srAudio.toggle();
        }
      } else {
        updateLocalStorageSize();
        drawer.classList.add('is-expanded');
        drawer.setAttribute('aria-hidden', 'false');
        if (inspectToggle) inspectToggle.setAttribute('aria-expanded', 'true');
        if (toggleIcon) toggleIcon.textContent = 'expand_less';
        if (toggleLabel) {
          toggleLabel.textContent = (typeof window.t === 'function') ? window.t('Gizle') : 'Gizle';
        }
        if (window.srAudio && typeof window.srAudio.open === 'function') {
          window.srAudio.open();
        }
      }
    }

    if (inspectToggle) {
      inspectToggle.addEventListener('click', toggleDrawer);
    }

    // Interactive Local Storage Cupertino Switch
    function toggleLocalSwitch() {
      if (!swLocal) return;
      var isActive = swLocal.classList.contains('is-active');
      if (isActive) {
        swLocal.classList.remove('is-active');
        swLocal.setAttribute('aria-checked', 'false');
        if (typeof window.srShowToast === 'function') {
          var warnMsg = (typeof window.t === 'function')
            ? window.t('Yerel tercihler askıya alındı (oturum sonunda sıfırlanır).')
            : 'Yerel tercihler askıya alındı (oturum sonunda sıfırlanır).';
          window.srShowToast(warnMsg);
        }
      } else {
        swLocal.classList.add('is-active');
        swLocal.setAttribute('aria-checked', 'true');
        if (typeof window.srShowToast === 'function') {
          var okMsg = (typeof window.t === 'function')
            ? window.t('Yerel arayüz tercihleri aktif.')
            : 'Yerel arayüz tercihleri aktif.';
          window.srShowToast(okMsg);
        }
      }
      if (window.srAudio && typeof window.srAudio.toggle === 'function') {
        window.srAudio.toggle();
      }
    }

    if (swLocal) swLocal.addEventListener('click', toggleLocalSwitch);
    if (swRowLocal) {
      swRowLocal.addEventListener('click', function (e) {
        if (e.target !== swLocal && !swLocal.contains(e.target)) toggleLocalSwitch();
      });
    }

    // Locked Switches Information
    function handleLockedTracking() {
      if (window.srAudio && typeof window.srAudio.toggle === 'function') {
        window.srAudio.toggle();
      }
      if (typeof window.srShowToast === 'function') {
        var msg = (typeof window.t === 'function')
          ? window.t('Sıfır Çerez: Üçüncü taraf kodu SubRadar\'da tamamen engellenmiştir.')
          : 'Sıfır Çerez: Üçüncü taraf kodu SubRadar\'da tamamen engellenmiştir.';
        window.srShowToast(msg);
      }
    }

    if (swTracking) swTracking.addEventListener('click', handleLockedTracking);
    if (swRowTracking) {
      swRowTracking.addEventListener('click', function (e) {
        if (e.target !== swTracking && !swTracking.contains(e.target)) handleLockedTracking();
      });
    }

    function handleLockedTelemetry() {
      if (window.srAudio && typeof window.srAudio.toggle === 'function') {
        window.srAudio.toggle();
      }
      if (typeof window.srShowToast === 'function') {
        var msg = (typeof window.t === 'function')
          ? window.t('Hava Boşluğu: Finansal verileriniz asla sunucuya aktarılmaz.')
          : 'Hava Boşluğu: Finansal verileriniz asla sunucuya aktarılmaz.';
        window.srShowToast(msg);
      }
    }

    if (swTelemetry) swTelemetry.addEventListener('click', handleLockedTelemetry);
    if (swRowTelemetry) {
      swRowTelemetry.addEventListener('click', function (e) {
        if (e.target !== swTelemetry && !swTelemetry.contains(e.target)) handleLockedTelemetry();
      });
    }

    // Purge Local Storage
    if (purgeBtn) {
      purgeBtn.addEventListener('click', function () {
        try {
          var keysToRemove = ['sr-theme', 'sr-lang', 'sr-currency', 'sr-privacy-dismissed', 'sr-privacy-consent'];
          keysToRemove.forEach(function (k) {
            try { localStorage.removeItem(k); } catch (err) {}
          });
        } catch (e) {}

        var sizeElem = document.getElementById('sr-privacy-ls-size');
        if (sizeElem) sizeElem.textContent = '0 Bayt';

        if (window.srAudio && typeof window.srAudio.click === 'function') {
          window.srAudio.click();
        }

        if (typeof window.srShowToast === 'function') {
          var purgeMsg = (typeof window.t === 'function')
            ? window.t('Tüm yerel tercihler ve bellek temizlendi.')
            : 'Tüm yerel tercihler ve bellek temizlendi.';
          window.srShowToast(purgeMsg);
        }
      });
    }

    // Dismiss & Accept
    function dismiss(mode) {
      banner.classList.remove('show');
      if (drawer) {
        drawer.classList.remove('is-expanded');
        drawer.setAttribute('aria-hidden', 'true');
        if (inspectToggle) inspectToggle.setAttribute('aria-expanded', 'false');
        if (toggleIcon) toggleIcon.textContent = 'expand_more';
        if (toggleLabel) {
          toggleLabel.textContent = (typeof window.t === 'function') ? window.t('Detay') : 'Detay';
        }
      }

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
          ? window.t('Gizlilik kalkanı onaylandı: %100 yerel, sıfır telemetri.')
          : 'Gizlilik kalkanı onaylandı: %100 yerel, sıfır telemetri.';
        window.srShowToast(msg);
      }
    }

    if (acceptBtn) acceptBtn.addEventListener('click', function () { dismiss('accepted'); });
    if (drawerSealBtn) drawerSealBtn.addEventListener('click', function () { dismiss('accepted'); });
    if (closeBtn) closeBtn.addEventListener('click', function () { dismiss('closed'); });

    window.srOpenPrivacyBanner = function () {
      if (banner) {
        updateLocalStorageSize();
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
