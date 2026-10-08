/**
 * SubRadar — Theme Management (Dark / Light Mode)
 */
export function initTheme() {
  const themeBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-toggle-icon');
  const themeLabel = document.getElementById('theme-toggle-label');

  function paintThemeButton() {
    const light = document.documentElement.classList.contains('light');
    if (themeBtn) {
      themeBtn.setAttribute('aria-pressed', String(light));
      themeBtn.setAttribute('aria-label', light ? (typeof t === 'function' ? t('Koyu temaya geç') : 'Koyu temaya geç') : (typeof t === 'function' ? t('Açık temaya geç') : 'Açık temaya geç'));
    }
    if (themeIcon) themeIcon.textContent = light ? 'dark_mode' : 'light_mode';
    if (themeLabel) themeLabel.textContent = light ? (typeof t === 'function' ? t('Koyu tema') : 'Koyu tema') : (typeof t === 'function' ? t('Açık tema') : 'Açık tema');
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const root = document.documentElement;
      const light = !root.classList.contains('light');
      root.classList.toggle('light', light);
      root.classList.toggle('dark', !light);
      try { localStorage.setItem('sr-theme', light ? 'light' : 'dark'); } catch (e) {}
      paintThemeButton();
    });
    paintThemeButton();
  }
}
