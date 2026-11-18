/* Access/refresh token storage (localStorage, with an in-memory fallback). */

const TOKENS_KEY = 'loveandtails:tokens';

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
