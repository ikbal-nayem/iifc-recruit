
import LoginForm from '@/components/app/login-form';
import { LoginBanner } from '@/components/app/login-banner';

export default function LoginPage() {
  return (
    <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-muted/50 relative overflow-hidden">
         <LoginBanner />
      </div>
      <main className="flex flex-col items-center justify-center p-4 bg-background">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </main>
    </div>
  );
}
