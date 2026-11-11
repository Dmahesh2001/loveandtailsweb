import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChipTabs, PetCard, SearchField } from '@/components/app/common';
import { PETS } from '@/data/pets';
import elena from '@/assets/figma/messages/avatar-elena.png';
import marcus from '@/assets/figma/messages/avatar-marcus.png';
import sarah from '@/assets/figma/messages/avatar-sarah.png';
import julia from '@/assets/figma/messages/avatar-julia.png';
import wade from '@/assets/figma/reels/avatar-wade.png';

/*
 * Search — no dedicated Figma frame; composed from the design system pieces
 * (Search Field, Tab chips, Web / Pet card, people rows from Messages).
 */

const PEOPLE = [
  { id: 'elena', name: 'Elena Vance', meta: 'Paws Rescue volunteer', avatar: elena },
  { id: 'marcus', name: 'Marcus Chen', meta: 'Bruno’s dad · 2 km', avatar: marcus },
  { id: 'sarah', name: 'Sarah Jenkins', meta: 'Eva’s mum · 5 km', avatar: sarah },
  { id: 'julia', name: 'Julia Thorne', meta: 'Dog walker · Jubilee Hills', avatar: julia },
  { id: 'wade', name: 'Wade Warren', meta: '@wadewarren · Reels creator', avatar: wade },
];

const TABS = ['Top', 'Pets', 'People'];

function PersonRow({ person }) {
  const [following, setFollowing] = useState(false);
  return (
    <div className="flex items-center gap-3 py-2">
      <img src={person.avatar} alt="" width={48} height={48} className="size-12 rounded-full" />
      <Link to={`/messages/${person.id}`} className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold text-ink">{person.name}</p>
        <p className="truncate text-[13px] text-subtle">{person.meta}</p>
      </Link>
      <Button
        size="pill"
        variant={following ? 'secondary' : 'outline-brand'}
        onClick={() => setFollowing((f) => !f)}
      >
        {following ? 'Following' : 'Follow'}
      </Button>
    </div>
  );
}

export default function Search() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [tab, setTab] = useState('Top');
  const term = q.trim().toLowerCase();

  const pets = useMemo(
    () => PETS.filter((p) => !term || `${p.name} ${p.breed}`.toLowerCase().includes(term)),
    [term]
  );
  const people = useMemo(
    () => PEOPLE.filter((p) => !term || `${p.name} ${p.meta}`.toLowerCase().includes(term)),
    [term]
  );

  const showPets = tab !== 'People';
  const showPeople = tab !== 'Pets';

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 pt-5 pb-10 md:px-6 md:pt-8 xl:px-12">
      <h1 className="text-[22px] font-semibold text-ink md:text-[28px]">Search</h1>
      <SearchField
        autoFocus
        placeholder="Search pets, people, places"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="mt-4 max-w-[560px]"
      />
      <ChipTabs options={TABS} value={tab} onChange={setTab} className="mt-4" />

      {showPeople && people.length > 0 && (
        <section className="mt-6 max-w-[560px]">
          <h2 className="mb-2 text-[15px] font-semibold text-ink">People</h2>
          {(tab === 'Top' ? people.slice(0, 3) : people).map((p) => (
            <PersonRow key={p.id} person={p} />
          ))}
        </section>
      )}

      {showPets && pets.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-[15px] font-semibold text-ink">Pets looking for a home</h2>
          <div className="grid grid-cols-2 gap-x-3 gap-y-6 md:grid-cols-3 md:gap-x-4 xl:grid-cols-4">
            {(tab === 'Top' ? pets.slice(0, 4) : pets).map((pet) => (
              <PetCard
                key={pet.id}
                name={pet.name}
                age={pet.age}
                meta={`${pet.breed} · ${pet.distance}`}
                photo={pet.photo}
                tag={pet.verified ? 'Verified shelter' : null}
                onClick={() => navigate(`/adopt/${pet.id}`)}
              />
            ))}
          </div>
        </section>
      )}

      {!pets.length && !people.length && (
        <p className="py-16 text-center text-[15px] text-subtle">No results for “{q}”.</p>
      )}
    </div>
  );
}
