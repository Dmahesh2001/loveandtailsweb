import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Heart, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import reelPhoto from '@/assets/figma/shell/post-photo.png';
import wade from '@/assets/figma/reels/avatar-wade.png';
import iconHeart from '@/assets/figma/reels/icon-heart-28.svg';
import iconComment from '@/assets/figma/reels/icon-comment-28.svg';
import iconShare from '@/assets/figma/reels/icon-share-28.svg';
import iconBookmark from '@/assets/figma/reels/icon-bookmark-28.svg';
import iconMore from '@/assets/figma/reels/icon-more-28.svg';

/*
 * 13 · Reels — Figma 1488:2730 (1440) / 1488:2821 (768) / 1488:2901 (390)
 * Desktop/tablet: 440×780 reel card with an action rail to its right.
 * Mobile: full-bleed reel with the actions overlaid in white.
 */

const REEL = {
  user: 'wadewarren',
  name: 'Wade Warren',
  avatar: wade,
  caption: 'Bruno met the sea for the first time 🌊🐾',
  audio: 'Original audio · wadewarren',
  likes: '12k',
  comments: '340',
};

function Actions({ overlay }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const tone = overlay ? 'text-white' : 'text-icon';
  const invert = overlay ? 'brightness-0 invert' : '';
  const Item = ({ icon, label, onClick, pressed, active }) => (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      className={cn('flex flex-col items-center gap-1 text-xs font-medium', tone)}
    >
      {active || <img src={icon} alt="" width={28} height={28} className={invert} />}
      {label && <span>{label}</span>}
    </button>
  );
  return (
    <div className="flex flex-col items-center gap-5">
      <Item
        icon={iconHeart}
        label={REEL.likes}
        pressed={liked}
        onClick={() => setLiked((l) => !l)}
        active={liked && <Heart className="size-7 fill-brand text-brand" strokeWidth={1.6} />}
      />
      <Item icon={iconComment} label={REEL.comments} />
      <Link to="/share" className={cn('flex flex-col items-center gap-1 text-xs font-medium', tone)}>
        <img src={iconShare} alt="" width={28} height={28} className={invert} />
        <span>Share</span>
      </Link>
      <Item
        icon={iconBookmark}
        pressed={saved}
        onClick={() => setSaved((s) => !s)}
        active={saved && <img src={iconBookmark} alt="" width={28} height={28} className="opacity-50" />}
      />
      <Item icon={iconMore} />
    </div>
  );
}

function Caption() {
  const [following, setFollowing] = useState(false);
  return (
    <div className="text-white">
      <div className="flex items-center gap-2.5">
        <img src={REEL.avatar} alt="" width={36} height={36} className="size-9 rounded-full" />
        <span className="text-[15px] font-semibold">{REEL.user}</span>
        <button
          type="button"
          onClick={() => setFollowing((f) => !f)}
          className="rounded-full border border-white px-3 py-[5px] text-[13px] font-medium"
        >
          {following ? 'Following' : 'Follow'}
        </button>
      </div>
      <p className="mt-3 text-sm">{REEL.caption}</p>
      <p className="mt-2 text-xs whitespace-pre">♫  {REEL.audio}</p>
    </div>
  );
}

export default function Reels() {
  return (
    <>
      {/* ---------- Mobile: full bleed ---------- */}
      <div className="fixed inset-x-0 top-0 bottom-[60px] bg-black md:hidden">
        <img src={reelPhoto} alt="" className="size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
        <div className="absolute inset-x-4 top-4 flex items-center justify-between text-white">
          <button type="button" className="flex items-center gap-1 text-[22px] font-semibold">
            For You <ChevronDown className="size-5" />
          </button>
          <Link to="/create" aria-label="Create">
            <Plus className="size-6" />
          </Link>
        </div>
        <div className="absolute right-3 bottom-24">
          <Actions overlay />
        </div>
        <div className="absolute right-20 bottom-6 left-4">
          <Caption />
        </div>
      </div>

      {/* ---------- Tablet / desktop ---------- */}
      <div className="hidden min-h-svh items-center justify-center gap-6 py-[60px] md:flex">
        <div className="relative h-[min(780px,calc(100svh-120px))] aspect-[440/780] overflow-hidden rounded-[20px] bg-black">
          <img src={reelPhoto} alt="" className="size-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-b from-transparent to-black/65" />
          <div className="absolute inset-x-4 bottom-[30px]">
            <Caption />
          </div>
        </div>
        <div className="self-end pb-12">
          <Actions />
        </div>
      </div>
    </>
  );
}
