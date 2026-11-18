import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ApiError } from '@/lib/api';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputClass = 'h-14 rounded-xl border-[#d1d1d1] px-4 text-base shadow-none md:text-base';

function Field({ id, label, error, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="sr-only">
        {label}
      </Label>
      <Input
        id={id}
        placeholder={label}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={inputClass}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="text-[13px] text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

/*
 * Shared body of Login (1477:394) and Sign up (1490:2527):
 * title, subtitle, Google / Apple, "or" divider, fields, primary CTA, switch link.
 *
 * `mode="signup"` adds first/last name. `onSubmit({ email, password, first_name,
 * last_name })` may throw an ApiError; its field errors show under the matching
 * inputs and anything else shows above the button.
 */
export default function AuthForm({
  mode = 'login',
  title,
  subtitle,
  submitLabel,
  switchPrompt,
  switchLabel,
  switchTo,
  onSubmit,
}) {
  const signup = mode === 'signup';
  const [values, setValues] = useState({ first_name: '', last_name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const set = (key) => (e) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    if (errors[key]) setErrors(({ [key]: _, ...rest }) => rest);
    if (formError) setFormError('');
  };

  const validate = () => {
    const next = {};
    if (!EMAIL_PATTERN.test(values.email.trim())) next.email = 'Enter a valid email address.';
    if (!values.password) next.password = 'Enter your password.';
    else if (signup && values.password.length < 8) next.password = 'Use at least 8 characters.';
    if (signup && !values.first_name.trim()) next.first_name = 'Enter your first name.';
    return next;
  };

  const submit = async (event) => {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length) return;

    setSubmitting(true);
    setFormError('');
    try {
      await onSubmit?.({
        ...values,
        email: values.email.trim(),
        first_name: values.first_name.trim(),
        last_name: values.last_name.trim(),
      });
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors(err.fieldErrors);
        if (!Object.keys(err.fieldErrors).length) setFormError(err.message);
      } else {
        setFormError('Something went wrong. Please try again.');
      }
      setSubmitting(false);
    }
  };

  const socialUnavailable = (provider) =>
    setFormError(`${provider} sign-in isn’t available yet. Please use your email.`);

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
        onClick={() => socialUnavailable('Google')}
      >
        Continue with Google
      </Button>
      <Button
        type="button"
        variant="outline-neutral"
        size="pill-lg"
        className="w-full border-[#d1d1d1]"
        onClick={() => socialUnavailable('Apple')}
      >
        Continue with Apple
      </Button>

      <div className="flex items-center gap-3" role="separator">
        <span className="h-px flex-1 bg-border" />
        <span className="text-[13px] text-subtle">or</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      {signup && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            id="auth-first-name"
            label="First name"
            autoComplete="given-name"
            value={values.first_name}
            onChange={set('first_name')}
            error={errors.first_name}
          />
          <Field
            id="auth-last-name"
            label="Last name"
            autoComplete="family-name"
            value={values.last_name}
            onChange={set('last_name')}
            error={errors.last_name}
          />
        </div>
      )}
      <Field
        id="auth-email"
        label="Email"
        type="email"
        autoComplete="email"
        value={values.email}
        onChange={set('email')}
        error={errors.email}
      />
      <Field
        id="auth-password"
        label="Password"
        type="password"
        autoComplete={signup ? 'new-password' : 'current-password'}
        value={values.password}
        onChange={set('password')}
        error={errors.password}
      />

      {formError && (
        <p role="alert" className="text-[13px] text-destructive">
          {formError}
        </p>
      )}

      <Button type="submit" size="pill-lg" className="w-full" disabled={submitting}>
        {submitting ? 'Please wait…' : submitLabel}
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
