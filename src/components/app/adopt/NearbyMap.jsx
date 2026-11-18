import { useState } from 'react';
import { cn } from '@/lib/utils';
import mapPark from '@/assets/figma/adopt/map-park.svg';
import mapWater from '@/assets/figma/adopt/map-water.svg';

/*
 * "Nearby on map" — Figma 1542:6413 (rail, 320×340) / 1542:6626 (768, 640×260).
 * Illustrated street map: beige ground, park + water patches, white roads,
 * pet avatar pins (the focused pet is the red labelled pin), a "Search this
 * area" pill and a +/– zoom control. Drawn in the 640×260 design space and
 * cropped to fill (`slice`) so it works at any aspect ratio.
 */

// Roads from the 768 frame: [centerX, centerY, angle°, width, vertical?]
const ROADS = [
  [340.36, 101.5, 6, 12],
  [339.06, 17.57, -8, 6],
  [340.67, 204.92, 6, 6],
  [339.48, 126.94, -8, 12],
  [340.67, 311.3, 6, 6],
  [339.06, 230.37, -8, 6],
  [340.36, 420.7, 6, 12],
  [115.03, 188.32, -5, 12, true],
  [170.32, 185.9, 10, 6, true],
  [390.23, 188.32, -5, 12, true],
  [445.52, 185.9, 10, 6, true],
  [665.43, 188.32, -5, 12, true],
];

function roadLine([cx, cy, deg, w, vertical], i) {
  const a = (deg * Math.PI) / 180;
  // CSS rotate(θ) turns (1,0) into (cos, sin) and (0,1) into (−sin, cos).
  const [dx, dy] = vertical ? [-Math.sin(a), Math.cos(a)] : [Math.cos(a), Math.sin(a)];
  const L = 700;
  return (
    <line key={i} x1={cx - dx * L} y1={cy - dy * L} x2={cx + dx * L} y2={cy + dy * L} stroke="#fff" strokeWidth={w} />
  );
}

// Pin slots in % of the map box. Slot 0 holds the focused pet.
const SLOTS = [
  [30, 54],
  [58, 28],
  [76, 64],
  [12, 22],
  [52, 82],
  [88, 30],
  [16, 84],
];

function Pin({ pet, focused, style, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${pet.name}, ${pet.distance} away`}
      style={style}
      className={cn(
        'absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-[30px] p-1 shadow-[0_4px_12px_rgba(0,0,0,0.18)] transition-[left,top,transform] duration-300 hover:scale-105',
        focused ? 'z-10 bg-brand pr-3' : 'bg-white'
      )}
    >
      <img
        src={pet.photo}
        alt=""
        className={cn('shrink-0 rounded-full object-cover', focused ? 'size-11' : 'size-9')}
      />
      {focused && <span className="text-[13px] font-semibold whitespace-nowrap text-white">{pet.name}</span>}
    </button>
  );
}

const ZOOM_MIN = 1;
const ZOOM_MAX = 2;

export default function NearbyMap({ pets, focusId, onSelect, onSearchArea, className }) {
  const [zoom, setZoom] = useState(1);
  const [searched, setSearched] = useState(false);
  const focus = pets.find((p) => p.id === focusId);
  const pinned = (focus ? [focus, ...pets.filter((p) => p !== focus)] : pets).slice(0, SLOTS.length);

  const changeZoom = (d) => {
    setZoom((z) => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z + d)));
    setSearched(false);
  };

  return (
    <div className={cn('relative isolate overflow-hidden rounded-[20px] bg-[#f2f1ee]', className)}>
      <svg
        aria-hidden="true"
        viewBox="0 0 640 260"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 size-full transition-transform duration-300"
        style={{ transform: `scale(${zoom})` }}
      >
        <image href={mapPark} x={378.4} y={45.6} width={240.8} height={95} preserveAspectRatio="none" />
        <image href={mapWater} x={55.04} y={235.6} width={151.36} height={60.8} preserveAspectRatio="none" />
        {ROADS.map(roadLine)}
      </svg>

      {pinned.map((pet, i) => {
        const [x, y] = SLOTS[i];
        return (
          <Pin
            key={pet.id}
            pet={pet}
            focused={pet.id === focusId}
            onClick={() => onSelect?.(pet)}
            style={{ left: `${50 + (x - 50) * zoom}%`, top: `${50 + (y - 50) * zoom}%` }}
          />
        );
      })}

      {!searched && (
        <button
          type="button"
          onClick={() => {
            onSearchArea?.(Math.round(10 / zoom));
            setSearched(true);
          }}
          className="absolute top-5 left-1/2 z-20 -translate-x-1/2 rounded-[20px] bg-white px-3.5 py-[9px] text-[13px] font-semibold whitespace-nowrap text-ink shadow-[0_2px_8px_rgba(0,0,0,0.12)] hover:bg-accent"
        >
          Search this area
        </button>
      )}

      <div className="absolute right-3.5 bottom-6 z-20 flex flex-col overflow-hidden rounded-xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.12)]">
        <button
          type="button"
          aria-label="Zoom in"
          disabled={zoom >= ZOOM_MAX}
          onClick={() => changeZoom(0.25)}
          className="px-3.5 py-2 text-lg leading-[22px] font-semibold text-ink hover:bg-accent disabled:opacity-40"
        >
          +
        </button>
        <button
          type="button"
          aria-label="Zoom out"
          disabled={zoom <= ZOOM_MIN}
          onClick={() => changeZoom(-0.25)}
          className="px-3.5 py-2 text-lg leading-[22px] font-semibold text-ink hover:bg-accent disabled:opacity-40"
        >
          –
        </button>
      </div>
    </div>
  );
}
