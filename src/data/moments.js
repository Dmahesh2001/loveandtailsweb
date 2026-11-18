import golden from '@/assets/images/moments/moment-golden.jpg';
import puppy from '@/assets/images/moments/moment-puppy.jpg';
import audioDisc from '@/assets/images/moments/audio-disc.jpg';
import wade from '@/assets/images/moments/avatar-wade.png';
import julia from '@/assets/images/moments/avatar-wade-40.png';
import marcus from '@/assets/images/messages/avatar-marcus.png';
import sarah from '@/assets/images/messages/avatar-sarah.png';
import elena from '@/assets/images/messages/avatar-elena.png';
import bruno from '@/assets/images/pets/bruno.jpg';
import luna from '@/assets/images/pets/luna.jpg';
import fetch from '@/assets/images/landing/hero-fetch.jpg';
import swim from '@/assets/images/landing/feature-swim.jpg';

/*
 * Moments: short vertical posts (Figma "13 · Reels").
 * The first two use the photos and copy from the Figma frames; the rest reuse
 * existing pet photos so the feed has something to scroll through.
 */

const AUTHORS = {
  wade: { user: 'wadewarren', name: 'Wade Warren', avatar: wade, following: true },
  julia: { user: 'juliamoreno', name: 'Julia Moreno', avatar: julia },
  marcus: { user: 'marcus.pets', name: 'Marcus Lee', avatar: marcus, following: true },
  sarah: { user: 'sarahandluna', name: 'Sarah Kim', avatar: sarah },
  elena: { user: 'elena.walks', name: 'Elena Ruiz', avatar: elena },
};

export const MOMENTS = [
  {
    id: 'bruno-sea',
    photo: golden,
    author: AUTHORS.wade,
    caption: 'Bruno met the sea for the first time 🌊🐾',
    audio: 'Original audio · wadewarren',
    likes: 12000,
    comments: 340,
  },
  {
    id: 'first-walk',
    photo: puppy,
    author: AUTHORS.julia,
    caption: 'First walk outside. Tiny paws, big adventures.',
    audio: 'Dhurandhar - Title Track',
    likes: 12400,
    comments: 1180,
  },
  {
    id: 'herding-practice',
    photo: bruno,
    author: AUTHORS.marcus,
    caption: 'Herding practice, aka chasing every leaf in the park 🍂',
    audio: 'Original audio · marcus.pets',
    likes: 4800,
    comments: 96,
  },
  {
    id: 'luna-sunbeam',
    photo: luna,
    author: AUTHORS.sarah,
    caption: 'Luna found the one sunbeam in the flat. Do not disturb.',
    audio: 'Lazy Sunday · Lo-fi Paws',
    likes: 9100,
    comments: 212,
  },
  {
    id: 'fetch-champion',
    photo: fetch,
    author: AUTHORS.elena,
    caption: 'Fetch champion of the week 🏆',
    audio: 'Original audio · elena.walks',
    likes: 2300,
    comments: 41,
  },
  {
    id: 'pool-day',
    photo: swim,
    author: AUTHORS.wade,
    caption: 'Pool day. Nobody tell him he is not a fish.',
    audio: 'Original audio · wadewarren',
    likes: 7600,
    comments: 158,
  },
].map((m) => ({ audioCover: audioDisc, ...m }));

export const MOMENT_COMMENTS = [
  { id: 'c1', name: 'Sarah Kim', avatar: sarah, text: 'The little head tilt at the end 😭', time: '2h', likes: 48 },
  { id: 'c2', name: 'Marcus Lee', avatar: marcus, text: 'Ours did exactly the same thing on her first beach day.', time: '3h', likes: 12 },
  { id: 'c3', name: 'Elena Ruiz', avatar: elena, text: 'Where is this? Looks like a great spot for a walk.', time: '5h', likes: 3 },
];

/* 12000 → "12k", 1180 → "1.2k", 340 → "340" (matches the Figma counters). */
const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });
export const formatCount = (n) => compact.format(n).toLowerCase();
