/**
 * SubRadar — Global Configuration & Exchange Rates
 */
export const SR_RATES = {
  USD: { rate: 1, symbol: '$' },
  EUR: { rate: 0.86, symbol: '€' },
  TRY: { rate: 48.35, symbol: '₺' }
};

export let srCurrency = 'USD';
try {
  const savedCur = localStorage.getItem('sr-currency');
  if (savedCur && SR_RATES[savedCur]) srCurrency = savedCur;
} catch (e) {}

// Canlı kur önbelleği (12 saat TTL)
try {
  const fxCache = JSON.parse(localStorage.getItem('sr-fx') || 'null');
  if (fxCache && (Date.now() - (fxCache.ts || 0)) < 12 * 3600 * 1000) {
    if (fxCache.EUR > 0.5 && fxCache.EUR < 1.5) SR_RATES.EUR.rate = fxCache.EUR;
    if (fxCache.TRY > 10 && fxCache.TRY < 200) SR_RATES.TRY.rate = fxCache.TRY;
  }
} catch (e) {}

export function setCurrency(cur) {
  if (SR_RATES[cur]) {
    srCurrency = cur;
    try { localStorage.setItem('sr-currency', cur); } catch (e) {}
  }
}

export function srConvert(usd) { 
  return usd * SR_RATES[srCurrency].rate; 
}
