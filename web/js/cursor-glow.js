/* =========================================================================
   SubRadar — Dynamic Cursor Glow & Lighting Effect (Linear / Apple Pro style)
   ========================================================================= */

(function () {
  'use strict';

  function initCursorGlow() {
    var cards = document.querySelectorAll('.apple-card, [data-glow]');
    if (!cards || cards.length === 0) return;

    // Use passive listener and rAF to prevent layout thrashing
    document.addEventListener('pointermove', function (e) {
      window.requestAnimationFrame(function () {
        cards.forEach(function (card) {
          var rect = card.getBoundingClientRect();
          var x = e.clientX - rect.left;
          var y = e.clientY - rect.top;

          // Only compute for cards in or close to the viewport
          if (
            rect.top < window.innerHeight + 100 &&
            rect.bottom > -100 &&
            x > -150 && x < rect.width + 150 &&
            y > -150 && y < rect.height + 150
          ) {
            card.style.setProperty('--mouse-x', x + 'px');
            card.style.setProperty('--mouse-y', y + 'px');
          }
        });
      });
    }, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCursorGlow);
  } else {
    initCursorGlow();
  }
})();
