import { useState } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import ShareDialog from './ShareDialog';
import iconSearch from '@/assets/figma/shell/icon-search.svg';
import iconClear from '@/assets/figma/shell/icon-close-white-12.svg';
import iconHeart from '@/assets/figma/shell/icon-heart.svg';
import iconHeart18 from '@/assets/figma/shell/icon-heart-18.svg';
import iconComment from '@/assets/figma/shell/icon-comment.svg';
import iconShare from '@/assets/figma/shell/icon-share-03.svg';
import iconBookmark from '@/assets/figma/shell/icon-bookmark.svg';
import defaultPostAvatar from '@/assets/figma/shell/avatar.png';
import defaultPostPhoto from '@/assets/figma/shell/post-photo.png';
import defaultPetPhoto from '@/assets/figma/pets/max.jpg';
import defaultPetCardPhoto from '@/assets/figma/pets/ben.jpg';

/*
 * Search Field (Figma 1450:6146) — pill search used for every search bar.
 * State=Filled (1450:6139): pass `onClear` to show the grey (×) clear button
 * whenever the field has a value.
 */
export function SearchField({ placeholder = 'Search', className, inputClassName, onClear, ...props }) {
  const showClear = onClear && props.value;
  return (
    <label
      className={cn(
        'flex h-11 items-center gap-2 rounded-full bg-muted px-4 focus-within:ring-2 focus-within:ring-ring/30',
        className
      )}
    >
      <img src={iconSearch} alt="" width={24} height={24} className="shrink-0" />
      <input
        type="search"
        placeholder={placeholder}
        className={cn(
          'min-w-0 flex-1 bg-transparent text-base leading-[22px] text-ink outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden',
          inputClassName
        )}
        {...props}
      />
      {showClear && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={onClear}
          className="flex size-5 shrink-0 items-center justify-center rounded-[10px] bg-[#9ca3af] hover:bg-[#868c97]"
        >
          <img src={iconClear} alt="" width={12} height={12} />
        </button>
      )}
    </label>
  );
}

