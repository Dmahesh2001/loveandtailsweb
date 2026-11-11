import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { PetCard, SearchField, TagChip } from '@/components/app/common';
import illusNoResults from '@/assets/figma/search/no-results.png';
import { PETS } from '@/data/pets';
import iconFilter from '@/assets/figma/shell/icon-filter.svg';
import avatarGoldieClub from '@/assets/figma/search/avatar-goldie-club.png';
import avatarOscar from '@/assets/figma/profile/pet-oscar.png';
import avatarHappyTails from '@/assets/figma/profile/pet-bruno.png';
import avatarSunny from '@/assets/figma/search/avatar-sunny.png';
import elena from '@/assets/figma/messages/avatar-elena.png';
import marcus from '@/assets/figma/messages/avatar-marcus.png';
import sarah from '@/assets/figma/messages/avatar-sarah.png';
import julia from '@/assets/figma/messages/avatar-julia.png';
import wade from '@/assets/figma/moments/avatar-wade.png';
import postPointer from '@/assets/figma/search/post-pointer.jpg';
import postGoldenToy from '@/assets/figma/search/post-golden-toy.jpg';
import postBen2 from '@/assets/figma/pets/ben-2.jpg';
import postBen from '@/assets/figma/pets/ben.jpg';
import postLuna from '@/assets/figma/pets/luna.jpg';
import postCoco from '@/assets/figma/pets/coco.jpg';
import postPip from '@/assets/figma/pets/pip.jpg';
import postCollage4 from '@/assets/figma/auth/collage-4.jpg';
import postShadow from '@/assets/figma/pets/shadow.jpg';
import postCollage6 from '@/assets/figma/auth/collage-6.jpg';
import post11 from '@/assets/figma/search/post-11.png';
import post12 from '@/assets/figma/search/post-12.png';

/*
 * Search — Figma "Web 1440 / Search C – Results with tabs" (1530:4388).
 * Search row (back · Search Field · filter), underline tabs, People cards
 * and a 4-column masonry Posts grid. Content column is 720px wide.
 */

const TABS = ['Top', 'Pets', 'People', 'Posts', 'Adopt'];

// `kind: 'pet'` accounts show under the Pets tab; every account shows under People.
const ACCOUNTS = [
  { id: 'goldieclub', name: 'Goldie Club', handle: '@goldieclub', avatar: avatarGoldieClub, tags: 'golden retriever club community' },
  { id: 'oscar', name: 'Oscar', handle: '@oscar.golden', avatar: avatarOscar, kind: 'pet', tags: 'golden retriever dog' },
  { id: 'happytails', name: 'Happy Tails', handle: '@happytails', avatar: avatarHappyTails, tags: 'rescue shelter adoption golden retriever' },
  { id: 'sunny', name: 'Sunny', handle: '@sunny.pup', avatar: avatarSunny, kind: 'pet', tags: 'golden retriever puppy cat' },
  { id: 'elena', name: 'Elena Vance', handle: '@elenavance', avatar: elena, tags: 'paws rescue volunteer' },
  { id: 'marcus', name: 'Marcus Chen', handle: '@marcuschen', avatar: marcus, tags: 'bruno dad dog' },
  { id: 'sarah', name: 'Sarah Jenkins', handle: '@sarahj', avatar: sarah, tags: 'eva mum dog' },
  { id: 'julia', name: 'Julia Thorne', handle: '@juliathorne', avatar: julia, tags: 'dog walker jubilee hills' },
  { id: 'wade', name: 'Wade Warren', handle: '@wadewarren', avatar: wade, tags: 'moments creator' },
];

