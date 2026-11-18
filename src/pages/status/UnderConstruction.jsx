import { useState } from 'react';
import { Check, Hammer } from 'lucide-react';
import clayPuppy from '@/assets/images/onboarding/clay-add-your-pet.png';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/services';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/*
 * "We're building" page. While the app is under construction every route
 * shows this page (see UNDER_CONSTRUCTION in App.jsx); /building always shows it.
 * The email form joins the LTBackend waitlist.
 */
export default function UnderConstruction() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    const value = email.trim();
    if (!EMAIL_PATTERN.test(value)) {
      setError('Please enter a valid email address.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const result = await api.joinWaitlist(value);
      setDone(result.detail || "You're on the waitlist!");
    } catch (err) {
      setError(err.fieldErrors?.email || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-svh flex-col bg-white">
      <header className="px-4 pt-6 md:px-10 md:pt-8">
        <p className="font-brand text-[26px] leading-normal text-brand md:text-[30px]">Love&amp;Tails</p>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-8 md:py-12">
        <div className="flex w-full max-w-[560px] flex-col items-center text-center">
          <div className="relative size-[220px] md:size-[280px]">
            <div aria-hidden="true" className="absolute inset-[8%] rounded-full bg-brand-soft" />
            <img
              src={clayPuppy}
              alt="A fluffy white clay puppy with a red collar"
              width={280}
              height={280}
              className="relative size-full object-contain motion-safe:animate-[puppy-float_3.2s_ease-in-out_infinite]"
            />
          </div>

          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold tracking-wide text-brand uppercase">
            <Hammer className="size-3.5" aria-hidden="true" />
            Under construction
          </span>

          <h1 className="mt-4 text-[32px] leading-tight font-semibold text-balance text-ink md:text-[44px]">
            We’re building something pawsome
          </h1>
          <p className="mt-3 max-w-[460px] text-base text-pretty text-subtle md:text-[17px]">
            Our pup is still busy putting Love&amp;Tails together: a home to adopt, share and meet up with
            pet parents near you. Leave your email and we’ll tell you the moment it opens.
          </p>

          <div className="mt-7 w-full max-w-[440px]">
            {done ? (
              <p
                role="status"
                className="flex items-center justify-center gap-2 rounded-2xl bg-success-soft px-4 py-3.5 text-[15px] font-medium text-success"
              >
                <Check className="size-5 shrink-0" aria-hidden="true" />
                {done}
              </p>
            ) : (
              <form onSubmit={submit} noValidate className="flex flex-col gap-2 sm:flex-row">
                <label htmlFor="uc-email" className="sr-only">
                  Email address
                </label>
                <Input
                  id="uc-email"
                  type="email"
                  autoComplete="email"
                  placeholder="Email address"
                  value={email}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? 'uc-email-error' : undefined}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  className="h-12 flex-1 rounded-3xl border-[#d1d1d1] px-5 text-base shadow-none md:text-base"
                />
                <Button type="submit" size="pill-lg" disabled={submitting} className="shrink-0">
                  {submitting ? 'Joining…' : 'Notify me'}
                </Button>
              </form>
            )}
            {error && (
              <p id="uc-email-error" className="mt-2 text-left text-[13px] text-destructive sm:pl-5">
                {error}
              </p>
            )}
            {!done && <p className="mt-3 text-xs text-subtle">No spam. Just one email when we launch.</p>}
          </div>
        </div>
      </main>

      <footer className="px-4 pb-6 text-center text-xs text-subtle">© {new Date().getFullYear()} Love&amp;Tails</footer>
    </div>
  );
}
