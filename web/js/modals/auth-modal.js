/**
 * SubRadar — Auth Modal (Double Slider Sliding-Overlay Controller)
 * Dribbble / Apple Glass Edition
 */
import { srShowToast } from '../toast.js';

function getToast() {
  return typeof srShowToast === 'function' ? srShowToast : (window.srShowToast || function(msg) { console.log(msg); });
}

// Immediate global fail-safe opener
if (typeof window !== 'undefined') {
  window.srOpenAuthModal = window.srOpenAuthModal || function(mode) {
    mode = mode || 'login';
    var backdrop = document.getElementById('auth-modal-backdrop');
    var authBox = document.getElementById('auth-box');
    if (!backdrop) return;
    if (authBox) {
      if (mode === 'register') {
        authBox.classList.add('auth-right-panel-active');
      } else {
        authBox.classList.remove('auth-right-panel-active');
      }
    }
    backdrop.classList.remove('hidden');
    backdrop.classList.add('flex');
    backdrop.style.display = 'flex';
    backdrop.setAttribute('aria-hidden', 'false');
    try { document.body.style.overflow = 'hidden'; } catch (e) {}
    if (window.srAudio && window.srAudio.playToggle) window.srAudio.playToggle();
  };

  window.srCloseAuthModal = window.srCloseAuthModal || function() {
    var backdrop = document.getElementById('auth-modal-backdrop');
    if (!backdrop) return;
    backdrop.classList.add('hidden');
    backdrop.classList.remove('flex');
    backdrop.style.display = 'none';
    backdrop.setAttribute('aria-hidden', 'true');
    try { document.body.style.overflow = ''; } catch (e) {}
  };
}

