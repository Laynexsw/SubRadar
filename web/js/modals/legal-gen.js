/* =========================================================================
   SubRadar — Live Legal Notice Generator Controller (6502 SK & GDPR Art. 17)
   ========================================================================= */

(function () {
  'use strict';

  function initLegalGen() {
    var modal = document.getElementById('legal-modal-backdrop');
    var closeBtn = document.getElementById('legal-modal-close');
    var serviceInput = document.getElementById('legal-service-name');
    var userInput = document.getElementById('legal-user-name');
    var userIdInput = document.getElementById('legal-user-id');
    var preview = document.getElementById('legal-letter-preview');
    var copyBtn = document.getElementById('legal-copy-btn');
    var copyText = document.getElementById('legal-copy-text');
    var downloadBtn = document.getElementById('legal-download-btn');

    function buildNoticeText() {
      var s = (serviceInput ? serviceInput.value : '').trim() || 'Servis Sağlayıcı';
      var u = (userInput ? userInput.value : '').trim() || 'Abonelik Sahibi';
      var id = (userIdInput ? userIdInput.value : '').trim() || 'Kayıtlı E-posta';
      var today = new Date().toLocaleDateString('tr-TR');

      return [
        'KONU: ABONELİK SÖZLEŞMESİNİN FESHİ VE KİŞİSEL VERİLERİN İMHASI TALEBİ',
        'TARİH: ' + today,
        'MUHATAP: ' + s + ' Müşteri Hizmetleri / Hukuk Departmanı',
        '',
        'Sayın Yetkili,',
        '',
        'Sistemlerinizde ' + id + ' tanımlayıcısı/hesabı ile kayıtlı bulunan ' + s + ' abonelik sözleşmemi, 6502 sayılı Tüketicinin Korunması Hakkında Kanun\'un 52. maddesinin 4. fıkrası uyarınca herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin DERHAL FESHEDİYORUM.',
        '',
        'Mezkûr kanun hükmü uyarınca:',
        '1. Tarafıma herhangi bir erken fesih bedeli, cayma tazminatı veya ceza yansıtılamaz;',
        '2. Kredi kartımdan veya ödeme hesabımdan geleceğe dönük hiçbir çekim yapılamaz;',
        '3. Varsa peşin tahsil edilmiş ancak kullanılmamış günlerin bedeli tarafıma 14 gün içinde iade edilmelidir.',
        '',
        'Ayrıca, 6698 sayılı KVKK ve GDPR Madde 17 (Unutulma Hakkı) kapsamında, yasal saklama yükümlülüğü dışındaki tüm kredi kartı bilgilerimin, biyometrik verilerimin ve profil kayıtlarımın sunucularınızdan silinmesini ve tarafıma yazılı teyit verilmesini talep ederim.',
        '',
        'Gereğini rica eder, aksi halde Tüketici Hakem Heyetleri ve KVKK Kurumu nezdinde yasal süreç başlatacağımı ihtaren bildiririm.',
        '',
        'FESİH EDEN:',
        u,
        'Hesap / E-posta: ' + id,
        'Tarih: ' + today
      ].join('\n');
    }

    function updatePreview() {
      if (preview) {
        preview.textContent = buildNoticeText();
      }
    }

    function openModal(serviceName) {
      if (!modal) return;
      if (serviceName && serviceInput) {
        serviceInput.value = serviceName;
      }
      updatePreview();
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      try { document.body.style.overflow = 'hidden'; } catch (e) {}
      if (window.srAudio && window.srAudio.playToggle) window.srAudio.playToggle();
    }

    function closeModal() {
      if (!modal) return;
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      try { document.body.style.overflow = ''; } catch (e) {}
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === modal) closeModal();
      });
    }

    [serviceInput, userInput, userIdInput].forEach(function (inp) {
      if (inp) inp.addEventListener('input', updatePreview);
    });

    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        var text = buildNoticeText();
        navigator.clipboard.writeText(text).then(function () {
          if (copyText) copyText.textContent = 'Kopyalandı!';
          if (window.srAudio && window.srAudio.playSuccess) window.srAudio.playSuccess();
          setTimeout(function () {
            if (copyText) copyText.textContent = 'Panoya Kopyala';
          }, 2000);
        });
      });
    }

    if (downloadBtn) {
      downloadBtn.addEventListener('click', function () {
        var text = buildNoticeText();
        var s = (serviceInput ? serviceInput.value : 'Servis').replace(/[^a-zA-Z0-9_-]/g, '_');
        var blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'SubRadar_Yasal_Fesih_' + s + '.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        if (window.srAudio && window.srAudio.playSuccess) window.srAudio.playSuccess();
      });
    }

    // Expose open function globally
    window.srOpenLegalModal = openModal;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLegalGen);
  } else {
    initLegalGen();
  }
})();
