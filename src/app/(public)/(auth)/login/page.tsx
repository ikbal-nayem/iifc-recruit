import dynamic from 'next/dynamic';
import LoginLoading from './loading';

// Dynamically import the LoginForm component with suspense
const DynamicLoginForm = dynamic(() => import('@/components/app/public/auth/login-form'), {
  ssr: true,
  loading: () => <LoginLoading />
});

export default function LoginPage() {
  return <DynamicLoginForm />;
}
