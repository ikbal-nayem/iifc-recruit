'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/ui/form-input';
import { useAuth } from '@/contexts/auth-context';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const loginSchema = z.object({
	username: z.string().min(6, 'Please enter a valid email or phone number.'),
	password: z.string().min(6, 'Password should be at least 6 digit.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
	const { login } = useAuth();
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			username: '',
			password: '',
		},
	});

	async function onSubmit(data: LoginFormValues) {
		setIsLoading(true);
		setError(null);
		try {
			const user = await login(data.username, data.password);
			user && user.userType === 'JOB_SEEKER' ? router.push('/jobseeker') : router.push('/admin');
		} catch (err: any) {
			setError(err.message || 'An unexpected error occurred. Please try again.');
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Card className='w-full max-w-sm glassmorphism'>
			<CardHeader className='text-center'>
				<CardTitle className='text-2xl font-headline'>Welcome Back!</CardTitle>
				<CardDescription>Enter your credentials to access your account.</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
						{error && (
							<Alert variant='danger'>
								<AlertDescription className='flex items-center gap-2'>{error}</AlertDescription>
							</Alert>
						)}
						<FormInput
							control={form.control}
							name='username'
							label='Email/Phone'
							type='email'
							placeholder='you@example.com'
							required
							disabled={isLoading}
						/>
						<FormInput
							control={form.control}
							name='password'
							label='Password'
							type='password'
							placeholder='******'
							required
							disabled={isLoading}
						/>
						<Button type='submit' className='w-full' disabled={isLoading}>
							{isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
							Sign In
						</Button>
					</form>
				</Form>
				<div className='mt-4 text-center text-sm'>
					Don&apos;t have an account?{' '}
					<Link href='/signup' className='underline text-primary'>
						Sign up
					</Link>
				</div>
			</CardContent>
		</Card>
	);
}
