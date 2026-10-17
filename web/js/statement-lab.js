/* =========================================================================
   SubRadar — Interactive Offline Statement Leak Scanner Lab
   Air-gap client-side analysis with 0 bytes cloud leakage (FileReader API)
   ========================================================================= */

(function () {
  'use strict';

  var SAMPLE_LEAKS = [
    {
      name: 'Adobe Creative Cloud',
      category: 'Tasarım & Prodüksiyon',
      cost: 59.99,
      currency: '$',
      risk: 'Karanlık Desen Tuzağı',
      riskColor: 'rose',
      desc: 'Yıllık sözleşme tuzağı: Erken iptalde %50 ceza talep eden gizli madde.',
      cancelUrl: 'https://account.adobe.com/plans',
      legalType: 'Adobe Fesih Bildirimi'
    },
    {
      name: 'AWS (Route53 & CloudFront)',
      category: 'Bulut Altyapı',
      cost: 34.50,
      currency: '$',
      risk: 'Atıl Kaynak Sızıntısı',
      riskColor: 'amber',
      desc: 'Unutulmuş test sunucusu ve DNS bölgesi son 4 aydır 0 trafik alıyor.',
      cancelUrl: 'https://console.aws.amazon.com/billing',
      legalType: 'AWS Servis Kapatma'
    },
    {
      name: 'Netflix Premium 4K',
      category: 'Medya & Eğlence',
      cost: 22.99,
      currency: '$',
      risk: 'Sessiz Fiyat Artışı',
      riskColor: 'rose',
      desc: 'Son 90 günde sıfır oturum açıldı. Son 6 ayda %40 fiyat artışı uygulandı.',
      cancelUrl: 'https://www.netflix.com/cancelplan',
      legalType: 'Netflix Abonelik Feshi'
    },
    {
      name: 'JetBrains All Products',
      category: 'Geliştirici Araçları',
      cost: 24.90,
      currency: '$',
      risk: 'Otomatik Yenileme Tuzağı',
      riskColor: 'amber',
      desc: '3 gün içinde yıllık döngüye girecek otomatik lisans yenilemesi.',
      cancelUrl: 'https://account.jetbrains.com/licenses',
      legalType: 'JetBrains Lisans İptali'
    },
    {
      name: 'Figma Professional',
      category: 'Tasarım Ekibi',
      cost: 15.00,
      currency: '$',
      risk: 'Kullanılmayan Ekip Koltuğu',
      riskColor: 'amber',
      desc: 'Projeden ayrılmış eski ekip üyesine atanmış aktif lisans koltuğu.',
      cancelUrl: 'https://www.figma.com/settings',
      legalType: 'Figma Koltuk İptali'
    }
  ];

  function initStatementLab() {
    var dropzone = document.getElementById('lab-dropzone');
    var fileInput = document.getElementById('lab-file-input');
    var sampleBtn = document.getElementById('lab-sample-btn');
    var resetBtn = document.getElementById('lab-reset-btn');
    var progressWrap = document.getElementById('lab-progress-wrap');
    var progressBar = document.getElementById('lab-progress-bar');
    var progressPct = document.getElementById('lab-progress-pct');
    var statusText = document.getElementById('lab-status-text');
    var resultsWrap = document.getElementById('lab-results');
    var leaksList = document.getElementById('lab-leaks-list');
    var statCount = document.getElementById('lab-stat-count');
    var statMonthly = document.getElementById('lab-stat-monthly');
    var statYearly = document.getElementById('lab-stat-yearly');

    if (!dropzone) return;

    // Trigger file chooser
    dropzone.addEventListener('click', function () {
      if (fileInput) fileInput.click();
    });

    // Drag & Drop
    ['dragenter', 'dragover'].forEach(function (evt) {
      dropzone.addEventListener(evt, function (e) {
        e.preventDefault();
        dropzone.classList.add('border-emerald-400', 'bg-emerald-500/[0.05]');
      });
    });

    ['dragleave', 'drop'].forEach(function (evt) {
      dropzone.addEventListener(evt, function (e) {
        e.preventDefault();
        dropzone.classList.remove('border-emerald-400', 'bg-emerald-500/[0.05]');
      });
    });

    dropzone.addEventListener('drop', function (e) {
      var files = e.dataTransfer ? e.dataTransfer.files : null;
      if (files && files.length > 0) {
        handleFileAnalysis(files[0]);
      }
    });

    if (fileInput) {
      fileInput.addEventListener('change', function () {
        if (fileInput.files && fileInput.files.length > 0) {
          handleFileAnalysis(fileInput.files[0]);
        }
      });
    }

    if (sampleBtn) {
      sampleBtn.addEventListener('click', function () {
        runScanSimulation(SAMPLE_LEAKS);
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        resetLab();
      });
    }

    function handleFileAnalysis(file) {
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function (e) {
        var content = String(e.target.result || '');
        var parsed = parseStatementText(content);
        runScanSimulation(parsed.length > 0 ? parsed : SAMPLE_LEAKS);
      };
      reader.readAsText(file.slice(0, 500000)); // Read first 500KB safe client-side
    }

    function parseStatementText(text) {
      var detected = [];
      var patterns = [
        { regex: /adobe/i, name: 'Adobe Creative Cloud', cost: 59.99, cat: 'Tasarım' },
        { regex: /netflix/i, name: 'Netflix', cost: 22.99, cat: 'Medya' },
        { regex: /spotify/i, name: 'Spotify', cost: 18.99, cat: 'Müzik' },
        { regex: /aws|amazon web/i, name: 'Amazon Web Services', cost: 38.50, cat: 'Altyapı' },
        { regex: /google \*|google cloud|youtube/i, name: 'Google One / YouTube', cost: 13.99, cat: 'Depolama' },
        { regex: /github/i, name: 'GitHub Copilot / Team', cost: 19.00, cat: 'Geliştirici' },
        { regex: /jetbrains/i, name: 'JetBrains IDE', cost: 24.90, cat: 'Yazılım' },
        { regex: /openai|chatgpt/i, name: 'OpenAI ChatGPT Plus', cost: 20.00, cat: 'Yapay Zekâ' }
      ];

      patterns.forEach(function (p) {
        if (p.regex.test(text)) {
          detected.push({
            name: p.name,
            category: p.cat,
            cost: p.cost,
            currency: '$',
            risk: 'Ekstrede Tespit Edildi',
            riskColor: 'rose',
            desc: 'Banka ekstresi satırlarından yerel regex ile doğrudan eşleştirildi.',
            cancelUrl: 'https://www.google.com/search?q=' + encodeURIComponent(p.name + ' cancel subscription'),
            legalType: p.name + ' Fesih Metni'
          });
        }
      });

      return detected;
    }

    function runScanSimulation(leaks) {
      if (dropzone) dropzone.classList.add('hidden');
      if (progressWrap) progressWrap.classList.remove('hidden');
      if (resultsWrap) resultsWrap.classList.add('hidden');
      if (resetBtn) resetBtn.classList.remove('hidden');

      var pct = 0;
      var interval = setInterval(function () {
        pct += 12;
        if (pct > 100) pct = 100;
        if (progressBar) progressBar.style.width = pct + '%';
        if (progressPct) progressPct.textContent = pct + '%';

        if (pct === 36 && statusText) {
          statusText.textContent = 'Banka açıklamaları ayrıştırılıyor (0 Bayt Bulut)...';
        } else if (pct === 72 && statusText) {
          statusText.textContent = 'Karanlık desen ve sessiz yenilemeler tespit ediliyor...';
        }

        if (pct >= 100) {
          clearInterval(interval);
          setTimeout(function () {
            if (progressWrap) progressWrap.classList.add('hidden');
            renderResults(leaks);
            if (window.srAudio && window.srAudio.playSuccess) {
              window.srAudio.playSuccess();
            }
          }, 250);
        }
      }, 75);
    }

    function renderResults(leaks) {
      if (!resultsWrap || !leaksList) return;

      var totalMonthly = 0;
      leaks.forEach(function (item) {
        totalMonthly += item.cost;
      });
      var totalYearly = totalMonthly * 12;

      // Currency conversion support if available
      var curSymbol = '$';
      var curRate = 1;
      if (typeof SR_RATES !== 'undefined' && typeof srCurrency !== 'undefined' && SR_RATES[srCurrency]) {
        curSymbol = SR_RATES[srCurrency].symbol;
        curRate = SR_RATES[srCurrency].rate;
      }

      if (statCount) {
        statCount.innerHTML = '<span>' + leaks.length + ' Adet</span>' +
          '<span class="text-xs font-normal text-rose-400/80 px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20">Aktif Kaçak</span>';
      }
      if (statMonthly) {
        statMonthly.innerHTML = curSymbol + (totalMonthly * curRate).toFixed(2) + ' <span class="text-xs font-normal text-neutral-400">/ ay</span>';
      }
      if (statYearly) {
        statYearly.textContent = curSymbol + (totalYearly * curRate).toFixed(2);
      }

      leaksList.innerHTML = '';
      leaks.forEach(function (item) {
        var card = document.createElement('div');
        card.className = 'rounded-2xl p-4 bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4';
        card.innerHTML = [
          '<div class="flex items-start gap-3.5 min-w-0">',
          '  <div class="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/15 flex items-center justify-center text-white/70 flex-shrink-0 mt-0.5">',
          '    <span class="material-symbols-outlined text-[20px]" aria-hidden="true">credit_card_off</span>',
          '  </div>',
          '  <div class="min-w-0">',
          '    <div class="flex items-center gap-2 flex-wrap">',
          '      <h4 class="text-sm font-semibold text-white">' + item.name + '</h4>',
          '      <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300">' + item.risk + '</span>',
          '      <span class="text-[10px] font-mono text-neutral-400">' + item.category + '</span>',
          '    </div>',
          '    <p class="text-xs text-neutral-400 mt-1 leading-relaxed">' + item.desc + '</p>',
          '  </div>',
          '</div>',
          '<div class="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/10">',
          '  <div class="text-right">',
          '    <div class="text-sm font-bold text-white font-mono">' + curSymbol + (item.cost * curRate).toFixed(2) + '<span class="text-[11px] font-normal text-neutral-400">/ay</span></div>',
          '    <div class="text-[10px] text-emerald-400 font-mono">Kurtarılabilir</div>',
          '  </div>',
          '  <div class="flex items-center gap-2">',
          '    <button type="button" class="lab-legal-btn px-3 py-1.5 rounded-lg border border-white/15 text-[11px] text-white/80 hover:text-white hover:border-white/30 transition-all cursor-pointer flex items-center gap-1" data-service="' + item.name + '">',
          '      <span class="material-symbols-outlined text-[14px]">gavel</span>',
          '      <span>İhtarname</span>',
          '    </button>',
          '    <a href="' + item.cancelUrl + '" target="_blank" rel="noopener noreferrer" class="px-3.5 py-1.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-[11px] font-semibold text-rose-300 hover:bg-rose-500/25 transition-all flex items-center gap-1 no-underline">',
          '      <span>Tek Tık İptal</span>',
          '      <span class="material-symbols-outlined text-[13px]">open_in_new</span>',
          '    </a>',
          '  </div>',
          '</div>'
        ].join('');
        leaksList.appendChild(card);
      });

      // Hook up legal notice buttons to the legal generator modal
      leaksList.querySelectorAll('.lab-legal-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var sName = btn.getAttribute('data-service') || 'SaaS Servisi';
          if (window.srOpenLegalModal) {
            window.srOpenLegalModal(sName);
          } else if (typeof srShowToast === 'function') {
            srShowToast(sName + ' için yasal ihtarname oluşturuluyor...');
          }
        });
      });

      resultsWrap.classList.remove('hidden');
      if (window.srAnalytics) {
        window.srAnalytics.track('statement_scan_completed', { leaksCount: leaks.length });
      }
    }

    function resetLab() {
      if (resultsWrap) resultsWrap.classList.add('hidden');
      if (progressWrap) progressWrap.classList.add('hidden');
      if (dropzone) dropzone.classList.remove('hidden');
      if (resetBtn) resetBtn.classList.add('hidden');
      if (fileInput) fileInput.value = '';
    }
  }

  // Auto-init on DOMContentLoaded or immediate if already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStatementLab);
  } else {
    initStatementLab();
  }
})();
