/**
 * SubRadar — Interactive Waste Calculator & Profile Presets
 */
export function initCalculator() {
  const calcSubs = document.getElementById('calc-subs');
  const calcTrials = document.getElementById('calc-trials');
  const subsVal = document.getElementById('calc-subs-val');
  const trialsVal = document.getElementById('calc-trials-val');
  const out1yr = document.getElementById('out-1yr');
  const out5yr = document.getElementById('out-5yr');
  const reclaimTarget = document.getElementById('reclaim-target-amount');

  function updateCalculator() {
    if (!calcSubs || !calcTrials) return;
    const subs = parseInt(calcSubs.value, 10);
    const trials = parseInt(calcTrials.value, 10);

    if (subsVal) subsVal.textContent = `${subs} ${typeof t === 'function' ? t('araç') : 'araç'}`;
    if (trialsVal) trialsVal.textContent = `${trials} ${typeof t === 'function' ? t('aktif') : 'aktif'}`;

    const monthlyWaste = (subs * 32) + (trials * 78);
    const annualWaste = monthlyWaste * 12;
    const fiveYearWaste = annualWaste * 5;

    if (out1yr && typeof srFormat === 'function') out1yr.textContent = srFormat(annualWaste, 0);
    if (out5yr && typeof srFormat === 'function') out5yr.textContent = srFormat(fiveYearWaste, 0);
    if (reclaimTarget && typeof srFormat === 'function') reclaimTarget.textContent = srFormat(annualWaste, 2);
  }

  if (calcSubs && calcTrials) {
    calcSubs.addEventListener('input', updateCalculator);
    calcTrials.addEventListener('input', updateCalculator);
    updateCalculator();
  }

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

  return { updateCalculator };
}
