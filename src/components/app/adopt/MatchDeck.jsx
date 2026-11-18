import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getPet } from '@/data/pets';
import iconPass from '@/assets/figma/adopt/icon-pass.svg';
import iconLike from '@/assets/figma/adopt/icon-like.svg';
import iconDetails from '@/assets/figma/adopt/icon-details.svg';

/*
 * Match deck — Figma 1542:6472 (1440: 420×600 card) / 1542:6593 (768: 440×680).
 * The top card can be dragged left (pass) or right (like); the two cards
 * behind it peek out 12px / 24px lower at 70% / 40% opacity. Tapping the
 * left / right half of the photo steps through the gallery (progress bars).
 * Keyboard: ← pass, → like, space for details.
 */

const SWIPE_DISTANCE = 120;
const SWIPE_VELOCITY = 500;

const CARD_SIZE = 'h-[680px] main-xl:h-[600px]';

function isTyping(target) {
  return target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
}

function SwipeCard({ pet, onSwipe, onDetails }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-12, 12]);
  const gallery = getPet(pet.id)?.gallery ?? [pet.photo];
  const [index, setIndex] = useState(0);

  return (
    <motion.article
      ref={ref}
      aria-label={`${pet.name}, ${pet.age}`}
      className={cn(
        'absolute inset-x-0 top-0 cursor-grab touch-pan-y overflow-hidden rounded-[28px] bg-muted shadow-[0_16px_40px_rgba(0,0,0,0.16)] select-none active:cursor-grabbing',
        CARD_SIZE
      )}
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={1}
      onDragEnd={(_, info) => {
        if (info.offset.x > SWIPE_DISTANCE || info.velocity.x > SWIPE_VELOCITY) onSwipe(1);
        else if (info.offset.x < -SWIPE_DISTANCE || info.velocity.x < -SWIPE_VELOCITY) onSwipe(-1);
      }}
      onTap={(_, info) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect || gallery.length < 2) return;
        const right = info.point.x - window.scrollX > rect.left + rect.width / 2;
        setIndex((i) => Math.min(gallery.length - 1, Math.max(0, i + (right ? 1 : -1))));
      }}
      initial={{ scale: 0.96, y: 12, opacity: 0.7 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={(dir) => ({ x: dir * 640, rotate: dir * 18, opacity: 0, transition: { duration: 0.3 } })}
      transition={{ type: 'spring', stiffness: 320, damping: 30 }}
    >
      <img src={gallery[index]} alt="" draggable={false} className="pointer-events-none absolute inset-0 size-full object-cover" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-45% to-black/75" />

      <div className="pointer-events-none absolute inset-x-5 top-4 flex gap-1">
        {gallery.map((_, i) => (
          <span key={i} className={cn('h-[3px] flex-1 rounded-[2px]', i === index ? 'bg-white' : 'bg-white/45')} />
        ))}
      </div>

      <div className="absolute inset-x-5 bottom-[38px] flex flex-col gap-2 text-white">
        <button
          type="button"
          onClick={onDetails}
          className="flex items-baseline gap-2 self-start text-left"
          onPointerDownCapture={(e) => e.stopPropagation()}
        >
          <span className="text-[32px] font-semibold">{pet.name}</span>
          <span className="text-lg">{pet.age}</span>
        </button>
        <p className="text-sm">
          {[pet.breed, pet.shelterName, pet.distance].filter(Boolean).join(' · ')}
        </p>
        {pet.traits?.length > 0 && (
          <ul className="flex flex-wrap gap-1.5">
            {pet.traits.map((t) => (
              <li key={t} className="rounded-[14px] bg-white/22 px-2.5 py-[5px] text-xs font-medium">
                {t}
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.article>
  );
}

function RoundAction({ label, icon, size, iconSize, className, ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full shadow-[0_6px_16px_rgba(0,0,0,0.1)] transition-transform hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      style={{ width: size, height: size }}
      {...props}
    >
      <img src={icon} alt="" width={iconSize} height={iconSize} />
    </button>
  );
}

export default function MatchDeck({ pets, onPass, onLike, onDetails, empty, className }) {
  const [dir, setDir] = useState(0);
  const [top, back1, back2] = pets;

  const act = (d) => {
    if (!top) return;
    setDir(d);
    if (d > 0) onLike(top);
    else onPass(top);
  };

  // Keep the latest handlers for the global key listener.
  const latest = useRef({});
  latest.current = { act, top, onDetails };
  useEffect(() => {
    const onKey = (e) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target)) return;
      if (document.querySelector('[role="dialog"]')) return;
      const { act, top, onDetails } = latest.current;
      if (!top) return;
      if (e.key === 'ArrowLeft') act(-1);
      else if (e.key === 'ArrowRight') act(1);
      else if (e.key === ' ') {
        e.preventDefault();
        onDetails(top);
      } else return;
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className={cn('relative mx-auto w-full max-w-[440px] main-xl:max-w-[420px]', className)}>
      <div className={cn('relative', 'h-[770px] main-xl:h-[690px]')}>
        {back2 && (
          <div className={cn('absolute inset-x-6 top-6 overflow-hidden rounded-[28px] opacity-40', CARD_SIZE)}>
            <img src={back2.photo} alt="" className="size-full object-cover" />
          </div>
        )}
        {back1 && (
          <div className={cn('absolute inset-x-3 top-3 overflow-hidden rounded-[28px] opacity-70', CARD_SIZE)}>
            <img src={back1.photo} alt="" className="size-full object-cover" />
          </div>
        )}

        <AnimatePresence custom={dir} initial={false}>
          {top && <SwipeCard key={top.id} pet={top} onSwipe={act} onDetails={() => onDetails(top)} />}
        </AnimatePresence>

        {!top && (
          <div
            className={cn(
              'absolute inset-x-0 top-0 flex flex-col items-center justify-center gap-4 rounded-[28px] border border-dashed border-[#d1d1d1] bg-surface px-8 text-center',
              CARD_SIZE
            )}
          >
            {empty}
          </div>
        )}

        <div className="absolute top-[694px] left-1/2 flex -translate-x-1/2 items-center gap-5 main-xl:top-[614px]">
          <RoundAction
            label="Pass"
            icon={iconPass}
            size={60}
            iconSize={25.2}
            className="border border-[#eaeaeb] bg-white"
            disabled={!top}
            onClick={() => act(-1)}
          />
          <RoundAction
            label="Like"
            icon={iconLike}
            size={72}
            iconSize={30.24}
            className="bg-brand"
            disabled={!top}
            onClick={() => act(1)}
          />
          <RoundAction
            label="See details"
            icon={iconDetails}
            size={60}
            iconSize={25.2}
            className="border border-[#eaeaeb] bg-white"
            disabled={!top}
            onClick={() => onDetails(top)}
          />
        </div>
      </div>
    </div>
  );
}
