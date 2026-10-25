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

  // Scroll reveal animasyonları kaldırıldı: tüm öğeler anında görünür
  document.querySelectorAll('[data-rv]').forEach(el => el.classList.add('in'));

  // Floating Minimalist Scrollspy Island (Alt Gezinme Adası)
  let spyNav = document.getElementById('sr-scrollspy');
  if (!spyNav) {
    spyNav = document.createElement('nav');
    spyNav.id = 'sr-scrollspy';
    spyNav.setAttribute('aria-label', 'Bölüm Gezintisi');
    spyNav.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 z-40 hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full border border-white/15 text-xs font-mono shadow-2xl transition-all duration-300 opacity-100 pointer-events-auto translate-y-0';
    spyNav.innerHTML = [
      '<a href="#ekstre-laboratuvari" class="spy-item active" data-target="ekstre-laboratuvari">Ekstre Lab</a>',
      '<a href="#hesaplayici" class="spy-item" data-target="hesaplayici">İsraf Hesaplayıcı</a>',
      '<a href="#karsilastirma" class="spy-item" data-target="karsilastirma">Karşılaştırma</a>',
      '<a href="#ozellikler" class="spy-item" data-target="ozellikler">Özellikler</a>',
      '<a href="#isletim-sistemleri" class="spy-item" data-target="isletim-sistemleri">İşletim Sistemleri</a>',
      '<a href="#fiyatlandirma" class="spy-item" data-target="fiyatlandirma">Fiyatlandırma</a>'
    ].join('');
    document.body.appendChild(spyNav);
  }
  const spyItems = spyNav.querySelectorAll('.spy-item');
  const spySectionIds = ['ekstre-laboratuvari', 'hesaplayici', 'karsilastirma', 'ozellikler', 'isletim-sistemleri', 'fiyatlandirma'];

  let tick = false;
  let isIsland = false;
  function onScroll() {
    if (tick) return;
    tick = true;
    requestAnimationFrame(() => {
      tick = false;
      const y = window.scrollY || 0;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (bar) bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
      
      const siteHeader = document.getElementById('site-header');
      if (siteHeader) {
        if (!isIsland && y > 45) {
          isIsland = true;
          siteHeader.classList.add('is-scrolled-island');
        } else if (isIsland && y < 15) {
          isIsland = false;
          siteHeader.classList.remove('is-scrolled-island');
        }
      }

      // Active Section Scrollspy Tracking
      let currentId = 'ekstre-laboratuvari';
      for (let i = 0; i < spySectionIds.length; i++) {
        const sec = document.getElementById(spySectionIds[i]);
        if (sec) {
          const rect = sec.getBoundingClientRect();
          if (rect.top <= 240) {
            currentId = spySectionIds[i];
          }
        }
      }
      spyItems.forEach(item => {
        if (item.getAttribute('data-target') === currentId) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });

      // Hero scroll parallax kaldırıldı, hero sabit kalır
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
