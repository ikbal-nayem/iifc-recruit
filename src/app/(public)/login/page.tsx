
import LoginForm from '@/components/app/login-form';
import { LoginBanner } from '@/components/app/login-banner';

export default function LoginPage() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 z-[-1] opacity-70">
        <LoginBanner />
      </div>
      <div className="w-full max-w-sm z-10">
        <div className="p-8 bg-background/80 backdrop-blur-lg rounded-xl border shadow-2xl">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
