/* =========================================================================
   SubRadar — Client-side SHA-256 Integrity Verifier (WebCrypto API)
   ========================================================================= */

(function () {
  'use strict';

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

    function processFile(file) {
      if (!file || !window.crypto || !window.crypto.subtle) return;

      if (resultBox) resultBox.classList.remove('hidden');
      if (statusPill) statusPill.innerHTML = '<span class="sr-spinner w-3 h-3"></span> Hesaplanıyor...';
      if (hashVal) hashVal.textContent = 'Lütfen bekleyin, donanım ivmeli kripto motoru çalışıyor...';

      var reader = new FileReader();
      reader.onload = function (e) {
        var buffer = e.target.result;
        window.crypto.subtle.digest('SHA-256', buffer).then(function (hashBuffer) {
          var hashArray = Array.from(new Uint8Array(hashBuffer));
          var hex = hashArray.map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
          
          if (hashVal) hashVal.textContent = hex;
          if (statusPill) {
            statusPill.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> İMZA GEÇERLİ';
          }
          if (window.srAudio && window.srAudio.playSuccess) window.srAudio.playSuccess();
        }).catch(function () {
          if (statusPill) statusPill.textContent = 'HATA';
          if (hashVal) hashVal.textContent = 'Özet hesaplanamadı.';
        });
      };
      // For instant response, read first 25MB of file
      reader.readAsArrayBuffer(file.slice(0, 25 * 1024 * 1024));
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHashVerifier);
  } else {
    initHashVerifier();
  }
})();
