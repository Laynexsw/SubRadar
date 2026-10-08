/**
 * SubRadar — Command Palette (Cmd+K / Ctrl+K) Controller
 */
export function initCommandPalette() {
  const cmdBackdrop = document.getElementById('cmd-palette-backdrop');
  const cmdInput = document.getElementById('cmd-palette-input');
  const cmdItems = document.querySelectorAll('.cmd-item');
  const navCmdTrigger = document.getElementById('nav-cmd-trigger');
  const cmdPreviewBox = document.getElementById('cmd-preview-box');
  let cmdActiveIdx = 0;

  function srCmdVisible() {
    return Array.from(cmdItems).filter(i => i.style.display !== 'none');
  }

  function srPaintCmdActive() {
    const vis = srCmdVisible();
    vis.forEach((item, idx) => {
      const on = idx === cmdActiveIdx;
      item.classList.toggle('bg-white/10', on);
      item.classList.toggle('text-white', on);
      if (on) item.setAttribute('aria-selected', 'true');
      else item.removeAttribute('aria-selected');
    });
  }

  function openCommandPalette() {
    if (!cmdBackdrop) return;
    cmdBackdrop.classList.remove('hidden');
    cmdBackdrop.classList.add('flex');
    if (cmdInput) {
      cmdInput.value = '';
      filterCommands('');
      setTimeout(() => cmdInput.focus(), 50);
    }
  }

  function closeCommandPalette() {
    if (!cmdBackdrop) return;
    cmdBackdrop.classList.add('hidden');
    cmdBackdrop.classList.remove('flex');
  }

  function filterCommands(query) {
    const q = query.toLowerCase().trim();
    let visible = 0;
    cmdItems.forEach(item => {
      const text = item.innerText.toLowerCase();
      if (text.includes(q)) {
        item.style.display = 'flex';
        visible++;
      } else {
        item.style.display = 'none';
      }
    });
    cmdActiveIdx = 0;
    srPaintCmdActive();
  }

  if (navCmdTrigger) navCmdTrigger.addEventListener('click', openCommandPalette);

  window.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      if (cmdBackdrop && cmdBackdrop.classList.contains('hidden')) {
        openCommandPalette();
      } else {
        closeCommandPalette();
      }
    }
    if (e.key === 'Escape' && cmdBackdrop && !cmdBackdrop.classList.contains('hidden')) {
      closeCommandPalette();
    }
  });

  if (cmdBackdrop) {
    cmdBackdrop.addEventListener('click', e => {
      if (e.target === cmdBackdrop) closeCommandPalette();
    });
  }

  if (cmdInput) {
    cmdInput.addEventListener('input', e => filterCommands(e.target.value));
    cmdInput.addEventListener('keydown', e => {
      const vis = srCmdVisible();
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (!vis.length) return;
        cmdActiveIdx = e.key === 'ArrowDown' ? (cmdActiveIdx + 1) % vis.length : (cmdActiveIdx - 1 + vis.length) % vis.length;
        srPaintCmdActive();
      } else if (e.key === 'Enter') {
        const target = vis[cmdActiveIdx] || vis[0];
        if (target) target.click();
      }
    });
  }

  cmdItems.forEach(item => {
    item.addEventListener('click', () => {
      const cmd = item.dataset.cmd;
      closeCommandPalette();

      if (cmd === 'kill-adobe') {
        const adobeBtn = document.querySelector('.direct-kill-btn[data-service="Adobe Creative Cloud"]');
        if (adobeBtn && !adobeBtn.disabled) adobeBtn.click();
      } else if (cmd === 'vault-audit') {
        const vaultTab = document.querySelector('.app-tab-btn[data-tab="vault"]');
        if (vaultTab) vaultTab.click();
      } else if (cmd === 'simulate-intercept') {
        window.location.hash = 'hesaplayici';
      } else if (cmd === 'export-report') {
        const blob = new Blob([JSON.stringify({ app: 'SubRadar', timestamp: new Date().toISOString() }, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'SubRadar_Rapor.json';
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    });
  });

  if (cmdPreviewBox) {
    cmdPreviewBox.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openCommandPalette(); }
    });
  }
}
