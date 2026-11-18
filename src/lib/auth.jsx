import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ME } from '@/components/app/nav-config';
import { SplashScreen } from '@/pages/Splash';
import { api, getTokens, onTokensChange } from './api';

const LAST_USER_KEY = 'loveandtails:lastUser';

const AuthContext = createContext(null);

function readLastUser() {
  try {
    const raw = localStorage.getItem(LAST_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function rememberUser(user) {
  try {
    if (user) localStorage.setItem(LAST_USER_KEY, JSON.stringify({ email: user.email, first_name: user.first_name }));
  } catch {
    /* ignore */
  }
}

/*
 * Session state for the app.
 *   status: 'loading' (checking stored tokens) | 'authenticated' | 'anonymous'
 *   user:   the backend's /users/me/ payload
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(() => (getTokens() ? 'loading' : 'anonymous'));

  // Restore the session from stored tokens on first load.
  useEffect(() => {
    if (!getTokens()) return;
    let cancelled = false;
    api
      .getMe()
      .then((me) => {
        if (cancelled) return;
        setUser(me);
        rememberUser(me);
        setStatus('authenticated');
      })
      .catch(() => {
        if (cancelled) return;
        setStatus('anonymous');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // A failed refresh clears the tokens: end the session everywhere.
  useEffect(
    () =>
      onTokensChange((tokens) => {
        if (!tokens) {
          setUser(null);
          setStatus('anonymous');
        }
      }),
    []
  );

  const login = useCallback(async (email, password) => {
    await api.login(email, password);
    const me = await api.getMe();
    setUser(me);
    rememberUser(me);
    setStatus('authenticated');
    return me;
  }, []);

  const register = useCallback(
    async (fields) => {
      await api.register(fields);
      return login(fields.email, fields.password);
    },
    [login]
  );

  const logout = useCallback(async () => {
    await api.logout();
    setUser(null);
    setStatus('anonymous');
  }, []);

  const updateProfile = useCallback(async (fields) => {
    const me = await api.updateMe(fields);
    setUser(me);
    rememberUser(me);
    return me;
  }, []);

  const value = useMemo(
    () => ({ user, status, login, register, logout, updateProfile, lastUser: readLastUser() }),
    [user, status, login, register, logout, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

/*
 * The signed-in user in the shape the UI already uses (ME in nav-config).
 * Name and email come from the backend; avatar, handle and location aren't
 * stored by the API yet, so they fall back to the placeholder profile.
 */
export function useCurrentUser() {
  const { user } = useAuth();
  return useMemo(() => {
    if (!user) return ME;
    const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ');
    const emailName = user.email.split('@')[0];
    return {
      ...ME,
      id: user.id,
      email: user.email,
      phone: user.phone_number,
      name: fullName || emailName,
      firstName: user.first_name || emailName,
      handle: `@${emailName}`,
      location: '',
    };
  }, [user]);
}

/** Route guard for signed-in pages: sends visitors to /login and back afterwards. */
export function RequireAuth() {
  const { status } = useAuth();
  const location = useLocation();
  if (status === 'loading') return <SplashScreen />;
  if (status !== 'authenticated') {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }
  return <Outlet />;
}
