import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import heroFetch from '@/assets/figma/landing/hero-fetch.jpg';
import heroLabrador from '@/assets/figma/landing/hero-labrador.jpg';
import heroCat from '@/assets/figma/landing/hero-cat.jpg';
import heroCuddle from '@/assets/figma/landing/hero-cuddle.jpg';
import avatarOscar from '@/assets/figma/landing/avatar-oscar.png';
import featureSwim from '@/assets/figma/landing/feature-swim.jpg';
import featureAdopt from '@/assets/figma/pets/max.jpg';
import featurePack from '@/assets/figma/pets/eva.jpg';

/*
 * Landing — Figma 1495:13393 (1440) / 1495:13461 (768) / 1495:13523 (390).
 * Tablet/desktop: marketing page. Mobile: intro carousel ("Share every pawsome moment").
 */

const FEATURES = [
  { title: 'Share the everyday', text: 'Post photos and reels of your pets and follow the ones you love.', photo: featureSwim },
  { title: 'Adopt with confidence', text: 'Verified profiles, document checks and live-photo KYC on every listing.', photo: featureAdopt },
  { title: 'Find your local pack', text: 'Meet-ups, walks and events with pet lovers near you.', photo: featurePack },
];

const SLIDES = [
  {
    title: 'Share every pawsome moment',
    text: 'Post photos and reels of your pet and follow the pets you love.',
    photo: heroFetch,
    badge: { title: 'Oscar learned a new trick!', meta: '@oscar.the.golden · 2m' },
  },
  { title: 'Adopt with confidence', text: FEATURES[1].text, photo: heroLabrador },
  { title: 'Find your local pack', text: FEATURES[2].text, photo: heroCuddle },
  { title: 'Where pets find their people', text: 'Join 50k+ pet parents adopting, sharing and meeting up near you.', photo: heroCat },
];

const STATS = [
  ['50k+', 'pet parents'],
  ['3.2k', 'verified adoptions'],
  ['4.8★', 'app rating'],
];

function Nav() {
  return (
    <nav className="mx-auto flex h-20 w-full max-w-[1440px] items-center gap-6 px-6 lg:px-20">
      <Link to="/" className="font-brand text-[26px] leading-normal text-brand">
        Love&amp;Tails
      </Link>
      <span className="flex-1" />
      <div className="hidden items-center gap-6 text-[15px] font-medium text-ink lg:flex">
        <Link to="/adopt" className="hover:text-brand">Adopt</Link>
        <Link to="/home" className="hover:text-brand">Community</Link>
        <Link to="/adopt/new" className="hover:text-brand">For shelters</Link>
      </div>
      <Button asChild variant="ghost" size="pill">
        <Link to="/login">Log in</Link>
      </Button>
      <Button asChild size="pill">
        <Link to="/signup">Sign up</Link>
      </Button>
    </nav>
  );
}

function Collage() {
  return (
    <div className="relative grid w-full max-w-[560px] grid-cols-2 gap-5">
      <div className="flex flex-col gap-5 pt-[60px]">
        <img src={heroFetch} alt="" className="h-[360px] w-full rounded-3xl object-cover" />
        <img src={heroCuddle} alt="" className="h-[180px] w-full rounded-3xl object-cover" />
      </div>
      <div className="flex flex-col gap-5">
        <img src={heroLabrador} alt="" className="h-[250px] w-full rounded-3xl object-cover" />
        <img src={heroCat} alt="" className="h-[300px] w-full rounded-3xl object-cover" />
      </div>
      <div className="absolute top-[540px] -left-10 flex items-center gap-2.5 rounded-2xl bg-white py-2.5 pr-4 pl-3 shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
        <img src={avatarOscar} alt="" width={36} height={36} className="size-9 rounded-full" />
        <div>
          <p className="text-[13px] font-semibold text-ink">Oscar was adopted 🎉</p>
          <p className="text-xs text-subtle">by the Sharma family · 2h ago</p>
        </div>
      </div>
    </div>
  );
}

