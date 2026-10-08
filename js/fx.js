/**
 * SubRadar — Live FX Updater
 */
export function initFx() {
  const TTL = 12 * 3600 * 1000;
  function valid(r) { return r && r.EUR > 0.5 && r.EUR < 1.5 && r.TRY > 10 && r.TRY < 200; }
  function markLive() {
    const n = document.getElementById('fx-updated');
    if (n) { try { n.textContent = typeof t === 'function' ? t('canlı kur') : 'canlı kur'; } catch (e) { n.textContent = 'canlı kur'; } }
  }
  function applyFx(r) {
    try {
      if (typeof SR_RATES !== 'undefined') {
        SR_RATES.EUR.rate = r.EUR;
        SR_RATES.TRY.rate = r.TRY;
      }
      localStorage.setItem('sr-fx', JSON.stringify({ ts: Date.now(), EUR: r.EUR, TRY: r.TRY }));
    } catch (e) {}
    try {
      if (typeof srPaintStatics === 'function') srPaintStatics();
    } catch (_) {}
    markLive();
  }
  function get(url, ms) {
    const c = new AbortController();
    const to = setTimeout(() => { try { c.abort(); } catch (e) {} }, ms || 8000);
    return fetch(url, { signal: c.signal }).then(res => {
      if (!res.ok) throw new Error('fx');
      return res.json();
    }).finally(() => clearTimeout(to));
  }
  function updateFx() {
    get('https://open.er-api.com/v6/latest/USD').then(d => {
      if (d && d.result === 'success' && valid(d.rates)) return { EUR: d.rates.EUR, TRY: d.rates.TRY };
      throw new Error('fx');
    }).catch(() => {
      return get('https://api.frankfurter.app/latest?from=USD').then(d => {
        if (d && valid(d.rates)) return { EUR: d.rates.EUR, TRY: d.rates.TRY };
        throw new Error('fx');
      });
    }).then(applyFx).catch(() => {});
  }

  let fresh = false;
  try {
    const c = JSON.parse(localStorage.getItem('sr-fx') || 'null');
    fresh = !!(c && (Date.now() - (c.ts || 0)) < TTL && valid(c));
  } catch (e) {}
  if (fresh) markLive(); else updateFx();
}
