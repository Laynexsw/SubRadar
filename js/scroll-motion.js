/**
 * SubRadar — Scroll Motion & Progress Bar
 */
export function initScrollMotion() {
  let reduce = false;
  try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  
  let bar = document.getElementById('sr-progress');
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'sr-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
  }

  const els = document.querySelectorAll('[data-rv]');
  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        io.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    els.forEach(el => io.observe(el));
  } else {
    els.forEach(el => el.classList.add('in'));
  }

  let tick = false;
  function onScroll() {
    if (tick) return;
    tick = true;
    requestAnimationFrame(() => {
      tick = false;
      const y = window.scrollY || 0;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (bar) bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
      if (!reduce) {
        const hero = document.querySelector('[data-od-id="hero"]');
        if (hero && y < 1000) {
          hero.style.transform = y === 0 ? '' : 'translateY(' + Math.round(y * 0.1) + 'px)';
          hero.style.opacity = y === 0 ? '' : String(Math.max(0.3, 1 - y / 1200));
        } else if (hero && y >= 1000 && hero.style.transform) {
          hero.style.transform = '';
          hero.style.opacity = '';
        }
      }
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
