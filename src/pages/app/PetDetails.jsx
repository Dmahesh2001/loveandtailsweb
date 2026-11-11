import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Heart, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { getPet } from '@/data/pets';
import NotFound from '@/pages/NotFound';
import iconBack from '@/assets/figma/shell/icon-back.svg';
import iconHeart24 from '@/assets/figma/shell/icon-heart-24.svg';
import iconCheck from '@/assets/figma/shell/icon-check-green.svg';
import iconAdoptWhite from '@/assets/figma/shell/icon-adopt-white.svg';
import iconChat from '@/assets/figma/shell/icon-chat.svg';

/*
 * 07 · Pet details (adopt) — Figma 1482:1188 (1440) / 1482:1343 (768) / 1484:1351 (390)
 * Desktop: gallery + adopt card on the left, info on the right.
 * Tablet / mobile: single column, sticky "Request to adopt" bar on mobile.
 */

function TagChip({ children }) {
  return (
    <span className="rounded-full bg-muted px-4 py-2 text-xs leading-4 text-[#4a546c]">{children}</span>
  );
}

function SectionTitle({ children }) {
  return <h2 className="text-lg font-semibold text-ink">{children}</h2>;
}

function Gallery({ pet, saved, onToggleSave }) {
  const [active, setActive] = useState(0);
  const thumbs = pet.gallery.slice(1, 4);
  return (
    <div className="flex flex-col gap-4">
      <div className="relative h-[300px] overflow-hidden rounded-3xl md:h-[420px]">
        <img src={pet.gallery[active]} alt={pet.name} className="size-full object-cover" />
        <button
          type="button"
          aria-label={saved ? 'Remove from saved' : 'Save'}
          aria-pressed={saved}
          onClick={onToggleSave}
          className="absolute top-5 right-5 flex size-10 items-center justify-center rounded-full bg-muted"
        >
          {saved ? (
            <Heart className="size-6 fill-brand text-brand" strokeWidth={1.8} />
          ) : (
            <img src={iconHeart24} alt="" width={24} height={24} />
          )}
        </button>
      </div>
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        {thumbs.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i + 1 === active ? 0 : i + 1)}
            className={cn(
              'h-[90px] overflow-hidden rounded-2xl ring-offset-2 transition md:h-[124px]',
              active === i + 1 && 'ring-2 ring-brand'
            )}
          >
            <img src={src} alt="" className="size-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

function AdoptCard({ pet, className }) {
  const navigate = useNavigate();
  return (
    <div
      className={cn(
        'flex flex-col gap-3.5 rounded-[20px] border border-border bg-white p-5 shadow-[0_6px_20px_rgba(0,0,0,0.06)]',
        className
      )}
    >
      <p className="text-[13px] text-subtle">Adoption fee</p>
      <p className="text-[26px] font-semibold text-ink">{pet.fee}</p>
      <p className="text-[13px] text-subtle">{pet.feeNote}</p>
      <Button size="pill-lg" className="w-full" onClick={() => navigate('/applications')}>
        <img src={iconAdoptWhite} alt="" width={20} height={20} />
        Request to adopt
      </Button>
      <Button
        variant="outline-neutral"
        size="pill-lg"
        className="w-full border-[#d1d1d1]"
        onClick={() => navigate('/messages/elena')}
      >
        <img src={iconChat} alt="" width={20} height={20} />
        Chat with shelter
      </Button>
      <div className="h-px bg-border" />
      <div className="flex items-center gap-2.5">
        <img src={pet.shelter.avatar} alt="" width={40} height={40} className="size-10 rounded-full" />
        <div>
          <p className="text-sm font-semibold text-ink">{pet.shelter.name}</p>
          <p className="text-xs text-subtle">{pet.shelter.meta}</p>
        </div>
      </div>
    </div>
  );
}

function Info({ pet }) {
  const facts = [
    ['Age', pet.age],
    ['Gender', pet.gender],
    ['Size', pet.size],
    ['Weight', pet.weight],
  ];
  return (
    <div className="flex flex-col gap-[18px]">
      {pet.verified && (
        <span className="w-fit rounded-full bg-success-soft px-2.5 py-1 text-xs font-medium text-success">
          Verified shelter
        </span>
      )}
      <div className="flex items-baseline gap-2">
        <h1 className="text-[30px] font-semibold text-ink md:text-[34px]">{pet.name}</h1>
        <span className="text-lg text-subtle">{pet.age}</span>
      </div>
      <p className="text-[15px] text-subtle">
        {pet.breed} · {pet.city} · {pet.distance}
      </p>
      <div className="grid grid-cols-4 gap-2.5">
        {facts.map(([label, value]) => (
          <div key={label} className="flex flex-col items-center gap-0.5 rounded-[14px] bg-[#f6f6f6] px-2 py-3">
            <span className="text-xs text-subtle">{label}</span>
            <span className="text-base font-semibold text-ink">{value}</span>
          </div>
        ))}
      </div>

      <SectionTitle>About {pet.name}</SectionTitle>
      <p className="text-[15px] text-ink">{pet.about}</p>

      <SectionTitle>Personality</SectionTitle>
      <div className="flex flex-wrap gap-2">
        {pet.personality.map((t) => (
          <TagChip key={t}>{t}</TagChip>
        ))}
      </div>

      <SectionTitle>Health &amp; care</SectionTitle>
      <ul className="flex flex-wrap gap-x-5 gap-y-2.5">
        {pet.health.map((h) => (
          <li key={h} className="flex items-center gap-1.5 text-sm font-medium text-ink">
            <img src={iconCheck} alt="" width={18} height={18} />
            {h}
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-[18px] main-xl:hidden">
        <SectionTitle>Looking for</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {pet.lookingFor.map((t) => (
            <TagChip key={t}>{t}</TagChip>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PetDetails() {
  const { petId } = useParams();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const pet = getPet(petId);

  if (!pet) return <NotFound />;

  return (
    <div className="mx-auto w-full max-w-[1120px] px-4 pt-4 pb-28 md:px-6 md:pt-7 md:pb-12 main-xl:px-12">
      <div className="mb-4 flex items-center gap-4 md:mb-6">
        <button
          type="button"
          aria-label="Back"
          onClick={() => navigate(-1)}
          className="flex size-10 items-center justify-center rounded-full border border-[#e8e8eb] bg-white shadow-[0_2px_5px_rgba(13,18,38,0.08)]"
        >
          <img src={iconBack} alt="" width={24} height={24} />
        </button>
        <nav className="text-sm font-medium text-subtle">
          <Link to="/adopt" className="hover:text-ink">
            Adopt
          </Link>
          <span className="mx-2">/</span>
          <span>{pet.name}</span>
        </nav>
      </div>

      <div className="flex flex-col gap-8 main-xl:flex-row">
        <div className="flex w-full flex-col gap-8 main-xl:w-[560px] main-xl:shrink-0">
          <Gallery pet={pet} saved={saved} onToggleSave={() => setSaved((s) => !s)} />
          <AdoptCard pet={pet} className="hidden main-xl:flex" />
        </div>
        <div className="min-w-0 flex-1 main-xl:max-w-[480px]">
          <Info pet={pet} />
          <AdoptCard pet={pet} className="mt-8 hidden md:flex main-xl:hidden" />
          <div className="mt-8 md:hidden">
            <AdoptCard pet={pet} />
          </div>
        </div>
      </div>

      {/* Mobile action bar (390 frame) */}
      <div className="fixed inset-x-0 bottom-[60px] z-20 flex items-center gap-3 border-t border-line bg-white px-4 py-3 md:hidden">
        <button
          type="button"
          aria-label="Close"
          onClick={() => navigate('/adopt')}
          className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border"
        >
          <X className="size-5 text-icon" />
        </button>
        <Button size="pill-lg" className="flex-1" onClick={() => navigate('/applications')}>
          <img src={iconAdoptWhite} alt="" width={20} height={20} />
          Request to adopt
        </Button>
        <button
          type="button"
          aria-label={saved ? 'Remove from saved' : 'Save'}
          aria-pressed={saved}
          onClick={() => setSaved((s) => !s)}
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-soft"
        >
          <Heart className={cn('size-5 text-brand', saved && 'fill-brand')} />
        </button>
      </div>
    </div>
  );
}
