import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PAGE_CONTAINER } from '@/components/app/TopBar';
import { Card, ChipTabs, PetRow, PostCard } from '@/components/app/common';
import { Button } from '@/components/ui/button';
import FeedSkeleton from '@/components/app/FeedSkeleton';
import { ME } from '@/components/app/nav-config';
import petMax from '@/assets/figma/pets/max.jpg';
import petEva from '@/assets/figma/pets/eva.jpg';
import petBruno from '@/assets/figma/pets/bruno.jpg';
import petBen from '@/assets/figma/pets/ben.jpg';
import meAvatar from '@/assets/figma/home/me-avatar.png';
import { MOMENTS, formatCount } from '@/data/moments';

/* 01 · Home feed — Figma 1476:141 (1440) / 1476:287 (768) / 1476:390 (390) */

const TABS = ['For you', 'Following', 'Nearby'];

const PETS = [
  { id: 'max', name: 'Max', detail: 'Golden Retriever · 3 km', photo: petMax },
  { id: 'eva', name: 'Eva', detail: 'Shih Tzu · 5 km', photo: petEva },
  { id: 'bruno', name: 'Bruno', detail: 'Border Collie · 6 km', photo: petBruno },
  { id: 'ben', name: 'Ben', detail: 'Golden Retriever · 3 km', photo: petBen },
];

const POSTS = [
  { id: 1 },
  {
    id: 2,
    name: 'Esther Howard',
    meta: 'with Eva · 5h',
    caption: 'Grooming day done. Somebody is very proud of her new bow ✨',
  },
];

function Composer() {
  return (
    <Card className="flex items-center gap-3 px-4 py-3.5">
      <img src={meAvatar} alt={ME.name} width={40} height={40} className="size-10 rounded-full" />
      <Link to="/create" className="min-w-0 flex-1 truncate text-[15px] text-subtle">
        Share a moment with your pet…
      </Link>
      <Button size="pill" asChild>
        <Link to="/create">Post</Link>
      </Button>
    </Card>
  );
}

function PetsNearYou() {
  const navigate = useNavigate();
  return (
    <Card className="flex flex-col gap-4 p-5">
      <div className="flex items-center">
        <h2 className="flex-1 text-[17px] font-semibold text-ink">Looking for a home</h2>
        <Link to="/adopt" className="text-sm font-medium text-brand">
          See all
        </Link>
      </div>
      {PETS.slice(0, 3).map((pet) => (
        <PetRow key={pet.id} {...pet} onMeet={() => navigate(`/adopt/${pet.id}`)} />
      ))}
    </Card>
  );
}

/* Tablet: the right rail collapses into a horizontal strip above the feed. */
function PetsStrip() {
  return (
    <Card className="hidden flex-col gap-3 p-5 md:flex main-xl:hidden">
      <h2 className="text-base font-semibold text-ink">Looking for a home near you</h2>
      <div className="-mx-1 flex gap-4 overflow-x-auto px-1">
        {PETS.map((pet) => (
          <Link key={pet.id} to={`/adopt/${pet.id}`} className="flex shrink-0 flex-col items-center gap-2">
            <img src={pet.photo} alt="" className="size-[112px] rounded-[14px] object-cover" />
            <span className="text-sm font-medium text-ink">{pet.name}</span>
          </Link>
        ))}
      </div>
    </Card>
  );
}

/* Entry point to Moments (vertical feed at /moments). */
function MomentsStrip() {
  return (
    <Card className="flex flex-col gap-3 p-4 md:p-5">
      <div className="flex items-center">
        <h2 className="flex-1 text-base font-semibold text-ink md:text-[17px]">Moments</h2>
        <Link to="/moments" className="text-sm font-medium text-brand">
          Watch all
        </Link>
      </div>
      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 [scrollbar-width:none] md:-mx-5 md:px-5 [&::-webkit-scrollbar]:hidden">
        {MOMENTS.map((m) => (
          <Link
            key={m.id}
            to={`/moments/${m.id}`}
            aria-label={`Moment by ${m.author.name}`}
            className="relative aspect-[9/16] w-[112px] shrink-0 overflow-hidden rounded-[14px] bg-black"
          >
            <img src={m.photo} alt="" className="size-full object-cover transition-transform duration-300 hover:scale-105" />
            <span className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-gradient-to-t from-black/70 to-transparent px-2 pt-8 pb-2 text-white">
              <span className="flex items-center gap-1.5">
                <img src={m.author.avatar} alt="" className="size-5 rounded-full object-cover ring-1 ring-white" />
                <span className="truncate text-[11px] font-semibold">{m.author.user}</span>
              </span>
              <span className="text-[11px] font-medium">♥ {formatCount(m.likes)}</span>
            </span>
          </Link>
        ))}
      </div>
    </Card>
  );
}

function UpcomingMeet() {
  return (
    <Link
      to="/applications"
      className="flex flex-col gap-1.5 rounded-[20px] bg-[#fceeed] p-5 transition-colors hover:bg-[#f9e3e2]"
    >
      <span className="text-[13px] font-medium text-brand">Upcoming meet &amp; greet</span>
      <span className="text-base font-semibold text-ink">Max · Sat 16 Aug, 4:00 PM</span>
      <span className="text-sm text-subtle">Hard Rock Cafe, Jubilee Hills</span>
    </Link>
  );
}

/*
 * 25 · Loading (Figma 1495:13238 / 1495:13316 / 1495:13374): the feed shows its skeleton on the first
 * visit of a session while posts "load" (mock data, so the fetch is simulated). Later visits render at once.
 */
let feedLoaded = false;
function useFirstLoad(ms = 900) {
  const [loading, setLoading] = useState(!feedLoaded);
  useEffect(() => {
    if (!loading) return undefined;
    const t = setTimeout(() => {
      feedLoaded = true;
      setLoading(false);
    }, ms);
    return () => clearTimeout(t);
  }, [loading, ms]);
  return loading;
}

export default function HomeFeed() {
  const [tab, setTab] = useState(TABS[0]);
  const loading = useFirstLoad();

  if (loading) return <FeedSkeleton />;

  return (
    <>
      <h1 className="sr-only">Home</h1>

      <div className={`${PAGE_CONTAINER} px-4 pb-6 md:px-6`}>
        <div className="flex items-start gap-12">
          <main className="flex w-full max-w-[600px] min-w-0 flex-col gap-3 md:gap-5">
            {/* Feed tabs: left-aligned with the feed, pinned while it scrolls (below the 60px mobile header). */}
            <div className="sticky top-[60px] z-10 -mb-3 bg-surface pt-3 pb-3 md:top-0 md:-mb-5 md:pt-6 md:pb-5">
              <ChipTabs options={TABS} value={tab} onChange={setTab} className="max-w-full" />
            </div>
            <div className="hidden main-xl:block">
              <Composer />
            </div>
            <PetsStrip />
            <MomentsStrip />
            {POSTS.map((post) => (
              <PostCard key={post.id} {...post} />
            ))}
          </main>

          <aside className="sticky top-6 mt-6 hidden w-[340px] shrink-0 flex-col gap-5 main-xl:flex">
            <PetsNearYou />
            <UpcomingMeet />
          </aside>
        </div>
      </div>
    </>
  );
}
