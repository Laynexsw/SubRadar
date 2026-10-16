/**
 * SubRadar — Privacy-First Zero-Cookie Local Analytics
 * 
 * 100% Offline & Local Session Analytics.
 * Zero PII, Zero Cloud Telemetry, Zero Third-Party Trackers.
 * Fully honors navigator.doNotTrack.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'sr-local-metrics';
  const DNT = navigator.doNotTrack === '1' || window.doNotTrack === '1';

  function getMetrics() {
    if (DNT) return { dnt: true };
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : { views: 0, calcs: 0, downloads: 0, kills: 0 };
    } catch {
      return { views: 0, calcs: 0, downloads: 0, kills: 0 };
    }
  }

  function saveMetrics(metrics) {
    if (DNT) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(metrics));
    } catch {
      // Storage unavailable or quota exceeded
    }
  }

  function trackEvent(name) {
    if (DNT) return;
    const m = getMetrics();
    if (name === 'view') m.views = (m.views || 0) + 1;
    else if (name === 'calc') m.calcs = (m.calcs || 0) + 1;
    else if (name === 'download') m.downloads = (m.downloads || 0) + 1;
    else if (name === 'kill') m.kills = (m.kills || 0) + 1;
    saveMetrics(m);
  }

  // Record initial view
  trackEvent('view');

  // Attach global API for transparent inspection
  window.srAnalytics = {
    track: trackEvent,
    get: getMetrics,
    isDnt: DNT
  };
})();
