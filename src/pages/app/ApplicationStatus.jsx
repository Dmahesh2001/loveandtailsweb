import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import avatarMax from '@/assets/figma/applications/avatar-max.png';
import cafe from '@/assets/figma/applications/cafe.jpg';
import markerDone from '@/assets/figma/shell/marker-done.svg';
import markerCurrent from '@/assets/figma/shell/marker-current.svg';
import iconChatWhite from '@/assets/figma/shell/icon-chat-white.svg';
import iconBack from '@/assets/figma/shell/icon-back.svg';

/* 11 · Application status — Figma 1488:2010 (1440) / 1488:2148 (768) / 1488:2253 (390) */

const STEPS = [
  { title: 'Applied', detail: 'Priya accepted your request', state: 'done' },
  { title: 'Chatted with Priya', detail: 'You talked about Max’s routine', state: 'done' },
  {
    title: 'Meet & greet',
    detail: ['Sat 16 Aug, 4:00 PM', 'Hard Rock Cafe, Jubilee Hills'],
    state: 'current',
    link: { label: 'Get directions', href: 'https://maps.google.com/?q=Hard+Rock+Cafe+Jubilee+Hills' },
  },
  { title: 'Approval', detail: 'Priya decides after you meet', state: 'upcoming' },
  { title: 'Handover', detail: 'Bring Max home', state: 'upcoming' },
];

function Marker({ state }) {
  if (state === 'done') return <img src={markerDone} alt="" width={20} height={20} />;
  if (state === 'current') return <img src={markerCurrent} alt="" width={20} height={20} />;
  return <span className="block size-5 rounded-full border-2 border-[#e8e8eb] bg-white" />;
}

function Timeline() {
  return (
    <ol className="flex flex-col">
      {STEPS.map((step, i) => {
        const last = i === STEPS.length - 1;
        const connectorDone = step.state === 'done';
        return (
          <li key={step.title} className="relative flex gap-4 pb-6 last:pb-0">
            <div className="flex flex-col items-center">
              <Marker state={step.state} />
              {!last && (
                <span
                  className={cn('mt-1 w-0.5 flex-1 rounded-full', connectorDone ? 'bg-brand' : 'bg-[#e8e8eb]')}
                />
              )}
            </div>
            <div className="min-w-0 flex-1 -mt-px">
              <p
                className={cn(
                  'text-base',
                  step.state === 'current' && 'font-semibold text-brand',
                  step.state === 'done' && 'font-medium text-ink',
                  step.state === 'upcoming' && 'font-medium text-[#a8adb8]'
                )}
              >
                {step.title}
              </p>
              <div className={cn('mt-0.5 text-sm', step.state === 'upcoming' ? 'text-[#a8adb8]' : 'text-[#6b7080]')}>
                {[].concat(step.detail).map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
              {step.link && (
                <a
                  href={step.link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1.5 inline-block text-sm font-medium text-brand hover:underline"
                >
                  {step.link.label}
                </a>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function ApplicationCard({ className }) {
  return (
    <div className={cn('flex flex-col items-center', className)}>
      <img src={avatarMax} alt="Max" width={80} height={80} className="size-20 rounded-full" />
      <h2 className="mt-3.5 text-2xl font-semibold text-ink">Max</h2>
      <p className="mt-1 text-sm text-[#6b7080]">Golden Retriever · Priya’s pet</p>
      <span className="mt-3 rounded-full bg-[#e8f7ed] px-3 py-[5px] text-[13px] font-medium text-[#179954]">
        Accepted
      </span>
      <div className="my-8 h-px w-full max-w-[342px] bg-[#e8e8eb]" />
      <div className="w-full max-w-[342px]">
        <Timeline />
      </div>
    </div>
  );
}

function MeetCard({ className }) {
  const navigate = useNavigate();
  return (
    <div className={cn('flex flex-col gap-3.5 rounded-3xl border border-border bg-white p-5', className)}>
      <img src={cafe} alt="" className="h-[180px] w-full rounded-2xl object-cover" />
      <span className="w-fit rounded-full bg-[#fceeed] px-2.5 py-1 text-xs font-medium text-brand">
        Up next · Meet &amp; greet
      </span>
      <p className="text-lg font-semibold text-ink">Hard Rock Cafe, Jubilee Hills</p>
      <p className="text-[15px] text-subtle">Saturday 16 Aug · 4:00 PM</p>
      <div className="flex gap-2.5">
        <Button variant="outline-neutral" size="pill" className="flex-1 border-[#d1d1d1]">
          Reschedule
        </Button>
        <Button asChild variant="outline-neutral" size="pill" className="flex-1 border-[#d1d1d1]">
          <a href={STEPS[2].link.href} target="_blank" rel="noreferrer">
            Directions
          </a>
        </Button>
      </div>
      <Button size="pill-lg" className="w-full" onClick={() => navigate('/messages/elena')}>
        <img src={iconChatWhite} alt="" width={20} height={20} />
        Chat with Priya
      </Button>
    </div>
  );
}

export default function ApplicationStatus() {
  const navigate = useNavigate();
  return (
    <>
      {/* ---------- Mobile ---------- */}
      <div className="flex min-h-svh flex-col bg-white md:hidden">
        <header className="relative flex h-[60px] items-center justify-center px-4">
          <button
            type="button"
            aria-label="Back"
            onClick={() => navigate(-1)}
            className="absolute left-4 flex size-10 items-center justify-center rounded-full border border-[#e8e8eb] bg-white shadow-[0_2px_5px_rgba(13,18,38,0.08)]"
          >
            <img src={iconBack} alt="" width={24} height={24} />
          </button>
          <h1 className="text-[17px] font-semibold text-ink">Application</h1>
        </header>
        <ApplicationCard className="flex-1 px-6 pt-4" />
        <div className="sticky bottom-0 bg-white px-6 pt-4 pb-6">
          <Button size="pill-lg" className="w-full" onClick={() => navigate('/messages/elena')}>
            Chat with Priya
          </Button>
        </div>
      </div>

      {/* ---------- Tablet / desktop ---------- */}
      <div className="mx-auto hidden w-full max-w-[1200px] px-6 pt-9 pb-12 md:block xl:px-12">
        <div className="flex items-center gap-3">
          <h1 className="text-[28px] font-semibold text-ink">Max’s application</h1>
          <Link to="/adopt" className="ml-auto text-sm font-medium text-brand hover:underline xl:hidden">
            Browse pets
          </Link>
        </div>
        <div className="mt-6 flex flex-col gap-8 xl:flex-row xl:items-start">
          <ApplicationCard className="rounded-3xl border border-border bg-white px-6 pt-7 pb-10 xl:w-[560px]" />
          <MeetCard className="xl:w-[400px]" />
        </div>
      </div>
    </>
  );
}