// Masonry columns exactly as laid out in the frame (photo heights in px).
const POST_COLUMNS = [
  [
    { id: 'p1', photo: postPointer, h: 240, tags: 'pointer dog paw' },
    { id: 'p2', photo: postGoldenToy, h: 180, tags: 'golden retriever toy dog' },
    { id: 'p3', photo: postBen2, h: 300, tags: 'golden retriever dog' },
  ],
  [
    { id: 'p4', photo: postBen, h: 180, tags: 'golden retriever dog' },
    { id: 'p5', photo: postLuna, h: 260, tags: 'tabby cat' },
    { id: 'p6', photo: postCoco, h: 200, tags: 'dog puppy' },
  ],
  [
    { id: 'p7', photo: postPip, h: 260, tags: 'yorkshire terrier dog' },
    { id: 'p8', photo: postCollage4, h: 200, tags: 'puppy dog' },
    { id: 'p9', photo: postShadow, h: 240, tags: 'dog' },
  ],
  [
    { id: 'p10', photo: postCollage6, h: 200, tags: 'puppy golden retriever' },
    { id: 'p11', photo: post11, h: 240, tags: 'jack russell terrier dog' },
    { id: 'p12', photo: post12, h: 180, tags: 'dog' },
  ],
];

const matches = (text, tokens) => !tokens.length || tokens.some((t) => text.toLowerCase().includes(t));

// Matching posts re-flowed into 4 balanced columns (shortest column first).
function flowPosts(posts) {
  const cols = [[], [], [], []];
  const heights = [0, 0, 0, 0];
  for (const p of posts) {
    const i = heights.indexOf(Math.min(...heights));
    cols[i].push(p);
    heights[i] += p.h;
  }
  return cols.filter((c) => c.length);
}

/* Icon Button — Action (Figma 1452:6174): 40px grey circle. */
function IconButton({ icon, label, className, ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        'flex size-10 shrink-0 items-center justify-center rounded-full bg-muted hover:bg-[#e6e6e6]',
        className
      )}
      {...props}
    >
      <img src={icon} alt="" width={24} height={24} />
    </button>
  );
}

