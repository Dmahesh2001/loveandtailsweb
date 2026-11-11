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
 *   768+    tablet:  Collapsed sidebar (80px)
 *   1280+   laptop:  Expanded sidebar (248px)
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
        <Sidebar className="fixed inset-y-0 left-0 z-30 hidden md:flex" />
        <div className={cn('md:pl-20 xl:pl-[248px]', showTabBar && 'pb-[60px] md:pb-0')}>
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
