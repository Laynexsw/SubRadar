/**
 * SubRadar — Master Application Orchestrator
 */
import { SR_RATES, srCurrency, setCurrency, srConvert } from './config.js';
import { initTheme } from './theme.js';
import { initFx } from './fx.js';
import { srShowToast } from './toast.js';
import { initCalculator } from './calculator.js';
import { initHeroWindow } from './hero-window.js';
import { initScrollMotion } from './scroll-motion.js';
import { initDownloadModal } from './modals/download-modal.js';
import { initCommandPalette } from './modals/command-palette.js';
import { initEnterpriseModal } from './modals/enterprise-modal.js';
import { initReclaimModal } from './modals/reclaim-modal.js';
import { initAuthModal } from './modals/auth-modal.js';
import './analytics.js';
import './cookie-banner.js';
import './mobile-cta.js';
import './audio-fx.js';
import './cursor-glow.js';
import './statement-lab.js';
import './hash-verifier.js';
import './social-export.js';
import './modals/shortcuts-modal.js';
import './modals/legal-gen.js';
import './supabase.js';
import { initTilesLoader } from './tiles-loader.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize modules
  initTheme();
  initFx();
  initScrollMotion();
  const heroModule = initHeroWindow();
  const calcModule = initCalculator();
  initDownloadModal();
  initCommandPalette();
  initEnterpriseModal();
  initReclaimModal();
  initAuthModal();

  // Originkit "Tiles Loader" Preloader: runs before site opens
  initTilesLoader({
    minTime: 1.8,
    revealS: 1.3
  });

  // Mobile menu toggle
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('hidden');
      menuBtn.setAttribute('aria-expanded', String(!open));
    });
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      menuBtn.setAttribute('aria-expanded', 'false');
    }));
  }

  // Currency switchers
  document.querySelectorAll('.currency-btn').forEach(b => {
    b.addEventListener('click', () => {
      const cur = b.dataset.currency;
      if (!SR_RATES[cur]) return;
      setCurrency(cur);
      document.querySelectorAll('.currency-btn').forEach(btn => {
        const active = btn.dataset.currency === cur;
        btn.setAttribute('aria-pressed', String(active));
        btn.classList.toggle('bg-white/15', active);
        btn.classList.toggle('text-white', active);
        btn.classList.toggle('text-white/50', !active);
      });
      if (typeof srPaintStatics === 'function') srPaintStatics();
      if (heroModule) heroModule.renderHero();
      if (calcModule) calcModule.updateCalculator();
    });
  });

  // Platform-aware shortcut labeling
  const isMacPlatform = navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.userAgent.toUpperCase().indexOf('MAC') >= 0;
  if (!isMacPlatform) {
    const navCmd = document.querySelector('#nav-cmd-trigger span:last-child');
    if (navCmd) navCmd.textContent = 'Ctrl+K';
    const heroSearch = document.getElementById('hero-sub-search');
    if (heroSearch) heroSearch.placeholder = 'Aboneliğe git (Ctrl+K)';
  }

  // Register Offline PWA Service Worker
  if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    navigator.serviceWorker.register('sw.js').catch(function () {});
  }
});
