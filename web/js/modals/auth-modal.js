/**
 * SubRadar — Auth Modal ($10,000 Executive Apple Glass Split-Screen Controller)
 */
import { srShowToast } from '../toast.js';

export function initAuthModal() {
  const backdrop = document.getElementById('auth-modal-backdrop');
  if (!backdrop) return;

  const openBtns = document.querySelectorAll('#auth-modal-btn, .mobile-auth-trigger');
  const closeBtn = document.getElementById('auth-modal-close');
  const sliderContainer = document.getElementById('auth-tab-slider-container');
  const tabLogin = document.getElementById('auth-tab-login');
  const tabRegister = document.getElementById('auth-tab-register');
  const sliderGlider = document.getElementById('auth-tab-slider-glider');
  const registerExtra = document.getElementById('auth-register-extra');
  const nameGroup = document.getElementById('auth-name-group');
  const rememberRow = document.getElementById('auth-remember-row');
  const rightTitle = document.getElementById('auth-right-title');
  const rightSubtitle = document.getElementById('auth-right-subtitle');
  const submitBtn = document.getElementById('auth-submit-btn');
  const submitLabel = document.getElementById('auth-submit-label');
  const submitSpinner = document.getElementById('auth-submit-spinner');
  const submitIcon = document.getElementById('auth-submit-icon');
  const quickDemoBtn = document.getElementById('auth-quick-demo-btn');
  const switchPromptBtn = document.getElementById('auth-switch-prompt-btn');
  const switchPromptText = document.getElementById('auth-switch-prompt-text');
  const nameInput = document.getElementById('auth-name');
  const emailInput = document.getElementById('auth-email');
  const pwdInput = document.getElementById('auth-password');
  const pwdConfirmInput = document.getElementById('auth-password-confirm');
  const pwdToggle = document.getElementById('auth-pwd-toggle');
  const pwdIcon = document.getElementById('auth-pwd-icon');
  const authBtnLabel = document.getElementById('auth-btn-label');
  const socialBtns = document.querySelectorAll('.social-login-btn');

  // Carousel Elements
  const slides = document.querySelectorAll('.auth-carousel-slide');
  const dots = document.querySelectorAll('.auth-carousel-dot');
  const prevSlideBtn = document.getElementById('auth-carousel-prev');
  const nextSlideBtn = document.getElementById('auth-carousel-next');
  const showcasePanel = document.getElementById('auth-showcase-panel');
  const progressBar = document.getElementById('auth-carousel-progress-bar');
  const slideCounter = document.getElementById('auth-slide-counter');
  const mockKillCard = document.getElementById('auth-mock-kill-card');
  const killStatusBadge = document.getElementById('auth-kill-status-badge');

  // Views
  const mainFlow = document.getElementById('auth-main-flow');
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

  // Strength bars & Checklist chips
  const pwdStrengthText = document.getElementById('auth-pwd-strength-text');
  const pwdMatchIcon = document.getElementById('auth-pwd-match-icon');
  const reqLen = document.getElementById('pwd-req-len');
  const reqNum = document.getElementById('pwd-req-num');
  const reqSpec = document.getElementById('pwd-req-spec');
  const bars = [
    document.getElementById('auth-pwd-bar-1'),
    document.getElementById('auth-pwd-bar-2'),
    document.getElementById('auth-pwd-bar-3')
  ];

  let currentTab = 'login';
  let currentSlide = 0;
  let carouselProgressInterval = null;
  let progressVal = 0;
  let isCarouselHovered = false;
  const SLIDE_DURATION_MS = 4500;
  const PROGRESS_TICK_MS = 50;

  // Carousel functionality
  function goToSlide(index) {
    if (!slides.length) return;
    currentSlide = (index + slides.length) % slides.length;

    slides.forEach((slide, idx) => {
      if (idx === currentSlide) {
        slide.classList.remove('hidden');
      } else {
        slide.classList.add('hidden');
      }
    });

    dots.forEach((dot, idx) => {
      if (idx === currentSlide) {
        dot.className = 'auth-carousel-dot w-7 h-1.5 rounded-full bg-emerald-400 transition-all cursor-pointer';
        dot.setAttribute('aria-label', `Slayt ${idx + 1} (Aktif)`);
      } else {
        dot.className = 'auth-carousel-dot w-2 h-1.5 rounded-full bg-white/20 hover:bg-white/50 transition-all cursor-pointer';
        dot.setAttribute('aria-label', `Slayt ${idx + 1}`);
      }
    });

    if (slideCounter) {
      slideCounter.textContent = `${currentSlide + 1} / ${slides.length}`;
    }

    // Reset progress
    progressVal = 0;
    if (progressBar) {
      progressBar.style.width = '0%';
    }
  }

  function startCarouselProgress() {
    stopCarouselProgress();
    carouselProgressInterval = setInterval(() => {
      if (isCarouselHovered) return;
      progressVal += (PROGRESS_TICK_MS / SLIDE_DURATION_MS) * 100;
      if (progressBar) {
        progressBar.style.width = `${Math.min(progressVal, 100)}%`;
      }
      if (progressVal >= 100) {
        progressVal = 0;
        goToSlide(currentSlide + 1);
      }
    }, PROGRESS_TICK_MS);
  }

  function stopCarouselProgress() {
    if (carouselProgressInterval) {
      clearInterval(carouselProgressInterval);
      carouselProgressInterval = null;
    }
  }

  if (prevSlideBtn) {
    prevSlideBtn.addEventListener('click', () => {
      goToSlide(currentSlide - 1);
      if (window.srAudio && window.srAudio.playToggle) window.srAudio.playToggle();
    });
  }

  if (nextSlideBtn) {
    nextSlideBtn.addEventListener('click', () => {
      goToSlide(currentSlide + 1);
      if (window.srAudio && window.srAudio.playToggle) window.srAudio.playToggle();
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const target = parseInt(dot.getAttribute('data-target') || '0', 10);
      goToSlide(target);
      if (window.srAudio && window.srAudio.playToggle) window.srAudio.playToggle();
    });
  });

  if (showcasePanel) {
    showcasePanel.addEventListener('mouseenter', () => {
      isCarouselHovered = true;
    });
    showcasePanel.addEventListener('mouseleave', () => {
      isCarouselHovered = false;
    });
  }

  // Interactive Kill Switch simulation on Slide 0
  if (mockKillCard && killStatusBadge) {
    let isKilled = false;
    mockKillCard.style.cursor = 'pointer';
    mockKillCard.addEventListener('click', () => {
      isKilled = !isKilled;
      if (isKilled) {
        killStatusBadge.className = 'inline-flex items-center gap-1 text-[10px] font-mono text-emerald-300 font-bold bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/40 shadow-sm';
        killStatusBadge.innerHTML = '<span class="material-symbols-outlined text-[12px]">check_circle</span><span>İPTAL EDİLDİ</span>';
        srShowToast('⚡ Adobe Creative Cloud tek tıkla iptal simülasyonu çalıştırıldı (+$59.99/ay kurtarıldı).', 'success');
        if (window.srAudio && window.srAudio.playSuccess) window.srAudio.playSuccess();
      } else {
        killStatusBadge.className = 'inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-bold bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/30 shadow-sm animate-pulse';
        killStatusBadge.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span><span>İPTAL HAZIR</span>';
      }
    });
  }

  function openModal(mode = 'login') {
    updateSessionUI();
    if (!hasActiveSession()) {
      showMainFlow();
      switchTab(mode);
    }
    backdrop.classList.remove('hidden');
    backdrop.classList.add('flex');
    backdrop.style.display = 'flex';
    backdrop.setAttribute('aria-hidden', 'false');
    try { document.body.style.overflow = 'hidden'; } catch (e) {}
    if (window.srAudio && window.srAudio.playToggle) window.srAudio.playToggle();
    goToSlide(0);
    startCarouselProgress();
    setTimeout(() => {
      if (!hasActiveSession() && emailInput) emailInput.focus();
    }, 80);
  }

  function closeModal() {
    backdrop.classList.add('hidden');
    backdrop.classList.remove('flex');
    backdrop.style.display = 'none';
    backdrop.setAttribute('aria-hidden', 'true');
    stopCarouselProgress();
    try { document.body.style.overflow = ''; } catch (e) {}
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
    if (emailInput) emailInput.value = '';
    if (pwdInput) pwdInput.value = '';
    if (pwdConfirmInput) pwdConfirmInput.value = '';
    updateSessionUI();
    showMainFlow();
    switchTab('login');
  }

  function showMainFlow() {
    if (mainFlow) mainFlow.classList.remove('hidden');
    if (activeDashboard) activeDashboard.classList.add('hidden');
    if (forgotView) forgotView.classList.add('hidden');
  }

  function showActiveDashboard() {
    if (mainFlow) mainFlow.classList.add('hidden');
    if (activeDashboard) activeDashboard.classList.remove('hidden');
    if (forgotView) forgotView.classList.add('hidden');
  }

  function showForgotView() {
    if (mainFlow) mainFlow.classList.add('hidden');
    if (activeDashboard) activeDashboard.classList.add('hidden');
    if (forgotView) forgotView.classList.remove('hidden');
    if (forgotSuccess) forgotSuccess.classList.add('hidden');
    if (forgotEmail && emailInput && emailInput.value) {
      forgotEmail.value = emailInput.value;
    }
  }

  function switchTab(tab) {
    currentTab = tab;
    if (window.srAudio && window.srAudio.playToggle) window.srAudio.playToggle();

    if (tab === 'login') {
      if (sliderGlider) {
        sliderGlider.style.transform = 'translateX(0)';
      }
      if (tabLogin) {
        tabLogin.className = 'auth-tab-btn relative z-10 flex-1 py-1.5 text-xs font-semibold rounded-full transition-colors duration-200 text-black cursor-pointer flex items-center justify-center gap-1.5';
        tabLogin.setAttribute('aria-selected', 'true');
      }
      if (tabRegister) {
        tabRegister.className = 'auth-tab-btn relative z-10 flex-1 py-1.5 text-xs font-semibold rounded-full transition-colors duration-200 text-white/60 hover:text-white cursor-pointer flex items-center justify-center gap-1.5';
        tabRegister.setAttribute('aria-selected', 'false');
      }
      if (nameGroup) nameGroup.classList.add('hidden');
      if (registerExtra) registerExtra.classList.add('hidden');
      if (rememberRow) rememberRow.classList.remove('hidden');
      if (rightTitle) rightTitle.textContent = "SubRadar'a Giriş Yap";
      if (rightSubtitle) rightSubtitle.textContent = 'Aboneliklerinizi yerel kasanızda yönetmeye devam edin.';
      if (submitLabel) submitLabel.textContent = 'Giriş Yap';
      if (switchPromptText) switchPromptText.textContent = 'Henüz hesabınız yok mu?';
      if (switchPromptBtn) switchPromptBtn.textContent = 'Kayıt Ol';
    } else {
      if (sliderGlider) {
        sliderGlider.style.transform = 'translateX(calc(100% + 0px))';
      }
      if (tabRegister) {
        tabRegister.className = 'auth-tab-btn relative z-10 flex-1 py-1.5 text-xs font-semibold rounded-full transition-colors duration-200 text-black cursor-pointer flex items-center justify-center gap-1.5';
        tabRegister.setAttribute('aria-selected', 'true');
      }
      if (tabLogin) {
        tabLogin.className = 'auth-tab-btn relative z-10 flex-1 py-1.5 text-xs font-semibold rounded-full transition-colors duration-200 text-white/60 hover:text-white cursor-pointer flex items-center justify-center gap-1.5';
        tabLogin.setAttribute('aria-selected', 'false');
      }
      if (nameGroup) nameGroup.classList.remove('hidden');
      if (registerExtra) registerExtra.classList.remove('hidden');
      if (rememberRow) rememberRow.classList.add('hidden');
      if (rightTitle) rightTitle.textContent = 'Ücretsiz Hesap Oluştur';
      if (rightSubtitle) rightSubtitle.textContent = 'Sıfır bilgi korumalı yerel kasanızı saniyeler içinde başlatın.';
      if (submitLabel) submitLabel.textContent = 'Kayıt Ol ve Başlat';
      if (switchPromptText) switchPromptText.textContent = 'Zaten bir hesabınız var mı?';
      if (switchPromptBtn) switchPromptBtn.textContent = 'Giriş Yap';
    }
  }

  // Keyboard navigation for Tabs (ArrowLeft / ArrowRight)
  if (sliderContainer) {
    sliderContainer.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        switchTab('register');
        if (tabRegister) tabRegister.focus();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        switchTab('login');
        if (tabLogin) tabLogin.focus();
      }
    });
  }

  function updateSessionUI() {
    const session = getActiveSession();
    if (session) {
      const displayName = session.name || (session.email ? session.email.split('@')[0] : 'Kullanıcı');
      if (authBtnLabel) {
        authBtnLabel.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-400 inline-block mr-1"></span>${displayName} (Hesabım)`;
      }
      if (profileName) profileName.textContent = displayName;
      if (profileEmail) profileEmail.textContent = session.email || 'kullanici@subradar.dev';
      if (avatarInitials) {
        const parts = displayName.split(' ');
        const initials = parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : displayName.substring(0, 2).toUpperCase();
        avatarInitials.innerHTML = `${initials}<span class="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0e1017]"></span>`;
      }
      showActiveDashboard();
    } else {
      if (authBtnLabel) {
        authBtnLabel.textContent = 'Giriş Yap / Kayıt Ol';
      }
      showMainFlow();
    }
  }

  function updatePasswordStrength() {
    if (!pwdInput) return;
    const pwd = pwdInput.value || '';
    const confirm = pwdConfirmInput ? pwdConfirmInput.value : '';

    let hasLen = pwd.length >= 8;
    let hasNum = /[A-Z]/.test(pwd) || /[0-9]/.test(pwd);
    let hasSpec = /[^A-Za-z0-9]/.test(pwd);

    let score = 0;
    if (hasLen) score++;
    if (hasNum) score++;
    if (hasSpec) score++;

    const colors = ['bg-rose-500', 'bg-amber-500', 'bg-emerald-400'];
    const labels = ['Zayıf', 'Orta Düzey', 'Güçlü Şifre'];

    bars.forEach((bar, idx) => {
      if (!bar) return;
      bar.className = 'h-full flex-1 rounded-full transition-all duration-300 ' + (idx < score ? colors[Math.min(score - 1, colors.length - 1)] : 'bg-white/15');
    });

    if (pwdStrengthText) {
      if (pwd.length === 0) {
        pwdStrengthText.textContent = 'Bekleniyor';
        pwdStrengthText.className = 'text-white/50 font-semibold font-mono';
      } else {
        pwdStrengthText.textContent = labels[score - 1] || 'Zayıf';
        pwdStrengthText.className = score <= 1 ? 'text-rose-400 font-semibold font-mono' : (score === 2 ? 'text-amber-400 font-semibold font-mono' : 'text-emerald-400 font-semibold font-mono');
      }
    }

    // Update real-time checklist chips
    function updateChip(el, isOk) {
      if (!el) return;
      const icon = el.querySelector('.req-icon');
      if (isOk) {
        el.className = 'flex items-center gap-1 text-emerald-400 font-medium transition-colors';
        if (icon) icon.textContent = '✓';
      } else {
        el.className = 'flex items-center gap-1 text-white/40 transition-colors';
        if (icon) icon.textContent = '○';
      }
    }

    updateChip(reqLen, hasLen);
    updateChip(reqNum, hasNum);
    updateChip(reqSpec, hasSpec);

    if (pwdMatchIcon && pwdConfirmInput) {
      if (confirm.length > 0) {
        pwdMatchIcon.classList.remove('hidden');
        if (pwd === confirm) {
          pwdMatchIcon.textContent = 'check_circle';
          pwdMatchIcon.className = 'material-symbols-outlined text-[18px] text-emerald-400 absolute right-3 top-3';
        } else {
          pwdMatchIcon.textContent = 'cancel';
          pwdMatchIcon.className = 'material-symbols-outlined text-[18px] text-rose-400 absolute right-3 top-3';
        }
      } else {
        pwdMatchIcon.classList.add('hidden');
      }
    }
  }

  // Social Sign-in simulation
  socialBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const provider = btn.getAttribute('data-provider') || 'Google';
      const label = btn.querySelector('.provider-label');
      const oldText = label ? label.textContent : provider;
      if (label) label.textContent = 'Giriş...';
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
        srShowToast(`✓ ${provider} ile başarıyla giriş yapıldı. Hoş geldiniz!`, 'success');
        if (window.srAudio && window.srAudio.playSuccess) window.srAudio.playSuccess();
        if (label) label.textContent = oldText;
        btn.disabled = false;
      }, 400);
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
      srShowToast('⚡ Demo hesabı ile tek tıkla giriş yapıldı. Hoş geldiniz!', 'success');
      if (window.srAudio && window.srAudio.playSuccess) window.srAudio.playSuccess();
    });
  }

  // Switch prompt button (footer link between login/register)
  if (switchPromptBtn) {
    switchPromptBtn.addEventListener('click', () => {
      switchTab(currentTab === 'login' ? 'register' : 'login');
    });
  }

  // Main Form Submit with Spinner Animation
  const authForm = document.getElementById('auth-form');
  if (authForm) {
    authForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = (emailInput && emailInput.value.trim()) || 'kullanici@subradar.dev';
      const pwd = pwdInput ? pwdInput.value : '';

      // Show loader
      if (submitSpinner) submitSpinner.classList.remove('hidden');
      if (submitIcon) submitIcon.classList.add('hidden');
      if (submitBtn) submitBtn.disabled = true;

      setTimeout(() => {
        if (submitSpinner) submitSpinner.classList.add('hidden');
        if (submitIcon) submitIcon.classList.remove('hidden');
        if (submitBtn) submitBtn.disabled = false;

        if (currentTab === 'register') {
          const nameVal = (nameInput && nameInput.value.trim()) || email.split('@')[0];
          const confirmVal = pwdConfirmInput ? pwdConfirmInput.value : '';

          if (confirmVal && pwd !== confirmVal) {
            srShowToast('Şifreler birbiriyle eşleşmiyor!', 'error');
            if (window.srAudio && window.srAudio.playError) window.srAudio.playError();
            return;
          }

          setAuthenticated({
            name: nameVal,
            email: email,
            provider: 'Local'
          });
          srShowToast('Hesabınız başarıyla oluşturuldu! Hoş geldiniz.', 'success');
          if (window.srAudio && window.srAudio.playSuccess) window.srAudio.playSuccess();
        } else {
          const nameVal = email.split('@')[0];
          setAuthenticated({
            name: nameVal.charAt(0).toUpperCase() + nameVal.slice(1),
            email: email,
            provider: 'Local'
          });
          srShowToast('Giriş başarılı! Hoş geldiniz.', 'success');
          if (window.srAudio && window.srAudio.playSuccess) window.srAudio.playSuccess();
        }
      }, 350);
    });
  }

  // Password Visibility Toggle
  if (pwdToggle && pwdInput && pwdIcon) {
    pwdToggle.addEventListener('click', () => {
      const isPwd = pwdInput.type === 'password';
      pwdInput.type = isPwd ? 'text' : 'password';
      pwdIcon.textContent = isPwd ? 'visibility_off' : 'visibility';
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
      showMainFlow();
      if (window.srAudio && window.srAudio.playToggle) window.srAudio.playToggle();
    });
  }

  if (forgotForm) {
    forgotForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (forgotSuccess) forgotSuccess.classList.remove('hidden');
      srShowToast('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi!', 'success');
      if (window.srAudio && window.srAudio.playSuccess) window.srAudio.playSuccess();
    });
  }

  // Dashboard action buttons
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

      srShowToast('Hesap ve abonelik verileriniz (.json) başarıyla indirildi.', 'success');
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
        srShowToast('Profil adınız güncellendi!', 'success');
        if (window.srAudio && window.srAudio.playSuccess) window.srAudio.playSuccess();
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      clearAuthentication();
      srShowToast('Oturum kapatıldı.', 'info');
      if (window.srAudio && window.srAudio.playToggle) window.srAudio.playToggle();
    });
  }

  // Password Strength Listeners
  if (pwdInput) {
    ['input', 'keyup', 'change', 'paste'].forEach(evt => {
      pwdInput.addEventListener(evt, updatePasswordStrength);
    });
  }
  if (pwdConfirmInput) {
    ['input', 'keyup', 'change', 'paste'].forEach(evt => {
      pwdConfirmInput.addEventListener(evt, updatePasswordStrength);
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
  if (tabLogin) tabLogin.addEventListener('click', () => switchTab('login'));
  if (tabRegister) tabRegister.addEventListener('click', () => switchTab('register'));

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
