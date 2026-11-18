import { useNavigate } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import AuthForm from '@/components/auth/AuthForm';
import { useAuth } from '@/lib/auth';

/* 14 · Sign up — Figma 1490:2516 / 1490:2552 / 1490:2584 */
export default function SignUp() {
  const navigate = useNavigate();
  const { register } = useAuth();
  return (
    <AuthLayout>
      <AuthForm
        mode="signup"
        title="Create your account"
        subtitle="Join pet parents adopting, sharing and meeting up near you."
        submitLabel="Sign up with email"
        switchPrompt="Already have an account?"
        switchLabel="Log in"
        switchTo="/login"
        onSubmit={async (fields) => {
          await register(fields);
          navigate('/onboarding', { replace: true });
        }}
      />
    </AuthLayout>
  );
}
