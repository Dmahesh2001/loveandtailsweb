import { create } from 'zustand';
import { api, getTokens, onTokensChange } from '@/services';

const LAST_USER_KEY = 'loveandtails:lastUser';

function readLastUser() {
  try {
    const raw = localStorage.getItem(LAST_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function rememberUser(user) {
  const lastUser = { email: user.email, first_name: user.first_name };
  try {
    localStorage.setItem(LAST_USER_KEY, JSON.stringify(lastUser));
  } catch {
    /* ignore */
  }
  return lastUser;
}

/*
 * Session state for the app.
 *   status: 'loading' (checking stored tokens) | 'authenticated' | 'anonymous'
 *   user:   the backend's /users/me/ payload
 */
export const useAuthStore = create((set, get) => ({
  user: null,
  status: getTokens() ? 'loading' : 'anonymous',
  lastUser: readLastUser(),

  login: async (email, password) => {
    await api.login(email, password);
    const me = await api.getMe();
    set({ user: me, status: 'authenticated', lastUser: rememberUser(me) });
    return me;
  },

  register: async (fields) => {
    await api.register(fields);
    return get().login(fields.email, fields.password);
  },

  logout: async () => {
    await api.logout();
    set({ user: null, status: 'anonymous' });
  },

  updateProfile: async (fields) => {
    const me = await api.updateMe(fields);
    set({ user: me, lastUser: rememberUser(me) });
    return me;
  },
}));

/** Restores the session from stored tokens and ends it when a refresh fails. Call once at startup. */
export function initAuth() {
  const { setState } = useAuthStore;

  onTokensChange((tokens) => {
    if (!tokens) setState({ user: null, status: 'anonymous' });
  });

  if (!getTokens()) return;
  api
    .getMe()
    .then((me) => setState({ user: me, status: 'authenticated', lastUser: rememberUser(me) }))
    .catch(() => setState({ status: 'anonymous' }));
}
