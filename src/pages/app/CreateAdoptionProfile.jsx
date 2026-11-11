import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PetCard } from '@/components/app/common';
import SelectField from '@/components/app/SelectField';
import { ProgressBar } from '@/components/onboarding/StepLayout';
import oscar from '@/assets/figma/profile/pet-oscar.png';
import eva from '@/assets/figma/profile/pet-eva.png';
import bruno from '@/assets/figma/profile/pet-bruno.png';
import max from '@/assets/figma/pets/max.jpg';
import iconBack from '@/assets/figma/shell/icon-back.svg';

/*
 * 17 · Create adoption profile — Figma 1491:2649 (1440) / 1491:2783 (768) / 1491:2889 (390)
 * Step 1 is the designed "Find a loving home" form; steps 2–3 extend it (photos, fee & publish).
 */

const PETS = [
  { id: 'oscar', name: 'Oscar', avatar: oscar, photo: max, age: '3 yrs', breed: 'Golden Retriever' },
  { id: 'eva', name: 'Eva', avatar: eva, photo: eva, age: '2 yrs', breed: 'Shih Tzu' },
  { id: 'bruno', name: 'Bruno', avatar: bruno, photo: bruno, age: '3 yrs', breed: 'Border Collie' },
];

const FIELDS = [
  ['homeType', 'Home type', ['House with garden', 'Apartment', 'Farm or large plot']],
  ['children', 'Children', ['Okay with children', 'Older children only', 'No children']],
  ['otherPets', 'Other pets', ['No aggressive pets', 'Good with dogs', 'Good with cats', 'Only pet']],
  ['experience', 'Adopter experience', ['Experienced preferred', 'First-time adopters welcome']],
];

const STEPS = 3;

function Preview({ pet, photos }) {
  return (
    <div className="flex w-full flex-col gap-3.5 rounded-3xl bg-[#fbedea] p-6 main-xl:w-[312px]">
      <p className="text-[15px] font-semibold text-ink">How adopters will see {pet.name}</p>
      <PetCard
        name={pet.name}
        age={pet.age}
        meta={`${pet.breed} · Hyderabad`}
        photo={photos[0] || pet.photo}
        tag={null}
        className="max-w-[264px]"
      />
      <p className="max-w-[264px] text-[13px] text-subtle">Tip: listings with 4+ photos get twice as many requests.</p>
    </div>
  );
}

