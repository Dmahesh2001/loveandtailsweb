import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crop, Music, Scissors, Smile, SlidersHorizontal, Sparkles, Type, Gauge, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import max from '@/assets/figma/pets/max.jpg';
import eva from '@/assets/figma/pets/eva.jpg';
import bruno from '@/assets/figma/pets/bruno.jpg';
import warm from '@/assets/figma/editor/filter-warm.png';
import golden from '@/assets/figma/editor/filter-golden.png';
import mono from '@/assets/figma/editor/filter-mono.png';
import fade from '@/assets/figma/editor/filter-fade.png';
import iconChevronLeft from '@/assets/figma/shell/icon-chevron-left.svg';

/*
 * Media editor — Figma 1493:3544 (1440 "New reel") / 1493:3615 (768) / 1493:3658 (390 "Edit photo")
 * Filters are applied live to the canvas with CSS filters; intensity scales them.
 */

const TOOLS = [
  { id: 'trim', label: 'Trim', icon: Scissors },
  { id: 'audio', label: 'Audio', icon: Music },
  { id: 'text', label: 'Text', icon: Type },
  { id: 'stickers', label: 'Stickers', icon: Smile },
  { id: 'filters', label: 'Filters', icon: Sparkles },
  { id: 'speed', label: 'Speed', icon: Gauge },
];

const MOBILE_TOOLS = [
  { id: 'crop', label: 'Crop', icon: Crop },
  { id: 'filters', label: 'Filters', icon: Sparkles },
  { id: 'adjust', label: 'Adjust', icon: SlidersHorizontal },
  { id: 'text', label: 'Text', icon: Type },
  { id: 'stickers', label: 'Stickers', icon: Smile },
];

const FILTERS = [
  { id: 'original', label: 'Original', thumb: max, css: () => 'none' },
  { id: 'warm', label: 'Warm', thumb: warm, css: (k) => `sepia(${0.35 * k}) saturate(${1 + 0.3 * k})` },
  { id: 'golden', label: 'Golden', thumb: golden, css: (k) => `sepia(${0.5 * k}) saturate(${1 + 0.5 * k}) brightness(${1 + 0.05 * k})` },
  { id: 'soft', label: 'Soft', thumb: max, css: (k) => `contrast(${1 - 0.15 * k}) brightness(${1 + 0.08 * k})` },
  { id: 'mono', label: 'Mono', thumb: mono, css: (k) => `grayscale(${k})` },
  { id: 'fade', label: 'Fade', thumb: fade, css: (k) => `contrast(${1 - 0.25 * k}) brightness(${1 + 0.15 * k}) saturate(${1 - 0.3 * k})` },
];

const TIMELINE = [max, eva, bruno, max, eva, bruno, max, eva, bruno, max];

function FilterGrid({ filter, setFilter, intensity, setIntensity, compact }) {
  return (
    <div className="flex flex-col gap-3.5">
      <div className={cn('flex gap-3', compact ? 'overflow-x-auto' : 'flex-wrap')}>
        {FILTERS.map((f) => (
          <button key={f.id} type="button" onClick={() => setFilter(f.id)} className="flex shrink-0 flex-col items-start gap-1.5">
            <img
              src={f.thumb}
              alt=""
              className={cn(
                'size-[84px] rounded-xl object-cover',
                f.id === filter && 'border-[3px] border-brand'
              )}
              style={f.thumb === max && f.id !== 'original' ? { filter: f.css(1) } : undefined}
            />
            <span className={cn('text-xs text-ink', f.id === filter ? 'font-semibold' : 'font-medium', compact && 'text-white')}>
              {f.label}
            </span>
          </button>
        ))}
      </div>
      <label className="flex flex-col gap-2">
        <span className={cn('text-sm font-semibold', compact ? 'text-white' : 'text-ink')}>Intensity</span>
        <input
          type="range"
          min={0}
          max={100}
          value={intensity}
          onChange={(e) => setIntensity(Number(e.target.value))}
          className="h-1.5 w-full max-w-[280px] cursor-pointer accent-brand"
        />
      </label>
    </div>
  );
}

