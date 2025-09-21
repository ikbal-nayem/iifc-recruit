
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Mail, User, Lock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import NProgress from 'nprogress';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { FormInput } from '@/components/ui/form-input';

const signupSchema = z.object({
  firstName: z.string().min(1, 'First name is required.'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required.'),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long.' }),
});

type SignupFormValues = z.infer<typeof signupSchema>;


export default function SignupForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    NProgress.start();
    setIsLoading(true);

    toast({
      title: 'Signup Successful',
      description: 'Redirecting to your dashboard...',
      variant: 'success'
    });

    router.push('/jobseeker');
    
    setIsLoading(false);
  };

  return (
     <Card className="glassmorphism">
        <CardHeader className="text-center">
             <div className="flex justify-center mb-4">
               <Image src="/iifc-logo.png" alt="IIFC Logo" width={48} height={48} className="h-12 w-auto" />
            </div>
            <CardTitle className="text-3xl font-bold font-headline">Create an Account</CardTitle>
            <CardDescription className="pt-2">
              Enter your information to get started.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormInput control={form.control} name="firstName" label="First Name" required />
                        <FormInput control={form.control} name="lastName" label="Last Name" required />
                    </div>
                    <FormInput control={form.control} name="email" label="Email" type="email" placeholder="you@example.com" required startIcon={<Mail className="h-4 w-4 text-muted-foreground" />} />
                    <FormInput control={form.control} name="password" label="Password" type="password" placeholder="••••••••" required startIcon={<Lock className="h-4 w-4 text-muted-foreground" />} />
                    
                    <Button type="submit" className="w-full h-11 text-base" disabled={isLoading}>
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                </form>
            </Form>
        </CardContent>
         <CardFooter className="flex-col items-start gap-4">
           <div className="text-center text-sm w-full">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-primary hover:underline">Sign in</Link>
          </div>
        </CardFooter>
      </Card>
  );
}
