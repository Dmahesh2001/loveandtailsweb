import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import iconBack from '@/assets/figma/shell/icon-back.svg';
import radioOn from '@/assets/figma/shell/radio-on.svg';
import radioOff from '@/assets/figma/shell/radio-off.svg';

/* Progress Bar (Figma 1280:19) — 4px track, brand fill pinned left. */
export function ProgressBar({ value, className }) {
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value * 100)}
      className={cn('h-1 overflow-hidden rounded-full bg-muted', className)}
    >
      <div className="h-full rounded-full bg-brand transition-[width] duration-300" style={{ width: `${value * 100}%` }} />
    </div>
  );
}

/* Option Card (Figma 1280:8) — single-choice row. */
export function OptionCard({ label, selected, onSelect }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        'flex h-14 w-full items-center gap-3 rounded-2xl bg-[#f6f6f6] p-4 text-left transition-colors hover:bg-[#efefef]',
        selected && 'ring-1 ring-brand/30'
      )}
    >
      <span className="flex-1 text-base leading-[22px] font-medium text-black">{label}</span>
      <img src={selected ? radioOn : radioOff} alt="" width={20} height={20} />
    </button>
  );
}

/*
 * Onboarding step template — Figma 06 (1482:1086 / 1482:1123 / 1484:1313).
 * lg+: illustration panel (620/1440) on the left, step on the right, "Save & exit" top-right.
 * < lg: back button + progress + "Next" header, sticky Continue at the bottom.
 */
export default function StepLayout({
  illustration,
  panelTitle,
  panelText,
  stepLabel,
  progress,
  title,
  subtitle,
  children,
  onBack,
  onNext,
  nextLabel = 'Continue',
  nextDisabled,
  exitTo = '/home',
}) {
  const navigate = useNavigate();
  const back = onBack || (() => navigate(-1));

  return (
    <div className="flex min-h-svh bg-white">
      {/* Illustration panel */}
      <aside className="relative hidden w-[43%] max-w-[620px] shrink-0 flex-col items-center justify-center bg-[#fbedea] px-10 lg:flex">
        <Link to="/" className="absolute top-8 left-10 font-brand text-[26px] leading-normal text-brand">
          Love&amp;Tails
        </Link>
        <img src={illustration} alt="" className="aspect-square w-full max-w-[420px] object-contain" />
        <h2 className="mt-4 text-center text-[28px] font-semibold text-ink">{panelTitle}</h2>
        <p className="mt-3 max-w-[500px] text-center text-base text-subtle">{panelText}</p>
      </aside>

      <div className="relative flex min-w-0 flex-1 flex-col">
        <Link
          to={exitTo}
          className="absolute top-9 right-[60px] hidden text-sm font-medium text-subtle hover:text-ink lg:block"
        >
          Save &amp; exit
        </Link>

        {/* Compact header */}
        <header className="flex h-16 items-center gap-4 px-4 md:px-8 lg:hidden">
          <button
            type="button"
            aria-label="Back"
            onClick={back}
            className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[#e8e8eb] bg-white shadow-[0_2px_5px_rgba(13,18,38,0.08)]"
          >
            <img src={iconBack} alt="" width={24} height={24} />
          </button>
          <ProgressBar value={progress} className="mx-auto w-full max-w-[184px]" />
          <button
            type="button"
            onClick={onNext}
            disabled={nextDisabled}
            className="text-[15px] font-semibold text-brand disabled:opacity-40"
          >
            Next
          </button>
        </header>

        <main className="flex flex-1 items-start justify-center px-4 pt-4 pb-28 md:px-8 lg:items-center lg:py-16">
          <div className="flex w-full max-w-[440px] flex-col gap-3.5">
            <ProgressBar value={progress} className="hidden w-full lg:block" />
            {stepLabel && <p className="hidden text-[13px] font-medium text-brand lg:block">{stepLabel}</p>}
            <h1 className="text-2xl font-semibold text-ink lg:text-[30px]">{title}</h1>
            {subtitle && <p className="text-[15px] text-subtle">{subtitle}</p>}
            <div className="h-1.5" />
            {children}
            <div className="mt-2 hidden gap-3 lg:flex">
              <Button variant="ghost" size="pill-lg" onClick={back}>
                Back
              </Button>
              <Button size="pill-lg" className="flex-1" onClick={onNext} disabled={nextDisabled}>
                {nextLabel}
              </Button>
            </div>
          </div>
        </main>

        <div className="fixed inset-x-0 bottom-0 bg-white px-4 pt-3 pb-6 md:px-8 lg:hidden">
          <Button size="pill-lg" className="mx-auto flex w-full max-w-[440px]" onClick={onNext} disabled={nextDisabled}>
            {nextLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
