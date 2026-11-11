import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Crop, Music, Scissors, Smile, SlidersHorizontal, Sparkles, Type, Gauge, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { photoFilter } from '@/lib/photo-filters';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useObjectUrl } from '@/hooks/use-object-url';
import { Button } from '@/components/ui/button';
import max from '@/assets/figma/pets/max.jpg';
import editPhoto from '@/assets/figma/editor/edit-photo.jpg';
import eva from '@/assets/figma/pets/eva.jpg';
import bruno from '@/assets/figma/pets/bruno.jpg';
import warm from '@/assets/figma/editor/filter-warm.png';
import golden from '@/assets/figma/editor/filter-golden.png';
import mono from '@/assets/figma/editor/filter-mono.png';
import fade from '@/assets/figma/editor/filter-fade.png';
import iconChevronLeft from '@/assets/figma/shell/icon-chevron-left.svg';

/*
 * Media editor — Figma 1493:3544 (1440 "New reel", shown as "New moment") / 1493:3615 (768) / 1493:3658 (390 "Edit photo")
 * Filters are applied live to the canvas with CSS filters; intensity scales them.
 *
 * Entry points:
 *   - Moments "+" → new moment with the sample clip.
 *   - Create post → photo picked (router state `{ file, from: 'post', draft }`), or "Edit" on the preview.
 * "Next" returns to /create with `{ file | src, filterId, intensity, draft }` so the post preview keeps the edit.
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

// Figma thumbnails are pre-rendered for the sample clip; a user's own photo gets live-filtered thumbs instead.
const FILTERS = [
  { id: 'original', label: 'Original', thumb: max },
  { id: 'warm', label: 'Warm', thumb: warm },
  { id: 'golden', label: 'Golden', thumb: golden },
  { id: 'soft', label: 'Soft', thumb: null },
  { id: 'mono', label: 'Mono', thumb: mono },
  { id: 'fade', label: 'Fade', thumb: fade },
];

const TIMELINE = [max, eva, bruno, max, eva, bruno, max, eva, bruno, max];

function FilterGrid({ filter, setFilter, intensity, setIntensity, compact, src, sample }) {
  return (
    <div className="flex flex-col gap-3.5">
      <div className={cn('flex gap-3', compact ? 'overflow-x-auto' : 'flex-wrap')}>
        {FILTERS.map((f) => (
          <button key={f.id} type="button" onClick={() => setFilter(f.id)} className="flex shrink-0 flex-col items-start gap-1.5">
            <img
              src={sample && f.thumb ? f.thumb : src}
              alt=""
              className={cn(
                'size-[84px] rounded-xl object-cover',
                f.id === filter && 'border-[3px] border-brand'
              )}
              style={sample && f.thumb ? undefined : { filter: photoFilter(f.id) }}
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
  const { state } = useLocation();
  const desktop = useMediaQuery('(min-width: 768px)');
  const fromPost = state?.from === 'post';
  const fileUrl = useObjectUrl(state?.file);
  // Sample media per Figma: golden retriever on 1440/768, "Edit photo" toller on 390.
  const sample = !state?.file && !state?.src;
  const src = fileUrl || state?.src || (desktop ? max : editPhoto);
  const [tool, setTool] = useState('filters');
  const [mobileTool, setMobileTool] = useState(null);
  const [filter, setFilter] = useState(state?.filterId ?? (fromPost ? 'original' : 'golden'));
  const [intensity, setIntensity] = useState(state?.intensity ?? 70);
  const [saved, setSaved] = useState(false);
  const canvasFilter = photoFilter(filter, intensity);
  const title = fromPost ? 'Edit photo' : 'New moment';

  const next = () =>
    navigate('/create', {
      replace: fromPost,
      state: {
        file: state?.file,
        src: state?.file ? undefined : src,
        filterId: filter,
        intensity,
        draft: state?.draft,
      },
    });

  // Picked file still turning into a blob URL: keep the canvas empty instead of flashing the sample.
  if (state?.file && !fileUrl) return <div className="fixed inset-0 bg-black md:bg-white" aria-busy="true" />;

  return (
    <>
      {/* ---------- Mobile: Edit photo (dark) ---------- */}
      <div className="fixed inset-0 z-40 flex flex-col bg-black text-white md:hidden">
        <header className="flex h-14 items-center justify-between px-4">
          <button type="button" aria-label="Close" onClick={() => navigate(-1)}>
            <X className="size-6" />
          </button>
          <h1 className="text-[17px] font-semibold">Edit photo</h1>
          <button type="button" onClick={next} className="text-[17px] font-semibold text-brand">
            Next
          </button>
        </header>
        <div className="relative min-h-0 flex-1">
          <img src={src} alt="" className="size-full object-cover" style={{ filter: canvasFilter }} />
        </div>
        <div className="flex flex-col gap-4 px-4 pt-4 pb-6">
          {mobileTool === 'filters' ? (
            <FilterGrid filter={filter} setFilter={setFilter} intensity={intensity} setIntensity={setIntensity} src={src} sample={false} compact />
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

      {/* ---------- Tablet / desktop: New moment ---------- */}
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
          <h1 className="flex-1 text-[17px] font-semibold text-ink">{title}</h1>
          <Button variant="ghost" size="pill" onClick={() => setSaved(true)}>
            {saved ? 'Draft saved' : 'Save draft'}
          </Button>
          <Button size="pill" onClick={next}>
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
              <img src={src} alt="" className="size-full object-cover" style={{ filter: canvasFilter }} />
            </div>
            {!fromPost && (
              <div className="flex max-w-full gap-1 overflow-x-auto rounded-[14px] bg-[#f6f6f6] px-3 py-2.5">
                {TIMELINE.map((clip, i) => (
                  <img
                    key={i}
                    src={clip}
                    alt=""
                    className={cn(
                      'h-16 w-12 shrink-0 object-cover',
                      i === 0 || i === TIMELINE.length - 1 ? 'rounded-lg' : 'rounded-[2px]'
                    )}
                    style={{ filter: canvasFilter }}
                  />
                ))}
              </div>
            )}
          </div>

          <aside className="hidden w-[320px] shrink-0 p-5 lg:block">
            {tool === 'filters' ? (
              <>
                <h2 className="mb-3.5 text-[17px] font-semibold text-ink">Filters</h2>
                <FilterGrid filter={filter} setFilter={setFilter} intensity={intensity} setIntensity={setIntensity} src={src} sample={sample} />
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
