import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Camera } from 'lucide-react';
import StepLayout, { OptionCard } from '@/components/onboarding/StepLayout';
import { ChoiceChip } from '@/components/app/common';
import { Input } from '@/components/ui/input';
import clayDog from '@/assets/figma/onboarding/clay-add-your-pet.png';

/*
 * Pet onboarding — 6 steps built on the step template (Figma 06 · Onboarding step).
 * Step 2 is the "Choose your pet type" frame; step 4 is 15 · Personalize
 * ("What does Mikel love?", Figma 1490:2677 / 1490:2740 / 1490:2800).
 */

const TYPES = ['Dog', 'Cat', 'Rabbit', 'Bird'];
const LOVES = [
  'Belly rubs',
  'Playing fetch',
  'Tug of war',
  'Swimming',
  'Crunchy snacks',
  'Cuddling',
  'Running in the park',
  'Napping',
  'Chewing toys',
  'Sunbathing',
  'Meeting new people',
  'Chasing balls',
  'Exploring outdoors',
  'Sniffing everything',
];
const GENDERS = ['Male', 'Female', 'Not sure yet'];
const TOTAL = 6;

const fieldClass = 'h-14 rounded-xl border-[#d1d1d1] px-4 text-base shadow-none md:text-base';

export default function Onboarding() {
  const navigate = useNavigate();
  const { step: stepParam } = useParams();
  const step = Math.min(Math.max(Number(stepParam) || 1, 1), TOTAL);
  const [pet, setPet] = useState({
    name: 'Mikel',
    type: 'Dog',
    breed: '',
    age: '',
    loves: ['Playing fetch', 'Swimming', 'Sunbathing'],
    gender: '',
    photo: null,
  });
  const photoRef = useRef(null);
  const set = (patch) => setPet((p) => ({ ...p, ...patch }));
  const go = (n) => navigate(`/onboarding/${n}`);
  const name = pet.name.trim() || 'your pet';

  const steps = {
    1: {
      title: 'What’s your pet’s name?',
      subtitle: 'This is how friends and adopters will see them.',
      valid: pet.name.trim().length > 0,
      body: (
        <Input
          autoFocus
          aria-label="Pet name"
          placeholder="Pet name"
          value={pet.name}
          onChange={(e) => set({ name: e.target.value })}
          className={fieldClass}
        />
      ),
    },
    2: {
      title: 'Choose your pet type',
      subtitle: 'Help us personalise your feed and matches.',
      valid: Boolean(pet.type),
      body: (
        <div role="radiogroup" aria-label="Pet type" className="flex flex-col gap-4">
          {TYPES.map((t) => (
            <OptionCard key={t} label={t} selected={pet.type === t} onSelect={() => set({ type: t })} />
          ))}
        </div>
      ),
    },
    3: {
      title: `Tell us about ${name}`,
      subtitle: 'Breed and age help us suggest the right friends.',
      valid: pet.breed.trim() && pet.age.trim(),
      body: (
        <div className="flex flex-col gap-4">
          <Input aria-label="Breed" placeholder="Breed (e.g. Golden Retriever)" value={pet.breed} onChange={(e) => set({ breed: e.target.value })} className={fieldClass} />
          <Input aria-label="Age" placeholder="Age (e.g. 3 yrs)" value={pet.age} onChange={(e) => set({ age: e.target.value })} className={fieldClass} />
        </div>
      ),
    },
    4: {
      title: `What does ${name} love?`,
      subtitle: 'Pick a few — we’ll show you posts, pals and places to match.',
      valid: pet.loves.length > 0,
      body: (
        <div className="flex flex-wrap gap-2">
          {LOVES.map((l) => (
            <ChoiceChip
              key={l}
              selected={pet.loves.includes(l)}
              onClick={() =>
                set({ loves: pet.loves.includes(l) ? pet.loves.filter((x) => x !== l) : [...pet.loves, l] })
              }
            >
              {l}
            </ChoiceChip>
          ))}
        </div>
      ),
    },
    5: {
      title: `Is ${name} a boy or a girl?`,
      subtitle: 'You can change this later.',
      valid: Boolean(pet.gender),
      body: (
        <div role="radiogroup" aria-label="Gender" className="flex flex-col gap-4">
          {GENDERS.map((g) => (
            <OptionCard key={g} label={g} selected={pet.gender === g} onSelect={() => set({ gender: g })} />
          ))}
        </div>
      ),
    },
    6: {
      title: `Add a photo of ${name}`,
      subtitle: 'Profiles with a photo get 3× more friends.',
      valid: true,
      body: (
        <>
          <input
            ref={photoRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) set({ photo: URL.createObjectURL(f) });
            }}
          />
          <button
            type="button"
            onClick={() => photoRef.current?.click()}
            className="flex aspect-square w-full max-w-[240px] flex-col items-center justify-center gap-2 overflow-hidden rounded-3xl border border-dashed border-[#d1d1d6] bg-[#f6f6f6] text-sm font-medium text-subtle"
          >
            {pet.photo ? (
              <img src={pet.photo} alt="" className="size-full object-cover" />
            ) : (
              <>
                <Camera className="size-7" />
                Upload photo
              </>
            )}
          </button>
        </>
      ),
    },
  };

  const current = steps[step];
  const last = step === TOTAL;

  return (
    <StepLayout
      illustration={clayDog}
      panelTitle="Build your pet’s profile"
      panelText="A few quick questions so pet lovers nearby can meet them."
      stepLabel={`Step ${step} of ${TOTAL}`}
      progress={step / TOTAL}
      title={current.title}
      subtitle={current.subtitle}
      onBack={() => (step === 1 ? navigate(-1) : go(step - 1))}
      onNext={() => (last ? navigate('/permissions') : go(step + 1))}
      nextLabel={last ? 'Finish' : 'Continue'}
      nextDisabled={!current.valid}
    >
      {current.body}
    </StepLayout>
  );
}
