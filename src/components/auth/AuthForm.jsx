import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/*
 * Shared body of Login (1477:394) and Sign up (1490:2527):
 * title, subtitle, Google / Apple, "or" divider, email, primary CTA, switch link.
 */
export default function AuthForm({
  title,
  subtitle,
  submitLabel,
  switchPrompt,
  switchLabel,
  switchTo,
  onContinue,
}) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const submit = (event) => {
    event.preventDefault();
    if (!EMAIL_PATTERN.test(email)) {
      setError('Enter a valid email address.');
      return;
    }
    onContinue?.({ method: 'email', email });
  };

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      <h1 className="text-[28px] leading-tight font-semibold text-ink md:text-[32px]">{title}</h1>
      <p className="text-[15px] text-subtle">{subtitle}</p>
      <div className="h-2" />

      <Button
        type="button"
        variant="outline-neutral"
        size="pill-lg"
        className="w-full border-[#d1d1d1]"
        onClick={() => onContinue?.({ method: 'google' })}
      >
        Continue with Google
      </Button>
      <Button
        type="button"
        variant="outline-neutral"
        size="pill-lg"
        className="w-full border-[#d1d1d1]"
        onClick={() => onContinue?.({ method: 'apple' })}
      >
        Continue with Apple
      </Button>

      <div className="flex items-center gap-3" role="separator">
        <span className="h-px flex-1 bg-border" />
        <span className="text-[13px] text-subtle">or</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="auth-email" className="sr-only">
          Email
        </Label>
        <Input
          id="auth-email"
          type="email"
          autoComplete="email"
          placeholder="Email"
          value={email}
          aria-invalid={Boolean(error)}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError('');
          }}
          className="h-14 rounded-xl border-[#d1d1d1] px-4 text-base shadow-none md:text-base"
        />
        {error && <p className="text-[13px] text-destructive">{error}</p>}
      </div>

      <Button type="submit" size="pill-lg" className="w-full">
        {submitLabel}
      </Button>

      <p className="text-center text-sm font-medium text-ink">
        {switchPrompt}{' '}
        <Link to={switchTo} className="text-brand hover:underline">
          {switchLabel}
        </Link>
      </p>
      <p className="text-center text-xs text-subtle">
        By continuing, you agree to our Terms and Privacy Policy.
      </p>
    </form>
  );
}
