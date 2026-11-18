/*
 * HTTP client for the LTBackend REST API (Django + SimpleJWT).
 *
 * Base URL comes from VITE_API_URL (see .env.example); defaults to the local
 * Django dev server. A 401 on an authenticated call triggers one token
 * refresh (shared by concurrent callers) and a retry.
 */
import { getTokens, setTokens } from './tokens';

const DEFAULT_API_URL = import.meta.env.PROD
  ? 'https://api.loveandtails.com/api/v1'
  : 'http://localhost:8000/api/v1';

export const API_URL = (import.meta.env.VITE_API_URL || DEFAULT_API_URL).replace(/\/+$/, '');

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

/* ---------- requests ---------- */

export async function send(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const tokens = getTokens();
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
  const tokens = getTokens();
  if (!tokens?.refresh) throw new ApiError(401, null);
  refreshing ??= send('/auth/token/refresh/', { method: 'POST', body: { refresh: tokens.refresh } })
    .then(({ data }) => {
      // Refresh tokens rotate: the response carries a new pair.
      setTokens({ access: data.access, refresh: data.refresh ?? getTokens()?.refresh });
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
export async function authed(path, options = {}) {
  try {
    return (await send(path, { ...options, auth: true })).data;
  } catch (err) {
    if (err.status !== 401 || !getTokens()?.refresh) throw err;
    await refreshTokens();
    return (await send(path, { ...options, auth: true })).data;
  }
}
