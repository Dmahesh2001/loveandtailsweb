import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChipTabs } from '@/components/app/common';
import { getMyPet } from '@/data/me';
import NotFound from '@/pages/NotFound';
import iconEdit from '@/assets/figma/shell/icon-edit-white.svg';
import iconShare from '@/assets/figma/shell/icon-share-18.svg';
import iconBack from '@/assets/figma/shell/icon-back.svg';
import iconMore from '@/assets/figma/shell/icon-more.svg';

/*
 * 08 · My pet’s profile — Figma 1484:1520 (1440) / 1484:1643 (768) / 1484:1750 (390)
 * Desktop/tablet: square photo + info, Moments/Health/Documents tabs, moments grid.
 * Mobile: full-bleed hero with name and actions, then moments grid and About card.
 */

const TABS = ['Moments', 'Health', 'Documents'];

function Tag({ children }) {
  return <span className="rounded-full bg-muted px-4 py-2 text-xs leading-4 text-[#4a546c]">{children}</span>;
}

function MomentsGrid({ pet }) {
  return (
    <div className="grid grid-cols-3 gap-1.5 md:gap-3 xl:grid-cols-4">
      {pet.moments.map((src, i) => (
        <div key={i} className="aspect-square overflow-hidden rounded-[10px] md:rounded-[14px]">
          <img src={src} alt="" loading="lazy" className="size-full object-cover" />
        </div>
      ))}
    </div>
  );
}

function HealthList() {
  const rows = [
    ['Rabies booster', 'Due 18 Oct 2026', 'text-brand'],
    ['DHPP vaccine', 'Done · 2 Feb 2026', 'text-success'],
    ['Deworming', 'Done · 10 Jan 2026', 'text-success'],
  ];
  return (
    <ul className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-white">
      {rows.map(([name, when, tone]) => (
        <li key={name} className="flex items-center justify-between px-4 py-3.5">
          <span className="text-[15px] font-medium text-ink">{name}</span>
          <span className={cn('text-[13px] font-medium', tone)}>{when}</span>
        </li>
      ))}
    </ul>
  );
}

function TabBody({ tab, pet }) {
  if (tab === 'Health') return <HealthList />;
  if (tab === 'Documents')
    return (
      <div className="flex flex-col items-start gap-3 rounded-2xl bg-[#f6f6f6] p-5">
        <p className="text-[15px] text-ink">Vaccination records, vet reports and adoption papers for {pet.name}.</p>
        <Button asChild size="pill">
          <Link to={`/pets/${pet.id}/documents`}>Open documents</Link>
        </Button>
      </div>
    );
  return <MomentsGrid pet={pet} />;
}

function Actions({ pet, light }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-wrap gap-2.5">
      <Button
        size="pill"
        className={cn(light && 'bg-white text-ink hover:bg-white/90')}
        onClick={() => navigate(`/pets/${pet.id}/edit`)}
      >
        <img src={iconEdit} alt="" width={18} height={18} className={cn(light && 'brightness-0')} />
        Edit pet
      </Button>
      <Button
        size="pill"
        variant="secondary"
        className={cn(light && 'bg-white/25 text-white backdrop-blur hover:bg-white/35')}
        onClick={() => navigate('/share')}
      >
        <img src={iconShare} alt="" width={18} height={18} className={cn(light && 'brightness-0 invert')} />
        Share
      </Button>
      {!light && (
        <Button asChild size="pill" variant="outline-neutral" className="border-[#d1d1d1]">
          <Link to={`/pets/${pet.id}/documents`}>Documents</Link>
        </Button>
      )}
    </div>
  );
}

export default function MyPetProfile() {
  const { petId } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState('Moments');
  const pet = getMyPet(petId);
  if (!pet) return <NotFound />;

  return (
    <>
      {/* ---------- Mobile ---------- */}
      <div className="md:hidden">
        <div className="relative h-[520px]">
          <img src={pet.photo} alt={pet.name} className="size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/70" />
          <div className="absolute inset-x-4 top-3 flex gap-1">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className={cn('h-[3px] flex-1 rounded-full', i === 0 ? 'bg-white' : 'bg-white/40')} />
            ))}
          </div>
          <div className="absolute inset-x-4 top-7 flex justify-between">
            <button
              type="button"
              aria-label="Back"
              onClick={() => navigate(-1)}
              className="flex size-10 items-center justify-center rounded-full bg-white/25 backdrop-blur"
            >
              <img src={iconBack} alt="" width={24} height={24} className="brightness-0 invert" />
            </button>
            <button
              type="button"
              aria-label="More"
              className="flex size-10 items-center justify-center rounded-full bg-white/25 backdrop-blur"
            >
              <img src={iconMore} alt="" width={24} height={24} className="brightness-0 invert" />
            </button>
          </div>
          <div className="absolute bottom-14 left-5 flex flex-col gap-2 text-white">
            <h1 className="text-[34px] leading-tight font-semibold">{pet.name}</h1>
            <p className="text-sm text-white/85">
              {pet.breed} · {pet.age}
            </p>
            <div className="mt-2">
              <Actions pet={pet} light />
            </div>
          </div>
        </div>

        <div className="relative -mt-8 flex flex-col gap-4 rounded-t-3xl bg-white px-4 pt-6 pb-8">
          <div className="flex items-center">
            <h2 className="flex-1 text-lg font-semibold text-ink">
              Moments <span className="text-sm font-normal text-subtle">{pet.stats[0][0]}</span>
            </h2>
            <Link
              to="/create"
              className="flex items-center gap-1 rounded-full bg-brand-soft px-3 py-1.5 text-[13px] font-medium text-brand"
            >
              <Plus className="size-3.5" /> Add moment
            </Link>
          </div>
          <MomentsGrid pet={pet} />
          <div className="flex flex-col gap-3 rounded-2xl bg-[#f6f6f6] p-4">
            <h3 className="text-base font-semibold text-ink">About {pet.name}</h3>
            <p className="text-sm text-[#4a546c]">{pet.bio}</p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-white px-3 py-1.5 text-xs text-[#4a546c]">{pet.gender}</span>
              <span className="rounded-full bg-white px-3 py-1.5 text-xs text-[#4a546c]">{pet.city}</span>
              <span className="rounded-full bg-white px-3 py-1.5 text-xs text-[#4a546c]">Birthday · {pet.birthday}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Tablet / desktop ---------- */}
      <div className="mx-auto hidden w-full max-w-[1200px] px-6 pt-10 pb-12 md:block xl:px-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-11">
          <img
            src={pet.photo}
            alt={pet.name}
            className="aspect-square w-full max-w-[380px] rounded-[28px] object-cover"
          />
          <div className="flex max-w-[560px] flex-col gap-3.5">
            <h1 className="text-[34px] font-semibold text-ink">{pet.name}</h1>
            <p className="text-[15px] text-subtle">
              {pet.breed} · {pet.age} · {pet.gender}
            </p>
            <div className="flex gap-8">
              {pet.stats.map(([n, l]) => (
                <div key={l} className="flex flex-col">
                  <span className="text-lg font-semibold text-ink">{n}</span>
                  <span className="text-[13px] text-subtle">{l}</span>
                </div>
              ))}
            </div>
            <p className="text-[15px] text-ink">{pet.bio}</p>
            <div className="flex flex-wrap gap-2">
              {pet.tags.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
            <Actions pet={pet} />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4">
          <ChipTabs options={TABS} value={tab} onChange={setTab} />
          <TabBody tab={tab} pet={pet} />
        </div>
      </div>
    </>
  );
}
