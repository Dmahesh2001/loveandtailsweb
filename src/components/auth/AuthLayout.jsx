import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import c1 from '@/assets/figma/pets/luna.jpg';
import c2 from '@/assets/figma/pets/coco.jpg';
import c3 from '@/assets/figma/pets/pip.jpg';
import c4 from '@/assets/figma/auth/collage-4.jpg';
import c5 from '@/assets/figma/pets/shadow.jpg';
import c6 from '@/assets/figma/auth/collage-6.jpg';

/*
 * Photo collage used by Login (1477:383) and Sign up (1490:2516).
 * Desktop: 720×900 panel. Positions are kept as percentages of that frame so
 * the collage scales with the viewport.
 */
const pct = (v, of) => `${(v / of) * 100}%`;
const DESKTOP_TILES = [
  { src: c1, x: 12, y: 22, h: 392 },
  { src: c2, x: 12, y: 466, h: 392 },
  { src: c3, x: 248, y: -18, h: 472 },
  { src: c4, x: 248, y: 426, h: 472 },
  { src: c5, x: 484, y: 22, h: 392 },
  { src: c6, x: 484, y: 466, h: 392 },
];

function DesktopCollage() {
  return (
    <div className="relative hidden h-svh min-h-[640px] w-1/2 shrink-0 overflow-hidden bg-[#f6f6f6] lg:block">
      {DESKTOP_TILES.map((t) => (
        <img
          key={t.src}
          src={t.src}
          alt=""
          className="absolute rounded-[20px] object-cover"
          style={{
            left: pct(t.x, 720),
            top: pct(t.y, 900),
            width: pct(224, 720),
            height: pct(t.h, 900),
          }}
        />
      ))}
      <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-b from-transparent to-black/70" />
      <div className="absolute bottom-[56px] left-12 text-white">
        <p className="font-brand text-[40px] leading-normal">Love&amp;Tails</p>
        <p className="mt-2 text-xl font-medium">Find your forever friend, and their friends too.</p>
      </div>
    </div>
  );
}

/* Tablet (768): four-column banner across the top, logo over the fade. */
function TabletCollage() {
  const tiles = [
    { src: c1, top: 'top-3', h: 'h-[260px]' },
    { src: c2, top: '-top-4', h: 'h-[360px]' },
    { src: c3, top: 'top-3', h: 'h-[300px]' },
    { src: c4, top: '-top-6', h: 'h-[380px]' },
  ];
  return (
    <div className="relative hidden h-[372px] overflow-hidden bg-[#f6f6f6] md:block lg:hidden">
      <div className="grid h-full grid-cols-4 gap-3 px-3">
        {tiles.map((t) => (
          <div key={t.src} className="relative">
            <img src={t.src} alt="" className={cn('absolute inset-x-0 w-full rounded-[20px] object-cover', t.top, t.h)} />
          </div>
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent to-black/60" />
      <p className="absolute bottom-6 left-10 font-brand text-[36px] leading-normal text-white">Love&amp;Tails</p>
    </div>
  );
}

/* Mobile (390): wordmark + a row of four square thumbnails above the form. */
function MobileCollage() {
  return (
    <div className="px-6 pt-6 md:hidden">
      <Link to="/" className="font-brand text-[28px] leading-normal text-brand">
        Love&amp;Tails
      </Link>
      <div className="mt-4 grid grid-cols-4 gap-2">
        {[c1, c2, c3, c4].map((src) => (
          <img key={src} src={src} alt="" className="aspect-square w-full rounded-[14px] object-cover" />
        ))}
      </div>
    </div>
  );
}

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-svh bg-white">
      <DesktopCollage />
      <div className="flex min-w-0 flex-1 flex-col">
        <TabletCollage />
        <MobileCollage />
        <main className="flex flex-1 items-start justify-center px-6 pt-8 pb-10 md:pt-12 lg:items-center lg:py-12">
          <div className="w-full max-w-[400px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
