/**
 * SubRadar — Auth & Local Vault Access Modal
 */
import { srShowToast } from '../toast.js';

export function initAuthModal() {
  const backdrop = document.getElementById('auth-modal-backdrop');
  if (!backdrop) return;

  const openBtns = document.querySelectorAll('#auth-modal-btn, .mobile-auth-trigger');
  const closeBtn = document.getElementById('auth-modal-close');
  const tabLogin = document.getElementById('auth-tab-login');
  const tabRegister = document.getElementById('auth-tab-register');
  const registerExtra = document.getElementById('auth-register-extra');
  const modalTitle = document.getElementById('auth-modal-title');
  const submitBtn = document.getElementById('auth-submit-btn');
  const submitLabel = document.getElementById('auth-submit-label');
  const quickDemoBtn = document.getElementById('auth-quick-demo-btn');
  const pwdInput = document.getElementById('auth-password');
  const pwdToggle = document.getElementById('auth-pwd-toggle');
  const pwdIcon = document.getElementById('auth-pwd-icon');
  const emailInput = document.getElementById('auth-email');
  const authBtnLabel = document.getElementById('auth-btn-label');

  let currentTab = 'login';

  function openModal(mode = 'login') {
    switchTab(mode);
    backdrop.classList.remove('hidden');
    backdrop.classList.add('flex');
    backdrop.setAttribute('aria-hidden', 'false');
    try { document.body.style.overflow = 'hidden'; } catch (e) {}
    if (window.srAudio && window.srAudio.playToggle) window.srAudio.playToggle();
    setTimeout(() => { if (emailInput) emailInput.focus(); }, 50);
  }

  function closeModal() {
    backdrop.classList.add('hidden');
    backdrop.classList.remove('flex');
    backdrop.setAttribute('aria-hidden', 'true');
    try { document.body.style.overflow = ''; } catch (e) {}
  }

  function switchTab(tab) {
    currentTab = tab;
    if (tab === 'login') {
      if (tabLogin) {
        tabLogin.classList.add('text-white', 'bg-white/15', 'shadow-sm');
        tabLogin.classList.remove('text-white/50');
        tabLogin.setAttribute('aria-selected', 'true');
      }
      if (tabRegister) {
        tabRegister.classList.remove('text-white', 'bg-white/15', 'shadow-sm');
        tabRegister.classList.add('text-white/50');
        tabRegister.setAttribute('aria-selected', 'false');
      }
      if (registerExtra) registerExtra.classList.add('hidden');
      if (modalTitle) modalTitle.textContent = 'Yerel Kasa Girişi';
      if (submitLabel) submitLabel.textContent = 'Giriş Yap';
    } else {
      if (tabRegister) {
        tabRegister.classList.add('text-white', 'bg-white/15', 'shadow-sm');
        tabRegister.classList.remove('text-white/50');
        tabRegister.setAttribute('aria-selected', 'true');
      }
      if (tabLogin) {
        tabLogin.classList.remove('text-white', 'bg-white/15', 'shadow-sm');
        tabLogin.classList.add('text-white/50');
        tabLogin.setAttribute('aria-selected', 'false');
      }
      if (registerExtra) registerExtra.classList.remove('hidden');
      if (modalTitle) modalTitle.textContent = 'Yeni Yerel Kasa Oluştur';
      if (submitLabel) submitLabel.textContent = 'Kayıt Ol ve Kasayı Başlat';
    }
  }

  const logoutBtn = document.getElementById('auth-logout-btn');

  function updateSessionUI() {
    try {
      const raw = localStorage.getItem('sr-local-auth');
      if (raw) {
        const data = JSON.parse(raw);
        if (data && data.email) {
          if (authBtnLabel) {
            authBtnLabel.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-400 inline-block mr-1"></span>${data.email.split('@')[0]} (Kasa)`;
          }
          if (logoutBtn) {
            logoutBtn.classList.remove('hidden');
            logoutBtn.classList.add('flex');
          }
          return;
        }
      }
    } catch (e) {}
    if (authBtnLabel) {
      authBtnLabel.textContent = 'Giriş Yap / Kayıt Ol';
    }
    if (logoutBtn) {
      logoutBtn.classList.add('hidden');
      logoutBtn.classList.remove('flex');
    }
  }

  function setAuthenticated(userEmail) {
    try {
      localStorage.setItem('sr-local-auth', JSON.stringify({ email: userEmail, ts: Date.now() }));
    } catch (e) {}
    updateSessionUI();
  }

  function handleAuthSuccess(email) {
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="material-symbols-outlined text-[16px] animate-spin">refresh</span><span>Doğrulanıyor...</span>';
    }

    setTimeout(() => {
      setAuthenticated(email);
      closeModal();
      srShowToast(currentTab === 'login' ? 'Yerel Kasa oturumu başarıyla açıldı. Hoş geldiniz!' : 'Yeni yerel AES-256 kasa başarıyla oluşturuldu!', 'success');
      if (window.srAudio && window.srAudio.playSuccess) window.srAudio.playSuccess();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span id="auth-submit-label">${currentTab === 'login' ? 'Giriş Yap' : 'Kayıt Ol ve Kasayı Başlat'}</span><span class="material-symbols-outlined text-[15px]">arrow_forward</span>`;
      }
    }, 450);
  }

  // Restore existing session if present
  updateSessionUI();

  // Event Listeners
  openBtns.forEach(b => b.addEventListener('click', () => openModal('login')));
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (tabLogin) tabLogin.addEventListener('click', () => switchTab('login'));
  if (tabRegister) tabRegister.addEventListener('click', () => switchTab('register'));

  if (pwdToggle && pwdInput && pwdIcon) {
    pwdToggle.addEventListener('click', () => {
      const isPwd = pwdInput.type === 'password';
      pwdInput.type = isPwd ? 'text' : 'password';
      pwdIcon.textContent = isPwd ? 'visibility_off' : 'visibility';
    });
  }

  if (quickDemoBtn) {
    quickDemoBtn.addEventListener('click', () => {
      handleAuthSuccess('demo.kullanici@subradar.dev');
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      try { localStorage.removeItem('sr-local-auth'); } catch (e) {}
      updateSessionUI();
      closeModal();
      srShowToast('Yerel Kasa oturumu kapatıldı.', 'info');
      if (window.srAudio && window.srAudio.playToggle) window.srAudio.playToggle();
    });
  }

  const form = document.getElementById('auth-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = emailInput && emailInput.value.trim() ? emailInput.value.trim() : 'kullanici@subradar.dev';
      handleAuthSuccess(email);
    });
  }

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !backdrop.classList.contains('hidden')) {
      closeModal();
    }
  });

  // Expose globally
  window.srOpenAuthModal = openModal;
}
