import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

/*
 * "Your liked pets" — Figma 1542:6382 (rail) / 1542:6660 (768).
 * A row whose shelter has replied is highlighted (#fceeed) with a red
 * "Replied" status; a sent request shows grey "Pending".
 */

const VISIBLE = 4;

function LikedRow({ entry }) {
  const { pet, note, status } = entry;
  const replied = status === 'Replied';
  return (
    <li>
      <Link
        to={`/adopt/${pet.id}`}
        className={cn(
          'flex items-center gap-3 rounded-[14px] px-2 py-2.5 transition-colors',
          replied ? 'bg-[#fceeed] hover:bg-[#f9e2e0]' : 'hover:bg-accent'
        )}
      >
        <img src={pet.photo} alt="" className="size-[52px] shrink-0 rounded-xl object-cover" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold text-ink">{pet.name}</p>
          <p className="mt-0.5 truncate text-xs text-subtle">{note}</p>
        </div>
        {status && (
          <span className={cn('shrink-0 text-xs font-semibold', replied ? 'text-brand' : 'text-subtle')}>{status}</span>
        )}
      </Link>
    </li>
  );
}

export default function LikedPets({ liked, className, listClassName }) {
  const [showAll, setShowAll] = useState(false);
  const rows = showAll ? liked : liked.slice(0, VISIBLE);

  return (
    <section className={className}>
      <div className="flex items-center pb-3 font-semibold">
        <h2 className="flex-1 text-[17px] text-ink">Your liked pets</h2>
        <span className="text-sm text-brand">{liked.length}</span>
      </div>
      {liked.length === 0 ? (
        <p className="px-2 py-4 text-sm text-subtle">Pets you like will show up here.</p>
      ) : (
        <ul className={cn('flex flex-col gap-2', listClassName)}>
          {rows.map((entry) => (
            <LikedRow key={entry.pet.id} entry={entry} />
          ))}
        </ul>
      )}
      {liked.length > VISIBLE && (
        <Button
          variant="outline-neutral"
          size="pill-lg"
          className="mt-2 w-full border-[#d1d1d1] font-medium text-black"
          aria-expanded={showAll}
          onClick={() => setShowAll((s) => !s)}
        >
          {showAll ? 'Show fewer' : 'View all liked'}
        </Button>
      )}
    </section>
  );
}
