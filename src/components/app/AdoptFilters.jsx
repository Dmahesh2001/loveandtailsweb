import { Switch as SwitchPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';
import { ChoiceChip } from '@/components/app/common';
import ResponsiveModal from '@/components/app/ResponsiveModal';
import { Button } from '@/components/ui/button';
import iconFilters from '@/assets/figma/adopt/icon-filters-18.svg';

/*
 * Adoption filters — Figma "Filters" panel (Search 1544:4120, Adopt 1542:7194)
 * and the outline "Filters · N" button (1542:6727 / 1543:7535).
 *
 * Wide layouts (content ≥ main-xl) show the panel inline as a 280px column;
 * narrower layouts open the same panel in a dialog / bottom sheet.
 */

export const MAX_DISTANCE = 50;

export const DEFAULT_FILTERS = {
  petType: [],
  age: [],
  size: [],
  distance: MAX_DISTANCE,
  children: false,
  dogs: false,
  cats: false,
  verifiedOnly: false,
};

const PET_TYPES = [
  { value: 'dog', label: 'Dogs' },
  { value: 'cat', label: 'Cats' },
  { value: 'small', label: 'Small pets' },
];
const AGES = [
  { value: 'puppy', label: 'Puppy' },
  { value: 'young', label: 'Young' },
  { value: 'adult', label: 'Adult' },
  { value: 'senior', label: 'Senior' },
];
const SIZES = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
];
const GOOD_WITH = [
  { key: 'children', label: 'Children' },
  { key: 'dogs', label: 'Other dogs' },
  { key: 'cats', label: 'Cats' },
  { key: 'verifiedOnly', label: 'Verified shelters only' },
];

/** Number of filter sections that differ from the defaults (shown as "Filters · N"). */
export function countActiveFilters(f) {
  return [
    f.petType.length > 0,
    f.age.length > 0,
    f.size.length > 0,
    f.distance < MAX_DISTANCE,
    f.children || f.dogs || f.cats || f.verifiedOnly,
  ].filter(Boolean).length;
}

export function applyFilters(pets, f) {
  return pets.filter(
    (p) =>
      (!f.petType.length || f.petType.includes(p.type)) &&
      (!f.age.length || f.age.includes(p.ageGroup)) &&
      (!f.size.length || f.size.includes(p.size)) &&
      p.km <= f.distance &&
      (!f.children || p.goodWith?.children) &&
      (!f.dogs || p.goodWith?.dogs) &&
      (!f.cats || p.goodWith?.cats) &&
      (!f.verifiedOnly || p.verified)
  );
}

/** Same breakpoint as the `main-xl` container variant: content ≥ 1032px + 80px sidebar. */
export function useInlineFilters() {
  return useMediaQuery('(min-width: 1112px)');
}

export function FiltersButton({ count = 0, className, ...props }) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-3xl border border-[#d1d1d1] bg-white px-5 text-[15px] leading-5 font-medium text-black transition-colors hover:bg-accent',
        className
      )}
      {...props}
    >
      <img src={iconFilters} alt="" width={18} height={18} />
      {count > 0 ? `Filters · ${count}` : 'Filters'}
    </button>
  );
}

function Section({ title, aside, children, className }) {
  return (
    <section className={cn('flex flex-col gap-2.5', className)}>
      <div className="flex items-start">
        <h3 className="flex-1 text-sm font-semibold text-ink">{title}</h3>
        {aside}
      </div>
      {children}
    </section>
  );
}

function ChoiceGroup({ options, value, onChange }) {
  const toggle = (v) => onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <ChoiceChip key={o.value} selected={value.includes(o.value)} onClick={() => toggle(o.value)}>
          {o.label}
        </ChoiceChip>
      ))}
    </div>
  );
}