function MobileIntro() {
  const navigate = useNavigate();
  const [i, setI] = useState(0);
  const slide = SLIDES[i];
  const last = i === SLIDES.length - 1;
  return (
    <div className="flex min-h-svh flex-col bg-white px-6 pt-5 pb-8 md:hidden">
      <div className="flex items-center justify-between">
        <span className="font-brand text-2xl leading-normal text-brand">Love&amp;Tails</span>
        <Link to="/signup" className="text-[15px] font-medium text-subtle">
          Skip
        </Link>
      </div>
      <div className="relative mt-4 aspect-[342/420] overflow-hidden rounded-3xl">
        <img src={slide.photo} alt="" className="size-full object-cover" />
        {slide.badge && (
          <>
            <div className="absolute top-4 -left-2 flex items-center gap-2.5 rounded-2xl bg-white py-2.5 pr-4 pl-3 shadow-md">
              <img src={avatarOscar} alt="" className="size-9 rounded-full" />
              <div>
                <p className="text-sm font-semibold text-ink">{slide.badge.title}</p>
                <p className="text-xs text-subtle">{slide.badge.meta}</p>
              </div>
            </div>
            <span className="absolute right-3 bottom-[72px] rounded-full bg-white px-3 py-1.5 text-xs font-medium text-brand shadow">
              ♥ 1.2k likes
            </span>
            <span className="absolute bottom-4 left-4 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-ink shadow">
              💬 86 comments
            </span>
          </>
        )}
      </div>
      <h1 className="mt-6 text-[28px] leading-tight font-semibold text-ink">{slide.title}</h1>
      <p className="mt-2 text-[15px] text-subtle">{slide.text}</p>
      <div className="mt-5 flex gap-1.5" aria-label={`Slide ${i + 1} of ${SLIDES.length}`}>
        {SLIDES.map((_, j) => (
          <button
            key={j}
            type="button"
            aria-label={`Go to slide ${j + 1}`}
            onClick={() => setI(j)}
            className={cn('h-1.5 rounded-full transition-all', j === i ? 'w-6 bg-brand' : 'w-1.5 bg-[#d9d9db]')}
          />
        ))}
      </div>
      <div className="flex-1" />
      <Button size="pill-lg" className="mt-8 w-full" onClick={() => (last ? navigate('/signup') : setI(i + 1))}>
        {last ? 'Get started' : 'Next'}
      </Button>
    </div>
  );
}

export default function Landing() {
  return (
    <>
      <MobileIntro />

      <div className="hidden min-h-svh bg-white md:block">
        <Nav />
        <section className="mx-auto flex w-full max-w-[1440px] flex-col gap-16 px-6 pt-16 pb-24 lg:flex-row lg:items-start lg:justify-between lg:px-20 lg:pt-10">
          <div className="flex max-w-[560px] flex-col gap-5 lg:pt-20">
            <span className="w-fit rounded-full bg-[#fceeed] px-3 py-1.5 text-[13px] font-medium text-brand">
              1,200+ pets found homes this year
            </span>
            <h1 className="text-[52px] leading-[1.05] font-semibold text-ink lg:text-[64px]">
              Where pets find
              <br />
              their people.
            </h1>
            <p className="text-lg text-subtle">
              Share everyday moments, meet pet lovers nearby, and adopt with verified, caring families — all in one
              place.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="pill-lg">
                <Link to="/signup">Get started — it’s free</Link>
              </Button>
              <Button asChild variant="outline-neutral" size="pill-lg" className="border-[#d1d1d1]">
                <Link to="/adopt">Browse pets</Link>
              </Button>
            </div>
            <div className="flex gap-8 pt-3">
              {STATS.map(([n, l]) => (
                <div key={l}>
                  <p className="text-[22px] font-semibold text-ink">{n}</p>
                  <p className="text-[13px] text-subtle">{l}</p>
                </div>
              ))}
            </div>
          </div>
          <Collage />
        </section>

        <section className="mx-auto w-full max-w-[1440px] px-6 pb-24 lg:px-20">
          <h2 className="text-[30px] font-semibold text-ink lg:text-[36px]">Everything your pet’s life needs</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {FEATURES.map((f) => (
              <article key={f.title} className="flex flex-col gap-4">
                <img src={f.photo} alt="" className="h-[200px] w-full rounded-[20px] object-cover lg:h-[240px]" />
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-xl font-semibold text-ink">{f.title}</h3>
                  <p className="text-[15px] text-subtle">{f.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <footer className="border-t border-border">
          <div className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center gap-4 px-6 py-8 text-sm text-subtle lg:px-20">
            <span className="font-brand text-xl text-brand">Love&amp;Tails</span>
            <span className="flex-1" />
            <Link to="/coming-soon" className="hover:text-ink">Newsletter</Link>
            <Link to="/settings/help" className="hover:text-ink">Help</Link>
            <span>© {new Date().getFullYear()} Love &amp; Tails</span>
          </div>
        </footer>
      </div>
    </>
  );
}