function UnderlineTabs({ options, value, onChange }) {
  return (
    <div className="border-b border-[#eaeaeb]">
      <div role="tablist" className="-mb-px flex gap-8 overflow-x-auto pb-[3px]">
        {options.map((opt) => {
          const active = opt === value;
          return (
            <button
              key={opt}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(opt)}
              className="flex shrink-0 flex-col items-center gap-2"
            >
              <span
                className={cn(
                  'text-[15px] leading-[18px]',
                  active ? 'font-semibold text-ink' : 'font-medium text-subtle hover:text-ink'
                )}
              >
                {opt}
              </span>
              <span className={cn('h-[3px] w-7 rounded-[2px]', active ? 'bg-brand' : 'bg-transparent')} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SectionHeader({ title, onSeeAll }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      {onSeeAll && (
        <button type="button" onClick={onSeeAll} className="text-sm font-medium text-brand hover:underline">
          See all
        </button>
      )}
    </div>
  );
}

function AccountCard({ account }) {
  const [following, setFollowing] = useState(false);
  return (
    <div className="flex flex-col items-center gap-2 rounded-[18px] border border-[#eaeaeb] px-2 pt-[18px] pb-4">
      <img src={account.avatar} alt="" width={64} height={64} className="size-16 rounded-full object-cover" />
      <Link to={`/messages/${account.id}`} className="flex max-w-full flex-col items-center gap-2">
        <p className="max-w-full truncate text-[15px] font-semibold text-ink">{account.name}</p>
        <p className="max-w-full truncate text-[13px] text-subtle">{account.handle}</p>
      </Link>
      <Button
        size="pill"
        variant={following ? 'secondary' : 'default'}
        aria-pressed={following}
        onClick={() => setFollowing((f) => !f)}
      >
        {following ? 'Following' : 'Follow'}
      </Button>
    </div>
  );
}

function AccountGrid({ accounts }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {accounts.map((a) => (
        <AccountCard key={a.id} account={a} />
      ))}
    </div>
  );
}

function PostsGrid({ columns }) {
  return (
    <div className="grid grid-cols-2 items-start gap-2.5 sm:grid-cols-4">
      {columns.map((col, i) => (
        <div key={i} className="flex flex-col gap-2.5">
          {col.map((post) => (
            <img
              key={post.id}
              src={post.photo}
              alt=""
              style={{ height: post.h }}
              className="w-full rounded-[14px] object-cover"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

const SUGGESTIONS = ['Golden retriever', 'Puppies near me', 'Labrador', 'Up for adoption'];

/* No results — Figma "Web 1440 / Search D – No results" (1530:4810–4823),
 * illustration from "4 · Final set" → Clay / No search results (1374:2). */
function NoResults({ query, onClear, onSuggest }) {
  return (
    <div className="flex flex-col items-center pt-16 pb-10 text-center">
      <div className="flex w-[292px] max-w-full flex-col items-center gap-6">
        <img src={illusNoResults} alt="" width={160} height={160} className="size-40 rounded-3xl object-contain" />
        <div className="flex flex-col gap-2 tracking-[-0.3px]">
          <h2 className="text-xl font-medium text-black">No results found</h2>
          <p className="text-base text-[#9ca3af]">
            {query ? `Nothing matches “${query}”. ` : 'Nothing here yet. '}
            Try another word or clear your filters.
          </p>
        </div>
      </div>
      <Button size="pill-lg" className="mt-8 w-[198px]" onClick={onClear}>
        Clear search
      </Button>
      <h3 className="mt-11 text-base font-semibold text-ink">Try searching for</h3>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {SUGGESTIONS.map((s) => (
          <TagChip key={s} onClick={() => onSuggest(s)}>
            {s}
          </TagChip>
        ))}
      </div>
    </div>
  );
}

export default function Search() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get('q') ?? '');
  const [tab, setTab] = useState('Top');
  const tokens = q.trim().toLowerCase().split(/\s+/).filter(Boolean);

  const accounts = ACCOUNTS.filter((a) => matches(`${a.name} ${a.handle} ${a.tags}`, tokens));
  const petAccounts = accounts.filter((a) => a.kind === 'pet');
  const postColumns = tokens.length
    ? flowPosts(POST_COLUMNS.flat().filter((p) => matches(p.tags, tokens)))
    : POST_COLUMNS;
  const listings = PETS.filter((p) => matches(`${p.name} ${p.breed} ${p.type}`, tokens));

  const empty =
    (tab === 'Top' && !accounts.length && !postColumns.length) ||
    (tab === 'Pets' && !petAccounts.length) ||
    (tab === 'People' && !accounts.length) ||
    (tab === 'Posts' && !postColumns.length) ||
    (tab === 'Adopt' && !listings.length);

  return (
    <div className="mx-auto w-full max-w-[768px] px-4 pt-4 pb-10 md:px-6 md:pt-8">
      <div className="flex items-center gap-2.5">
        <SearchField
          autoFocus
          placeholder="Search pets, people, places"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onClear={() => setQ('')}
          className="min-w-0 flex-1"
        />
        <IconButton icon={iconFilter} label="Filters" />
      </div>

      <div className="mt-5">
        <UnderlineTabs options={TABS} value={tab} onChange={setTab} />
      </div>

      {tab === 'Top' && accounts.length > 0 && (
        <section className="mt-6">
          <SectionHeader title="People" onSeeAll={() => setTab('People')} />
          <div className="mt-3.5">
            <AccountGrid accounts={accounts.slice(0, 4)} />
          </div>
        </section>
      )}

      {tab === 'Top' && postColumns.length > 0 && (
        <section className={accounts.length ? 'mt-14' : 'mt-6'}>
          <SectionHeader title="Posts" onSeeAll={() => setTab('Posts')} />
          <div className="mt-3.5">
            <PostsGrid columns={postColumns} />
          </div>
        </section>
      )}

      {(tab === 'People' || tab === 'Pets') && !empty && (
        <section className="mt-6">
          <AccountGrid accounts={tab === 'Pets' ? petAccounts : accounts} />
        </section>
      )}

      {tab === 'Posts' && !empty && (
        <section className="mt-6">
          <PostsGrid columns={postColumns} />
        </section>
      )}

      {tab === 'Adopt' && !empty && (
        <section className="mt-6 grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3">
          {listings.map((pet) => (
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
        </section>
      )}

      {empty && (
        <NoResults
          query={q.trim()}
          onClear={() => {
            setQ('');
            setTab('Top');
          }}
          onSuggest={(s) => {
            setQ(s);
            setTab('Top');
          }}
        />
      )}
    </div>
  );
}
