import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/* Splash — Figma 1495:13209 (1440) / 1495:13213 (768) / 1495:13217 (390) */
export function SplashScreen() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-12 bg-white" role="status" aria-label="Loading Love & Tails">
      <p className="font-brand text-[44px] leading-normal text-brand md:text-[64px]">Love&amp;Tails</p>
      <div className="relative h-1 w-[120px] overflow-hidden rounded-sm bg-[#eaeaeb]">
        <div className="absolute inset-y-0 left-0 w-2/5 animate-[splash_1.2s_ease-in-out_infinite] rounded-sm bg-brand" />
      </div>
    </div>
  );
}

/* /splash route: shows the splash, then continues to `to`. */
export default function Splash({ to = '/', delay = 1600 }) {
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => navigate(to, { replace: true }), delay);
    return () => clearTimeout(t);
  }, [navigate, to, delay]);
  return <SplashScreen />;
}
