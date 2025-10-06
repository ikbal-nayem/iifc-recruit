
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import LoginLoading from './loading';

// Dynamically import the LoginForm component with suspense
const LoginForm = dynamic(() => import('@/components/app/public/login-form'), {
  ssr: true,
  loading: () => <LoginLoading />
});

export default function LoginPage() {
  return <LoginForm />;
}
