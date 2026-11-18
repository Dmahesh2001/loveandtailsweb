import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import AuthForm from '@/components/auth/AuthForm';
import { useAuth } from '@/lib/auth';

/* 02 · Login — Figma 1477:383 / 1477:423 / 1477:458 */
export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, status } = useAuth();
  const from = location.state?.from || '/home';

  if (status === 'authenticated') return <Navigate to={from} replace />;

  return (
    <AuthLayout>
      <AuthForm
        title="Welcome back"
        subtitle="Log in to see what your pet friends are up to."
        submitLabel="Log in"
        switchPrompt="Don’t have an account?"
        switchLabel="Sign up"
        switchTo="/signup"
        onSubmit={async ({ email, password }) => {
          await login(email, password);
          navigate(from, { replace: true });
        }}
      />
    </AuthLayout>
  );
}