export function initAuthModal() {
  const backdrop = document.getElementById('auth-modal-backdrop');
  const authBox = document.getElementById('auth-box');
  if (!backdrop || !authBox) return;

  const openBtns = document.querySelectorAll('#auth-modal-btn, .mobile-auth-trigger');
  const closeBtn = document.getElementById('auth-modal-close');

  // Double Slider Controls
  const toSignUpBtn = document.getElementById('auth-to-signup-btn');
  const toSignInBtn = document.getElementById('auth-to-signin-btn');

  // Mobile Top Switcher Controls
  const mobileTabLogin = document.getElementById('auth-mobile-tab-login');
  const mobileTabRegister = document.getElementById('auth-mobile-tab-register');
  const mobileSwitchToRegister = document.getElementById('auth-mobile-switch-to-register');
  const mobileSwitchToLogin = document.getElementById('auth-mobile-switch-to-login');

  // Forms & Inputs
  const loginForm = document.getElementById('auth-login-form');
  const loginEmail = document.getElementById('auth-login-email');
  const loginPwd = document.getElementById('auth-login-password');
  const loginPwdToggle = document.getElementById('auth-login-pwd-toggle');
  const loginPwdIcon = document.getElementById('auth-login-pwd-icon');
  const loginSpinner = document.getElementById('auth-login-spinner');
  const loginSubmitLabel = document.getElementById('auth-login-submit-label');
  const quickDemoBtn = document.getElementById('auth-quick-demo-btn');

  const registerForm = document.getElementById('auth-register-form');
  const registerName = document.getElementById('auth-register-name');
  const registerEmail = document.getElementById('auth-register-email');
  const registerPwd = document.getElementById('auth-register-password');
  const registerPwdToggle = document.getElementById('auth-register-pwd-toggle');
  const registerPwdIcon = document.getElementById('auth-register-pwd-icon');
  const registerSpinner = document.getElementById('auth-register-spinner');
  const registerSubmitLabel = document.getElementById('auth-register-submit-label');

  // Real-time Checklist & Strength Bars
  const regPwdStrengthText = document.getElementById('auth-register-pwd-strength-text');
  const regBars = [
    document.getElementById('auth-register-pwd-bar-1'),
    document.getElementById('auth-register-pwd-bar-2'),
    document.getElementById('auth-register-pwd-bar-3')
  ];
  const reqLen = document.getElementById('pwd-req-len');
  const reqNum = document.getElementById('pwd-req-num');
  const reqSpec = document.getElementById('pwd-req-spec');

  // Social Buttons
  const socialBtns = document.querySelectorAll('.social-login-btn');

  // Views
  const sliderWrapper = document.getElementById('auth-slider-wrapper');
  const activeDashboard = document.getElementById('auth-active-dashboard');
  const forgotView = document.getElementById('auth-forgot-view');
  const forgotLink = document.getElementById('auth-forgot-link');
  const forgotBackBtn = document.getElementById('auth-forgot-back-btn');
  const forgotForm = document.getElementById('auth-forgot-form');
  const forgotSuccess = document.getElementById('auth-forgot-success');
  const forgotEmail = document.getElementById('auth-forgot-email');

  // Dashboard elements
  const profileName = document.getElementById('auth-profile-name');
  const profileEmail = document.getElementById('auth-profile-email');
  const avatarInitials = document.getElementById('auth-avatar-initials');
  const btnViewSubs = document.getElementById('auth-btn-view-subs');
  const btnExportJson = document.getElementById('auth-btn-export-json');
  const btnEditProfile = document.getElementById('auth-btn-edit-profile');
  const logoutBtn = document.getElementById('auth-logout-btn');
  const authBtnLabel = document.getElementById('auth-btn-label');

  // Switch between Sign-In and Sign-Up panels
  function setPanel(mode) {
    if (mode === 'register') {
      authBox.classList.add('auth-right-panel-active');
      if (mobileTabRegister && mobileTabLogin) {
        mobileTabRegister.className = 'auth-mobile-btn flex-1 py-1 text-xs font-semibold rounded-full transition-all text-black bg-white cursor-pointer';
        mobileTabLogin.className = 'auth-mobile-btn flex-1 py-1 text-xs font-semibold rounded-full transition-all text-white/60 hover:text-white cursor-pointer';
      }
    } else {
      authBox.classList.remove('auth-right-panel-active');
      if (mobileTabRegister && mobileTabLogin) {
        mobileTabLogin.className = 'auth-mobile-btn flex-1 py-1 text-xs font-semibold rounded-full transition-all text-black bg-white cursor-pointer';
        mobileTabRegister.className = 'auth-mobile-btn flex-1 py-1 text-xs font-semibold rounded-full transition-all text-white/60 hover:text-white cursor-pointer';
      }
    }
    if (window.srAudio && window.srAudio.playToggle) window.srAudio.playToggle();
  }

  if (toSignUpBtn) {
    toSignUpBtn.addEventListener('click', () => setPanel('register'));
  }
  if (toSignInBtn) {
    toSignInBtn.addEventListener('click', () => setPanel('login'));
  }

  // Mobile Switchers
  if (mobileTabLogin) {
    mobileTabLogin.addEventListener('click', () => setPanel('login'));
  }
  if (mobileTabRegister) {
    mobileTabRegister.addEventListener('click', () => setPanel('register'));
  }
  if (mobileSwitchToRegister) {
    mobileSwitchToRegister.addEventListener('click', () => setPanel('register'));
  }
  if (mobileSwitchToLogin) {
    mobileSwitchToLogin.addEventListener('click', () => setPanel('login'));
  }

  function hasActiveSession() {
    try {
      const raw = localStorage.getItem('sr-local-auth');
      if (raw) {
        const data = JSON.parse(raw);
        return !!(data && (data.email || data.name));
      }
    } catch (e) {}
    return false;
  }

  function getActiveSession() {
    try {
      const raw = localStorage.getItem('sr-local-auth');
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return null;
  }

  function setAuthenticated(user) {
    try {
      localStorage.setItem('sr-local-auth', JSON.stringify({
        name: user.name || 'Kullanıcı',
        email: user.email || 'kullanici@subradar.dev',
        provider: user.provider || 'Local',
        ts: Date.now()
      }));
    } catch (e) {}
    updateSessionUI();
  }

  function clearAuthentication() {
    try {
      localStorage.removeItem('sr-local-auth');
    } catch (e) {}
    if (loginEmail) loginEmail.value = '';
    if (loginPwd) loginPwd.value = '';
    if (registerName) registerName.value = '';
    if (registerEmail) registerEmail.value = '';
    if (registerPwd) registerPwd.value = '';
    updateSessionUI();
    showSliderWrapper();
    setPanel('login');
  }

  function showSliderWrapper() {
    if (sliderWrapper) sliderWrapper.classList.remove('hidden');
    if (activeDashboard) activeDashboard.classList.add('hidden');
    if (forgotView) forgotView.classList.add('hidden');
  }

  function showActiveDashboard() {
    if (sliderWrapper) sliderWrapper.classList.add('hidden');
    if (activeDashboard) {
      activeDashboard.classList.remove('hidden');
      activeDashboard.classList.add('flex');
    }
    if (forgotView) forgotView.classList.add('hidden');
  }

  function showForgotView() {
    if (sliderWrapper) sliderWrapper.classList.add('hidden');
    if (activeDashboard) activeDashboard.classList.add('hidden');
    if (forgotView) {
      forgotView.classList.remove('hidden');
      forgotView.classList.add('flex');
    }
    if (forgotSuccess) forgotSuccess.classList.add('hidden');
    if (forgotEmail && loginEmail && loginEmail.value) {
      forgotEmail.value = loginEmail.value;
    }
  }

  function updateSessionUI() {
    const session = getActiveSession();
    if (session) {
      const displayName = session.name || (session.email ? session.email.split('@')[0] : 'Kullanıcı');
      if (authBtnLabel) {
        authBtnLabel.innerHTML = `<span class="w-2 h-2 rounded-full bg-white inline-block mr-1"></span>${displayName} (Hesabım)`;
      }
      if (profileName) profileName.textContent = displayName;
      if (profileEmail) profileEmail.textContent = session.email || 'kullanici@subradar.dev';
      if (avatarInitials) {
        const parts = displayName.split(' ');
        const initials = parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : displayName.substring(0, 2).toUpperCase();
        avatarInitials.innerHTML = `${initials}<span class="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-white border-2 border-[#09090b]"></span>`;
      }
      showActiveDashboard();
    } else {
      if (authBtnLabel) {
        authBtnLabel.textContent = 'Giriş Yap / Kayıt Ol';
      }
      showSliderWrapper();
    }
  }

  function openModal(mode = 'login') {
    updateSessionUI();
    if (!hasActiveSession()) {
      showSliderWrapper();
      setPanel(mode);
    }
    backdrop.classList.remove('hidden');
    backdrop.classList.add('flex');
    backdrop.style.display = 'flex';
    backdrop.setAttribute('aria-hidden', 'false');
    try { document.body.style.overflow = 'hidden'; } catch (e) {}
    if (window.srAudio && window.srAudio.playToggle) window.srAudio.playToggle();
    setTimeout(() => {
      if (!hasActiveSession()) {
        if (mode === 'register' && registerName) registerName.focus();
        else if (loginEmail) loginEmail.focus();
      }
    }, 120);
  }

  function closeModal() {
    backdrop.classList.add('hidden');
    backdrop.classList.remove('flex');
    backdrop.style.display = 'none';
    backdrop.setAttribute('aria-hidden', 'true');
    try { document.body.style.overflow = ''; } catch (e) {}
  }

  // Password Strength Logic for Registration (Apple Monochrome)
  function updateRegisterPasswordStrength() {
    if (!registerPwd) return;
    const pwd = registerPwd.value || '';

    const hasLen = pwd.length >= 8;
    const hasNum = /[A-Z]/.test(pwd) || /[0-9]/.test(pwd);
    const hasSpec = /[^A-Za-z0-9]/.test(pwd);

    let score = 0;
    if (hasLen) score++;
    if (hasNum) score++;
    if (hasSpec) score++;

    const colors = ['bg-white/35', 'bg-white/70', 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)]'];
    const labels = ['Zayıf', 'Orta Düzey', 'Güçlü Şifre'];

    regBars.forEach((bar, idx) => {
      if (!bar) return;
      bar.className = 'h-full flex-1 rounded-full transition-all duration-300 ' + (idx < score ? colors[Math.min(score - 1, colors.length - 1)] : 'bg-white/15');
    });

    if (regPwdStrengthText) {
      if (pwd.length === 0) {
        regPwdStrengthText.textContent = 'Bekleniyor';
        regPwdStrengthText.className = 'text-white/50 font-semibold font-mono';
      } else {
        regPwdStrengthText.textContent = labels[score - 1] || 'Zayıf';
        regPwdStrengthText.className = score <= 1 ? 'text-neutral-400 font-semibold font-mono' : (score === 2 ? 'text-neutral-200 font-semibold font-mono' : 'text-white font-bold font-mono');
      }
    }

    function updateChip(el, isOk) {
      if (!el) return;
      const icon = el.querySelector('.req-icon');
      if (isOk) {
        el.className = 'flex items-center gap-1 text-white font-medium transition-colors';
        if (icon) icon.textContent = '✓';
      } else {
        el.className = 'flex items-center gap-1 text-white/40 transition-colors';
        if (icon) icon.textContent = '○';
      }
    }

    updateChip(reqLen, hasLen);
    updateChip(reqNum, hasNum);
    updateChip(reqSpec, hasSpec);
  }

  if (registerPwd) {
    ['input', 'keyup', 'change', 'paste'].forEach(evt => {
      registerPwd.addEventListener(evt, updateRegisterPasswordStrength);
    });
  }

  // Password Visibility Toggles
  if (loginPwdToggle && loginPwd && loginPwdIcon) {
    loginPwdToggle.addEventListener('click', () => {
      const isPwd = loginPwd.type === 'password';
      loginPwd.type = isPwd ? 'text' : 'password';
      loginPwdIcon.textContent = isPwd ? 'visibility_off' : 'visibility';
    });
  }
  if (registerPwdToggle && registerPwd && registerPwdIcon) {
    registerPwdToggle.addEventListener('click', () => {
      const isPwd = registerPwd.type === 'password';
      registerPwd.type = isPwd ? 'text' : 'password';
      registerPwdIcon.textContent = isPwd ? 'visibility_off' : 'visibility';
    });
  }

  // Social Sign-in simulation
  socialBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const provider = btn.getAttribute('data-provider') || 'Google';
      btn.style.opacity = '0.6';
      btn.disabled = true;

      if (window.srAudio && window.srAudio.playToggle) window.srAudio.playToggle();

      setTimeout(() => {
        let name = 'Arda Yılmaz';
        let email = 'arda.yilmaz@gmail.com';
        if (provider === 'GitHub') {
          name = 'arday-dev';
          email = 'arda@github.dev';
        } else if (provider === 'Apple') {
          name = 'Arda Yılmaz';
          email = 'arda@privaterelay.appleid.com';
        }

        setAuthenticated({ name, email, provider });
        getToast()(`✓ ${provider} ile başarıyla giriş yapıldı. Hoş geldiniz!`, 'success');
        if (window.srAudio && window.srAudio.playSuccess) window.srAudio.playSuccess();
        btn.style.opacity = '1';
        btn.disabled = false;
      }, 350);
    });
  });

  // 1-Click Quick Demo Login
  if (quickDemoBtn) {
    quickDemoBtn.addEventListener('click', () => {
      setAuthenticated({
        name: 'Arda Yılmaz',
        email: 'arda@subradar.dev',
        provider: 'Demo'
      });
      getToast()('⚡ Demo hesabı ile tek tıkla giriş yapıldı. Hoş geldiniz!', 'success');
      if (window.srAudio && window.srAudio.playSuccess) window.srAudio.playSuccess();
    });
  }

  // Sign-In Form Submit
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = (loginEmail && loginEmail.value.trim()) || 'kullanici@subradar.dev';

      if (loginSpinner) loginSpinner.classList.remove('hidden');
      if (loginSubmitLabel) loginSubmitLabel.textContent = 'GİRİŞ YAPILIYOR...';

      setTimeout(() => {
        if (loginSpinner) loginSpinner.classList.add('hidden');
        if (loginSubmitLabel) loginSubmitLabel.textContent = 'GİRİŞ YAP';

        const nameVal = email.split('@')[0];
        setAuthenticated({
          name: nameVal.charAt(0).toUpperCase() + nameVal.slice(1),
          email: email,
          provider: 'Local'
        });
        getToast()('Giriş başarılı! Hoş geldiniz.', 'success');
        if (window.srAudio && window.srAudio.playSuccess) window.srAudio.playSuccess();
      }, 350);
    });
  }

  // Sign-Up Form Submit
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = (registerName && registerName.value.trim()) || 'Yeni Kullanıcı';
      const email = (registerEmail && registerEmail.value.trim()) || 'kullanici@subradar.dev';

      if (registerSpinner) registerSpinner.classList.remove('hidden');
      if (registerSubmitLabel) registerSubmitLabel.textContent = 'KAYDEDİLİYOR...';

      setTimeout(() => {
        if (registerSpinner) registerSpinner.classList.add('hidden');
        if (registerSubmitLabel) registerSubmitLabel.textContent = 'KAYIT OL';

        setAuthenticated({
          name: name,
          email: email,
          provider: 'Local'
        });
        getToast()('Hesabınız başarıyla oluşturuldu! Hoş geldiniz.', 'success');
        if (window.srAudio && window.srAudio.playSuccess) window.srAudio.playSuccess();
      }, 350);
    });
  }

  // Forgot password flow
  if (forgotLink) {
    forgotLink.addEventListener('click', () => {
      showForgotView();
      if (window.srAudio && window.srAudio.playToggle) window.srAudio.playToggle();
    });
  }
  if (forgotBackBtn) {
    forgotBackBtn.addEventListener('click', () => {
      showSliderWrapper();
      if (window.srAudio && window.srAudio.playToggle) window.srAudio.playToggle();
    });
  }
  if (forgotForm) {
    forgotForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (forgotSuccess) forgotSuccess.classList.remove('hidden');
      getToast()('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi!', 'success');
      if (window.srAudio && window.srAudio.playSuccess) window.srAudio.playSuccess();
    });
  }

  // Active Dashboard Buttons
  if (btnViewSubs) {
    btnViewSubs.addEventListener('click', () => {
      closeModal();
      const target = document.getElementById('hero-mock-window') || document.getElementById('ekstre-laboratuvari');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  if (btnExportJson) {
    btnExportJson.addEventListener('click', () => {
      const session = getActiveSession() || { name: 'Kullanıcı', email: 'kullanici@subradar.dev' };
      const backupData = {
        app: 'SubRadar',
        version: '1.5.0',
        exportedAt: new Date().toISOString(),
        user: session,
        subscriptionsSummary: {
          activeCount: 14,
          monthlyBurn: 384.20,
          annualBurn: 4610.40,
          detectedLeaks: 3,
          potentialAnnualSavings: 1890.00
        },
        subscriptions: [
          { name: 'Adobe Creative Cloud', cost: 59.99, cycle: 'monthly', status: 'idle_leak', lastUsed: '51 gün önce' },
          { name: 'JetBrains Toolbox', cost: 28.90, cycle: 'monthly', status: 'unassigned_seat', lastUsed: 'Atanmamış' },
          { name: 'AWS Cloud Sandbox', cost: 74.30, cycle: 'monthly', status: 'idle_zombie', lastUsed: '38 gün önce' },
          { name: 'Spotify Family', cost: 14.99, cycle: 'monthly', status: 'active', lastUsed: 'Bugün' }
        ]
      };

      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `subradar-hesap-yedegi-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      getToast()('Hesap ve abonelik verileriniz (.json) başarıyla indirildi.', 'success');
      if (window.srAudio && window.srAudio.playSuccess) window.srAudio.playSuccess();
    });
  }

  if (btnEditProfile) {
    btnEditProfile.addEventListener('click', () => {
      const session = getActiveSession();
      const currentName = session ? session.name : 'Arda Yılmaz';
      const newName = prompt('Yeni profil adınızı girin:', currentName);
      if (newName && newName.trim()) {
        const updated = Object.assign({}, session, { name: newName.trim() });
        setAuthenticated(updated);
        getToast()('Profil adınız güncellendi!', 'success');
        if (window.srAudio && window.srAudio.playSuccess) window.srAudio.playSuccess();
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      clearAuthentication();
      getToast()('Oturum kapatıldı.', 'info');
      if (window.srAudio && window.srAudio.playToggle) window.srAudio.playToggle();
    });
  }

  // Global API exposure
  window.srOpenAuthModal = openModal;
  window.srCloseAuthModal = closeModal;

  // Initialize UI on load
  updateSessionUI();

  // Event Listeners for Open / Close
  openBtns.forEach(b => b.addEventListener('click', (e) => {
    e.preventDefault();
    openModal('login');
  }));
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // Global document click delegation for all auth triggers
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('#auth-modal-btn, .mobile-auth-trigger, [data-open-auth]');
    if (trigger) {
      e.preventDefault();
      const mode = trigger.getAttribute('data-auth-mode') || 'login';
      openModal(mode);
    }
  });

  // Close on backdrop click
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModal();
  });

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !backdrop.classList.contains('hidden')) {
      closeModal();
    }
  });
}

// Auto-init on DOMContentLoaded or immediate execution
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuthModal);
  } else {
    initAuthModal();
  }
}
