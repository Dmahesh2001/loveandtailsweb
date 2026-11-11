import { useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import ResponsiveModal from '@/components/app/ResponsiveModal';
import { getMyPet } from '@/data/me';
import NotFound from '@/pages/NotFound';
import iconPlusWhite from '@/assets/figma/shell/icon-plus-white-20.svg';
import iconPlusRed from '@/assets/figma/shell/icon-plus-red-20.svg';
import iconDoc20 from '@/assets/figma/shell/icon-document-20.svg';
import iconDoc22 from '@/assets/figma/shell/icon-document-22.svg';
import iconChevron from '@/assets/figma/shell/icon-chevron-right.svg';
import iconCamera from '@/assets/figma/shell/icon-camera.svg';
import iconImage from '@/assets/figma/shell/icon-image.svg';

/*
 * 09 · Documents — Figma 1487:1459 (1440) / 1487:1844 (768) / 1487:2205 (390)
 * Upload: modal 1487:1629 (1440) / 1487:2001 (768), bottom sheet 1487:2333 (390).
 */

const INITIAL_GROUPS = [
  {
    title: 'Vaccinations',
    docs: [
      { name: 'Rabies certificate', meta: 'Expires 18 Oct 2026', warn: true },
      { name: 'DHPPi booster', meta: 'Added 02 Jun 2026' },
    ],
  },
  {
    title: 'Medical',
    docs: [
      { name: 'Annual health check', meta: '14 Jan 2026' },
      { name: 'Blood test report', meta: '14 Jan 2026' },
    ],
  },
  {
    title: 'ID & ownership',
    docs: [
      { name: 'Microchip certificate', meta: '9851 2000 4471' },
      { name: 'KCI registration', meta: 'Pedigree papers' },
    ],
  },
  { title: 'Insurance', docs: [], addLabel: 'Add insurance policy', addMeta: 'Keep claims in one place' },
];

function DocRow({ doc }) {
  return (
    <button type="button" className="flex w-full items-center gap-3 rounded-xl py-2.5 text-left hover:bg-black/[0.02]">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#f6f6f6]">
        <img src={iconDoc20} alt="" width={20} height={20} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-medium text-ink">{doc.name}</span>
        <span className={cn('block truncate text-[13px]', doc.warn ? 'text-brand' : 'text-subtle')}>{doc.meta}</span>
      </span>
      <img src={iconChevron} alt="" width={18} height={18} />
    </button>
  );
}

function AddRow({ label, meta, onClick }) {
  return (
    <button type="button" onClick={onClick} className="flex w-full items-center gap-3 rounded-xl py-2.5 text-left">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#fceeed]">
        <img src={iconPlusRed} alt="" width={20} height={20} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-medium text-brand">{label}</span>
        <span className="block text-[13px] text-subtle">{meta}</span>
      </span>
      <img src={iconChevron} alt="" width={18} height={18} />
    </button>
  );
}

function UploadOptions({ onFiles }) {
  const camera = useRef(null);
  const photos = useRef(null);
  const files = useRef(null);
  const [dragging, setDragging] = useState(false);

  const options = [
    { icon: iconCamera, title: 'Scan document', meta: 'Use your camera', ref: camera },
    { icon: iconImage, title: 'Choose from photos', meta: 'JPG or PNG', ref: photos },
    { icon: iconDoc22, title: 'Browse files', meta: 'PDF up to 10 MB', ref: files },
  ];

  const handle = (e) => {
    const list = Array.from(e.target.files || []);
    if (list.length) onFiles(list);
    e.target.value = '';
  };

  return (
    <>
      <input ref={camera} type="file" accept="image/*" capture="environment" hidden onChange={handle} />
      <input ref={photos} type="file" accept="image/jpeg,image/png" multiple hidden onChange={handle} />
      <input ref={files} type="file" accept="application/pdf" multiple hidden onChange={handle} />

      <div className="flex flex-col rounded-[20px] bg-[#f6f6f6] px-4">
        {options.map((o, i) => (
          <button
            key={o.title}
            type="button"
            onClick={() => o.ref.current?.click()}
            className={cn('flex items-center gap-3 py-3.5 text-left', i > 0 && 'border-t border-border')}
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white">
              <img src={o.icon} alt="" width={22} height={22} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-semibold text-ink">{o.title}</span>
              <span className="block text-[13px] text-subtle">{o.meta}</span>
            </span>
            <img src={iconChevron} alt="" width={18} height={18} />
          </button>
        ))}
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const list = Array.from(e.dataTransfer.files || []);
          if (list.length) onFiles(list);
        }}
        className={cn(
          'hidden rounded-2xl border border-dashed py-5 text-center text-sm font-medium text-subtle transition-colors md:block',
          dragging ? 'border-brand bg-brand-soft text-brand' : 'border-[#d9d9db]'
        )}
      >
        or drag &amp; drop files here
      </div>
    </>
  );
}

