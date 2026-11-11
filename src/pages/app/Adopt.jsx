import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChipTabs, PetCard, SearchField } from '@/components/app/common';
import { Button } from '@/components/ui/button';
import { PETS } from '@/data/pets';
import iconFilter from '@/assets/figma/shell/icon-filter.svg';

/* 04 · Adopt — Figma 1479:600 (1440) / 1479:782 (768) / 1479:923 (390) */

const FILTERS = ['All', 'Dogs', 'Cats', 'Puppies & kittens', 'Near me', 'Verified shelters'];

const MATCHERS = {
  All: () => true,
  Dogs: (p) => p.type === 'dog',
  Cats: (p) => p.type === 'cat',
  'Puppies & kittens': (p) => p.young,
  'Near me': (p) => parseFloat(p.distance) <= 4,
  'Verified shelters': (p) => p.verified,
};

export default function Adopt() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');

  const pets = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PETS.filter(MATCHERS[filter]).filter(
      (p) => !q || `${p.name} ${p.breed}`.toLowerCase().includes(q)
    );
  }, [filter, query]);

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 pt-5 pb-8 md:px-6 md:pt-8 main-xl:px-12">
      <header className="flex flex-col gap-4 md:gap-5 main-xl:flex-row main-xl:items-center">
        <div className="min-w-0 flex-1">
          <h1 className="text-[22px] font-semibold text-ink md:text-[28px]">Find your forever friend</h1>
          <p className="mt-1 hidden text-[15px] text-subtle main-xl:block">
            128 pets near Hyderabad are looking for a home
          </p>
        </div>
        <div className="flex items-center gap-4">
          <SearchField
            placeholder="Search breed, name or area"
            className="flex-1 main-xl:w-[320px] main-xl:flex-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="button"
            aria-label="Filters"
            className="hidden size-10 shrink-0 items-center justify-center rounded-full bg-muted md:flex"
          >
            <img src={iconFilter} alt="" width={24} height={24} />
          </button>
        </div>
      </header>

      <ChipTabs
        options={FILTERS}
        value={filter}
        onChange={setFilter}
        className="-mx-4 mt-4 px-4 md:mx-0 md:mt-5 md:px-0 [&::-webkit-scrollbar]:hidden"
      />

      <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-6 md:mt-5 md:grid-cols-3 md:gap-x-4 md:gap-y-7 main-xl:grid-cols-4">
        {pets.map((pet) => (
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

      {pets.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <p className="text-[15px] text-subtle">No pets match that search yet.</p>
          <Button variant="secondary" size="pill" onClick={() => { setFilter('All'); setQuery(''); }}>
            Clear filters
          </Button>
        </div>
      )}

      <div className="mt-10 flex justify-center">
        <Button asChild variant="outline-brand" size="pill-lg">
          <Link to="/adopt/new">List a pet for adoption</Link>
        </Button>
      </div>
    </div>
  );
}
