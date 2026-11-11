import { Suspense } from 'react';
import { Outlet, useMatches } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';
import TabBar from './TabBar';
import FeedSkeleton from './FeedSkeleton';

/*
 * Signed-in layout.
 *   < 768   mobile:  Mobile header (top) + Tab bar (bottom)
 *   768+    desktop: Collapsed sidebar (80px); hovering the logo expands it
 *                    to 248px as an overlay, so the content never shifts.
 *
 * The content column is a size container named "main" (md+). Page layouts use
 * the `main-lg:` / `main-xl:` variants (see index.css) so they respond to the
 * width they actually get rather than to the viewport.
 *
 * A route can opt out of the mobile chrome with
 *   handle: { mobileHeader: false, tabBar: false }
 * and pick a white page background (Figma frames differ) with
 *   handle: { bg: 'white' }
 */
export default function AppShell() {
  const matches = useMatches();
  const handle = Object.assign({}, ...matches.map((m) => m.handle || {}));
  const showMobileHeader = handle.mobileHeader !== false;
  const showTabBar = handle.tabBar !== false;

  return (
    <TooltipProvider delayDuration={300}>
      <div className={cn('min-h-svh', handle.bg === 'white' ? 'bg-white' : 'bg-surface')}>
        <Sidebar id="app-sidebar" className="fixed inset-y-0 left-0 z-30 hidden md:flex" />
        <div
          className={cn(
            'md:@container/main md:pl-20',
            showTabBar && 'pb-[60px] md:pb-0'
          )}
        >
          {showMobileHeader && <MobileHeader className="sticky top-0 z-20 md:hidden" />}
          <Suspense fallback={<FeedSkeleton />}>
            <Outlet />
          </Suspense>
        </div>
        {showTabBar && <TabBar className="fixed inset-x-0 bottom-0 z-30 md:hidden" />}
      </div>
    </TooltipProvider>
  );
}
