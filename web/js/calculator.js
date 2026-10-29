/**
 * SubRadar — Interactive Waste Calculator & Family / Team Cost Splitter
 */
export function initCalculator() {
  const calcSubs = document.getElementById('calc-subs');
  const calcTrials = document.getElementById('calc-trials');
  const subsVal = document.getElementById('calc-subs-val');
  const trialsVal = document.getElementById('calc-trials-val');
  const out1yr = document.getElementById('out-1yr');
  const out5yr = document.getElementById('out-5yr');
  const reclaimTarget = document.getElementById('reclaim-target-amount');

  // Family / Team Splitter Elements
  const splitToggle = document.getElementById('calc-split-toggle');
  const splitPanel = document.getElementById('calc-split-panel');
  const splitResults = document.getElementById('calc-split-results');
  const splitMembers = document.getElementById('calc-split-members');
  const splitMembersVal = document.getElementById('calc-split-members-val');
  const outSplitPerPerson = document.getElementById('out-split-per-person');
  const outSplitAnnualSaved = document.getElementById('out-split-annual-saved');
  const outSplitBadge = document.getElementById('out-split-badge');
  const splitBtns = document.querySelectorAll('.calc-split-btn');

  function updateSplitButtonStates(membersCount) {
    splitBtns.forEach(btn => {
      const isSelected = parseInt(btn.dataset.members, 10) === membersCount;
      btn.classList.toggle('border-emerald-400/40', isSelected);
      btn.classList.toggle('bg-emerald-500/15', isSelected);
      btn.classList.toggle('text-emerald-300', isSelected);
      btn.classList.toggle('font-semibold', isSelected);
      btn.classList.toggle('border-white/10', !isSelected);
      btn.classList.toggle('bg-white/[0.03]', !isSelected);
      btn.classList.toggle('text-white/70', !isSelected);
    });
  }

  function updateCalculator() {
    if (!calcSubs || !calcTrials) return;
    const subs = parseInt(calcSubs.value, 10) || 0;
    const trials = parseInt(calcTrials.value, 10) || 0;

    if (subsVal) subsVal.textContent = `${subs} ${typeof t === 'function' ? t('araç') : 'araç'}`;
    if (trialsVal) trialsVal.textContent = `${trials} ${typeof t === 'function' ? t('aktif') : 'aktif'}`;

    const monthlyWaste = (subs * 32) + (trials * 78);
    const annualWaste = monthlyWaste * 12;
    const fiveYearWaste = annualWaste * 5;

    if (out1yr && typeof srFormat === 'function') out1yr.textContent = srFormat(annualWaste, 0);
    if (out5yr && typeof srFormat === 'function') out5yr.textContent = srFormat(fiveYearWaste, 0);
    if (reclaimTarget && typeof srFormat === 'function') reclaimTarget.textContent = srFormat(annualWaste, 2);

    const leakRateDisplay = document.getElementById('calc-leak-rate-display');
    if (leakRateDisplay && typeof srFormat === 'function' && typeof srPer === 'function') {
      leakRateDisplay.textContent = `${srFormat(monthlyWaste, 0)}${srPer()}`;
    }
    const wave = document.querySelector('.calc-leak-wave');
    if (wave) {
      const speed = Math.max(6.5, 12.0 - (monthlyWaste / 300));
      wave.style.animationDuration = `${speed.toFixed(1)}s`;
    }

    // Family / Team Splitter Computations
    const isSplitActive = splitToggle ? splitToggle.checked : false;
    let members = splitMembers ? parseInt(splitMembers.value, 10) || 4 : 4;
    if (members < 2) members = 2;
    if (members > 6) members = 6;

    if (splitMembersVal) {
      splitMembersVal.textContent = `${members} ${typeof t === 'function' ? t('kişi') : 'kişi'}`;
    }

    const perPersonMonthly = monthlyWaste / members;
    const annualSplitSavings = annualWaste * (members - 1) / members;
    const pctSaved = Math.round(((members - 1) / members) * 100);

    if (outSplitPerPerson && typeof srFormat === 'function') {
      const perSuffix = typeof srPer === 'function' ? srPer() : '/ay';
      outSplitPerPerson.textContent = `${srFormat(perPersonMonthly, 0)}${perSuffix}`;
    }

    if (outSplitAnnualSaved && typeof srFormat === 'function') {
      outSplitAnnualSaved.textContent = srFormat(annualSplitSavings, 0);
    }

    if (outSplitBadge) {
      const saveWord = typeof t === 'function' ? t('Tasarruf') : 'Tasarruf';
      const personWord = typeof t === 'function' ? t('Kişi') : 'Kişi';
      outSplitBadge.textContent = `%${pctSaved} ${saveWord} (${members} ${personWord})`;
    }

    if (splitPanel) {
      splitPanel.classList.toggle('hidden', !isSplitActive);
    }
    if (splitResults) {
      splitResults.classList.toggle('hidden', !isSplitActive);
    }
  }

  // Sliders input listeners
  if (calcSubs && calcTrials) {
    calcSubs.addEventListener('input', updateCalculator);
    calcTrials.addEventListener('input', updateCalculator);
  }

  // Split toggle listener
  if (splitToggle) {
    splitToggle.addEventListener('change', () => {
      updateCalculator();
    });
  }

  // Split members slider listener
  if (splitMembers) {
    splitMembers.addEventListener('input', () => {
      const m = parseInt(splitMembers.value, 10);
      updateSplitButtonStates(m);
      updateCalculator();
    });
  }

  // Split member pill button listeners
  splitBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const m = parseInt(btn.dataset.members, 10);
      if (splitMembers) {
        splitMembers.value = m;
      }
      updateSplitButtonStates(m);
      updateCalculator();
    });
  });

  // Preset buttons
  document.querySelectorAll('.calc-preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const subs = parseInt(btn.dataset.subs, 10);
      const trials = parseInt(btn.dataset.trials, 10);
      if (calcSubs && calcTrials) {
        calcSubs.value = subs;
        calcTrials.value = trials;
        updateCalculator();
      }
      document.querySelectorAll('.calc-preset-btn').forEach(b => {
        const on = b === btn;
        b.classList.toggle('border-white/30', on);
        b.classList.toggle('bg-white/10', on);
        b.classList.toggle('text-white', on);
        b.classList.toggle('border-white/10', !on);
        b.classList.toggle('bg-white/[0.03]', !on);
        b.classList.toggle('text-white/70', !on);
      });
    });
  });

  // Initial calculation
  updateCalculator();

  return { updateCalculator };
}
