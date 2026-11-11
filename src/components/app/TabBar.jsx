import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import tabHome from '@/assets/figma/shell/tab-home.svg';
import tabSearch from '@/assets/figma/shell/tab-search.svg';
import tabAdopt from '@/assets/figma/shell/tab-adopt.svg';
import tabProfile from '@/assets/figma/shell/tab-profile.svg';
import iconPlus from '@/assets/figma/shell/icon-plus.svg';

/* Web / Tab bar (Figma 1475:165) — mobile web: Home, Search, Create, Adopt, Profile. */
const TABS = [
  { to: '/home', label: 'Home', icon: tabHome },
  { to: '/search', label: 'Search', icon: tabSearch },
  { to: '/create', label: 'Create', create: true },
  { to: '/adopt', label: 'Adopt', icon: tabAdopt },
  { to: '/profile', label: 'Profile', icon: tabProfile },
];

export default function TabBar({ className }) {
  return (
    <nav
      className={cn(
        'flex h-[60px] items-center justify-between border-t border-line bg-white px-5',
        className
      )}
    >
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          aria-label={tab.label}
          className={({ isActive }) =>
            cn('transition-opacity', !tab.create && !isActive && 'opacity-80')
          }
        >
          {tab.create ? (
            <span className="flex h-9 w-12 items-center justify-center rounded-xl bg-brand">
              <img src={iconPlus} alt="" width={22} height={22} className="brightness-0 invert" />
            </span>
          ) : (
            <img src={tab.icon} alt="" width={48} height={48} />
          )}
        </NavLink>
      ))}
    </nav>
  );
}
