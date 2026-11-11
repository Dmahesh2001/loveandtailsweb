import { useState } from 'react';
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
 * Collapsed by default (80px, icons + tooltips). Hovering (or focusing) the
 * logo expands it to 248px with labels, overlaying the page; it collapses again
 * once the pointer leaves the panel.
 * Active page: filled icon + bold label (the Profile avatar gets a ring).
 */
function itemClass(expanded) {
  return cn(
    'relative flex h-12 items-center rounded-xl text-base text-ink transition-colors hover:bg-black/[0.04]',
    expanded ? 'w-full justify-start gap-4 px-3' : 'w-12 justify-center'
  );
}

function NavIcon({ item, active }) {
  if (item.avatar) {
    return (
      <img
        src={ME.avatar}
        alt=""
        className={cn(
          'size-[26px] shrink-0 rounded-xl object-cover',
          active && 'ring-2 ring-brand ring-offset-1 ring-offset-white'
        )}
      />
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

function SidebarItem({ item, expanded }) {
  // Resolve active state up-front: Radix Slot (TooltipTrigger asChild) can't
  // merge NavLink's function-style className.
  const onPage = Boolean(useMatch({ path: item.to, end: false }));
  // Sub-pages that belong to this item's section (e.g. /pets/* under Profile,
  // /applications under Adopt) show it active.
  const inSection = Boolean(useMatch({ path: item.section || item.to, end: false }));
  const isActive = onPage || inSection;

  const link = (
    <NavLink
      to={item.to}
      aria-label={expanded ? undefined : item.label}
      className={cn(itemClass(expanded), isActive ? 'font-semibold' : 'font-normal')}
    >
      <NavIcon item={item} active={isActive} />
      {expanded && <span className="flex-1">{item.label}</span>}
      {item.badge ? (
        expanded ? (
          <span className="rounded-full bg-brand px-[7px] py-0.5 text-[11px] font-semibold text-white">
            {item.badge}
          </span>
        ) : (
          <span className="absolute top-[11px] right-[10px] size-1.5 rounded-full bg-brand ring-2 ring-white" />
        )
      ) : null}
    </NavLink>
  );

  if (expanded) return link;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right">{item.label}</TooltipContent>
    </Tooltip>
  );
}

export default function Sidebar({ className, ...props }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  // Keep it open while the More menu (portalled outside the aside) is open.
  const [menuOpen, setMenuOpen] = useState(false);
  const expanded = hovered || menuOpen;
  // Settings lives under "More" (Figma 19 · Settings shows More as active).
  const moreActive = Boolean(useMatch({ path: '/settings', end: false }));

  return (
    <aside
      {...props}
      onMouseLeave={() => setHovered(false)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setHovered(false);
      }}
      className={cn(
        'flex h-svh flex-col gap-1.5 overflow-hidden border-r border-line bg-white pt-8 pb-6',
        'transition-[width,box-shadow] duration-200 ease-out motion-reduce:transition-none',
        expanded ? 'w-[248px] items-start px-4 shadow-xl' : 'w-20 items-center px-3',
        className
      )}
    >
      <div className={cn('flex w-full items-center', expanded ? 'pl-3' : 'justify-center')}>
        <Link
          to="/home"
          onMouseEnter={() => setHovered(true)}
          onFocus={() => setHovered(true)}
          className={cn(
            'font-brand leading-normal whitespace-nowrap text-brand',
            expanded ? 'text-[28px]' : 'text-xl'
          )}
        >
          {expanded ? 'Love&Tails' : 'L&T'}
        </Link>
      </div>
      {/* Equal flexible spacers above and below keep the nav vertically centred. */}
      <div className="min-h-4 flex-1" />

      <nav className={cn('flex w-full flex-col gap-1.5', expanded ? 'items-stretch' : 'items-center')}>
        {SIDEBAR_NAV.map((item) => (
          <SidebarItem key={item.to} item={item} expanded={expanded} />
        ))}
      </nav>

      <div className="min-h-4 flex-1" />

      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label={expanded ? undefined : 'More'}
            className={cn(itemClass(expanded), 'outline-none', moreActive && 'font-semibold')}
          >
            <img
              src={moreActive ? MORE_ICON_ACTIVE : MORE_ICON}
              alt=""
              width={26}
              height={26}
              className="size-[26px] shrink-0"
            />
            {expanded && <span className="flex-1 text-left">More</span>}
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
