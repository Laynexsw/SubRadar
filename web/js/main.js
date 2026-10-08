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
});
