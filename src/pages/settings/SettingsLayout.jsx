import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';
import { ME } from '@/components/app/nav-config';
import { MY_PETS } from '@/data/me';
import iconBack from '@/assets/figma/shell/icon-back.svg';
import notificationsIcon from '@/assets/figma/shell/header-notifications.svg';
import EditProfile from './EditProfile';

/*
 * 19 · Settings — Figma 1491:3068 (1440) / 1491:3214 (768): settings menu + detail pane.
 * Mobile: 1491:3348 "Profile menu" (Account hub) at /settings, detail pages full screen.
 */

export const SETTINGS_GROUPS = [
  {
    title: 'Account',
    items: [
      { label: 'Edit profile', to: '/settings/profile' },
      { label: 'Switch accounts', to: '/settings/accounts' },
      { label: 'Verification', to: '/kyc' },
    ],
  },
  {
    title: 'Pets',
    items: [
      { label: 'My pets', to: '/profile' },
      { label: 'Documents', to: '/pets/mikel/documents' },
      { label: 'Adoption listings', to: '/adopt/new' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { label: 'Notifications', to: '/settings/notifications' },
      { label: 'Privacy', to: '/settings/privacy' },
      { label: 'Language', to: '/settings/language' },
    ],
  },
  {
    title: 'Support',
    items: [
      { label: 'Help centre', to: '/settings/help' },
      { label: 'Log out', to: '/login', danger: true },
    ],
  },
];

function SettingsMenu({ className, highlightRoot = true }) {
  const { pathname } = useLocation();
  return (
    <nav className={cn('flex flex-col gap-5', className)}>
      {SETTINGS_GROUPS.map((g) => (
        <div key={g.title} className="flex flex-col gap-0.5">
          <p className="mb-0.5 text-[11px] font-medium tracking-wide text-subtle uppercase">{g.title}</p>
          {g.items.map((item) => {
            const active =
              pathname === item.to ||
              (highlightRoot && item.to === '/settings/profile' && pathname === '/settings');
            return (
              <NavLink
                key={item.label}
                to={item.to}
                className={cn(
                  'flex items-center rounded-xl px-3 py-2.5 text-[15px] transition-colors hover:bg-black/[0.03]',
                  active ? 'bg-[#f6f6f6] font-semibold text-ink' : 'text-ink',
                  item.danger && 'text-brand'
                )}
              >
                {item.label}
              </NavLink>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

/* Mobile Account hub (Figma 1491:3348). */
function AccountHub() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-5 bg-[#fafafa] px-4 pt-6 pb-10">
      <div className="flex items-center">
        <h1 className="flex-1 text-2xl font-semibold text-ink">Account</h1>
        <Link to="/notifications" aria-label="Notifications" className="-mr-2">
          <img src={notificationsIcon} alt="" width={48} height={48} />
        </Link>
      </div>

      <Link to="/settings/profile" className="flex items-center gap-3 rounded-2xl border border-border bg-white p-4">
        <img src={ME.avatar} alt="" className="size-12 rounded-full object-cover" />
        <span className="min-w-0 flex-1">
          <span className="block text-lg font-semibold text-ink">{ME.name}</span>
          <span className="block truncate text-sm text-subtle">{ME.handle}</span>
        </span>
        <ChevronRight className="size-5 text-icon" />
      </Link>

      <div className="grid grid-cols-2 gap-3">
        <Link to="/profile" className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-4">
          <span className="text-2xl" aria-hidden="true">❤️</span>
          <span className="text-base font-medium text-ink">Saved</span>
        </Link>
        <Link to="/profile" className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-4">
          <span className="flex -space-x-2">
            {MY_PETS.map((p) => (
              <img key={p.id} src={p.photo} alt="" className="size-7 rounded-full border-2 border-white object-cover" />
            ))}
          </span>
          <span className="text-base font-medium text-ink">Following</span>
        </Link>
      </div>

      <section className="flex flex-col gap-3">
        <button type="button" onClick={() => navigate('/profile')} className="flex items-center text-left">
          <h2 className="flex-1 text-base font-semibold text-ink">My pets</h2>
          <ChevronRight className="size-5 text-icon" />
        </button>
        <div className="-mx-4 flex gap-3 overflow-x-auto px-4">
          {MY_PETS.map((p) => (
            <Link
              key={p.id}
              to={`/pets/${p.id}`}
              className="flex w-[130px] shrink-0 flex-col items-center gap-1 rounded-2xl border border-border bg-white p-2 pb-3"
            >
              <img src={p.photo} alt="" className="aspect-square w-full rounded-xl object-cover" />
              <span className="mt-1 text-sm font-semibold text-ink">{p.name}</span>
              <span className="text-xs text-subtle">{p.breed}</span>
            </Link>
          ))}
        </div>
      </section>

      <div className="rounded-2xl border border-border bg-white px-4 py-2">
        <SettingsMenu highlightRoot={false} />
      </div>
    </div>
  );
}

export default function SettingsLayout() {
  const desktop = useMediaQuery('(min-width: 768px)');
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const atRoot = pathname === '/settings';

  if (!desktop) {
    if (atRoot) return <AccountHub />;
    return (
      <div className="min-h-svh bg-white">
        <header className="flex h-[60px] items-center gap-3 px-4">
          <button
            type="button"
            aria-label="Back"
            onClick={() => navigate('/settings')}
            className="flex size-10 items-center justify-center rounded-full border border-[#e8e8eb] bg-white shadow-[0_2px_5px_rgba(13,18,38,0.08)]"
          >
            <img src={iconBack} alt="" width={24} height={24} />
          </button>
        </header>
        <div className="px-4 pb-10">
          <Outlet />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh bg-white">
      <aside className="w-[260px] shrink-0 border-r border-border px-5 pt-7 pb-8 xl:w-[300px]">
        <h1 className="mb-5 text-2xl font-semibold text-ink">Settings</h1>
        <SettingsMenu />
      </aside>
      <div className="min-w-0 flex-1 px-8 pt-10 pb-12 xl:px-[92px]">
        <div className="max-w-[600px]">{atRoot ? <EditProfile /> : <Outlet />}</div>
      </div>
    </div>
  );
}
