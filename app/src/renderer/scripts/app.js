/**
 * SubRadar Desktop — Application Main Entrypoint
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Trafik Işıkları Olayları
  const btnClose = document.getElementById('traffic-close');
  const btnMin = document.getElementById('traffic-min');
  const btnMax = document.getElementById('traffic-max');

  btnClose?.addEventListener('click', () => {
    if (window.subradar && window.subradar.closeWindow) {
      window.subradar.closeWindow();
    } else {
      window.close();
    }
  });

  btnMin?.addEventListener('click', () => {
    if (window.subradar && window.subradar.minimizeWindow) {
      window.subradar.minimizeWindow();
    }
  });

  btnMax?.addEventListener('click', () => {
    if (window.subradar && window.subradar.maximizeWindow) {
      window.subradar.maximizeWindow();
    }
  });

  // Klavye Kısayolları (Ctrl+K / ⌘K Arama, ESC Modal Kapatma)
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      const search = document.getElementById('search-input');
      search?.focus();
      search?.select();
    }
    if (e.key === 'Escape') {
      window.cancelWizard?.close();
      window.addSubModal?.close();
    }
  });

  // Veri Kasası Dinleyicisi
  window.subStore.subscribe((store) => {
    window.uiRenderer.render(store);
  });

  // Kasayı Başlat
  await window.subStore.init();

  console.log('SubRadar Desktop initialized successfully.');
});