/* Toggle (Figma 40×24): red track when on, grey #eaeaeb when off, 18px white knob. */
function Toggle({ label, checked, onCheckedChange }) {
  return (
    <label className="flex cursor-pointer items-center text-sm text-ink">
      <span className="flex-1">{label}</span>
      <SwitchPrimitive.Root
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="inline-flex h-6 w-10 shrink-0 items-center rounded-full bg-[#eaeaeb] px-[3px] transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40 data-[state=checked]:bg-brand"
      >
        <SwitchPrimitive.Thumb className="block size-[18px] rounded-full bg-white transition-transform data-[state=checked]:translate-x-4" />
      </SwitchPrimitive.Root>
    </label>
  );
}

/* Slider (Figma 232×20): 4px track, red fill, 20px white thumb with 3px red ring. */
function DistanceSlider({ value, onChange }) {
  const pct = ((value - 1) / (MAX_DISTANCE - 1)) * 100;
  return (
    <input
      type="range"
      min={1}
      max={MAX_DISTANCE}
      step={1}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      aria-label="Distance"
      className="lt-range h-5 w-full"
      style={{ '--lt-range-fill': `${pct}%` }}
    />
  );
}

export function FilterPanelBody({ value, onChange }) {
  const set = (patch) => onChange({ ...value, ...patch });
  return (
    <div className="flex flex-col gap-[22px]">
      <Section title="Pet type">
        <ChoiceGroup options={PET_TYPES} value={value.petType} onChange={(petType) => set({ petType })} />
      </Section>
      <Section title="Age">
        <ChoiceGroup options={AGES} value={value.age} onChange={(age) => set({ age })} />
      </Section>
      <Section title="Size">
        <ChoiceGroup options={SIZES} value={value.size} onChange={(size) => set({ size })} />
      </Section>
      <Section
        title="Distance"
        aside={
          <span className="text-[13px] font-medium text-subtle">
            {value.distance >= MAX_DISTANCE ? 'Any distance' : `Within ${value.distance} km`}
          </span>
        }
      >
        <DistanceSlider value={value.distance} onChange={(distance) => set({ distance })} />
      </Section>
      <Section title="Good with" className="gap-3.5">
        {GOOD_WITH.map((g) => (
          <Toggle key={g.key} label={g.label} checked={value[g.key]} onCheckedChange={(v) => set({ [g.key]: v })} />
        ))}
      </Section>
    </div>
  );
}

/* Inline 280px column (Figma 1544:4120) with a full-height divider on its right. */
export function FilterPanel({ value, onChange, onHide, className }) {
  return (
    <aside
      aria-label="Filters"
      className={cn(
        'sticky top-0 h-svh w-[280px] shrink-0 overflow-y-auto border-r border-[#eaeaeb] px-6 pt-7 pb-6',
        className
      )}
    >
      <div className="mb-[22px] flex items-center gap-3.5">
        <h2 className="flex-1 text-lg font-semibold text-ink">Filters</h2>
        <button
          type="button"
          onClick={() => onChange(DEFAULT_FILTERS)}
          className="text-[13px] font-medium text-brand hover:underline"
        >
          Clear all
        </button>
        <button type="button" onClick={onHide} className="text-[13px] font-medium text-subtle hover:text-ink">
          Hide
        </button>
      </div>
      <FilterPanelBody value={value} onChange={onChange} />
    </aside>
  );
}

/* Narrow layouts: the same filters in a dialog (tablet) / bottom sheet (mobile). */
export function FilterSheet({ open, onOpenChange, value, onChange, resultCount }) {
  return (
    <ResponsiveModal open={open} onOpenChange={onOpenChange} title="Filters" className="max-h-[90svh] overflow-y-auto">
      <FilterPanelBody value={value} onChange={onChange} />
      <div className="mt-2 flex gap-3">
        <Button variant="outline-neutral" size="pill-lg" className="flex-1" onClick={() => onChange(DEFAULT_FILTERS)}>
          Clear all
        </Button>
        <Button size="pill-lg" className="flex-1" onClick={() => onOpenChange(false)}>
          {resultCount == null ? 'Done' : `Show ${resultCount} ${resultCount === 1 ? 'pet' : 'pets'}`}
        </Button>
      </div>
    </ResponsiveModal>
  );
}
