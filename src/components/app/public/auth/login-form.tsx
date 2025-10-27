
'use client';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/ui/form-input';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const loginSchema = z.object({
	email: z.string().email('Please enter a valid email.'),
	password: z.string().min(1, 'Password is required.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
	const router = useRouter();
	const { login, user } = useAuth();
	const { toast } = useToast();
	const [isLoading, setIsLoading] = React.useState(false);

	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	React.useEffect(() => {
		if (user) {
			const { userType } = user;
			if (userType === 'SYSTEM' || userType === 'IIFC_ADMIN') {
				router.push('/admin');
			} else if (userType === 'JOB_SEEKER') {
				router.push('/jobseeker');
			} else {
				router.push('/');
			}
		}
	}, [user, router]);

	const onSubmit = async (data: LoginFormValues) => {
		setIsLoading(true);
		try {
			await login(data.email, data.password);
			toast({
				title: 'Login Successful',
				description: 'Welcome back!',
				variant: 'success',
			});
			// Redirection is handled by the useEffect
		} catch (error: any) {
			toast({
				title: 'Login Failed',
				description: error?.message || 'Invalid email or password. Please try again.',
				variant: 'danger',
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='w-full space-y-6'>
			<div className='text-center'>
				<h1 className='text-3xl font-bold font-headline'>Welcome Back</h1>
				<p className='text-muted-foreground'>Sign in to continue to your account.</p>
			</div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
					<FormInput
						control={form.control}
						name='email'
						label='Email'
						type='email'
						placeholder='you@example.com'
						required
					/>
					<FormInput
						control={form.control}
						name='password'
						label='Password'
						type='password'
						placeholder='••••••••'
						required
					/>
					<Button type='submit' className='w-full' disabled={isLoading}>
						{isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
						Sign In
					</Button>
				</form>
			</Form>
			<div className='relative'>
				<Separator />
				<div className='absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center'>
					<span className='bg-background px-2 text-sm text-muted-foreground'>OR</span>
				</div>
			</div>
			<p className='text-center text-sm'>
				Don&apos;t have an account?{' '}
				<Button variant='link' className='p-0 h-auto' asChild>
					<Link href='/signup'>Sign up</Link>
				</Button>
			</p>
		</div>
	);
}
