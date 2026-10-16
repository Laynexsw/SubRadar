/**
 * SubRadar — Sticky Mobile CTA Bar Controller
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const cta = document.getElementById('sr-mobile-sticky-cta');
    const closeBtn = document.getElementById('sr-mobile-cta-close');
    if (!cta) return;

    let dismissed = false;

    function handleScroll() {
      if (dismissed || window.innerWidth >= 768) {
        cta.classList.remove('show');
        return;
      }

      if (window.scrollY > 350) {
        cta.classList.add('show');
      } else {
        cta.classList.remove('show');
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        dismissed = true;
        cta.classList.remove('show');
      });
    }
  });
})();
