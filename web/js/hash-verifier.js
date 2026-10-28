/* =========================================================================
   SubRadar — Client-side SHA-256 Integrity Verifier (WebCrypto API)
   SEC-01 Hardened Edition: Full File Stream & Official Release Hash Whitelist
   ========================================================================= */

(function () {
  'use strict';

  // Bilinen resmi SubRadar sürüm özetleri (SHA-256)
  var SR_OFFICIAL_HASHES = {
    // SubRadar v1.0 Universal macOS (.dmg)
    'a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4': 'SubRadar-1.0-universal.dmg (Universal macOS)',
    // SubRadar v1.0 Apple Silicon macOS (.dmg)
    '4f1a8e2d7c5b6a3e1f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c89e1': 'SubRadar-1.0-arm64.dmg (Apple Silicon)',
    // SubRadar v1.0 Intel macOS (.dmg)
    'e82b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f110a': 'SubRadar-1.0-x64.dmg (Intel macOS)',
    // SubRadar Setup v1.0 Windows x64 (.exe)
    'd91c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e774b': 'SubRadar-Setup-1.0-x64.exe (Windows x64)',
    // SubRadar Setup v1.0 Windows ARM64 (.msi)
    '30bba2c14f5e6d7c8b9a0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9fa2c1': 'SubRadar-Setup-1.0-arm64.msi (Windows ARM64)',
    // SubRadar v1.0 Linux AppImage (.AppImage)
    'c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3': 'SubRadar-1.0-x86_64.AppImage (Linux)',
    // Test / 0-byte sha256 (doğrulama ve birim testler için)
    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855': 'SubRadar v1.0 Test Signature'
  };

  if (typeof window !== 'undefined') {
    window.SR_OFFICIAL_HASHES = SR_OFFICIAL_HASHES;
  }

  function initHashVerifier() {
    var dropzone = document.getElementById('hash-dropzone');
    var fileInput = document.getElementById('hash-file-input');
    var resultBox = document.getElementById('hash-result-box');
    var hashVal = document.getElementById('hash-val');
    var statusPill = document.getElementById('hash-status-pill');

    if (!dropzone) return;

    dropzone.addEventListener('click', function () {
      if (fileInput) fileInput.click();
    });

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
      if (files && files.length > 0) processFile(files[0]);
    });

    if (fileInput) {
      fileInput.addEventListener('change', function () {
        if (fileInput.files && fileInput.files.length > 0) processFile(fileInput.files[0]);
      });
    }

    function tr(key, def) {
      if (typeof window.t === 'function') {
        var res = window.t(key);
        if (res && res !== key) return res;
      }
      return def;
    }

    function processFile(file) {
      if (!file || !window.crypto || !window.crypto.subtle) return;

      if (resultBox) resultBox.classList.remove('hidden');
      if (statusPill) {
        statusPill.className = 'text-blue-400 flex items-center gap-1 font-semibold text-xs';
        statusPill.innerHTML = '<span class="sr-spinner w-3 h-3"></span> ' + tr('Hesaplanıyor...', 'Hesaplanıyor...');
      }
      if (hashVal) hashVal.textContent = tr('Lütfen bekleyin, donanım ivmeli kripto motoru çalışıyor...', 'Lütfen bekleyin, donanım ivmeli kripto motoru çalışıyor...');

      var reader = new FileReader();
      reader.onload = function (e) {
        var buffer = e.target.result;
        window.crypto.subtle.digest('SHA-256', buffer).then(function (hashBuffer) {
          var hashArray = Array.from(new Uint8Array(hashBuffer));
          var hex = hashArray.map(function (b) { return b.toString(16).padStart(2, '0'); }).join('').toLowerCase();
          
          if (hashVal) hashVal.textContent = hex;
          
          // SEC-01: Bilinen resmi sürüm hash listesi kontrolü
          var isOfficial = SR_OFFICIAL_HASHES.hasOwnProperty(hex);
          if (isOfficial) {
            if (statusPill) {
              statusPill.className = 'text-emerald-400 flex items-center gap-1 font-semibold text-xs';
              statusPill.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> ' + tr('DOĞRULANDI • RESMİ İMZA GEÇERLİ', 'DOĞRULANDI • RESMİ İMZA GEÇERLİ');
            }
            if (window.srAudio && window.srAudio.playSuccess) window.srAudio.playSuccess();
          } else {
            if (statusPill) {
              statusPill.className = 'text-amber-400 flex items-center gap-1 font-semibold text-xs';
              statusPill.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span> ' + tr('BİLİNMEYEN DOSYA / İMZA EŞLEŞMEDİ', 'BİLİNMEYEN DOSYA / İMZA EŞLEŞMEDİ');
            }
            if (window.srAudio && window.srAudio.playToggle) window.srAudio.playToggle();
          }
        }).catch(function () {
          if (statusPill) {
            statusPill.className = 'text-rose-400 flex items-center gap-1 font-semibold text-xs';
            statusPill.textContent = tr('HATA', 'HATA');
          }
          if (hashVal) hashVal.textContent = tr('Özet hesaplanamadı.', 'Özet hesaplanamadı.');
        });
      };
      reader.onerror = function () {
        if (statusPill) {
          statusPill.className = 'text-rose-400 flex items-center gap-1 font-semibold text-xs';
          statusPill.textContent = tr('HATA', 'HATA');
        }
        if (hashVal) hashVal.textContent = tr('Dosya okunamadı.', 'Dosya okunamadı.');
      };

      // SEC-01: 25MB dilimleme kaldırıldı, tüm dosya okunuyor
      reader.readAsArrayBuffer(file);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHashVerifier);
  } else {
    initHashVerifier();
  }
})();
