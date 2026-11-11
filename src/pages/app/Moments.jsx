import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Bookmark, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import ResponsiveModal from '@/components/app/ResponsiveModal';
import Toast from '@/components/Toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ME } from '@/components/app/nav-config';
import { MOMENTS, MOMENT_COMMENTS, formatCount } from '@/data/moments';
import iconHeart from '@/assets/figma/moments/icon-heart-28.svg';
import iconComment from '@/assets/figma/moments/icon-comment-28.svg';
import iconShare from '@/assets/figma/moments/icon-share-28.svg';
import iconBookmark from '@/assets/figma/moments/icon-bookmark-28.svg';
import iconMore from '@/assets/figma/moments/icon-more-28.svg';
import iconHeartWhite from '@/assets/figma/moments/icon-heart-white-24.svg';
import iconCommentWhite from '@/assets/figma/moments/icon-comment-white-24.svg';
import iconSendWhite from '@/assets/figma/moments/icon-send-white-24.svg';
import iconMoreWhite from '@/assets/figma/moments/icon-more-white-24.svg';
import iconMusic from '@/assets/figma/moments/icon-music-white-18.svg';
import iconChevronDown from '@/assets/figma/moments/icon-chevron-down-white-24.svg';
import iconPlusWhite from '@/assets/figma/moments/icon-plus-white-24.svg';
import iconMenu from '@/assets/figma/moments/icon-menu-white-24.svg';
import iconSend from '@/assets/figma/shell/icon-send.svg';

/*
 * 13 · Moments (Figma "Reels") — 1488:2730 (1440) / 1488:2821 (768) / 1488:2901 (390)
 * A vertical, snap-scrolling feed: one moment per screen.
 *   Mobile:  full-bleed moment, white overlay actions, playback bar, "browse" button.
 *   Tablet/desktop: 480×860 / 440×780 card with the action rail to its right.
 * Double-tap a moment to like it; ↑/↓ (or j/k) move between moments.
 */

const FEEDS = ['For You', 'Following'];
const DOUBLE_TAP_MS = 300;

/* ---------------------------------------------------------------- pieces */

function FollowButton({ following, onClick, className }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={following} className={className}>
      {following ? 'Following' : 'Follow'}
    </button>
  );
}

