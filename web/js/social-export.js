/* =========================================================================
   SubRadar — Social "Abonelik Röntgeni" PNG Card Generator (HTML5 Canvas API)
   Generates 1200x630 Retina viral summary cards without external libraries.
   ========================================================================= */

(function () {
  'use strict';

  function generateAuditCard(yearlyAmount, leakCount) {
    var canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var cur = (typeof srCurrency !== 'undefined' ? srCurrency : 'USD');
    var sym = (typeof SR_RATES !== 'undefined' && SR_RATES[cur] ? SR_RATES[cur].symbol : '$');
    var amountText = sym + (yearlyAmount || '1,890.00');
    var countText = (leakCount || '3') + ' Kaçak Abonelik';

    // 1. Deep Dark Base Background
    ctx.fillStyle = '#07090e';
    ctx.fillRect(0, 0, 1200, 630);

    // 2. Ambient Gradient Glows
    var g1 = ctx.createRadialGradient(250, 150, 20, 250, 150, 450);
    g1.addColorStop(0, 'rgba(16, 185, 129, 0.22)');
    g1.addColorStop(1, 'transparent');
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, 1200, 630);

    var g2 = ctx.createRadialGradient(950, 480, 20, 950, 480, 450);
    g2.addColorStop(0, 'rgba(99, 102, 241, 0.18)');
    g2.addColorStop(1, 'transparent');
    ctx.fillStyle = g2;
    ctx.fillRect(0, 0, 1200, 630);

    // 3. Apple Glass Inner Box
    ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 2;
    roundRect(ctx, 60, 60, 1080, 510, 28);
    ctx.fill();
    ctx.stroke();

    // 4. Header: Logo & Badge
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(115, 125, 16, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText('SubRadar', 145, 134);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText('.', 268, 134);

    // Pill badge right
    ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
    ctx.lineWidth = 1.5;
    roundRect(ctx, 840, 105, 250, 38, 19);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#34d399';
    ctx.font = '600 13px -apple-system, monospace';
    ctx.fillText('✓ %100 ÇEVRİMDIŞI & GÜVENLİ', 855, 129);

    // 5. Title / Label
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.font = '600 16px -apple-system, monospace';
    ctx.fillText('YILLIK KURTARILABİLİR İSRAF RAPORU', 110, 220);

    // 6. Huge Amount Display
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 84px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
    ctx.fillText(amountText, 105, 310);

    // Subtext
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '500 22px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(countText + ' ve gizli yenileme yerel diskte durduruldu.', 110, 365);

    // 7. Bottom Divider
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(110, 430);
    ctx.lineTo(1030, 430);
    ctx.stroke();

    // 8. Footer guarantees
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '500 15px -apple-system, sans-serif';
    ctx.fillText('🔒 %100 Yerel AES-256 Kasa  •  🚫 Sıfır Bulut Bağımlılığı  •  ⚡ Tek Tıkla Yasal İptal', 110, 485);

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 15px -apple-system, monospace';
    ctx.fillText('laynexsw.github.io/SubRadar', 835, 485);

    // Export as PNG
    var dataUrl = canvas.toDataURL('image/png');
    var link = document.createElement('a');
    link.download = 'SubRadar_Abonelik_Rontgeni.png';
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (window.srAudio && window.srAudio.playSuccess) window.srAudio.playSuccess();
    if (typeof srShowToast === 'function') {
      srShowToast('Abonelik Röntgeni PNG olarak indirildi!');
    }
  }

  function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  function shareToTwitter(amount) {
    var amt = amount || '1.890 $';
    var text = encodeURIComponent('SubRadar ile aboneliklerimi taradım ve yılda ' + amt + ' kaçak israf tespit ettim. Sıfır bulut, sıfır banka şifresi:');
    var url = encodeURIComponent('https://laynexsw.github.io/SubRadar/');
    window.open('https://twitter.com/intent/tweet?text=' + text + '&url=' + url, '_blank', 'width=600,height=400');
  }

  function shareToLinkedIn() {
    var url = encodeURIComponent('https://laynexsw.github.io/SubRadar/');
    window.open('https://www.linkedin.com/sharing/share-offsite/?url=' + url, '_blank', 'width=600,height=500');
  }

  window.srSocialExport = {
    downloadCard: generateAuditCard,
    shareTwitter: shareToTwitter,
    shareLinkedIn: shareToLinkedIn
  };

  // Wire buttons if present on page
  function initSocialTriggers() {
    var exportBtn = document.getElementById('calc-export-png-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', function () {
        var yearlyEl = document.getElementById('out-1yr');
        var val = yearlyEl ? yearlyEl.textContent.replace(/[^0-9.,]/g, '') : '1,890.00';
        generateAuditCard(val, '3');
      });
    }

    var twBtn = document.getElementById('calc-share-tw-btn');
    if (twBtn) {
      twBtn.addEventListener('click', function () {
        var yearlyEl = document.getElementById('out-1yr');
        var val = yearlyEl ? yearlyEl.textContent : '1.890 $';
        shareToTwitter(val);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSocialTriggers);
  } else {
    initSocialTriggers();
  }
})();
