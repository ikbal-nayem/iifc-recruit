import { Building2 } from 'lucide-react';
import LoginForm from '@/components/app/login-form';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center justify-center space-y-4 mb-8">
          <div className="bg-primary p-3 rounded-full text-primary-foreground">
             <Building2 className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-headline font-bold text-center">
            IIFC Recruit
          </h1>
          <p className="text-muted-foreground text-center">
            Welcome back! Please sign in to continue.
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
