import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet';
import iconClose from '@/assets/figma/shell/icon-close.svg';

/*
 * Centered modal on tablet/desktop (Figma "Upload modal" 1487:1798),
 * bottom sheet on mobile (Figma "Upload sheet" 1487:2333).
 * Header: title + subtitle + 40px Icon Button close.
 */
export default function ResponsiveModal({ open, onOpenChange, title, description, children, className }) {
  const desktop = useMediaQuery('(min-width: 768px)');

  const header = (Title, Description, Close) => (
    <div className="flex items-center gap-3">
      <div className="min-w-0 flex-1">
        <Title className="text-xl font-semibold text-ink">{title}</Title>
        {description ? (
          <Description className="mt-0.5 text-sm text-subtle">{description}</Description>
        ) : (
          <Description className="sr-only">{title}</Description>
        )}
      </div>
      <Close
        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted"
        aria-label="Close"
      >
        <img src={iconClose} alt="" width={24} height={24} />
      </Close>
    </div>
  );

  if (desktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          showCloseButton={false}
          className={cn(
            'gap-4 rounded-3xl border-0 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.18)] sm:max-w-[480px]',
            className
          )}
        >
          {header(DialogTitle, DialogDescription, DialogClose)}
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className={cn('gap-4 rounded-t-3xl border-0 px-5 pt-3 pb-8', className)}
      >
        <span className="mx-auto h-1 w-10 rounded-full bg-[#d9d9db]" aria-hidden="true" />
        {header(SheetTitle, SheetDescription, SheetClose)}
        {children}
      </SheetContent>
    </Sheet>
  );
}
