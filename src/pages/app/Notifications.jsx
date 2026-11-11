import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ChipTabs } from '@/components/app/common';
import pawsRescue from '@/assets/figma/notifications/avatar-paws-rescue.png';
import elena from '@/assets/figma/messages/avatar-elena.png';
import marcus from '@/assets/figma/messages/avatar-marcus.png';
import sarah from '@/assets/figma/messages/avatar-sarah.png';

/* 10 · Notifications — Figma 1487:2492 (1440) / 1487:2608 (768) / 1487:2712 (390) */

const FILTERS = ['All', 'Adoption', 'Social', 'Reminders'];

const GROUPS = [
  {
    title: 'Today',
    items: [
      {
        id: 1,
        type: 'Adoption',
        avatar: pawsRescue,
        title: 'Paws Rescue accepted your request to adopt Ben',
        detail: 'Start a chat to plan your meet & greet',
        time: '2m',
        unread: true,
        to: '/applications',
      },
      {
        id: 2,
        type: 'Social',
        avatar: elena,
        title: 'Elena Vance liked your post',
        detail: '“First beach day…”',
        time: '1h',
        unread: true,
        to: '/home',
      },
      {
        id: 3,
        type: 'Reminders',
        emoji: '💉',
        emojiBg: 'bg-[#fceeed]',
        title: 'Rabies booster due in 17 days',
        detail: 'Mikel · 18 Oct 2026',
        time: '3h',
        to: '/pets/mikel',
      },
    ],
  },
  {
    title: 'This week',
    items: [
      { id: 4, type: 'Social', avatar: marcus, title: 'Marcus Chen started following you', time: 'Tue', to: '/profile' },
      {
        id: 5,
        type: 'Adoption',
        emoji: '📅',
        emojiBg: 'bg-[#eef2ff]',
        title: 'Meet & greet confirmed',
        detail: 'Sat 16 Aug, 4:00 PM · Hard Rock Cafe',
        time: 'Mon',
        to: '/applications',
      },
      {
        id: 6,
        type: 'Social',
        avatar: sarah,
        title: 'Sarah Jenkins commented on Eva’s photo',
        detail: '“So fluffy! 😍”',
        time: 'Mon',
        to: '/messages/sarah',
      },
    ],
  },
];

function NotificationRow({ item, onOpen }) {
  return (
    <Link
      to={item.to}
      onClick={onOpen}
      className={cn(
        'flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors',
        item.unread ? 'bg-[#fff7f6] hover:bg-[#fdeeec]' : 'hover:bg-black/[0.03]'
      )}
    >
      {item.avatar ? (
        <img src={item.avatar} alt="" width={48} height={48} className="size-12 shrink-0 rounded-full" />
      ) : (
        <span className={cn('flex size-12 shrink-0 items-center justify-center rounded-full text-xl', item.emojiBg)}>
          {item.emoji}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-medium text-ink">{item.title}</p>
        {item.detail && <p className="mt-0.5 truncate text-[13px] text-subtle">{item.detail}</p>}
      </div>
      <span className="shrink-0 text-xs text-subtle">{item.time}</span>
      {item.unread && <span className="size-2 shrink-0 rounded-full bg-brand" aria-label="Unread" />}
    </Link>
  );
}

export default function Notifications() {
  const [filter, setFilter] = useState('All');
  const [read, setRead] = useState(() => new Set());

  return (
    <div className="mx-auto w-full max-w-[728px] px-4 pt-5 pb-10 md:px-6 md:pt-8">
      <h1 className="text-[28px] font-semibold text-ink">Notifications</h1>
      <ChipTabs options={FILTERS} value={filter} onChange={setFilter} className="mt-[18px]" />

      <div className="mt-[18px] flex flex-col gap-2.5">
        {GROUPS.map((group) => {
          const items = group.items.filter((i) => filter === 'All' || i.type === filter);
          if (!items.length) return null;
          return (
            <section key={group.title} className="flex flex-col gap-2.5">
              <h2 className="text-[15px] font-semibold text-ink">{group.title}</h2>
              {items.map((item) => (
                <NotificationRow
                  key={item.id}
                  item={{ ...item, unread: item.unread && !read.has(item.id) }}
                  onOpen={() => setRead((r) => new Set(r).add(item.id))}
                />
              ))}
            </section>
          );
        })}
      </div>
    </div>
  );
}
