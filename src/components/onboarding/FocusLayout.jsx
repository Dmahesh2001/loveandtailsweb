import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

/*
 * Centered full-screen flow (Figma 16 · Badge quiz, 18 · KYC verification):
 * wordmark top-left, optional "Save & exit" top-right, content column centered.
 */
export default function FocusLayout({ children, exitTo, className, header }) {
  return (
    <div className="relative min-h-svh bg-white">
      <div className="hidden items-center justify-between px-12 pt-8 md:flex">
        <Link to="/" className="font-brand text-[26px] leading-normal text-brand">
          Love&amp;Tails
        </Link>
        {exitTo && (
          <Link to={exitTo} className="text-sm font-medium text-subtle hover:text-ink">
            Save &amp; exit
          </Link>
        )}
      </div>
      {header}
      <main className={cn('mx-auto flex w-full flex-col px-4 pb-10 md:px-6', className)}>{children}</main>
    </div>
  );
}
