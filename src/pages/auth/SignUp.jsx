import { useNavigate } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import AuthForm from '@/components/auth/AuthForm';

/* 14 · Sign up — Figma 1490:2516 / 1490:2552 / 1490:2584 */
export default function SignUp() {
  const navigate = useNavigate();
  return (
    <AuthLayout>
      <AuthForm
        title="Create your account"
        subtitle="Join pet parents adopting, sharing and meeting up near you."
        submitLabel="Sign up with email"
        switchPrompt="Already have an account?"
        switchLabel="Log in"
        switchTo="/login"
        onContinue={() => navigate('/onboarding')}
      />
    </AuthLayout>
  );
}
