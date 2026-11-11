import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import photo from '@/assets/figma/auth/welcome-photo.jpg';
import avatar from '@/assets/figma/auth/welcome-avatar.png';

/*
 * 14 · Welcome back — Figma 1490:2615 (1440) / 1490:2632 (768) / 1490:2646 (390)
 * Desktop: photo left half, card right. Tablet: photo banner on top.
 * Mobile: full-bleed photo with the card content over a dark fade.
 */
export default function WelcomeBack() {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-svh flex-col bg-white lg:flex-row">
      <div className="absolute inset-0 md:relative md:inset-auto md:h-[460px] lg:h-svh lg:w-1/2">
        <img src={photo} alt="" className="size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/85 md:hidden" />
        <Link
          to="/"
          className="absolute top-10 left-1/2 -translate-x-1/2 font-brand text-[28px] leading-normal text-white md:hidden lg:left-12 lg:block lg:translate-x-0 lg:text-[32px]"
        >
          Love&amp;Tails
        </Link>
      </div>

      <main className="relative flex flex-1 flex-col items-center justify-end px-6 pb-10 md:-mt-12 md:justify-start md:pb-12 lg:mt-0 lg:justify-center">
        <div className="flex w-full max-w-[400px] flex-col items-center gap-3.5 text-center">
          <img
            src={avatar}
            alt="Ria"
            width={96}
            height={96}
            className="size-24 rounded-full border-4 border-white object-cover lg:border-0"
          />
          <h1 className="text-[28px] font-semibold text-white md:text-[32px] md:text-ink">Welcome back, Ria</h1>
          <p className="text-[15px] text-white/80 md:text-subtle">
            @riamadrid · Oscar, Eva &amp; Bruno missed you
          </p>
          <div className="h-2.5" />
          <Button size="pill-lg" className="w-full" onClick={() => navigate('/home')}>
            Continue as Ria
          </Button>
          <Button
            variant="ghost"
            size="pill-lg"
            className="w-full text-white hover:bg-white/10 hover:text-white md:text-ink md:hover:bg-accent md:hover:text-ink"
            onClick={() => navigate('/login')}
          >
            Switch account
          </Button>
        </div>
      </main>
    </div>
  );
}
