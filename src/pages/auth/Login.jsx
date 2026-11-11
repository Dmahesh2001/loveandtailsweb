import { useNavigate } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import AuthForm from '@/components/auth/AuthForm';

/* 02 · Login — Figma 1477:383 / 1477:423 / 1477:458 */
export default function Login() {
  const navigate = useNavigate();
  return (
    <AuthLayout>
      <AuthForm
        title="Welcome back"
        subtitle="Log in to see what your pet friends are up to."
        submitLabel="Continue with email"
        switchPrompt="Don’t have an account?"
        switchLabel="Sign up"
        switchTo="/signup"
        onContinue={() => navigate('/home')}
      />
    </AuthLayout>
  );
}