export default function MediaEditor() {
  const navigate = useNavigate();
  const [tool, setTool] = useState('filters');
  const [mobileTool, setMobileTool] = useState(null);
  const [filter, setFilter] = useState('golden');
  const [intensity, setIntensity] = useState(70);
  const [saved, setSaved] = useState(false);
  const active = FILTERS.find((f) => f.id === filter);
  const canvasFilter = active.css(intensity / 100);

  return (
    <>
      {/* ---------- Mobile: Edit photo (dark) ---------- */}
      <div className="fixed inset-0 z-40 flex flex-col bg-black text-white md:hidden">
        <header className="flex h-14 items-center justify-between px-4">
          <button type="button" aria-label="Close" onClick={() => navigate(-1)}>
            <X className="size-6" />
          </button>
          <h1 className="text-[17px] font-semibold">Edit photo</h1>
          <button type="button" onClick={() => navigate('/create')} className="text-[17px] font-semibold text-brand">
            Next
          </button>
        </header>
        <div className="relative min-h-0 flex-1">
          <img src={max} alt="" className="size-full object-cover" style={{ filter: canvasFilter }} />
        </div>
        <div className="flex flex-col gap-4 px-4 pt-4 pb-6">
          {mobileTool === 'filters' ? (
            <FilterGrid filter={filter} setFilter={setFilter} intensity={intensity} setIntensity={setIntensity} compact />
          ) : (
            <p className="mx-auto rounded-full bg-white/15 px-4 py-2 text-sm">Pick a tool to start editing</p>
          )}
          <div className="flex justify-between">
            {MOBILE_TOOLS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setMobileTool(mobileTool === id ? null : id)}
                className={cn('flex flex-col items-center gap-1 text-xs', mobileTool === id ? 'text-brand' : 'text-white/70')}
              >
                <Icon className="size-6" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ---------- Tablet / desktop: New reel ---------- */}
      <div className="hidden min-h-svh flex-col bg-white md:flex">
        <header className="flex h-16 items-center gap-3 border-b border-border px-4">
          <button
            type="button"
            aria-label="Back"
            onClick={() => navigate(-1)}
            className="flex size-10 items-center justify-center rounded-full border border-[#e8e8eb] bg-white shadow-[0_2px_5px_rgba(13,18,38,0.08)]"
          >
            <img src={iconChevronLeft} alt="" width={24} height={24} />
          </button>
          <h1 className="flex-1 text-[17px] font-semibold text-ink">New reel</h1>
          <Button variant="ghost" size="pill" onClick={() => setSaved(true)}>
            {saved ? 'Draft saved' : 'Save draft'}
          </Button>
          <Button size="pill" onClick={() => navigate('/create')}>
            Next
          </Button>
        </header>

        <div className="flex flex-1 gap-6 px-6 pt-6 pb-6">
          <nav className="flex flex-col gap-1.5 px-2 py-4" aria-label="Editing tools">
            {TOOLS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTool(id)}
                className={cn(
                  'flex w-[72px] flex-col items-center gap-1 rounded-xl py-2.5 text-xs text-ink',
                  tool === id ? 'bg-[#f6f6f6] font-semibold' : 'font-medium hover:bg-black/[0.03]'
                )}
              >
                <span
                  className={cn(
                    'flex size-7 items-center justify-center rounded-full',
                    tool === id ? 'bg-brand text-white' : 'bg-[#f2f2f3] text-icon'
                  )}
                >
                  <Icon className="size-3.5" />
                </span>
                {label}
              </button>
            ))}
          </nav>

          <div className="flex min-w-0 flex-1 flex-col items-center gap-5">
            <div className="aspect-[380/676] h-[min(676px,calc(100svh-230px))] overflow-hidden rounded-2xl">
              <img src={max} alt="" className="size-full object-cover" style={{ filter: canvasFilter }} />
            </div>
            <div className="flex max-w-full gap-1 overflow-x-auto rounded-[14px] bg-[#f6f6f6] px-3 py-2.5">
              {TIMELINE.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  className={cn(
                    'h-16 w-12 shrink-0 object-cover',
                    i === 0 || i === TIMELINE.length - 1 ? 'rounded-lg' : 'rounded-[2px]'
                  )}
                  style={{ filter: canvasFilter }}
                />
              ))}
            </div>
          </div>

          <aside className="hidden w-[320px] shrink-0 p-5 lg:block">
            {tool === 'filters' ? (
              <>
                <h2 className="mb-3.5 text-[17px] font-semibold text-ink">Filters</h2>
                <FilterGrid filter={filter} setFilter={setFilter} intensity={intensity} setIntensity={setIntensity} />
              </>
            ) : (
              <>
                <h2 className="text-[17px] font-semibold text-ink">{TOOLS.find((t) => t.id === tool).label}</h2>
                <p className="mt-2 text-sm text-subtle">Select a clip in the timeline to use this tool.</p>
              </>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}
