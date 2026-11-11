import { cn } from '@/lib/utils';
import { SearchField } from './common';

/*
 * Page top bar (Figma "Top bar" 1476:200): 76px, white, bottom border.
 * Its inner row lines up with the page container below it (pass the same
 * `containerClassName` you use for the page body). Hidden on mobile, where
 * the Mobile header takes over.
 */
export const PAGE_CONTAINER = 'mx-auto w-full max-w-[608px] px-6 main-xl:max-w-[1036px]';

export default function TopBar({
  title,
  titleHidden = false, // keep the <h1> for screen readers but don't show it
  children,
  search,
  right,
  className,
  containerClassName = PAGE_CONTAINER,
}) {
  return (
    <div
      className={cn(
        'sticky top-0 z-20 hidden h-[76px] border-b border-border bg-white md:block',
        className
      )}
    >
      <div className={cn('flex h-full items-center gap-6', containerClassName)}>
        {title && (
          <h1 className={cn('shrink-0 text-[22px] font-semibold text-ink', titleHidden && 'sr-only')}>
            {title}
          </h1>
        )}
        <div className="hidden min-w-0 flex-1 items-center main-xl:flex">{children}</div>
        <div className="flex-1 main-xl:hidden" />
        {search && <SearchField placeholder={search} className="w-[220px] main-xl:w-[340px]" />}
        {right}
      </div>
    </div>
  );
}
