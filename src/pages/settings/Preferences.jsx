import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import SelectField from '@/components/app/SelectField';

/*
 * Settings detail panes not drawn in Figma (Notifications, Privacy, Language, Help).
 * Built from the same tokens and components as 19 · Settings.
 */

function ToggleList({ title, rows }) {
  const [state, setState] = useState(() => Object.fromEntries(rows.map((r) => [r.key, r.on])));
  return (
    <div className="flex flex-col gap-[18px]">
      <h2 className="text-2xl font-semibold text-ink">{title}</h2>
      <ul className="flex flex-col divide-y divide-border rounded-[20px] border border-border">
        {rows.map((r) => (
          <li key={r.key} className="flex items-center gap-4 px-4 py-3.5">
            <label htmlFor={r.key} className="min-w-0 flex-1">
              <span className="block text-[15px] font-medium text-ink">{r.label}</span>
              <span className="block text-[13px] text-subtle">{r.detail}</span>
            </label>
            <Switch
              id={r.key}
              checked={state[r.key]}
              onCheckedChange={(v) => setState((s) => ({ ...s, [r.key]: v }))}
              className="data-[state=checked]:bg-brand"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function NotificationSettings() {
  return (
    <ToggleList
      title="Notifications"
      rows={[
        { key: 'adoption', label: 'Adoption updates', detail: 'Requests, replies and meet & greets', on: true },
        { key: 'messages', label: 'Messages', detail: 'New chats and replies', on: true },
        { key: 'social', label: 'Likes, comments & follows', detail: 'Activity on your posts', on: true },
        { key: 'reminders', label: 'Health reminders', detail: 'Vaccines, vet visits and documents', on: true },
        { key: 'email', label: 'Email digest', detail: 'A weekly summary in your inbox', on: false },
      ]}
    />
  );
}

export function PrivacySettings() {
  return (
    <ToggleList
      title="Privacy"
      rows={[
        { key: 'private', label: 'Private account', detail: 'Only approved followers see your posts', on: false },
        { key: 'location', label: 'Show distance on listings', detail: 'Adopters see roughly how far away you are', on: true },
        { key: 'dm', label: 'Allow messages from anyone', detail: 'Otherwise only people you follow', on: true },
        { key: 'online', label: 'Show when you’re online', detail: 'Others see “● Online” in chats', on: true },
      ]}
    />
  );
}

export function LanguageSettings() {
  const [lang, setLang] = useState('English');
  const [region, setRegion] = useState('India');
  return (
    <div className="flex flex-col gap-[18px]">
      <h2 className="text-2xl font-semibold text-ink">Language</h2>
      <SelectField label="App language" value={lang} onChange={setLang} options={['English', 'हिन्दी', 'తెలుగు', 'Español']} />
      <SelectField label="Region" value={region} onChange={setRegion} options={['India', 'Spain', 'United Kingdom', 'United States']} />
    </div>
  );
}

export function HelpCentre() {
  const faqs = [
    ['How does adoption work?', 'Browse pets, send a request, chat with the owner or shelter, meet, and bring your new friend home.'],
    ['Is there a fee?', 'Owners can set an adoption fee that covers vaccines and care, or list for free.'],
    ['How do I get verified?', 'Go to Settings → Verification and follow the three quick steps.'],
  ];
  return (
    <div className="flex flex-col gap-[18px]">
      <h2 className="text-2xl font-semibold text-ink">Help centre</h2>
      {faqs.map(([q, a]) => (
        <details key={q} className="group rounded-2xl bg-[#f6f6f6] p-4">
          <summary className="cursor-pointer list-none text-[15px] font-semibold text-ink">{q}</summary>
          <p className="mt-2 text-sm text-[#4a546c]">{a}</p>
        </details>
      ))}
    </div>
  );
}
