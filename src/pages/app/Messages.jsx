import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChipTabs, SearchField } from '@/components/app/common';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import iconPlus from '@/assets/figma/shell/icon-attach-plus.svg';
import iconSend from '@/assets/figma/shell/icon-send.svg';
import iconMore from '@/assets/figma/shell/icon-more.svg';
import elena from '@/assets/figma/messages/avatar-elena.png';
import marcus from '@/assets/figma/messages/avatar-marcus.png';
import sarah from '@/assets/figma/messages/avatar-sarah.png';
import julia from '@/assets/figma/messages/avatar-julia.png';

/* 03 · Messages — Figma 1478:410 (1440) / 1478:553 (768) / 1478:679 (390) */

const CONVERSATIONS = [
  {
    id: 'elena',
    name: 'Elena Vance',
    avatar: elena,
    time: '12:45 PM',
    preview: 'I’ve sent over the vet report for Max',
    unread: 2,
    online: true,
    messages: [
      { from: 'them', text: 'Hi! Max had his check-up this morning, all good 🐶', time: '10:02 AM' },
      { from: 'me', text: 'That’s great news. Can you share the report?', time: '10:04 AM' },
      { from: 'them', text: 'I’ve sent over the vet report for Max', time: '12:45 PM' },
    ],
  },
  {
    id: 'marcus',
    name: 'Marcus Chen',
    avatar: marcus,
    time: '10:12 AM',
    preview: 'Sounds good! Let’s meet at the park',
    messages: [
      { from: 'me', text: 'Bruno would love a playdate this weekend', time: '9:58 AM' },
      { from: 'them', text: 'Sounds good! Let’s meet at the park', time: '10:12 AM' },
    ],
  },
  {
    id: 'sarah',
    name: 'Sarah Jenkins',
    avatar: sarah,
    time: 'Yesterday',
    preview: 'Did you see the new photos of Eva?',
    unread: 1,
    messages: [{ from: 'them', text: 'Did you see the new photos of Eva?', time: '6:30 PM' }],
  },
  {
    id: 'julia',
    name: 'Julia Thorne',
    avatar: julia,
    time: 'Monday',
    preview: 'Thanks for the help yesterday!',
    messages: [{ from: 'them', text: 'Thanks for the help yesterday!', time: '8:15 PM' }],
  },
];

const FILTERS = ['All', 'People', 'Unread'];

