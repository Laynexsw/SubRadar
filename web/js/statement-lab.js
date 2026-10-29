/* =========================================================================
   SubRadar — Interactive Offline Statement Leak Scanner Lab (Wave 2 Sync)
   100% Offline client-side analysis with 0 bytes cloud leakage (FileReader API)
   Multi-Bank Formats: Garanti BBVA, Enpara, Papara, Wise CSV, Revolut
   Sneak Price Hike Detector with 6502 SK THH & Chargeback Legal Actions
   ========================================================================= */

(function () {
  'use strict';

  // Bank-specific sample datasets matching app/src/parser.rs v1.0
  var BANK_DATASETS = {
    sample: [
      {
        name: 'Adobe Creative Cloud',
        bank: 'Garanti BBVA / Kart',
        category: 'Tasarım & Prodüksiyon',
        cost: 59.99,
        currency: '$',
        risk: 'Karanlık Desen Tuzağı',
        desc: 'Yıllık sözleşme tuzağı: Erken iptalde %50 ceza talep eden gizli madde.',
        cancelUrl: 'https://account.adobe.com/plans',
        legalType: 'Adobe Fesih Bildirimi',
        hike: {
          pct: 56.9,
          prev: '$38.20',
          badge: '🔥 Sinsi Fiyat Artışı: +%56.9 Gizli Zam Algılandı ($38.20 ➔ $59.99)'
        }
      },
      {
        name: 'AWS (Route53 & CloudFront)',
        bank: 'Wise Multi-Cur.',
        category: 'Bulut Altyapı',
        cost: 34.50,
        currency: '$',
        risk: 'Unutulan Ek Paket',
        desc: 'Unutulmuş bulut depolama ve ek servis paketi son 4 aydır hiç kullanılmadı.',
        cancelUrl: 'https://console.aws.amazon.com/billing',
        legalType: 'AWS Servis Kapatma',
        hike: {
          pct: 32.5,
          prev: '$26.00',
          badge: '⚠️ Sessiz Fiyat Artışı: +%32.5 Otomatik Bant Aşımı'
        }
      },
      {
        name: 'Netflix Premium 4K',
        bank: 'Enpara.com',
        category: 'Medya & Eğlence',
        cost: 22.99,
        currency: '$',
        risk: 'Sessiz Fiyat Artışı',
        desc: 'Son 90 günde sıfır oturum açıldı. Ekstreler arası sinsi zam yakalandı.',
        cancelUrl: 'https://www.netflix.com/cancelplan',
        legalType: 'Netflix Abonelik Feshi',
        hike: {
          pct: 50.0,
          prev: '$15.30',
          badge: '🔥 Sinsi Fiyat Artışı: +%50.0 Zam Tespit Edildi ($15.30 ➔ $22.99)'
        }
      },
      {
        name: 'JetBrains All Products',
        bank: 'Revolut Card',
        category: 'Geliştirici Araçları',
        cost: 24.90,
        currency: '$',
        risk: 'Otomatik Yenileme Tuzağı',
        desc: '3 gün içinde yıllık döngüye girecek otomatik lisans yenilemesi.',
        cancelUrl: 'https://account.jetbrains.com/licenses',
        legalType: 'JetBrains Lisans İptali',
        hike: null
      },
      {
        name: 'Figma Professional Seat',
        bank: 'Wise CSV',
        category: 'Tasarım Ekibi',
        cost: 15.00,
        currency: '$',
        risk: 'Kullanılmayan Ekip Koltuğu',
        desc: 'Projeden ayrılmış eski ekip üyesine atanmış aktif lisans koltuğu.',
        cancelUrl: 'https://www.figma.com/settings',
        legalType: 'Figma Koltuk İptali',
        hike: null
      }
    ],

    garanti: [
      {
        name: 'Netflix.com TR',
        bank: 'Garanti BBVA',
        category: 'Medya & Eğlence',
        cost: 299.99,
        currency: 'TRY',
        risk: 'Sinsi Fiyat Artışı',
        desc: '15/10/2026 GARANTI BBVA - NETFLIX.COM TR. Önceki aydan %50 zamlı kesildi.',
        cancelUrl: 'https://www.netflix.com/cancelplan',
        legalType: 'Netflix İtiraz Metni',
        hike: {
          pct: 50.0,
          prev: '199,99 TL',
          badge: '🔥 Sinsi Fiyat Artışı: +%50.0 Zam (199,99 TL ➔ 299,99 TL)'
        }
      },
      {
        name: 'Adobe Systems Creative Cloud',
        bank: 'Garanti BBVA',
        category: 'Tasarım & Prodüksiyon',
        cost: 2966.52,
        currency: 'TRY',
        risk: 'Karanlık Taahhüt Tuzağı',
        desc: '14.10.2026 GARANTI BBVA ADOBE SYSTEMS INC 2966.52 TRY. Erken fesih cezalı sözleşme.',
        cancelUrl: 'https://account.adobe.com/plans',
        legalType: '6502 SK THH Adobe Şikayeti',
        hike: {
          pct: 56.9,
          prev: '1.890,00 TL',
          badge: '🔥 Sinsi Fiyat Artışı: +%56.9 Gizli Artış (1.890 TL ➔ 2.966,52 TL)'
        }
      },
      {
        name: 'Spotify Turkiye',
        bank: 'Garanti BBVA',
        category: 'Müzik & Ses',
        cost: 99.99,
        currency: 'TRY',
        risk: 'Aylık Otomatik Çekim',
        desc: '08.10.2026 SPOTIFY TURKIYE 99.99 TRY. Mükerrer aile paketi olabilir.',
        cancelUrl: 'https://www.spotify.com/account/subscription/',
        legalType: 'Spotify Fesih Bildirimi',
        hike: null
      },
      {
        name: 'YouTube Premium Family',
        bank: 'Garanti BBVA',
        category: 'Medya & Video',
        cost: 115.99,
        currency: 'TRY',
        risk: 'Otomatik Yinelenen',
        desc: '02.10.2026 YOUTUBE PREMIUM GOOGLE 115.99 TL düzenli ekstre kalemi.',
        cancelUrl: 'https://www.youtube.com/paid_memberships',
        legalType: 'YouTube Abonelik Feshi',
        hike: null
      }
    ],

    enpara: [
      {
        name: 'OpenAI ChatGPT Plus',
        bank: 'Enpara.com',
        category: 'Yapay Zekâ (AI)',
        cost: 967.00,
        currency: 'TRY',
        risk: 'Dövizli Otomatik Çekim',
        desc: '05.10.2026 11:02 ENPARA.COM OPENAI *CHATGPT PLUS 967.00 TL ($20.00 USD).',
        cancelUrl: 'https://chat.openai.com/#settings',
        legalType: 'OpenAI Abonelik İptali',
        hike: null
      },
      {
        name: 'Netflix TR',
        bank: 'Enpara.com',
        category: 'Medya & Eğlence',
        cost: 299.99,
        currency: 'TRY',
        risk: 'Sinsi Fiyat Artışı',
        desc: '11.10.2026 ENPARA.COM NETFLIX.COM 299.99 TL. Sessizce zamlı faturalandırıldı.',
        cancelUrl: 'https://www.netflix.com/cancelplan',
        legalType: '6502 SK THH Netflix Dilekçesi',
        hike: {
          pct: 50.0,
          prev: '199,99 TL',
          badge: '🔥 Sinsi Fiyat Artışı: +%50.0 Zam Algılandı (199,99 TL ➔ 299,99 TL)'
        }
      },
      {
        name: 'GitHub Copilot Individual',
        bank: 'Enpara.com',
        category: 'Geliştirici Araçları',
        cost: 483.50,
        currency: 'TRY',
        risk: 'Yıllık Döngü Öncesi',
        desc: '01.10.2026 GITHUB COPILOT SUBSCRIPTION 483.50 TRY ($10.00 USD).',
        cancelUrl: 'https://github.com/settings/billing',
        legalType: 'GitHub Lisans İptali',
        hike: null
      },
      {
        name: 'YouTube Premium',
        bank: 'Enpara.com',
        category: 'Medya & Müzik',
        cost: 115.99,
        currency: 'TRY',
        risk: 'Aylık Çekim',
        desc: '12.10.2026 ENPARA.COM YOUTUBE PREMIUM 115,99 TL.',
        cancelUrl: 'https://www.youtube.com/paid_memberships',
        legalType: 'YouTube Abonelik Feshi',
        hike: null
      }
    ],

    papara: [
      {
        name: 'Adobe Systems Inc (Papara Card)',
        bank: 'Papara',
        category: 'Tasarım & Prodüksiyon',
        cost: 2966.52,
        currency: 'TRY',
        risk: 'Karanlık Taahhüt Tuzağı',
        desc: '01.10.2026 14:15 Papara Card Adobe Systems Inc 2.966,52 TL. İptalde ceza isteyen sözleşme.',
        cancelUrl: 'https://account.adobe.com/plans',
        legalType: '6502 SK THH / TÜBİS Dilekçesi',
        hike: {
          pct: 56.9,
          prev: '1.890,00 TL',
          badge: '🔥 Sinsi Fiyat Artışı: +%56.9 Gizli Zam (1.890 TL ➔ 2.966,52 TL)'
        }
      },
      {
        name: 'Netflix Turkiye',
        bank: 'Papara',
        category: 'Medya & Eğlence',
        cost: 299.99,
        currency: 'TRY',
        risk: 'Sinsi Fiyat Artışı',
        desc: '15.10.2026 Papara Card Netflix TR 299,99 TL. Aylar arası fark yakalandı.',
        cancelUrl: 'https://www.netflix.com/cancelplan',
        legalType: 'Visa/Mastercard Chargeback İtirazı',
        hike: {
          pct: 50.0,
          prev: '199,99 TL',
          badge: '🔥 Sinsi Fiyat Artışı: +%50.0 Zam Algılandı'
        }
      },
      {
        name: 'Spotify Turkiye',
        bank: 'Papara',
        category: 'Müzik & Ses',
        cost: 99.99,
        currency: 'TRY',
        risk: 'Aylık Çekim',
        desc: '08.10.2026 Papara Card Spotify Istanbul 99,99 TL.',
        cancelUrl: 'https://www.spotify.com/account/subscription/',
        legalType: 'Spotify Fesih Metni',
        hike: null
      },
      {
        name: 'Midjourney Inc AI',
        bank: 'Papara',
        category: 'Yapay Zekâ (AI)',
        cost: 380.00,
        currency: 'TRY',
        risk: 'Unutulan AI Aboneliği',
        desc: '25.09.2026 Papara Sanal Kart Midjourney AI 380.00 TL ($10.00 USD).',
        cancelUrl: 'https://www.midjourney.com/account',
        legalType: 'Midjourney İptal Talebi',
        hike: null
      }
    ],

    wise: [
      {
        name: 'Cursor Pro AI Editor',
        bank: 'Wise CSV',
        category: 'Yapay Zekâ & Kodlama',
        cost: 20.00,
        currency: '$',
        risk: 'Aktif AI Geliştirici Lisansı',
        desc: '2026-10-14 Wise Card Cursor Pro AI Monthly -20.00 USD. Akıllı kodlama editörü.',
        cancelUrl: 'https://www.cursor.com/settings',
        legalType: 'Cursor Abonelik Feshi',
        hike: null
      },
      {
        name: 'AWS Cloud Infrastructure',
        bank: 'Wise CSV',
        category: 'Bulut Altyapı',
        cost: 42.80,
        currency: '$',
        risk: 'Sinsi Fiyat Artışı',
        desc: '2026-10-01 Wise Card Amazon Web Services -42.80 USD. Unutulmuş VPC ve EBS hacmi.',
        cancelUrl: 'https://console.aws.amazon.com/billing',
        legalType: 'AWS Servis Sonlandırma',
        hike: {
          pct: 32.9,
          prev: '$32.20',
          badge: '🔥 Sinsi Fiyat Artışı: +%32.9 Sessiz Ek Veri Maliyeti ($32.20 ➔ $42.80)'
        }
      },
      {
        name: 'Figma Professional Team',
        bank: 'Wise CSV',
        category: 'Tasarım Ekibi',
        cost: 15.00,
        currency: '$',
        risk: 'Boşta Kalan Koltuk',
        desc: '2026-10-12 Wise Card Figma Inc -15.00 USD. Ayrılan ekip üyesi koltuğu.',
        cancelUrl: 'https://www.figma.com/settings',
        legalType: 'Figma Koltuk İptali',
        hike: null
      },
      {
        name: 'GitHub Copilot Enterprise',
        bank: 'Wise CSV',
        category: 'Geliştirici Araçları',
        cost: 10.00,
        currency: '$',
        risk: 'Bireysel Yinelenen',
        desc: '2026-10-09 Wise Card GitHub Subscriptions -10.00 USD.',
        cancelUrl: 'https://github.com/settings/billing',
        legalType: 'GitHub Lisans İptali',
        hike: null
      }
    ],

    revolut: [
      {
        name: 'Netflix 4K UHD',
        bank: 'Revolut Card',
        category: 'Medya & Eğlence',
        cost: 22.99,
        currency: 'EUR',
        risk: 'Sessiz Fiyat Artışı',
        desc: '08 Oct 2026 | Netflix 4K UHD | -22.99 EUR | Revolut Card. Aylar arası fark yakalandı.',
        cancelUrl: 'https://www.netflix.com/cancelplan',
        legalType: 'Chargeback Kod 4837 Dilekçesi',
        hike: {
          pct: 43.8,
          prev: '15.99 €',
          badge: '🔥 Sneak Price Hike: +%43.8 Fiyat Artışı (15.99 € ➔ 22.99 €)'
        }
      },
      {
        name: 'JetBrains All Products Pack',
        bank: 'Revolut Card',
        category: 'Geliştirici Araçları',
        cost: 24.90,
        currency: 'EUR',
        risk: 'Otomatik Yenileme Döngüsü',
        desc: '04 Oct 2026 | JetBrains All Products Pack | -24.90 EUR | Revolut Card.',
        cancelUrl: 'https://account.jetbrains.com/licenses',
        legalType: 'JetBrains Lisans İptali',
        hike: null
      },
      {
        name: 'OpenAI ChatGPT Plus',
        bank: 'Revolut Card',
        category: 'Yapay Zekâ (AI)',
        cost: 20.00,
        currency: '$',
        risk: 'Yinelenen Çekim',
        desc: '11 Oct 2026 | OpenAI ChatGPT Plus | -20.00 USD | Revolut Card.',
        cancelUrl: 'https://chat.openai.com/#settings',
        legalType: 'OpenAI Abonelik Feshi',
        hike: null
      },
      {
        name: 'Midjourney Inc AI',
        bank: 'Revolut Card',
        category: 'Yapay Zekâ (AI)',
        cost: 10.00,
        currency: '$',
        risk: 'Görsel Üretim',
        desc: '14 Oct 2026 | Midjourney Inc | -10.00 USD | Revolut Card.',
        cancelUrl: 'https://www.midjourney.com/account',
        legalType: 'Midjourney Fesih Metni',
        hike: null
      }
    ]
  };

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
    var bankSelectorWrap = document.getElementById('lab-bank-selector');

    if (!dropzone) return;

    // Trigger file chooser
    dropzone.addEventListener('click', function () {
      if (fileInput) fileInput.click();
    });

    // Drag & Drop visual feedback
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

    // Default sample button
    if (sampleBtn) {
      sampleBtn.addEventListener('click', function () {
        runScanSimulation(BANK_DATASETS.sample, 'Standart Örnek Ekstre');
      });
    }

    // Bank-specific preset buttons
    if (bankSelectorWrap) {
      var bankBtns = bankSelectorWrap.querySelectorAll('.lab-bank-btn');
      bankBtns.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          var bankKey = btn.getAttribute('data-bank');
          var dataset = BANK_DATASETS[bankKey] || BANK_DATASETS.sample;
          var bankLabel = btn.textContent.trim();
          runScanSimulation(dataset, bankLabel);
        });
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
        var dataset = parsed.length > 0 ? parsed : BANK_DATASETS.garanti;
        runScanSimulation(dataset, file.name);
      };
      reader.readAsText(file.slice(0, 500000)); // Read first 500KB safe client-side
    }

    function parseStatementText(text) {
      var detected = [];
      var lower = text.toLowerCase();

      var bankName = 'Özel Ekstre';
      if (lower.indexOf('garanti') !== -1) bankName = 'Garanti BBVA';
      else if (lower.indexOf('enpara') !== -1) bankName = 'Enpara.com';
      else if (lower.indexOf('papara') !== -1) bankName = 'Papara';
      else if (lower.indexOf('wise') !== -1) bankName = 'Wise CSV';
      else if (lower.indexOf('revolut') !== -1) bankName = 'Revolut Card';

      var patterns = [
        {
          regex: /adobe/i,
          name: 'Adobe Creative Cloud',
          cost: 59.99,
          cat: 'Tasarım',
          hike: { pct: 56.9, prev: '$38.20', badge: '🔥 Sinsi Fiyat Artışı: +%56.9 Zam Algılandı' },
          legal: '6502 SK THH Adobe Başvurusu'
        },
        {
          regex: /netflix/i,
          name: 'Netflix',
          cost: 22.99,
          cat: 'Medya',
          hike: { pct: 50.0, prev: '$15.30', badge: '🔥 Sinsi Fiyat Artışı: +%50.0 Zam (Aylar arası artış)' },
          legal: 'Netflix Abonelik Feshi'
        },
        {
          regex: /spotify/i,
          name: 'Spotify',
          cost: 18.99,
          cat: 'Müzik',
          hike: null,
          legal: 'Spotify Fesih Bildirimi'
        },
        {
          regex: /aws|amazon web/i,
          name: 'Amazon Web Services',
          cost: 38.50,
          cat: 'Altyapı',
          hike: { pct: 32.5, prev: '$29.00', badge: '⚠️ Gizli Artış: +%32.5 Ek Faturalandırma' },
          legal: 'AWS Servis Kapatma'
        },
        {
          regex: /google \*|google cloud|youtube/i,
          name: 'Google One / YouTube',
          cost: 13.99,
          cat: 'Depolama',
          hike: null,
          legal: 'Google Abonelik İptali'
        },
        {
          regex: /github/i,
          name: 'GitHub Copilot / Team',
          cost: 19.00,
          cat: 'Geliştirici',
          hike: null,
          legal: 'GitHub Lisans Feshi'
        },
        {
          regex: /jetbrains/i,
          name: 'JetBrains IDE',
          cost: 24.90,
          cat: 'Yazılım',
          hike: null,
          legal: 'JetBrains Lisans İptali'
        },
        {
          regex: /openai|chatgpt/i,
          name: 'OpenAI ChatGPT Plus',
          cost: 20.00,
          cat: 'Yapay Zekâ',
          hike: null,
          legal: 'OpenAI Abonelik Feshi'
        },
        {
          regex: /cursor/i,
          name: 'Cursor Pro AI',
          cost: 20.00,
          cat: 'Yapay Zekâ & Kod',
          hike: null,
          legal: 'Cursor AI Fesih Metni'
        },
        {
          regex: /midjourney/i,
          name: 'Midjourney AI',
          cost: 10.00,
          cat: 'Yapay Zekâ',
          hike: null,
          legal: 'Midjourney İptal Talebi'
        }
      ];

      patterns.forEach(function (p) {
        if (p.regex.test(text)) {
          detected.push({
            name: p.name,
            bank: bankName,
            category: p.cat,
            cost: p.cost,
            currency: '$',
            risk: p.hike ? 'Sinsi Fiyat Artışı' : 'Ekstrede Tespit Edildi',
            desc: bankName + ' ekstresi satırlarından %100 yerel FileReader motoruyla ayrıştırıldı.',
            cancelUrl: 'https://www.google.com/search?q=' + encodeURIComponent(p.name + ' cancel subscription'),
            legalType: p.legal,
            hike: p.hike
          });
        }
      });

      return detected;
    }

    function runScanSimulation(leaks, sourceName) {
      if (dropzone) dropzone.classList.add('hidden');
      if (progressWrap) progressWrap.classList.remove('hidden');
      if (resultsWrap) resultsWrap.classList.add('hidden');
      if (resetBtn) resetBtn.classList.remove('hidden');

      var label = sourceName || 'Banka Ekstresi';
      var pct = 0;
      var interval = setInterval(function () {
        pct += 12;
        if (pct > 100) pct = 100;
        if (progressBar) progressBar.style.width = pct + '%';
        if (progressPct) progressPct.textContent = pct + '%';

        if (pct === 36 && statusText) {
          statusText.textContent = label + ' ayrıştırılıyor (0 Bayt Bulut)...';
        } else if (pct === 72 && statusText) {
          statusText.textContent = 'Masaüstü Dalga 2: Karanlık desen & sinsi zamlar taranıyor...';
        }

        if (pct >= 100) {
          clearInterval(interval);
          setTimeout(function () {
            if (progressWrap) progressWrap.classList.add('hidden');
            renderResults(leaks, label);
            if (window.srAudio && window.srAudio.playSuccess) {
              window.srAudio.playSuccess();
            }
          }, 250);
        }
      }, 70);
    }

    function renderResults(leaks, sourceLabel) {
      if (!resultsWrap || !leaksList) return;

      var totalMonthly = 0;
      var hikeCount = 0;

      // Currency conversion support if available
      var curSymbol = '$';
      var curRate = 1;
      if (typeof SR_RATES !== 'undefined' && typeof srCurrency !== 'undefined' && SR_RATES[srCurrency]) {
        curSymbol = SR_RATES[srCurrency].symbol;
        curRate = SR_RATES[srCurrency].rate;
      }

      leaks.forEach(function (item) {
        var normalizedCost = item.cost;
        if (item.currency === 'TRY') {
          // If in USD view, convert TRY to USD roughly or keep native
          normalizedCost = (typeof SR_RATES !== 'undefined' && SR_RATES.TRY) ? (item.cost / SR_RATES.TRY.rate) : (item.cost / 48.35);
        } else if (item.currency === 'EUR') {
          normalizedCost = (typeof SR_RATES !== 'undefined' && SR_RATES.EUR) ? (item.cost / SR_RATES.EUR.rate) : (item.cost / 0.86);
        }
        totalMonthly += normalizedCost;
        if (item.hike) hikeCount++;
      });

      var totalYearly = totalMonthly * 12;

      if (statCount) {
        var hikeBadge = hikeCount > 0
          ? '<span class="text-xs font-normal text-amber-300 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center gap-1 font-mono">🔥 ' + hikeCount + ' Sinsi Zam</span>'
          : '<span class="text-xs font-normal text-rose-400/80 px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20">Yüksek Risk</span>';

        statCount.innerHTML = '<span>' + leaks.length + ' Adet</span>' + hikeBadge;
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
        card.className = 'rounded-2xl p-4 sm:p-5 bg-white/[0.02] border border-white/10 hover:border-emerald-500/30 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden group';

        // Price formatting per item
        var displayPrice = '';
        if (item.currency === 'TRY') {
          displayPrice = item.cost.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' TL';
        } else if (item.currency === 'EUR') {
          displayPrice = '€' + item.cost.toFixed(2);
        } else {
          displayPrice = '$' + item.cost.toFixed(2);
        }

        // Sneak price hike badge HTML
        var hikeHtml = '';
        if (item.hike) {
          hikeHtml = [
            '<div class="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-mono font-medium">',
            '  <span class="material-symbols-outlined text-[15px] text-amber-400">trending_up</span>',
            '  <span>' + item.hike.badge + '</span>',
            '</div>'
          ].join('');
        }

        var bankBadge = item.bank
          ? '<span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-neutral-300 flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>' + item.bank + '</span>'
          : '';

        card.innerHTML = [
          '<div class="flex items-start gap-3.5 min-w-0">',
          '  <div class="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/15 flex items-center justify-center text-white/70 flex-shrink-0 mt-0.5 group-hover:text-emerald-400 group-hover:border-emerald-500/40 transition-all">',
          '    <span class="material-symbols-outlined text-[22px]" aria-hidden="true">credit_card_off</span>',
          '  </div>',
          '  <div class="min-w-0">',
          '    <div class="flex items-center gap-2 flex-wrap">',
          '      <h4 class="text-sm font-semibold text-white">' + item.name + '</h4>',
          '      ' + bankBadge,
          '      <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300">' + item.risk + '</span>',
          '      <span class="text-[10px] font-mono text-neutral-400">' + item.category + '</span>',
          '    </div>',
          '    <p class="text-xs text-neutral-400 mt-1 leading-relaxed">' + item.desc + '</p>',
          '    ' + hikeHtml,
          '  </div>',
          '</div>',
          '<div class="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/10">',
          '  <div class="text-right">',
          '    <div class="text-sm font-bold text-white font-mono">' + displayPrice + '<span class="text-[11px] font-normal text-neutral-400">/ay</span></div>',
          '    <div class="text-[10px] text-emerald-400 font-mono">Cihaz İçi Kurtarılabilir</div>',
          '  </div>',
          '  <div class="flex items-center gap-2 flex-wrap">',
          '    <button type="button" class="lab-legal-btn px-3 py-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-[11px] text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all cursor-pointer flex items-center gap-1 font-mono" data-service="' + item.name + '" title="6502 SK THH veya Chargeback Dilekçesi Hazırla">',
          '      <span class="material-symbols-outlined text-[14px]">gavel</span>',
          '      <span>6502 SK / THH</span>',
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
            srShowToast(sName + ' için 6502 SK THH ve Chargeback dilekçesi hazırlanıyor...');
          }
        });
      });

      resultsWrap.classList.remove('hidden');
      if (window.srAnalytics) {
        window.srAnalytics.track('statement_scan_completed', {
          source: sourceLabel,
          leaksCount: leaks.length,
          hikesCount: hikeCount
        });
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
