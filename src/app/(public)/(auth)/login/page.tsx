import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import LoginLoading from './loading';
import LoginForm from '@/components/app/public/auth/login-form';

// Dynamically import the LoginForm component with suspense
const DynamicLoginForm = dynamic(() => import('@/components/app/public/auth/login-form'), {
  ssr: true,
  loading: () => <LoginLoading />
});

export default function LoginPage() {
  return <DynamicLoginForm />;
}
