import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TopBar, { PAGE_CONTAINER } from '@/components/app/TopBar';
import { Card, ChipTabs, PetRow, PostCard } from '@/components/app/common';
import { Button } from '@/components/ui/button';
import { ME } from '@/components/app/nav-config';
import petMax from '@/assets/figma/pets/max.jpg';
import petEva from '@/assets/figma/pets/eva.jpg';
import petBruno from '@/assets/figma/pets/bruno.jpg';
import petBen from '@/assets/figma/pets/ben.jpg';
import meAvatar from '@/assets/figma/home/me-avatar.png';

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
    <Card className="hidden flex-col gap-3 p-5 md:flex xl:hidden">
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

export default function HomeFeed() {
  const [tab, setTab] = useState(TABS[0]);

  return (
    <>
      <TopBar title="Home" search="Search pets, people, places">
        <ChipTabs options={TABS} value={tab} onChange={setTab} className="ml-5" />
      </TopBar>

      <div className={`${PAGE_CONTAINER} px-4 pt-3 pb-6 md:px-6 md:pt-6 xl:pt-6`}>
        <ChipTabs options={TABS} value={tab} onChange={setTab} className="mb-3 xl:hidden md:mb-5" />

        <div className="flex items-start gap-12">
          <main className="flex w-full max-w-[600px] min-w-0 flex-col gap-3 md:gap-5">
            <div className="hidden xl:block">
              <Composer />
            </div>
            <PetsStrip />
            {POSTS.map((post) => (
              <PostCard key={post.id} {...post} />
            ))}
          </main>

          <aside className="sticky top-[100px] hidden w-[340px] shrink-0 flex-col gap-5 xl:flex">
            <PetsNearYou />
            <UpcomingMeet />
          </aside>
        </div>
      </div>
    </>
  );
}
