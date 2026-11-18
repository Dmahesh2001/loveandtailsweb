import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { SplashScreen } from '@/pages/public/Splash';
import { router } from '@/routes';
import { initAuth } from '@/store/authStore';

initAuth();

export default function App() {
  // Top-level routes load lazily; the Figma Splash (1495:13209) covers the wait.
  // Pages inside the app shell use the Loading skeleton instead (see AppShell).
  return (
    <>
      <Suspense fallback={<SplashScreen />}>
        <RouterProvider router={router} />
      </Suspense>
      <Analytics />
    </>
  );
}
