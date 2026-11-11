import { useState } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import ResponsiveModal from './ResponsiveModal';
import { SearchField } from './common';
import oscar from '@/assets/figma/profile/pet-oscar.png';
import eva from '@/assets/figma/profile/pet-eva.png';
import bruno from '@/assets/figma/profile/pet-bruno.png';
import ria from '@/assets/figma/profile/avatar-ria.png';
import iconShare from '@/assets/figma/shell/icon-share-18.svg';
import iconPlus from '@/assets/figma/shell/icon-plus-20.svg';

/* Share — Figma 1493:3285 (1440 modal) / 1493:3371 (768) / 1493:3454 (390 bottom sheet) */

const PEOPLE = [
  { name: 'Sara', avatar: eva },
  { name: 'Arjun', avatar: bruno },
  { name: 'Meera', avatar: oscar },
  { name: 'Kabir', avatar: ria },
  { name: 'Happy Tails', avatar: bruno },
  { name: 'Zoya', avatar: eva },
  { name: 'Dev', avatar: oscar },
  { name: 'Anya', avatar: ria },
];

export default function ShareDialog({ open, onOpenChange, url }) {
  const [query, setQuery] = useState('');
  const [picked, setPicked] = useState(['Sara']);
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);

  const shown = PEOPLE.filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()));
  const toggle = (name) => {
    setSent(false);
    setPicked((p) => (p.includes(name) ? p.filter((n) => n !== name) : [...p, name]));
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url || window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked — nothing else to do */
    }
  };

  return (
    <ResponsiveModal open={open} onOpenChange={onOpenChange} title="Share" className="md:max-w-[520px]">
      <SearchField placeholder="Search people" value={query} onChange={(e) => setQuery(e.target.value)} />

      <div className="grid grid-cols-4 gap-x-2 gap-y-4">
        {shown.map((p) => {
          const on = picked.includes(p.name);
          return (
            <button
              key={p.name}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(p.name)}
              className="flex flex-col items-center gap-1.5"
            >
              <span className={cn('relative rounded-full', on && 'ring-2 ring-brand ring-offset-2')}>
                <img src={p.avatar} alt="" width={64} height={64} className="size-16 rounded-full object-cover" />
              </span>
              <span className="w-full truncate text-center text-[13px] font-medium text-ink">{p.name}</span>
            </button>
          );
        })}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!picked.length) return;
          setSent(true);
          setMessage('');
        }}
        className="flex items-center gap-2"
      >
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write a message…"
          aria-label="Message"
          className="h-10 min-w-0 flex-1 rounded-full bg-muted px-4 text-sm outline-none placeholder:text-subtle"
        />
        <Button type="submit" size="pill" disabled={!picked.length}>
          {sent ? 'Sent' : 'Send'}
        </Button>
      </form>

      <div className="h-px bg-border" />

      <div className="grid grid-cols-2 gap-2">
        <Button type="button" variant="secondary" size="pill" onClick={copy}>
          {copied ? <Check className="size-[18px]" /> : <img src={iconShare} alt="" width={18} height={18} />}
          {copied ? 'Copied' : 'Copy link'}
        </Button>
        <Button type="button" variant="secondary" size="pill">
          <img src={iconPlus} alt="" width={18} height={18} />
          Share to story
        </Button>
      </div>
    </ResponsiveModal>
  );
}
