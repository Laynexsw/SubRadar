/**
 * SubRadar — Supabase Client & Backend Integration
 * Project Ref: lkdyhelgxsdjuhkqundt
 * URL: https://lkdyhelgxsdjuhkqundt.supabase.co
 */

export const SUPABASE_URL = 'https://lkdyhelgxsdjuhkqundt.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrZHloZWxneHNkanVoa3F1bmR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg3ODIxMDQsImV4cCI6MjEwNDM1ODEwNH0.g-XERM3AuygktefIhL02F9ekYZfOfbFhKjlzWE2lCtw';

let _client = null;

export function getSupabase() {
  if (_client) return _client;
  if (typeof window !== 'undefined' && window.supabase && typeof window.supabase.createClient === 'function') {
    try {
      _client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      });
      return _client;
    } catch (e) {
      console.warn('[SubRadar] Supabase client init warning:', e);
    }
  }
  return null;
}

/**
 * REST Fallback helper in case CDN is slow or unavailable
 */
async function supabaseRest(endpoint, options = {}) {
  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
  const headers = Object.assign({
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  }, options.headers || {});

  const res = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || `Supabase REST HTTP ${res.status}`);
  }
  return await res.json();
}

/**
 * Sign Up with Email and Password
 */
export async function srAuthSignUp({ email, password, fullName }) {
  const client = getSupabase();
  if (client) {
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || email.split('@')[0]
        }
      }
    });
    if (error) throw error;
    return data;
  }

  // REST fallback
  const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      password,
      data: { full_name: fullName || email.split('@')[0] }
    })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || data.error_description || 'Kayıt başarısız oldu.');
  return data;
}

/**
 * Sign In with Email and Password
 */
export async function srAuthSignIn({ email, password }) {
  const client = getSupabase();
  if (client) {
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  }

  // REST fallback
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || data.msg || 'Giriş bilgileri geçersiz.');
  return data;
}

/**
 * Sign Out
 */
export async function srAuthSignOut() {
  const client = getSupabase();
  if (client) {
    try {
      await client.auth.signOut();
    } catch (e) {}
  }
  try {
    localStorage.removeItem('sb-lkdyhelgxsdjuhkqundt-auth-token');
    localStorage.removeItem('sr-local-auth');
  } catch (e) {}
}

/**
 * OAuth Login (Google, GitHub, Apple)
 */
export async function srAuthOAuth(provider) {
  const client = getSupabase();
  const validProvider = provider.toLowerCase();
  if (client) {
    const { data, error } = await client.auth.signInWithOAuth({
      provider: validProvider,
      options: {
        redirectTo: window.location.origin + window.location.pathname
      }
    });
    if (error) throw error;
    return data;
  }
  // Redirect to Supabase OAuth endpoint
  const redirectUrl = encodeURIComponent(window.location.origin + window.location.pathname);
  window.location.href = `${SUPABASE_URL}/auth/v1/authorize?provider=${validProvider}&redirect_to=${redirectUrl}`;
}

/**
 * Reset Password
 */
export async function srAuthResetPassword(email) {
  const client = getSupabase();
  if (client) {
    const { data, error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + window.location.pathname
    });
    if (error) throw error;
    return data;
  }
  const res = await fetch(`${SUPABASE_URL}/auth/v1/recover`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email })
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.msg || data.error_description || 'Sıfırlama bağlantısı gönderilemedi.');
  }
  return true;
}

/**
 * Get current session
 */
export async function srAuthGetSession() {
  const client = getSupabase();
  if (client) {
    const { data } = await client.auth.getSession();
    return data?.session || null;
  }
  return null;
}

/**
 * Listen to Auth State Changes
 */
export function srAuthOnStateChange(callback) {
  const client = getSupabase();
  if (client) {
    return client.auth.onAuthStateChange(callback);
  }
  return { data: { subscription: { unsubscribe: () => {} } } };
}

/**
 * Submit Enterprise Inquiry to Supabase Table
 */
export async function srSubmitEnterpriseInquiry({ name, email, company, seats, refCode }) {
  const client = getSupabase();
  const payload = {
    ref_code: refCode,
    name,
    email,
    company,
    seats: seats || '10-50',
    status: 'pending'
  };

  if (client) {
    const { data, error } = await client
      .from('enterprise_inquiries')
      .insert([payload])
      .select();
    if (error) throw error;
    return data;
  }

  return await supabaseRest('enterprise_inquiries', {
    method: 'POST',
    body: payload
  });
}

/**
 * Verify License Key in Supabase Table
 */
export async function srCheckLicense(licenseKey) {
  const cleanKey = (licenseKey || '').trim().toUpperCase();
  const client = getSupabase();

  if (client) {
    const { data, error } = await client
      .from('licenses')
      .select('*')
      .eq('license_key', cleanKey)
      .eq('status', 'active')
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  const list = await supabaseRest(`licenses?license_key=eq.${encodeURIComponent(cleanKey)}&status=eq.active&select=*`);
  return list && list.length ? list[0] : null;
}

/**
 * Get or Create User Profile
 */
export async function srGetUserProfile(userId) {
  if (!userId) return null;
  const client = getSupabase();
  if (client) {
    const { data, error } = await client
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (!error && data) return data;
  }
  return null;
}