export default function CreateAdoptionProfile() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [petId, setPetId] = useState('oscar');
  const [reason, setReason] = useState(
    'We’re moving abroad for work and can’t take Oscar with us. He deserves a family with a garden.'
  );
  const [prefs, setPrefs] = useState({
    homeType: 'House with garden',
    children: 'Okay with children',
    otherPets: 'No aggressive pets',
    experience: 'Experienced preferred',
  });
  const [photos, setPhotos] = useState([]);
  const [fee, setFee] = useState('2500');
  const [saved, setSaved] = useState(false);
  const fileRef = useRef(null);
  const pet = PETS.find((p) => p.id === petId);

  const title = ['Find a loving home', `Add photos of ${pet.name}`, 'Adoption fee & publish'][step - 1];
  const subtitle = [
    'Tell adopters about your pet and the home that suits them.',
    'Bright, recent photos help adopters fall in love.',
    'A small fee helps make sure adopters are serious. You can also list for free.',
  ][step - 1];

  const next = () => (step < STEPS ? setStep(step + 1) : navigate('/adopt'));
  const back = () => (step > 1 ? setStep(step - 1) : navigate(-1));

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 pt-4 pb-28 md:px-6 md:pt-12 md:pb-12 main-xl:px-[72px]">
      {/* Mobile header */}
      <div className="mb-6 flex items-center gap-4 md:hidden">
        <button
          type="button"
          aria-label="Back"
          onClick={back}
          className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[#e8e8eb] bg-white shadow-[0_2px_5px_rgba(13,18,38,0.08)]"
        >
          <img src={iconBack} alt="" width={24} height={24} />
        </button>
        <ProgressBar value={step / STEPS} className="flex-1" />
      </div>

      <div className="flex flex-col gap-10 main-xl:flex-row main-xl:items-start main-xl:gap-20">
        <div className="flex w-full max-w-[560px] flex-col gap-4">
          <p className="hidden text-[13px] font-medium text-brand md:block">
            Step {step} of {STEPS}
          </p>
          <h1 className="text-2xl font-semibold text-ink md:text-[30px]">{title}</h1>
          <p className="text-[15px] text-subtle">{subtitle}</p>

          {step === 1 && (
            <>
              <p className="text-[15px] font-semibold text-ink">Which pet?</p>
              <div role="radiogroup" aria-label="Which pet" className="flex gap-4">
                {PETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    role="radio"
                    aria-checked={p.id === petId}
                    onClick={() => setPetId(p.id)}
                    className="flex flex-col items-center gap-1.5"
                  >
                    <img
                      src={p.avatar}
                      alt=""
                      width={64}
                      height={64}
                      className={cn(
                        'size-16 rounded-full object-cover',
                        p.id === petId && 'ring-2 ring-brand ring-offset-2'
                      )}
                    />
                    <span className={cn('text-sm', p.id === petId ? 'font-semibold text-brand' : 'font-medium text-ink')}>
                      {p.name}
                    </span>
                  </button>
                ))}
              </div>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                aria-label="Adoption reason"
                placeholder="e.g. Moving abroad, can’t take her with me"
                className="h-[120px] w-full resize-none rounded-xl border border-[#d1d1d1] px-4 py-3.5 text-base leading-6 text-black outline-none placeholder:text-[#9ca3af] focus:border-ink"
              />
              <div className="grid gap-3 sm:grid-cols-2">
                {FIELDS.map(([key, label, options]) => (
                  <SelectField
                    key={key}
                    label={label}
                    value={prefs[key]}
                    options={options}
                    onChange={(v) => setPrefs((p) => ({ ...p, [key]: v }))}
                  />
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={(e) => {
                  const urls = Array.from(e.target.files || []).map((f) => URL.createObjectURL(f));
                  setPhotos((p) => [...p, ...urls].slice(0, 8));
                  e.target.value = '';
                }}
              />
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {photos.map((src, i) => (
                  <div key={src} className="relative aspect-square overflow-hidden rounded-2xl">
                    <img src={src} alt="" className="size-full object-cover" />
                    <button
                      type="button"
                      aria-label="Remove photo"
                      onClick={() => setPhotos((p) => p.filter((_, j) => j !== i))}
                      className="absolute top-1.5 right-1.5 flex size-7 items-center justify-center rounded-full bg-black/50 text-white"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ))}
                {photos.length < 8 && (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-brand/60 text-sm font-medium text-brand"
                  >
                    <Plus className="size-6" />
                    Add
                  </button>
                )}
              </div>
            </>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-3">
              <label className="flex h-14 items-center gap-2 rounded-xl border border-[#d1d1d1] px-4">
                <span className="text-base text-subtle">INR</span>
                <Input
                  inputMode="numeric"
                  aria-label="Adoption fee"
                  value={fee}
                  onChange={(e) => setFee(e.target.value.replace(/\D/g, ''))}
                  className="h-auto border-0 p-0 text-base shadow-none focus-visible:ring-0 md:text-base"
                />
              </label>
              <button type="button" onClick={() => setFee('0')} className="w-fit text-sm font-medium text-brand">
                List for free instead
              </button>
              <div className="rounded-2xl bg-[#f6f6f6] p-4 text-sm text-[#4a546c]">
                <p className="font-semibold text-ink">Summary</p>
                <p className="mt-1">
                  {pet.name} · {prefs.homeType} · {prefs.children} · {prefs.otherPets} · {prefs.experience}
                </p>
              </div>
            </div>
          )}

          <div className="mt-1 hidden gap-3 md:flex">
            <Button variant="ghost" size="pill-lg" onClick={() => (step > 1 ? back() : setSaved(true))}>
              {step > 1 ? 'Back' : saved ? 'Draft saved' : 'Save draft'}
            </Button>
            <Button size="pill-lg" className="flex-1" onClick={next}>
              {step < STEPS ? 'Continue' : 'Publish listing'}
            </Button>
          </div>
        </div>

        <div className="hidden md:block">
          <Preview pet={pet} photos={photos} />
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 bg-white px-4 pt-3 pb-6 md:hidden">
        <Button size="pill-lg" className="w-full" onClick={next}>
          {step < STEPS ? 'Continue' : 'Publish listing'}
        </Button>
      </div>
    </div>
  );
}