function MoreMenu({ children, onCopyLink, onNotInterested, onReport, saved, onSave }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent side="left" align="end" className="w-52">
        {onSave && <DropdownMenuItem onSelect={onSave}>{saved ? 'Remove from saved' : 'Save'}</DropdownMenuItem>}
        <DropdownMenuItem onSelect={onCopyLink}>Copy link</DropdownMenuItem>
        <DropdownMenuItem onSelect={onNotInterested}>Not interested</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={onReport} className="text-brand">
          Report
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* Mobile: white 24px icons stacked over the moment (Figma 1488:2907). */
function MobileRail({ moment, s, on }) {
  const Item = ({ label, children, ...props }) => (
    <button type="button" className="flex flex-col items-center gap-1 text-xs leading-4 font-medium text-white" {...props}>
      {children}
      {label && <span>{label}</span>}
    </button>
  );
  return (
    <div className="pointer-events-auto flex w-[25px] flex-col items-center gap-6">
      <img
        src={moment.audioCover}
        alt=""
        title={moment.audio}
        width={24}
        height={24}
        className="size-6 rounded-full object-cover"
      />
      <Item label={formatCount(s.likes)} aria-label="Like" aria-pressed={s.liked} onClick={on.like}>
        {s.liked ? (
          <Heart className="size-6 fill-brand text-brand" strokeWidth={1.5} />
        ) : (
          <img src={iconHeartWhite} alt="" width={24} height={24} />
        )}
      </Item>
      <Item label={formatCount(s.comments)} aria-label="Comments" onClick={on.comments}>
        <img src={iconCommentWhite} alt="" width={24} height={24} />
      </Item>
      <Link to="/share" aria-label="Share">
        <img src={iconSendWhite} alt="" width={24} height={24} />
      </Link>
      <MoreMenu {...on.menu} saved={s.saved} onSave={on.save}>
        <button type="button" aria-label="More">
          <img src={iconMoreWhite} alt="" width={24} height={24} />
        </button>
      </MoreMenu>
    </div>
  );
}

/* Tablet/desktop: 28px icons beside the card (Figma 1488:2801). */
function DesktopRail({ s, on }) {
  const Item = ({ label, children, ...props }) => (
    <button type="button" className="flex flex-col items-center gap-1 text-xs font-medium text-icon" {...props}>
      {children}
      {label && <span>{label}</span>}
    </button>
  );
  return (
    <div className="flex flex-col items-center gap-5">
      <Item label={formatCount(s.likes)} aria-label="Like" aria-pressed={s.liked} onClick={on.like}>
        {s.liked ? (
          <Heart className="size-7 fill-brand text-brand" strokeWidth={1.6} />
        ) : (
          <img src={iconHeart} alt="" width={28} height={28} />
        )}
      </Item>
      <Item label={formatCount(s.comments)} aria-label="Comments" onClick={on.comments}>
        <img src={iconComment} alt="" width={28} height={28} />
      </Item>
      <Link to="/share" className="flex flex-col items-center gap-1 text-xs font-medium text-icon">
        <img src={iconShare} alt="" width={28} height={28} />
        <span>Share</span>
      </Link>
      <Item aria-label={s.saved ? 'Remove from saved' : 'Save'} aria-pressed={s.saved} onClick={on.save}>
        {s.saved ? (
          <Bookmark className="size-7 fill-icon text-icon" strokeWidth={1.6} />
        ) : (
          <img src={iconBookmark} alt="" width={28} height={28} />
        )}
      </Item>
      <MoreMenu {...on.menu}>
        <button type="button" aria-label="More">
          <img src={iconMore} alt="" width={28} height={28} />
        </button>
      </MoreMenu>
    </div>
  );
}

function Moment({ moment, index, active, s, on }) {
  const lastTap = useRef(0);
  const [bursts, setBursts] = useState([]);

  // Double-tap (or double-click) likes, Instagram-style. A like never toggles off here.
  const onTap = () => {
    const now = Date.now();
    if (now - lastTap.current > DOUBLE_TAP_MS) {
      lastTap.current = now;
      return;
    }
    lastTap.current = 0;
    on.like(true);
    setBursts((b) => [...b, now]);
    setTimeout(() => setBursts((b) => b.filter((t) => t !== now)), 900);
  };

  return (
    <section
      data-index={index}
      aria-label={`Moment by ${moment.author.name}`}
      className="flex h-full snap-start snap-always items-center justify-center"
    >
      <div className="flex h-full w-full items-end gap-5 md:h-auto md:w-auto main-xl:gap-6">
        {/* ---- the moment itself ---- */}
        <div
          className={cn(
            'relative h-full w-full overflow-hidden bg-black select-none',
            'md:aspect-[480/860] md:h-[min(860px,calc(100svh-164px))] md:w-auto md:rounded-[20px]',
            'main-xl:aspect-[440/780] main-xl:h-[min(780px,calc(100svh-120px))]'
          )}
        >
          <div className="absolute inset-0" onClick={onTap}>
            <img
              src={moment.photo}
              alt={moment.caption}
              draggable={false}
              className="size-full object-cover"
              loading={index < 2 ? 'eager' : 'lazy'}
            />
          </div>

          <AnimatePresence>
            {bursts.map((t) => (
              <motion.div
                key={t}
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: [0.4, 1.15, 1] }}
                exit={{ opacity: 0, scale: 1.25 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <Heart className="size-24 fill-white text-white drop-shadow-[0_6px_24px_rgba(0,0,0,0.35)]" />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Mobile overlay (Figma 1488:2906) */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[187px] bg-gradient-to-t from-black/25 from-35% to-black/5 to-75% backdrop-blur-[2px] md:hidden" />
          <div className="pointer-events-none absolute inset-x-6 bottom-6 flex flex-col items-end md:hidden">
            <MobileRail moment={moment} s={s} on={on} />
            <div className="flex w-full flex-col gap-[17px]">
              <p className="flex items-center gap-2 text-[10px] leading-none font-medium text-white">
                <img src={iconMusic} alt="" width={18} height={18} />
                <span className="truncate">{moment.audio}</span>
              </p>
              <div className="flex h-10 items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <img
                    src={moment.author.avatar}
                    alt=""
                    width={40}
                    height={40}
                    className="size-10 shrink-0 rounded-full object-cover"
                  />
                  <div className="flex min-w-0 flex-col gap-0.5 text-white">
                    <span className="truncate text-xs leading-4">@{moment.author.user}</span>
                    <span className="truncate text-sm leading-5 font-semibold tracking-[-0.2px]">
                      {moment.author.name}
                    </span>
                  </div>
                </div>
                <FollowButton
                  following={s.following}
                  onClick={on.follow}
                  className="pointer-events-auto h-8 shrink-0 rounded-lg border border-white px-4 text-xs leading-4 font-medium text-white"
                />
              </div>
            </div>
          </div>
          {/* Playback bar (Figma 1488:2955) */}
          <span
            className="pointer-events-none absolute bottom-0 left-0 h-1 w-0 bg-brand md:hidden"
            style={{ animation: active ? 'moment-progress 15s linear infinite' : 'none' }}
          />

          {/* Tablet/desktop caption (Figma 1488:2794) */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[45%] bg-gradient-to-b from-transparent to-black/65 md:block" />
          <div className="absolute inset-x-4 bottom-[30px] hidden text-white md:block">
            <div className="flex items-center gap-2.5">
              <img src={moment.author.avatar} alt="" width={36} height={36} className="size-9 rounded-full object-cover" />
              <span className="text-[15px] font-semibold">{moment.author.user}</span>
              <FollowButton
                following={s.following}
                onClick={on.follow}
                className="rounded-full border border-white px-3 py-[5px] text-[13px] font-medium"
              />
            </div>
            <p className="mt-3 text-sm">{moment.caption}</p>
            <p className="mt-2 text-xs whitespace-pre">♫  {moment.audio}</p>
          </div>
        </div>

        <div className="hidden pb-[50px] md:block">
          <DesktopRail s={s} on={on} />
        </div>
      </div>
    </section>
  );
}

function CommentsPanel({ moment, extra, onAdd }) {
  const [text, setText] = useState('');
  const [liked, setLiked] = useState(() => new Set());
  const comments = [...extra, ...MOMENT_COMMENTS];
  const filled = text.trim().length > 0;
  const submit = (e) => {
    e.preventDefault();
    if (!filled) return;
    onAdd(text.trim());
    setText('');
  };
  const toggle = (id) =>
    setLiked((s) => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <>
      <ul className="-mx-1 flex max-h-[50svh] flex-col gap-4 overflow-y-auto px-1">
        {comments.map((c) => (
          <li key={c.id} className="flex items-start gap-3">
            <img src={c.avatar} alt="" width={36} height={36} className="size-9 shrink-0 rounded-full object-cover" />
            <div className="min-w-0 flex-1">
              <p className="text-[13px]">
                <span className="font-semibold text-ink">{c.name}</span>{' '}
                <span className="text-subtle">{c.time}</span>
              </p>
              <p className="mt-0.5 text-sm text-ink">{c.text}</p>
            </div>
            <button
              type="button"
              aria-label="Like comment"
              aria-pressed={liked.has(c.id)}
              onClick={() => toggle(c.id)}
              className="flex flex-col items-center gap-0.5 pt-1 text-[11px] text-subtle"
            >
              <Heart className={cn('size-4', liked.has(c.id) && 'fill-brand text-brand')} />
              {c.likes + (liked.has(c.id) ? 1 : 0) || null}
            </button>
          </li>
        ))}
      </ul>
      <form onSubmit={submit} className="flex h-11 items-center gap-2">
        <img src={ME.avatar} alt="" width={36} height={36} className="size-9 shrink-0 rounded-full object-cover" />
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`Add a comment for ${moment.author.user}…`}
          aria-label="Comment"
          className="h-11 min-w-0 flex-1 rounded-[22px] border border-[#d1d1d1] bg-white px-4 text-base outline-none placeholder:text-[#9ca3af] focus:border-ink"
        />
        <button
          type="submit"
          aria-label="Post comment"
          disabled={!filled}
          className={cn(
            'flex size-10 shrink-0 items-center justify-center rounded-full transition-colors',
            filled ? 'bg-brand' : 'bg-muted'
          )}
        >
          <img src={iconSend} alt="" width={20} height={20} className={cn(filled && 'brightness-0 invert')} />
        </button>
      </form>
    </>
  );
}

/* ------------------------------------------------------------------ page */

const toggleIn = (setter, key) =>
  setter((s) => {
    const next = new Set(s);
    next.has(key) ? next.delete(key) : next.add(key);
    return next;
  });

export default function Moments() {
  const { momentId } = useParams();
  const navigate = useNavigate();
  const scroller = useRef(null);

  const [feed, setFeed] = useState(FEEDS[0]);
  const [feedUsers, setFeedUsers] = useState(null); // who "Following" shows, fixed when the feed is picked
  const [hidden, setHidden] = useState(() => new Set());
  const [liked, setLiked] = useState(() => new Set());
  const [saved, setSaved] = useState(() => new Set());
  const [following, setFollowing] = useState(
    () => new Set(MOMENTS.filter((m) => m.author.following).map((m) => m.author.user))
  );
  const [added, setAdded] = useState({}); // momentId → comments posted this session
  const [commentsFor, setCommentsFor] = useState(null);
  const [browseOpen, setBrowseOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });
  const toastTimer = useRef();

  const list = useMemo(
    () => MOMENTS.filter((m) => !hidden.has(m.id) && (!feedUsers || feedUsers.has(m.author.user))),
    [hidden, feedUsers]
  );
  const [active, setActive] = useState(() => Math.max(0, MOMENTS.findIndex((m) => m.id === momentId)));
  const current = list[Math.min(active, list.length - 1)];

  const notify = (message) => {
    clearTimeout(toastTimer.current);
    setToast({ show: true, message });
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 2200);
  };
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const goTo = (i, smooth = true) => {
    const root = scroller.current;
    const el = root?.querySelector(`[data-index="${i}"]`);
    if (el) root.scrollTo({ top: el.offsetTop, behavior: smooth ? 'smooth' : 'auto' });
  };

  // Open on the moment in the URL (e.g. from the home feed strip).
  useLayoutEffect(() => {
    goTo(active, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Track which moment fills the screen.
  useEffect(() => {
    const root = scroller.current;
    if (!root) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(Number(e.target.dataset.index)));
      },
      { root, threshold: 0.6 }
    );
    root.querySelectorAll('[data-index]').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [list]);

  // Keep the URL shareable: /moments/:id follows the moment on screen.
  useEffect(() => {
    if (current && current.id !== momentId) navigate(`/moments/${current.id}`, { replace: true });
  }, [current, momentId, navigate]);

  // ↑/↓ and j/k step through moments on desktop.
  useEffect(() => {
    const onKey = (e) => {
      if (commentsFor || browseOpen) return;
      if (e.target.closest?.('input, textarea, [contenteditable="true"], [role="menu"]')) return;
      const step = { ArrowDown: 1, j: 1, ArrowUp: -1, k: -1 }[e.key];
      if (!step) return;
      e.preventDefault();
      goTo(Math.min(Math.max(active + step, 0), list.length - 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, list.length, commentsFor, browseOpen]);

  const pickFeed = (f) => {
    setFeed(f);
    setFeedUsers(f === 'Following' ? new Set(following) : null);
    setActive(0);
    scroller.current?.scrollTo({ top: 0 });
  };

  const handlers = (m) => ({
    like: (force) =>
      force === true
        ? setLiked((s) => (s.has(m.id) ? s : new Set(s).add(m.id)))
        : toggleIn(setLiked, m.id),
    save: () => {
      toggleIn(setSaved, m.id);
      notify(saved.has(m.id) ? 'Removed from saved' : 'Saved to your collection');
    },
    follow: () => toggleIn(setFollowing, m.author.user),
    comments: () => setCommentsFor(m.id),
    menu: {
      onCopyLink: () => {
        navigator.clipboard?.writeText(`${window.location.origin}/moments/${m.id}`).catch(() => {});
        notify('Link copied');
      },
      onNotInterested: () => {
        setHidden((s) => new Set(s).add(m.id));
        notify('Got it. You’ll see fewer moments like this.');
      },
      onReport: () => notify('Thanks for letting us know.'),
    },
  });

  const stateFor = (m) => ({
    liked: liked.has(m.id),
    saved: saved.has(m.id),
    following: following.has(m.author.user),
    likes: m.likes + (liked.has(m.id) ? 1 : 0),
    comments: m.comments + (added[m.id]?.length || 0),
  });

  const commentsMoment = MOMENTS.find((m) => m.id === commentsFor);

  return (
    <div className="relative h-[calc(100svh-60px)] bg-black md:h-svh md:bg-white">
      <div
        ref={scroller}
        className="relative h-full snap-y snap-mandatory overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {list.map((m, i) => (
          <Moment key={m.id} moment={m} index={i} active={i === active} s={stateFor(m)} on={handlers(m)} />
        ))}
        {list.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-8 text-center text-white md:text-ink">
            <p className="text-lg font-semibold">No moments here yet</p>
            <p className="text-sm opacity-70">Follow pet parents to see their moments in this feed.</p>
          </div>
        )}
      </div>

      {/* Mobile top bar (Figma 1488:3008) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[91px] bg-gradient-to-b from-black/25 from-5% to-transparent to-75% backdrop-blur-[2px] md:hidden" />
      <div className="absolute inset-x-6 top-2 flex h-[31px] items-center justify-between md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" className="flex items-center gap-1 text-2xl leading-8 font-semibold tracking-[-0.3px] text-white outline-none">
              {feed}
              <img src={iconChevronDown} alt="" width={24} height={24} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-44">
            {FEEDS.map((f) => (
              <DropdownMenuItem key={f} onSelect={() => pickFeed(f)} className={cn(f === feed && 'font-semibold')}>
                {f}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Link to="/create/edit" aria-label="Create a moment">
          <img src={iconPlusWhite} alt="" width={24} height={24} />
        </Link>
      </div>

      {/* Mobile "browse moments" button (Figma 1488:3020) */}
      <button
        type="button"
        aria-label="Browse moments"
        onClick={() => setBrowseOpen(true)}
        className="fixed bottom-[37px] left-1/2 z-40 flex size-[50px] -translate-x-1/2 items-center justify-center rounded-2xl bg-brand p-1 md:hidden"
      >
        <img src={iconMenu} alt="" width={24} height={24} />
      </button>

      <ResponsiveModal
        open={Boolean(commentsMoment)}
        onOpenChange={(open) => !open && setCommentsFor(null)}
        title="Comments"
        description={commentsMoment && `${formatCount(stateFor(commentsMoment).comments)} comments`}
      >
        {commentsMoment && (
          <CommentsPanel
            key={commentsMoment.id}
            moment={commentsMoment}
            extra={added[commentsMoment.id] || []}
            onAdd={(text) =>
              setAdded((a) => ({
                ...a,
                [commentsMoment.id]: [
                  { id: `me-${Date.now()}`, name: ME.name, avatar: ME.avatar, text, time: 'now', likes: 0 },
                  ...(a[commentsMoment.id] || []),
                ],
              }))
            }
          />
        )}
      </ResponsiveModal>

      <ResponsiveModal open={browseOpen} onOpenChange={setBrowseOpen} title="Moments" description={feed}>
        <div className="grid max-h-[60svh] grid-cols-3 gap-2 overflow-y-auto">
          {list.map((m, i) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                setBrowseOpen(false);
                goTo(i, false);
              }}
              className={cn(
                'relative aspect-[9/16] overflow-hidden rounded-xl',
                i === active && 'ring-2 ring-brand ring-offset-2'
              )}
            >
              <img src={m.photo} alt={m.caption} className="size-full object-cover" />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-2 pt-6 pb-1.5 text-left text-[11px] font-medium text-white">
                ♥ {formatCount(m.likes)}
              </span>
            </button>
          ))}
        </div>
      </ResponsiveModal>

      <Toast show={toast.show} message={toast.message} />
    </div>
  );
}
