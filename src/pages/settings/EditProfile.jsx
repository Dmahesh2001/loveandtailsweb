import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChoiceChip } from '@/components/app/common';
import TextField from '@/components/app/TextField';
import { useAuth, useCurrentUser } from '@/lib/auth';
import { MY_BIO } from '@/data/me';
import avatar from '@/assets/figma/settings/avatar-ria-64.png';

/* 19 · Settings · Edit profile — Figma 1491:3164 (1440) / 1491:3565 (390 "Edit profile") */

const ROLES = ['Pet owner', 'Pet lover', 'Pet caregiver'];

function FieldWithError({ error, children }) {
  return (
    <div className="flex flex-col gap-1">
      {children}
      {error && <p className="text-[13px] text-destructive">{error}</p>}
    </div>
  );
}

export default function EditProfile() {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const { user, updateProfile } = useAuth();
  const ME = useCurrentUser();
  // first_name, last_name and phone_number are saved to LTBackend (PATCH /users/me/).
  // Bio, location and role have no backend field yet, so they only live in this form.
  const initial = {
    first_name: user?.first_name ?? '',
    last_name: user?.last_name ?? '',
    phone_number: user?.phone_number ?? '',
    bio: MY_BIO,
    location: ME.location,
    role: 'Pet owner',
  };
  const [form, setForm] = useState(initial);
  const [photo, setPhoto] = useState(avatar);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const set = (k) => (e) => {
    setSaved(false);
    setErrors(({ [k]: _, form: __, ...rest }) => rest);
    setForm((f) => ({ ...f, [k]: e.target ? e.target.value : e }));
  };
  const displayName = [form.first_name, form.last_name].filter(Boolean).join(' ') || ME.name;

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setSaving(true);
        setErrors({});
        try {
          await updateProfile({
            first_name: form.first_name.trim(),
            last_name: form.last_name.trim(),
            phone_number: form.phone_number.trim(),
          });
          setSaved(true);
        } catch (err) {
          setErrors({ ...err.fieldErrors, form: Object.keys(err.fieldErrors ?? {}).length ? '' : err.message });
        } finally {
          setSaving(false);
        }
      }}
      className="flex flex-col gap-[18px]"
    >
      <h2 className="text-2xl font-semibold text-ink">Edit profile</h2>

      <div className="flex items-center gap-4 rounded-[20px] bg-[#f6f6f6] p-4">
        <img src={photo} alt="" width={64} height={64} className="size-16 rounded-full object-cover" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-semibold text-ink">{displayName}</p>
          <p className="truncate text-[13px] text-subtle">{ME.email}</p>
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
        <FieldWithError error={errors.first_name}>
          <TextField label="First name" value={form.first_name} onChange={set('first_name')} autoComplete="given-name" />
        </FieldWithError>
        <FieldWithError error={errors.last_name}>
          <TextField label="Last name" value={form.last_name} onChange={set('last_name')} autoComplete="family-name" />
        </FieldWithError>
        <TextField label="Email" value={ME.email ?? ''} readOnly className="bg-[#f6f6f6]" inputClassName="text-subtle" />
        <FieldWithError error={errors.phone_number}>
          <TextField label="Phone" type="tel" value={form.phone_number} onChange={set('phone_number')} autoComplete="tel" />
        </FieldWithError>
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
        <Button type="submit" size="pill-lg" disabled={saving}>
          {saving ? 'Saving…' : 'Save changes'}
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
        {errors.form && (
          <span role="alert" className="text-sm font-medium text-destructive">
            {errors.form}
          </span>
        )}
      </div>
    </form>
  );
}
