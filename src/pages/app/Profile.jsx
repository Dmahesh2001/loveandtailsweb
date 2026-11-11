import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChipTabs } from '@/components/app/common';
import { ME } from '@/components/app/nav-config';
import { MY_BIO, MY_PETS, MY_POSTS, MY_STATS } from '@/data/me';
import cover from '@/assets/figma/shell/post-photo.png';
import avatar from '@/assets/figma/profile/avatar-ria.png';
import iconEdit from '@/assets/figma/shell/icon-edit-white.svg';
import iconShare from '@/assets/figma/shell/icon-share-profile.svg';
import iconBack from '@/assets/figma/shell/icon-back.svg';
import iconMore from '@/assets/figma/shell/icon-more.svg';

/*
 * 05 · Profile — Figma 1480:924 (1440) / 1480:1054 (768) / 1480:1169 (390)
 * Desktop/tablet: cover + overlapping avatar, identity left, "My pets" card right.
 * Mobile: full-bleed portrait hero with the name over a fade, stats card below.
 */

const TABS = ['Posts', 'Media', 'Saved'];

function Badges() {
  return (
    <div className="flex flex-wrap gap-2">
      <span className="rounded-full bg-success-soft px-2.5 py-1 text-xs font-medium text-success">
        Open for adoption
      </span>
      <span className="rounded-full bg-[#eef2ff] px-2.5 py-1 text-xs font-medium text-[#3949ab]">
        Pet owner
      </span>
    </div>
  );
}

function Stats({ className }) {
  return (
    <div className={cn('flex gap-10', className)}>
      {MY_STATS.map(([n, label]) => (
        <div key={label} className="flex flex-col items-center">
          <span className="text-lg font-semibold text-ink">{n}</span>
          <span className="text-[13px] text-subtle">{label}</span>
        </div>
      ))}
    </div>
  );
}

function Actions({ className }) {
  const navigate = useNavigate();
  return (
    <div className={cn('flex gap-2.5', className)}>
      <Button size="pill" className="flex-1 md:flex-none" onClick={() => navigate('/settings')}>
        <img src={iconEdit} alt="" width={18} height={18} />
        Edit profile
      </Button>
      <Button
        size="pill"
        variant="secondary"
        className="flex-1 md:flex-none"
        onClick={() => navigate('/share')}
      >
        <img src={iconShare} alt="" width={18} height={18} />
        Share profile
      </Button>
    </div>
  );
}

function MyPets({ className }) {
  return (
    <div className={cn('flex flex-col gap-3.5 rounded-[20px] bg-[#f6f6f6] px-5 py-[18px]', className)}>
      <div className="flex items-center">
        <h2 className="flex-1 text-base font-semibold text-ink">My pets</h2>
        <Link to="/onboarding" className="text-sm font-medium text-brand">
          + Add pet
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto">
        {MY_PETS.map((pet) => (
          <Link key={pet.id} to={`/pets/${pet.id}`} className="flex w-[88px] shrink-0 flex-col items-center gap-1.5">
            <img src={pet.photo} alt="" width={64} height={64} className="size-16 rounded-full object-cover" />
            <span className="text-sm font-semibold text-ink">{pet.name}</span>
            <span className="w-full truncate text-center text-xs text-subtle">{pet.breed}</span>
          </Link>
        ))}
        <Link to="/onboarding" className="flex w-[88px] shrink-0 flex-col items-center gap-1.5 md:hidden">
          <span className="flex size-16 items-center justify-center rounded-2xl border border-dashed border-[#d1d1d1] bg-white">
            <Plus className="size-6 text-subtle" />
          </span>
          <span className="text-sm font-semibold text-ink">Add pet</span>
          <span className="text-xs text-subtle">New profile</span>
        </Link>
      </div>
    </div>
  );
}

function PostsGrid() {
  const [tab, setTab] = useState('Posts');
  return (
    <section className="flex flex-col gap-4">
      <ChipTabs options={TABS} value={tab} onChange={setTab} />
      {tab === 'Saved' ? (
        <p className="py-12 text-center text-[15px] text-subtle">Posts you save will show up here.</p>
      ) : (
        <div className="grid grid-cols-3 gap-1.5 md:gap-3 xl:grid-cols-4">
          {MY_POSTS.map((src, i) => (
            <div key={i} className="aspect-[267/294] overflow-hidden rounded-lg md:rounded-xl">
              <img src={src} alt="" loading="lazy" className="size-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function MobileHero() {
  const navigate = useNavigate();
  return (
    <div className="relative h-[440px] md:hidden">
      <img src={ME.avatar} alt={ME.name} className="size-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />
      <div className="absolute inset-x-4 top-4 flex items-center justify-between">
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
          onClick={() => navigate('/settings')}
          className="flex size-10 items-center justify-center rounded-full bg-white/25 backdrop-blur"
        >
          <img src={iconMore} alt="" width={24} height={24} className="brightness-0 invert" />
        </button>
      </div>
      <div className="absolute bottom-16 left-5 text-white">
        <h1 className="text-[30px] font-semibold">{ME.name}</h1>
        <p className="text-sm text-white/85">
          {ME.handle} · {ME.location}
        </p>
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <>
      {/* ---------- Mobile ---------- */}
      <div className="md:hidden">
        <MobileHero />
        <div className="relative -mt-10 flex flex-col gap-5 rounded-t-3xl bg-white px-4 pt-4 pb-8">
          <div className="rounded-2xl border border-border p-3">
            <Stats className="justify-around gap-0" />
          </div>
          <p className="text-[15px] text-ink">{MY_BIO}</p>
          <Badges />
          <Actions />
          <MyPets className="bg-transparent px-0 py-0" />
          <PostsGrid />
        </div>
      </div>

      {/* ---------- Tablet / desktop ---------- */}
      <div className="mx-auto hidden w-full max-w-[1200px] px-6 pt-6 pb-12 md:block xl:px-12">
        <div className="relative">
          <div className="h-[180px] overflow-hidden rounded-3xl xl:h-[220px]">
            <img src={cover} alt="" className="size-full object-cover" />
          </div>
          <img
            src={avatar}
            alt={ME.name}
            width={128}
            height={128}
            className="absolute -bottom-16 left-10 size-28 rounded-full xl:size-32"
          />
        </div>

        <div className="mt-[18px] flex justify-end">
          <Actions />
        </div>

        <div className="mt-6 flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex max-w-[520px] flex-col gap-2 pl-10">
            <h1 className="text-[30px] font-semibold text-ink">{ME.name}</h1>
            <p className="text-sm text-subtle">
              {ME.handle} · {ME.location}
            </p>
            <p className="text-[15px] text-ink">{MY_BIO}</p>
            <Badges />
            <Stats className="mt-5" />
          </div>
          <MyPets className="xl:w-[380px]" />
        </div>

        <div className="mt-10">
          <PostsGrid />
        </div>
      </div>
    </>
  );
}
