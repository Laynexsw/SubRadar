/**
 * SubRadar — Interactive Desktop App Mockup (Hero Window)
 */
import { srShowToast } from './toast.js';

export function initHeroWindow() {
  let currentMonthlyBurn = 384.20;
  let detectedLeaksCount = 3;
  let annualWasteRecoverable = 1890.00;

  const burnDisplay = document.getElementById('hero-monthly-burn');
  const leaksDisplay = document.getElementById('hero-detected-leaks');
  const wasteDisplay = document.getElementById('hero-annual-waste');
  const rulesBadge = document.getElementById('app-rules-count-badge');
  const interceptorStatus = document.getElementById('hero-interceptor-status');
  const memoryCounter = document.getElementById('app-memory-counter');
  const memoryBar = document.getElementById('memory-bar');

  const killButtons = document.querySelectorAll('.direct-kill-btn');
  const heroSubItems = document.querySelectorAll('.sub-item');
  const heroSearchInput = document.getElementById('hero-sub-search');
  const heroNoResults = document.getElementById('hero-no-results');
  const tabButtons = document.querySelectorAll('.app-tab-btn');
  let srHeroTab = 'overview';

  function renderHero() {
    if (burnDisplay && typeof srFormat === 'function') burnDisplay.textContent = srFormat(currentMonthlyBurn, 2);
    if (leaksDisplay) leaksDisplay.textContent = `${detectedLeaksCount} ${detectedLeaksCount === 1 ? (typeof t === 'function' ? t('Pasif Lisans') : 'Pasif Lisans') : (typeof t === 'function' ? t('Pasif Lisanslar') : 'Pasif Lisanslar')}`;
    if (wasteDisplay && typeof srFormat === 'function') wasteDisplay.textContent = srFormat(annualWasteRecoverable, 2);
    if (interceptorStatus) {
      interceptorStatus.textContent = `${detectedLeaksCount + 1} ${typeof t === 'function' ? t('Arka Plan Engelleyici Etkin') : 'Arka Plan Engelleyici Etkin'}`;
    }
    if (rulesBadge) {
      rulesBadge.textContent = `${detectedLeaksCount}`;
    }
  }

  function renderKillRow(btn) {
    const saving = parseFloat(btn.dataset.saving || 0);
    btn.disabled = true;
    btn.classList.remove('bg-white', 'text-black', 'hover:bg-neutral-200');
    btn.classList.add('bg-emerald-500/10', 'text-emerald-400', 'border', 'border-emerald-500/30', 'cursor-default');
    btn.innerHTML = `<span class="material-symbols-outlined text-[13px]" aria-hidden="true">check_circle</span><span>${typeof t === 'function' ? t('Sonlandırıldı') : 'Sonlandırıldı'} (${typeof srFormat === 'function' ? srFormat(saving, 2) : saving}${typeof t === 'function' ? t('/ay kazanç') : '/ay kazanç'})</span>`;
    const row = btn.closest('.sub-item');
    if (row) {
      const badge = row.querySelector('.status-badge');
      if (badge) {
        badge.className = 'status-badge text-[9px] font-mono bg-emerald-500/20 border border-emerald-500/40 px-1.5 py-0.5 rounded text-emerald-300';
        badge.textContent = typeof t === 'function' ? t('KESİN İPTAL TAMAMLANDI') : 'KESİN İPTAL TAMAMLANDI';
      }
      const costDisplay = row.querySelector('.item-cost-display');
      if (costDisplay && typeof srFormat === 'function') {
        costDisplay.removeAttribute('data-usd');
        const per = typeof srPer === 'function' ? srPer() : '/ay';
        costDisplay.innerHTML = `<span class="line-through text-white/40">${srFormat(saving, 2)}${per}</span> <span class="text-emerald-400 font-semibold">${srFormat(0, 2)}</span>`;
      }
      const dateDisplay = row.querySelector('.item-status-date');
      if (dateDisplay) {
        dateDisplay.textContent = typeof t === 'function' ? t('YİNELENEN ÖDEME TEMİZLENDİ') : 'YİNELENEN ÖDEME TEMİZLENDİ';
      }
    }
  }

  killButtons.forEach(btn => {
    const row = btn.closest('.sub-item');
    if (row) {
      const badge = row.querySelector('.status-badge');
      if (badge) {
        row.dataset.rawBadge = badge.textContent.trim();
        row.dataset.rawBadgeClass = badge.className;
      }
      const costDisplay = row.querySelector('.item-cost-display');
      if (costDisplay) {
        costDisplay.dataset.origUsd = costDisplay.getAttribute('data-usd') || '';
      }
      const dateDisplay = row.querySelector('.item-status-date');
      if (dateDisplay) {
        dateDisplay.dataset.origDate = dateDisplay.textContent.trim();
      }
    }

    btn.addEventListener('click', e => {
      e.stopPropagation();
      if (btn.disabled) return;
      const saving = parseFloat(btn.dataset.saving || 0);

      currentMonthlyBurn = Math.max(0, currentMonthlyBurn - saving);
      detectedLeaksCount = Math.max(0, detectedLeaksCount - 1);
      annualWasteRecoverable = Math.max(0, annualWasteRecoverable - (saving * 12));

      renderHero();
      renderKillRow(btn);

      if (memoryCounter && memoryBar) {
        const newMem = (18.4 - (3 - detectedLeaksCount) * 1.2).toFixed(1);
        memoryCounter.textContent = `${newMem} MB`;
        memoryBar.style.width = `${Math.max(14, 24 - (3 - detectedLeaksCount) * 3)}%`;
      }
      srRefilterHero();
    });
  });

  function resetHeroDemo() {
    currentMonthlyBurn = 384.20;
    detectedLeaksCount = 3;
    annualWasteRecoverable = 1890.00;
    killButtons.forEach(btn => {
      btn.disabled = false;
      btn.className = 'direct-kill-btn px-3 py-1.5 rounded-md bg-white text-black text-xs font-semibold hover:bg-neutral-200 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-sm min-h-[44px]';
      btn.innerHTML = `<span>${typeof t === 'function' ? t('Hemen İptal') : 'Hemen İptal'}</span><span class="material-symbols-outlined text-[13px]" aria-hidden="true">arrow_forward</span>`;
      const row = btn.closest('.sub-item');
      if (row) {
        const badge = row.querySelector('.status-badge');
        if (badge && row.dataset.rawBadge) {
          badge.textContent = typeof t === 'function' ? t(row.dataset.rawBadge) : row.dataset.rawBadge;
          badge.className = row.dataset.rawBadgeClass || '';
        }
        const costDisplay = row.querySelector('.item-cost-display');
        if (costDisplay && costDisplay.dataset.origUsd && typeof srFormat === 'function') {
          costDisplay.setAttribute('data-usd', costDisplay.dataset.origUsd);
          const sfx = typeof srSuffix === 'function' ? srSuffix(costDisplay) : '';
          costDisplay.textContent = srFormat(parseFloat(costDisplay.dataset.origUsd), 2) + sfx;
        }
        const dateDisplay = row.querySelector('.item-status-date');
        if (dateDisplay && row.dataset.origDate) {
          dateDisplay.textContent = typeof t === 'function' ? t(row.dataset.origDate) : row.dataset.origDate;
        }
      }
    });
    renderHero();
    if (memoryCounter && memoryBar) {
      memoryCounter.textContent = '18,4 MB';
      memoryBar.style.width = '24%';
    }
    if (typeof srPaintStatics === 'function') srPaintStatics();
    srRefilterHero();
    srShowToast(typeof t === 'function' ? t('Simülasyon sıfırlandı. Tüm abonelikler tekrar etkin.') : 'Simülasyon sıfırlandı.');
  }

  const demoResetBtn = document.getElementById('hero-demo-reset');
  if (demoResetBtn) demoResetBtn.addEventListener('click', resetHeroDemo);

  // Tabs
  function srShowRows(predicate, emptyMsgKey) {
    let matches = 0;
    heroSubItems.forEach(item => {
      const show = !predicate || predicate(item);
      item.style.display = show ? 'flex' : 'none';
      if (show) matches++;
    });
    if (heroNoResults) {
      heroNoResults.classList.toggle('hidden', matches > 0);
      if (matches === 0) heroNoResults.textContent = typeof t === 'function' ? t(emptyMsgKey || 'Eşleşen yerel abonelik bulunamadı. Temizlemek için ESC’ye bas.') : 'Eşleşen yerel abonelik bulunamadı.';
    }
  }

  function srPaintTabs() {
    tabButtons.forEach(b => {
      const on = b.dataset.tab === srHeroTab;
      b.classList.toggle('bg-white/10', on);
      b.classList.toggle('text-white', on);
      b.classList.toggle('text-white/60', !on);
      if (on) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
    });
  }

  function srRefilterHero() {
    if (srHeroTab === 'rules') srShowRows(item => !!item.querySelector('.direct-kill-btn:not([disabled])'), 'İptal edilecek abonelik kalmadı. Hepsi temiz.');
    else if (srHeroTab === 'vault') srShowRows(item => !item.querySelector('.direct-kill-btn:not([disabled])'), 'Korunan abonelik yok.');
    else srShowRows(null, null);
  }

  function srSetTab(tab, focusSearch) {
    srHeroTab = tab;
    srPaintTabs();
    if (heroSearchInput) heroSearchInput.value = '';
    srRefilterHero();
    if (focusSearch && heroSearchInput) heroSearchInput.focus();
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      srSetTab(btn.dataset.tab, btn.dataset.tab === 'subscriptions');
    });
  });

  // Search
  if (heroSearchInput) {
    heroSearchInput.addEventListener('input', e => {
      const query = e.target.value.toLowerCase().trim();
      let matches = 0;
      if (srHeroTab !== 'overview') { srHeroTab = 'overview'; srPaintTabs(); }
      heroSubItems.forEach(item => {
        const name = item.dataset.name || '';
        if (name.includes(query)) {
          item.style.display = 'flex';
          matches++;
        } else {
          item.style.display = 'none';
        }
      });
      if (heroNoResults) {
        heroNoResults.classList.toggle('hidden', matches > 0);
        if (matches === 0) heroNoResults.textContent = typeof t === 'function' ? t('Eşleşen yerel abonelik bulunamadı. Temizlemek için ESC’ye bas.') : 'Eşleşen yerel abonelik bulunamadı.';
      }
    });

    heroSearchInput.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        heroSearchInput.value = '';
        srHeroTab = 'overview'; srPaintTabs();
        heroSubItems.forEach(item => item.style.display = 'flex');
        if (heroNoResults) heroNoResults.classList.add('hidden');
        heroSearchInput.blur();
      }
    });
  }

  // Window Controls
  const heroWindow = document.getElementById('hero-mock-window');
  const heroWinBody = document.getElementById('hero-win-body');
  const heroCloseBtn = document.getElementById('hero-win-close');
  const heroMinBtn = document.getElementById('hero-win-min');
  const heroZoomBtn = document.getElementById('hero-win-zoom');
  const heroRestoreBar = document.getElementById('hero-win-restore-bar');
  const heroRestoreBtn = document.getElementById('hero-win-restore');
  let heroIsMinimized = false;
  let heroIsZoomed = false;

  if (heroCloseBtn) {
    heroCloseBtn.addEventListener('click', () => {
      if (heroWindow) heroWindow.classList.add('hidden');
      if (heroRestoreBar) heroRestoreBar.classList.remove('hidden');
      srShowToast(typeof t === 'function' ? t('SubRadar önizlemesi kapatıldı.') : 'SubRadar önizlemesi kapatıldı.');
    });
  }
  if (heroRestoreBtn) {
    heroRestoreBtn.addEventListener('click', () => {
      if (heroWindow) heroWindow.classList.remove('hidden');
      if (heroRestoreBar) heroRestoreBar.classList.add('hidden');
      srShowToast(typeof t === 'function' ? t('SubRadar önizlemesi geri yüklendi.') : 'SubRadar önizlemesi geri yüklendi.');
    });
  }
  if (heroMinBtn) {
    heroMinBtn.addEventListener('click', () => {
      heroIsMinimized = !heroIsMinimized;
      if (heroWinBody) heroWinBody.classList.toggle('hidden', heroIsMinimized);
      heroMinBtn.setAttribute('title', heroIsMinimized ? (typeof t === 'function' ? t('Geri Yükle') : 'Geri Yükle') : (typeof t === 'function' ? t('Küçült') : 'Küçült'));
      srShowToast(heroIsMinimized ? (typeof t === 'function' ? t('Pencere simge durumuna küçültüldü.') : 'Pencere simge durumuna küçültüldü.') : (typeof t === 'function' ? t('Pencere büyütüldü.') : 'Pencere büyütüldü.'));
    });
  }
  if (heroZoomBtn) {
    heroZoomBtn.addEventListener('click', () => {
      heroIsZoomed = !heroIsZoomed;
      const container = heroWindow ? heroWindow.closest('.group\\/window') : null;
      if (container) {
        container.classList.toggle('max-w-5xl', !heroIsZoomed);
        container.classList.toggle('max-w-7xl', heroIsZoomed);
      }
      srShowToast(heroIsZoomed ? (typeof t === 'function' ? t('Genişletilmiş görünüme geçildi.') : 'Genişletilmiş görünüme geçildi.') : (typeof t === 'function' ? t('Standart görünüme dönüldü.') : 'Standart görünüme dönüldü.'));
    });
  }

  // Latency ticker
  const liveLatencyDisplay = document.getElementById('live-latency-display');
  const footerPing = document.getElementById('footer-engine-ping');
  setInterval(() => {
    const pingRaw = (3.7 + Math.random() * 0.7).toFixed(1);
    const ping = pingRaw.replace('.', ',');
    if (liveLatencyDisplay) liveLatencyDisplay.textContent = `${typeof t === 'function' ? t('Gecikme:') : 'Gecikme:'} ${ping}ms`;
    if (footerPing) footerPing.textContent = `${ping}ms`;
  }, 2400);

  return { renderHero, resetHeroDemo };
}