export default function Documents() {
  const { petId } = useParams();
  const pet = getMyPet(petId);
  const [groups, setGroups] = useState(INITIAL_GROUPS);
  const [params] = useSearchParams();
  const [open, setOpen] = useState(() => params.get('upload') === '1');
  if (!pet) return <NotFound />;

  const count = groups.reduce((n, g) => n + g.docs.length, 0);

  const addFiles = (files) => {
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    setGroups((gs) => {
      const uploads = { title: 'Recently added', docs: files.map((f) => ({ name: f.name, meta: `Added ${today}` })) };
      const existing = gs.find((g) => g.title === 'Recently added');
      if (existing) {
        return gs.map((g) => (g === existing ? { ...g, docs: [...uploads.docs, ...g.docs] } : g));
      }
      return [uploads, ...gs];
    });
    setOpen(false);
  };

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 pt-5 pb-10 md:px-6 md:pt-8 main-xl:px-12">
      <header className="flex items-center gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-[24px] font-semibold text-ink md:text-[28px]">Documents</h1>
          <p className="mt-0.5 text-[15px] text-subtle">
            {pet.name} · {count} files
          </p>
        </div>
        <Button size="pill-lg" className="hidden md:inline-flex" onClick={() => setOpen(true)}>
          <img src={iconPlusWhite} alt="" width={20} height={20} />
          Upload document
        </Button>
      </header>

      <div className="mt-5 flex items-center gap-3.5 rounded-[18px] bg-[#fceeed] px-[18px] py-4">
        <div className="min-w-0 flex-1">
          <p className="text-base font-semibold text-ink">Rabies booster due</p>
          <p className="text-sm text-brand">18 Oct 2026 · in 17 days</p>
        </div>
        <Button size="pill">Book vet</Button>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {groups.map((g) => (
          <section key={g.title} className="flex flex-col gap-1 rounded-[20px] border border-border bg-white px-4 pt-4 pb-3">
            <h2 className="text-[15px] font-semibold text-ink">{g.title}</h2>
            {g.docs.map((d, i) => (
              <DocRow key={`${d.name}-${i}`} doc={d} />
            ))}
            {g.addLabel && <AddRow label={g.addLabel} meta={g.addMeta} onClick={() => setOpen(true)} />}
          </section>
        ))}
      </div>

      {/* Mobile: full-width upload button above the tab bar */}
      <div className="fixed inset-x-0 bottom-[60px] z-20 border-t border-line bg-white px-4 py-3 md:hidden">
        <Button size="pill-lg" className="w-full" onClick={() => setOpen(true)}>
          <img src={iconPlusWhite} alt="" width={20} height={20} />
          Upload document
        </Button>
      </div>
      <div className="h-20 md:hidden" />

      <ResponsiveModal
        open={open}
        onOpenChange={setOpen}
        title="Add a document"
        description="PDF or photo, up to 10 MB"
      >
        <UploadOptions onFiles={addFiles} />
      </ResponsiveModal>
    </div>
  );
}
