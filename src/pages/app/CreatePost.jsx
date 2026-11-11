import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { useMediaQuery } from '@/hooks/use-media-query';
import { ChoiceChip } from '@/components/app/common';
import { ME } from '@/components/app/nav-config';
import HomeFeed from './HomeFeed';
import meAvatar from '@/assets/figma/home/me-avatar.png';
import samplePhoto from '@/assets/figma/shell/post-photo.png';
import iconClose from '@/assets/figma/shell/icon-close.svg';
import iconCloseWhite from '@/assets/figma/shell/icon-close-white.svg';
import iconPaw from '@/assets/figma/shell/icon-paw-print.svg';
import iconImage from '@/assets/figma/shell/icon-image-24.svg';
import iconCamera from '@/assets/figma/shell/icon-camera-24.svg';

/*
 * 12 · Create post — Figma 1488:2291 (1440 modal over Home) / 1488:2486 (768) / 1488:2563 (390 full screen)
 */

const PETS = ['Mikel', 'Oscar', 'Eva', 'Bruno'];

function useObjectUrl(file) {
  const [url, setUrl] = useState(null);
  useEffect(() => {
    if (!file) return undefined;
    const u = URL.createObjectURL(file);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);
  return file ? url : null;
}

function Composer({ onDone, Close }) {
  const [text, setText] = useState('');
  const [tagged, setTagged] = useState(['Mikel']);
  const [showAllPets, setShowAllPets] = useState(false);
  const [file, setFile] = useState(null);
  const [removedSample, setRemovedSample] = useState(false);
  const photosRef = useRef(null);
  const cameraRef = useRef(null);
  const fileUrl = useObjectUrl(file);
  const media = fileUrl || (removedSample ? null : samplePhoto);

  const toggle = (pet) => setTagged((t) => (t.includes(pet) ? t.filter((p) => p !== pet) : [...t, pet]));
  const visiblePets = showAllPets ? PETS : PETS.slice(0, 2);
  const canPost = text.trim().length > 0 || Boolean(media);

  const pick = (e) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
    e.target.value = '';
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center gap-3">
        <img src={meAvatar} alt="" width={40} height={40} className="size-10 rounded-full" />
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold text-ink">{ME.name}</p>
          <p className="text-[13px] text-subtle">Public · Anyone can reply</p>
        </div>
        <Close />
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={`What’s ${tagged[0] || 'your pet'} up to today?`}
        aria-label="Post text"
        rows={2}
        className="min-h-[72px] w-full resize-none bg-transparent text-xl leading-7 text-ink outline-none placeholder:text-[#4a546b]"
      />

      {media && (
        <div className="relative h-[300px] shrink-0 overflow-hidden rounded-2xl">
          <img src={media} alt="" className="size-full object-cover" />
          <button
            type="button"
            aria-label="Remove photo"
            onClick={() => {
              setFile(null);
              setRemovedSample(true);
            }}
            className="absolute top-3 right-3 flex size-10 items-center justify-center rounded-full border border-white/30 bg-white/20 backdrop-blur-md"
          >
            <img src={iconCloseWhite} alt="" width={24} height={24} />
          </button>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <img src={iconPaw} alt="" width={20} height={20} />
        {visiblePets.map((pet) => (
          <ChoiceChip
            key={pet}
            selected={tagged.includes(pet)}
            onClick={() => toggle(pet)}

          >
            {pet}
          </ChoiceChip>
        ))}
        {!showAllPets && (
          <ChoiceChip onClick={() => setShowAllPets(true)}>
            + Tag pet
          </ChoiceChip>
        )}
      </div>

      <div className="mt-auto flex items-center gap-1">
        <input ref={photosRef} type="file" accept="image/*,video/*" hidden onChange={pick} />
        <input ref={cameraRef} type="file" accept="image/*" capture="environment" hidden onChange={pick} />
        <button
          type="button"
          aria-label="Add photo"
          onClick={() => photosRef.current?.click()}
          className="flex size-10 items-center justify-center rounded-full bg-muted"
        >
          <img src={iconImage} alt="" width={24} height={24} />
        </button>
        <button
          type="button"
          aria-label="Take photo"
          onClick={() => cameraRef.current?.click()}
          className="flex size-10 items-center justify-center rounded-full bg-muted"
        >
          <img src={iconCamera} alt="" width={24} height={24} />
        </button>
        <span className="flex-1" />
        <Button size="pill-lg" disabled={!canPost} onClick={onDone}>
          Post
        </Button>
      </div>
    </div>
  );
}

export default function CreatePost() {
  const navigate = useNavigate();
  const desktop = useMediaQuery('(min-width: 768px)');
  const close = () => navigate('/home');

  const CloseButton = ({ Comp = 'button' }) => (
    <Comp
      type="button"
      aria-label="Close"
      onClick={Comp === 'button' ? close : undefined}
      className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted"
    >
      <img src={iconClose} alt="" width={24} height={24} />
    </Comp>
  );

  if (!desktop) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-white px-4 pt-4 pb-6">
        <h1 className="sr-only">Create post</h1>
        <Composer onDone={close} Close={() => <CloseButton />} />
      </div>
    );
  }

  return (
    <>
      <HomeFeed />
      <Dialog open onOpenChange={(o) => !o && close()}>
        <DialogContent
          showCloseButton={false}
          className="max-h-[calc(100svh-48px)] gap-4 overflow-y-auto rounded-3xl border-0 px-6 py-5 shadow-[0_24px_64px_rgba(0,0,0,0.2)] sm:max-w-[600px]"
        >
          <div className="flex items-center">
            <DialogTitle className="flex-1 text-xl font-semibold text-ink">Create post</DialogTitle>
            <DialogDescription className="sr-only">Share a moment with your pet</DialogDescription>
            <DialogClose
              aria-label="Close"
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted"
            >
              <img src={iconClose} alt="" width={24} height={24} />
            </DialogClose>
          </div>
          <Composer onDone={close} Close={() => null} />
        </DialogContent>
      </Dialog>
    </>
  );
}
