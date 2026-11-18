import { useMemo } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ME } from '@/components/app/nav-config';
import { SplashScreen } from '@/pages/public/Splash';
import { useAuthStore } from '@/store/authStore';

export const useAuth = useAuthStore;

/*
 * The signed-in user in the shape the UI already uses (ME in nav-config).
 * Name and email come from the backend; avatar, handle and location aren't
 * stored by the API yet, so they fall back to the placeholder profile.
 */
export function useCurrentUser() {
  const user = useAuthStore((s) => s.user);
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
  const status = useAuthStore((s) => s.status);
  const location = useLocation();
  if (status === 'loading') return <SplashScreen />;
  if (status !== 'authenticated') {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }
  return <Outlet />;
}
