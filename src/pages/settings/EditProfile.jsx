import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChoiceChip } from '@/components/app/common';
import TextField from '@/components/app/TextField';
import { ME } from '@/components/app/nav-config';
import { MY_BIO } from '@/data/me';
import avatar from '@/assets/figma/settings/avatar-ria-64.png';

/* 19 · Settings · Edit profile — Figma 1491:3164 (1440) / 1491:3565 (390 "Edit profile") */

const ROLES = ['Pet owner', 'Pet lover', 'Pet caregiver'];

export default function EditProfile() {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const initial = { name: ME.name, username: ME.handle, bio: MY_BIO, location: ME.location, role: 'Pet owner' };
  const [form, setForm] = useState(initial);
  const [photo, setPhoto] = useState(avatar);
  const [saved, setSaved] = useState(false);
  const set = (k) => (e) => {
    setSaved(false);
    setForm((f) => ({ ...f, [k]: e.target ? e.target.value : e }));
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSaved(true);
      }}
      className="flex flex-col gap-[18px]"
    >
      <h2 className="text-2xl font-semibold text-ink">Edit profile</h2>

      <div className="flex items-center gap-4 rounded-[20px] bg-[#f6f6f6] p-4">
        <img src={photo} alt="" width={64} height={64} className="size-16 rounded-full object-cover" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-semibold text-ink">{form.name}</p>
          <p className="truncate text-[13px] text-subtle">{form.username}</p>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) setPhoto(URL.createObjectURL(f));
          }}
        />
        <Button type="button" size="pill" onClick={() => fileRef.current?.click()}>
          Change photo
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <TextField label="Name" value={form.name} onChange={set('name')} autoComplete="name" />
        <TextField label="Username" value={form.username} onChange={set('username')} autoComplete="username" />
      </div>
      <textarea
        aria-label="Bio"
        value={form.bio}
        onChange={set('bio')}
        className="h-[110px] w-full resize-none rounded-xl border border-[#d1d1d1] px-4 py-3.5 text-base leading-6 text-black outline-none focus:border-ink"
      />
      <TextField label="Location" value={form.location} onChange={set('location')} />

      <p className="text-[15px] font-semibold text-ink">Your role</p>
      <div className="flex flex-wrap gap-2">
        {ROLES.map((r) => (
          <ChoiceChip key={r} selected={form.role === r} onClick={() => set('role')(r)}>
            {r}
          </ChoiceChip>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" size="pill-lg">
          Save changes
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="pill-lg"
          onClick={() => {
            setForm(initial);
            navigate('/profile');
          }}
        >
          Cancel
        </Button>
        {saved && <span className="text-sm font-medium text-success">Saved</span>}
      </div>
    </form>
  );
}
