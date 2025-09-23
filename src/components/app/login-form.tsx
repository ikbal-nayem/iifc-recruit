
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Mail, Lock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import NProgress from 'nprogress';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import {
  Form,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { FormInput } from '@/components/ui/form-input';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;


export default function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    NProgress.start();
    setIsLoading(true);
    toast({
      title: 'Login Successful',
      description: 'Redirecting to your dashboard...',
      variant: 'success',
    });

    if (data.email.includes('admin')) {
      router.push('/admin');
    } else {
      router.push('/jobseeker');
    }
    
    // We may not see the loading state change if redirection is too fast,
    // but it's good practice to handle it.
    setIsLoading(false);
  };

  return (
    <Card className="glassmorphism">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
               <Image src="/iifc-logo.png" alt="IIFC Logo" width={48} height={48} className="h-12 w-auto" />
            </div>
            <CardTitle className="text-3xl font-bold font-headline">Welcome Back</CardTitle>
            <CardDescription className="pt-2">
            Sign in to access your account.
            </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormInput
                control={form.control}
                name="email"
                label="Email"
                type="email"
                placeholder="you@example.com"
                required
                startIcon={<Mail className="h-4 w-4 text-muted-foreground" />}
              />
               <FormInput
                control={form.control}
                name="password"
                label="Password"
                type="password"
                placeholder="••••••••"
                required
                startIcon={<Lock className="h-4 w-4 text-muted-foreground" />}
              >
                 <Link href="#" className="ml-auto inline-block text-sm text-primary hover:underline">
                    Forgot password?
                </Link>
              </FormInput>
              <Button type="submit" className="w-full h-11 text-base" disabled={isLoading}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex-col items-start gap-4">
           <div className="text-center text-sm w-full">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="font-semibold text-primary hover:underline">Sign up</Link>
          </div>
        </CardFooter>
    </Card>
  );
}