/* Chip — style=Tab (Figma 1279:42): grey, red when selected. */
export function Chip({ selected, className, children, ...props }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        'inline-flex h-8 shrink-0 items-center justify-center rounded-full px-3.5 text-sm leading-5 font-medium whitespace-nowrap transition-colors',
        selected ? 'bg-brand text-white' : 'bg-[#f6f6f6] text-[#4a546b] hover:bg-[#ececec]',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/* Chip — style=Tag (Figma 1279:38): small grey label; clickable when given onClick. */
export function TagChip({ className, children, ...props }) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex shrink-0 items-center rounded-full bg-muted px-4 py-2 text-xs leading-4 whitespace-nowrap text-[#4a546c] transition-colors hover:bg-[#e6e6e6]',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/* Chip — style=Choice (Figma 1279:42): outline, solid red when selected (onboarding / personalize / tag pets). */
export function ChoiceChip({ selected, className, children, ...props }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        'inline-flex h-9 items-center justify-center gap-1.5 rounded-full border px-4 text-sm leading-5 font-medium whitespace-nowrap transition-colors',
        selected
          ? 'border-brand bg-brand text-white'
          : 'border-[#d1d1d6] bg-white text-[#4a546b] hover:border-[#b9b9c0]',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function ChipTabs({ options, value, onChange, className }) {
  return (
    <div className={cn('flex gap-2 overflow-x-auto', className)}>
      {options.map((opt) => (
        <Chip key={opt} selected={opt === value} onClick={() => onChange?.(opt)}>
          {opt}
        </Chip>
      ))}
    </div>
  );
}

/* Web / Post card (Figma 1476:100) */
export function PostCard({
  name = 'Wade Warren',
  meta = 'with Bruno · 2h',
  caption = 'First beach day and he refused to leave the water 🐾',
  avatar = defaultPostAvatar,
  photo = defaultPostPhoto,
  likes = '1.2k',
  comments = '86',
  className,
}) {
  const [following, setFollowing] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [sharing, setSharing] = useState(false);

  return (
    <article
      className={cn(
        'flex w-full flex-col gap-3 rounded-[20px] border border-border bg-white p-4',
        className
      )}
    >
      <header className="flex items-center gap-2.5">
        <img src={avatar} alt="" width={40} height={40} className="size-10 rounded-full object-cover" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold text-ink">{name}</p>
          <p className="truncate text-[13px] text-subtle">{meta}</p>
        </div>
        <Button
          size="pill"
          variant={following ? 'secondary' : 'outline-brand'}
          onClick={() => setFollowing((f) => !f)}
        >
          {following ? 'Following' : 'Follow'}
        </Button>
      </header>
      <p className="text-[15px] text-ink">{caption}</p>
      <div className="h-[420px] overflow-hidden rounded-[14px] bg-muted">
        <img src={photo} alt="" className="size-full object-cover" />
      </div>
      <footer className="flex items-center gap-5 text-sm font-medium text-icon">
        <button
          type="button"
          onClick={() => setLiked((l) => !l)}
          className={cn('flex items-center gap-1.5', liked && 'text-brand')}
        >
          {liked ? (
            <Heart className="size-[22px] fill-brand text-brand" strokeWidth={1.8} />
          ) : (
            <img src={iconHeart} alt="" width={22} height={22} />
          )}
          {likes}
        </button>
        <button type="button" className="flex items-center gap-1.5">
          <img src={iconComment} alt="" width={22} height={22} />
          {comments}
        </button>
        <button type="button" onClick={() => setSharing(true)} className="flex items-center gap-1.5">
          <img src={iconShare} alt="" width={22} height={22} />
          Share
        </button>
        <span className="flex-1" />
        <button
          type="button"
          aria-label={saved ? 'Saved' : 'Save'}
          aria-pressed={saved}
          onClick={() => setSaved((s) => !s)}
          className={cn(saved && 'opacity-60')}
        >
          <img src={iconBookmark} alt="" width={22} height={22} />
        </button>
      </footer>
      <ShareDialog open={sharing} onOpenChange={setSharing} />
    </article>
  );
}

/* Web / Pet row (Figma 1476:130) */
export function PetRow({ name = 'Max', detail = 'Golden Retriever · 3 km', photo = defaultPetPhoto, onMeet, action = 'Meet' }) {
  return (
    <div className="flex w-full items-center gap-3">
      <img src={photo} alt="" className="size-[52px] shrink-0 rounded-[14px] object-cover" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold text-ink">{name}</p>
        <p className="truncate text-[13px] text-subtle">{detail}</p>
      </div>
      <Button size="pill" variant="secondary" onClick={onMeet}>
        {action}
      </Button>
    </div>
  );
}

/* Web / Pet card (Figma 1479:588) */
export function PetCard({
  name = 'Ben',
  age = '2 yrs',
  meta = 'Golden Retriever · 3 km',
  photo = defaultPetCardPhoto,
  tag = 'Verified shelter',
  className,
  imageClassName,
  onClick,
}) {
  const [saved, setSaved] = useState(false);
  return (
    <div className={cn('flex w-full flex-col gap-2.5', className)}>
      <div className={cn('relative h-60 overflow-hidden rounded-[18px] bg-muted', imageClassName)}>
        <button type="button" onClick={onClick} className="block size-full">
          <img src={photo} alt={name} className="size-full object-cover" />
        </button>
        <button
          type="button"
          aria-label={saved ? 'Remove from saved' : 'Save'}
          aria-pressed={saved}
          onClick={() => setSaved((s) => !s)}
          className={cn(
            'absolute top-3 right-3 flex size-9 items-center justify-center rounded-[18px] bg-white/90 transition',
            saved && 'bg-brand-soft'
          )}
        >
          <img src={iconHeart18} alt="" width={18} height={18} />
        </button>
        {tag && (
          <span className="absolute top-3 left-3 rounded-full bg-success-soft px-2.5 py-1 text-xs font-medium text-success">
            {tag}
          </span>
        )}
      </div>
      <button type="button" onClick={onClick} className="flex items-center gap-1.5 text-left">
        <span className="text-[17px] font-semibold text-ink">{name}</span>
        <span className="text-sm text-subtle">{age}</span>
      </button>
      <p className="text-sm text-subtle">{meta}</p>
    </div>
  );
}

export function Card({ className, children, ...props }) {
  return (
    <div className={cn('rounded-[20px] border border-border bg-white', className)} {...props}>
      {children}
    </div>
  );
}
