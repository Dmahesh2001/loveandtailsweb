/*
 * Client for the LTBackend REST API (Django + SimpleJWT).
 *
 * Base URL comes from VITE_API_URL (see .env.example); defaults to the local
 * Django dev server. Access/refresh tokens are kept in localStorage so a
 * reload keeps you signed in. A 401 on an authenticated call triggers one
 * token refresh (shared by concurrent callers) and a retry.
 */

const DEFAULT_API_URL = import.meta.env.PROD
  ? 'https://api.loveandtails.com/api/v1'
  : 'http://localhost:8000/api/v1';

export const API_URL = (import.meta.env.VITE_API_URL || DEFAULT_API_URL).replace(/\/+$/, '');

const TOKENS_KEY = 'loveandtails:tokens';

export class ApiError extends Error {
  constructor(status, data) {
    super(errorMessage(status, data));
    this.status = status;
    this.data = data;
    // DRF field errors: { email: ['...'], password: ['...'] }
    this.fieldErrors = data && typeof data === 'object' && !Array.isArray(data) ? fieldErrorsOf(data) : {};
  }
}

function fieldErrorsOf(data) {
  const out = {};
  for (const [key, value] of Object.entries(data)) {
    if (key === 'detail' || key === 'code' || key === 'non_field_errors') continue;
    out[key] = Array.isArray(value) ? value.join(' ') : String(value);
  }
  return out;
}

function errorMessage(status, data) {
  if (status === 0) return 'Can’t reach the server. Check your connection and try again.';
  if (status === 429) return 'Too many attempts. Please wait a moment and try again.';
  if (data?.detail) return String(data.detail);
  if (Array.isArray(data?.non_field_errors)) return data.non_field_errors.join(' ');
  if (status >= 500) return 'Something went wrong on our side. Please try again.';
  return 'Please check the details and try again.';
}

/* ---------- token storage ---------- */

let tokens = readTokens();
const listeners = new Set();

function readTokens() {
  try {
    const raw = localStorage.getItem(TOKENS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getTokens() {
  return tokens;
}

export function setTokens(next) {
  tokens = next;
  try {
    if (next) localStorage.setItem(TOKENS_KEY, JSON.stringify(next));
    else localStorage.removeItem(TOKENS_KEY);
  } catch {
    /* storage unavailable — tokens live in memory for this tab */
  }
  listeners.forEach((fn) => fn(next));
}

/** Called when tokens change (e.g. a refresh fails and the session ends). */
export function onTokensChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/* ---------- requests ---------- */

async function send(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (auth && tokens?.access) headers.Authorization = `Bearer ${tokens.access}`;

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, null);
  }

  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { detail: text };
    }
  }
  if (!res.ok) throw new ApiError(res.status, data);
  return { status: res.status, data };
}

let refreshing = null;

async function refreshTokens() {
  if (!tokens?.refresh) throw new ApiError(401, null);
  refreshing ??= send('/auth/token/refresh/', { method: 'POST', body: { refresh: tokens.refresh } })
    .then(({ data }) => {
      // Refresh tokens rotate: the response carries a new pair.
      setTokens({ access: data.access, refresh: data.refresh ?? tokens.refresh });
    })
    .catch((err) => {
      if (err.status === 401 || err.status === 400) setTokens(null);
      throw err;
    })
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
}

/** Authenticated request: refreshes the access token once on 401. */
async function authed(path, options = {}) {
  try {
    return (await send(path, { ...options, auth: true })).data;
  } catch (err) {
    if (err.status !== 401 || !tokens?.refresh) throw err;
    await refreshTokens();
    return (await send(path, { ...options, auth: true })).data;
  }
}

/* ---------- endpoints ---------- */

export const api = {
  async login(email, password) {
    const { data } = await send('/auth/token/', { method: 'POST', body: { email, password } });
    setTokens({ access: data.access, refresh: data.refresh });
    return data;
  },

  register({ email, password, first_name = '', last_name = '', phone_number = '' }) {
    return send('/auth/register/', {
      method: 'POST',
      body: { email, password, first_name, last_name, phone_number },
    }).then((r) => r.data);
  },

  async logout() {
    const refresh = tokens?.refresh;
    setTokens(null);
    if (!refresh) return;
    try {
      await send('/auth/logout/', { method: 'POST', body: { refresh } });
    } catch {
      /* already expired or offline — the local session is gone either way */
    }
  },

  getMe() {
    return authed('/users/me/');
  },

  updateMe(fields) {
    return authed('/users/me/', { method: 'PATCH', body: fields });
  },

  /** Returns { created, email, detail }. */
  async joinWaitlist(email) {
    const { status, data } = await send('/waitlist/', { method: 'POST', body: { email } });
    return { created: status === 201, ...data };
  },
};
