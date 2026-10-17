/* =========================================================================
   SubRadar — Apple-Grade Zero-Asset Web Audio Haptic & Sound Engine
   Zero external audio files. Pure mathematical Web Audio oscillators.
   ========================================================================= */

(function () {
  'use strict';

  var audioCtx = null;
  var isMuted = false;

  // Restore sound preference from localStorage (default: muted until user enables or interacts)
  try {
    isMuted = localStorage.getItem('sr-sound-enabled') !== 'true';
  } catch (e) {
    isMuted = true;
  }

  function getAudioContext() {
    if (!audioCtx) {
      var AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Soft high-frequency click (Apple trackpad/key tap feel)
  function playClick() {
    if (isMuted) return;
    try {
      var ctx = getAudioContext();
      if (!ctx) return;
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.015);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.015);
    } catch (e) {}
  }

  // Gentle toggle sound
  function playToggle() {
    if (isMuted) return;
    try {
      var ctx = getAudioContext();
      if (!ctx) return;
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(380, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(650, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.045);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.045);
    } catch (e) {}
  }

  // Harmonic warm unlock chord (Kill switch / Success feel)
  function playSuccess() {
    if (isMuted) return;
    try {
      var ctx = getAudioContext();
      if (!ctx) return;
      var freqs = [523.25, 659.25, 783.99]; // C5, E5, G5 chord
      freqs.forEach(function (f, idx) {
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, ctx.currentTime + idx * 0.04);
        gain.gain.setValueAtTime(0.035, ctx.currentTime + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.28);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.04);
        osc.stop(ctx.currentTime + 0.3);
      });
    } catch (e) {}
  }

  // Deep spatial radar sonar ping
  function playPing() {
    if (isMuted) return;
    try {
      var ctx = getAudioContext();
      if (!ctx) return;
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } catch (e) {}
  }

  function setMuted(muted) {
    isMuted = !!muted;
    try {
      localStorage.setItem('sr-sound-enabled', isMuted ? 'false' : 'true');
    } catch (e) {}
    updateSoundUI();
  }

  function toggleSound() {
    setMuted(!isMuted);
    if (!isMuted) {
      playSuccess();
      if (typeof srShowToast === 'function') {
        srShowToast('Dokunsal ses efektleri açıldı (Web Audio).');
      }
    } else {
      if (typeof srShowToast === 'function') {
        srShowToast('Ses efektleri kapatıldı.');
      }
    }
  }

  function updateSoundUI() {
    var btn = document.getElementById('sound-toggle-btn');
    if (!btn) return;
    var icon = btn.querySelector('.material-symbols-outlined');
    if (icon) {
      icon.textContent = isMuted ? 'volume_off' : 'volume_up';
    }
    btn.setAttribute('aria-label', isMuted ? 'Ses efektlerini aç' : 'Ses efektlerini kapat');
    btn.classList.toggle('text-emerald-400', !isMuted);
    btn.classList.toggle('text-white/40', isMuted);
  }

  // Expose API globally
  window.srAudio = {
    playClick: playClick,
    playToggle: playToggle,
    playSuccess: playSuccess,
    playPing: playPing,
    isMuted: function () { return isMuted; },
    toggle: toggleSound,
    setMuted: setMuted
  };

  // Wire interactive audio hooks on DOMContentLoaded
  function initAudioListeners() {
    updateSoundUI();
    var soundBtn = document.getElementById('sound-toggle-btn');
    if (soundBtn) soundBtn.addEventListener('click', toggleSound);

    // Auto-hook clicks on primary triggers
    document.addEventListener('click', function (e) {
      var target = e.target;
      if (!target) return;
      var el = target.closest('button, a, input[type="range"], [role="button"]');
      if (el) {
        if (el.classList.contains('direct-kill-btn')) {
          playSuccess();
        } else if (el.id === 'theme-toggle' || el.classList.contains('currency-btn') || el.classList.contains('lang-btn')) {
          playToggle();
        } else {
          playClick();
        }
      }
    }, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAudioListeners);
  } else {
    initAudioListeners();
  }
})();
