import { Link, NavLink, useMatch, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ME, MORE_ICON, MORE_ICON_ACTIVE, SIDEBAR_NAV } from './nav-config';

/*
 * Web / Sidebar (Figma 1475:152) — Instagram-style.
 * Expanded (248px) on laptop (xl+), Collapsed (80px) on tablet (md–xl).
 * Active page: bold label (and the filled home icon for Home).
 */
const itemBase =
  'relative flex h-12 items-center rounded-xl text-base text-ink transition-colors hover:bg-black/[0.04] ' +
  'justify-center w-12 xl:w-full xl:justify-start xl:gap-4 xl:px-3';

function NavIcon({ item, active }) {
  if (item.avatar && !(active && item.activeIcon)) {
    return (
      <img src={ME.avatar} alt="" className="size-[26px] shrink-0 rounded-xl object-cover" />
    );
  }
  return (
    <img
      src={active && item.activeIcon ? item.activeIcon : item.icon}
      alt=""
      width={26}
      height={26}
      className="size-[26px] shrink-0"
    />
  );
}

function SidebarItem({ item }) {
  // Resolve active state up-front: Radix Slot (TooltipTrigger asChild) can't
  // merge NavLink's function-style className.
  const onPage = Boolean(useMatch({ path: item.to, end: false }));
  // Sub-pages that belong to this item's section (e.g. /pets/* under Profile,
  // /applications under Adopt) show it active. The Profile item keeps the
  // avatar there (Figma 08 · My pet's profile).
  const inSection = Boolean(useMatch({ path: item.section || item.to, end: false }));
  const isActive = onPage || inSection;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <NavLink
          to={item.to}
          className={cn(itemBase, isActive ? 'font-semibold' : 'font-normal')}
        >
          <NavIcon item={item} active={item.avatar ? onPage : isActive} />
          <span className="hidden flex-1 xl:block">{item.label}</span>
          {item.badge ? (
            <>
              {/* Expanded: count pill */}
              <span className="hidden rounded-full bg-brand px-[7px] py-0.5 text-[11px] font-semibold text-white xl:inline">
                {item.badge}
              </span>
              {/* Collapsed: dot */}
              <span className="absolute top-[11px] right-[10px] size-1.5 rounded-full bg-brand ring-2 ring-white xl:hidden" />
            </>
          ) : null}
        </NavLink>
      </TooltipTrigger>
      <TooltipContent side="right" className="xl:hidden">
        {item.label}
      </TooltipContent>
    </Tooltip>
  );
}

export default function Sidebar({ className }) {
  const navigate = useNavigate();
  // Settings lives under "More" (Figma 19 · Settings shows More as active).
  const moreActive = Boolean(useMatch({ path: '/settings', end: false }));

  return (
    <aside
      className={cn(
        'flex h-svh flex-col items-center gap-1.5 border-r border-line bg-white px-3 pt-8 pb-6',
        'w-20 xl:w-[248px] xl:items-start xl:px-4',
        className
      )}
    >
      <Link to="/home" className="font-brand text-xl leading-normal text-brand xl:text-[28px]">
        <span className="xl:hidden">L&amp;T</span>
        <span className="hidden xl:inline">Love&amp;Tails</span>
      </Link>
      <div className="h-7 shrink-0" />

      <nav className="flex w-full flex-col items-center gap-1.5 xl:items-stretch">
        {SIDEBAR_NAV.map((item) => (
          <SidebarItem key={item.to} item={item} />
        ))}
      </nav>

      <div className="flex-1" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button type="button" className={cn(itemBase, 'outline-none', moreActive && 'font-semibold')}>
            <img
              src={moreActive ? MORE_ICON_ACTIVE : MORE_ICON}
              alt=""
              width={26}
              height={26}
              className="size-[26px] shrink-0"
            />
            <span className="hidden flex-1 text-left xl:block">More</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="start" className="w-56">
          <DropdownMenuItem onSelect={() => navigate('/settings')}>Settings</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => navigate('/pets/mikel/documents')}>
            Documents
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => navigate('/applications')}>
            Adoption applications
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => navigate('/settings/accounts')}>
            Switch accounts
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => navigate('/login')} className="text-brand">
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </aside>
  );
}