function ConversationRow({ convo, active }) {
  const unread = Boolean(convo.unread);
  return (
    <Link
      to={`/messages/${convo.id}`}
      className={cn(
        'flex items-center gap-3 rounded-[14px] px-3 py-2.5 transition-colors',
        active ? 'bg-[#fceeed]' : 'hover:bg-black/[0.03]'
      )}
    >
      <img src={convo.avatar} alt="" width={48} height={48} className="size-12 shrink-0 rounded-full" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="flex-1 truncate text-[15px] font-semibold text-ink">{convo.name}</p>
          <span className={cn('shrink-0 text-xs', unread ? 'text-brand' : 'text-subtle')}>
            {convo.time}
          </span>
        </div>
        <div className="mt-0.5 flex items-center gap-2">
          <p
            className={cn(
              'flex-1 truncate text-[13px]',
              unread ? 'font-medium text-ink' : 'text-subtle'
            )}
          >
            {convo.preview}
          </p>
          {unread && (
            <span className="shrink-0 rounded-full bg-brand px-[7px] py-0.5 text-[11px] font-semibold text-white">
              {convo.unread}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

function ConversationList({ activeId, className }) {
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');
  const shown = CONVERSATIONS.filter(
    (c) =>
      (filter !== 'Unread' || c.unread) &&
      c.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <section className={cn('flex flex-col gap-3.5 bg-white px-4 pt-6', className)}>
      <h1 className="text-2xl font-semibold text-ink">Messages</h1>
      <SearchField
        placeholder="Search messages"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <ChipTabs options={FILTERS} value={filter} onChange={setFilter} />
      <div className="flex flex-col gap-1 pb-6">
        {shown.map((c) => (
          <ConversationRow key={c.id} convo={c} active={c.id === activeId} />
        ))}
        {shown.length === 0 && (
          <p className="px-3 py-8 text-center text-sm text-subtle">No conversations found.</p>
        )}
      </div>
    </section>
  );
}

/* Chat Bubble (Figma 1280:28): outgoing brand red right; incoming grey left. */
function ChatBubble({ message }) {
  const outgoing = message.from === 'me';
  return (
    <div
      className={cn(
        'flex w-fit max-w-[260px] flex-col gap-1 rounded-3xl px-4 py-3',
        outgoing
          ? 'self-end rounded-br-[4px] bg-brand text-white md:self-start'
          : 'rounded-bl-[4px] bg-[#f6f6f6] text-black'
      )}
    >
      <p className="text-base leading-[22px]">{message.text}</p>
      <p className={cn('text-xs leading-4', outgoing ? 'opacity-80' : 'text-right text-[#9ca3af]')}>
        {message.time}
      </p>
    </div>
  );
}

/* Chat Input (Figma 1462:59): attach, field, send (grey when empty, red when filled). */
function ChatInput({ onSend }) {
  const [text, setText] = useState('');
  const filled = text.trim().length > 0;
  const submit = (e) => {
    e.preventDefault();
    if (!filled) return;
    onSend(text.trim());
    setText('');
  };
  return (
    <form onSubmit={submit} className="flex h-11 items-center gap-2">
      <button
        type="button"
        aria-label="Attach"
        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted"
      >
        <img src={iconPlus} alt="" width={24} height={24} />
      </button>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a message"
        aria-label="Message"
        className="h-11 min-w-0 flex-1 rounded-[22px] border border-[#d1d1d1] bg-white px-4 text-base outline-none placeholder:text-[#9ca3af] focus:border-ink"
      />
      <button
        type="submit"
        aria-label="Send"
        disabled={!filled}
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-full transition-colors',
          filled ? 'bg-brand' : 'bg-muted'
        )}
      >
        <img src={iconSend} alt="" width={20} height={20} className={cn(filled && 'brightness-0 invert')} />
      </button>
    </form>
  );
}

function Conversation({ convo, className }) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState(convo.messages);
  const endRef = useRef(null);

  useEffect(() => {
    setMessages(convo.messages);
  }, [convo]);
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [messages]);

  const send = (text) =>
    setMessages((m) => [
      ...m,
      {
        from: 'me',
        text,
        time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      },
    ]);

  return (
    <section className={cn('flex h-svh min-w-0 flex-1 flex-col bg-surface', className)}>
      <header className="flex h-[76px] shrink-0 items-center gap-3 border-b border-border bg-white px-4 md:px-6">
        <button
          type="button"
          aria-label="Back"
          onClick={() => navigate('/messages')}
          className="-ml-1 flex size-10 items-center justify-center rounded-full md:hidden"
        >
          <ArrowLeft className="size-6 text-icon" />
        </button>
        <img src={convo.avatar} alt="" width={44} height={44} className="size-11 rounded-full" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-semibold text-ink">{convo.name}</p>
          {convo.online && <p className="text-[13px] text-success">● Online</p>}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="More"
              className="flex size-10 items-center justify-center rounded-full bg-muted"
            >
              <img src={iconMore} alt="" width={24} height={24} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View profile</DropdownMenuItem>
            <DropdownMenuItem>Mute</DropdownMenuItem>
            <DropdownMenuItem className="text-brand">Block</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <div className="flex flex-1 flex-col gap-3.5 overflow-y-auto px-4 pt-6 pb-4 md:px-6">
        <p className="text-xs font-medium text-subtle">Today</p>
        {messages.map((m, i) => (
          <ChatBubble key={i} message={m} />
        ))}
        <div ref={endRef} />
      </div>

      <div className="shrink-0 px-4 pt-2 pb-6 md:px-6">
        <ChatInput onSend={send} />
      </div>
    </section>
  );
}

export default function Messages() {
  const { conversationId } = useParams();
  const active =
    CONVERSATIONS.find((c) => c.id === conversationId) || (conversationId ? null : CONVERSATIONS[0]);

  return (
    <div className="flex min-h-[calc(100svh-120px)] md:h-svh">
      <ConversationList
        activeId={active?.id}
        className={cn(
          'w-full overflow-y-auto border-border md:w-[300px] md:shrink-0 md:border-r xl:w-[380px]',
          conversationId && 'hidden md:flex'
        )}
      />
      {active ? (
        <Conversation
          convo={active}
          className={cn(!conversationId && 'hidden md:flex', conversationId && 'fixed inset-0 z-40 md:static')}
        />
      ) : (
        <div className="hidden flex-1 items-center justify-center text-subtle md:flex">
          Conversation not found.
        </div>
      )}
    </div>
  );
}
