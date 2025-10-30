'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/ui/form-input';
import { useAuth } from '@/contexts/auth-context';
import { toast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, LogIn } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const loginSchema = z.object({
	username: z.string().min(1, 'Username or Email is required.'),
	password: z.string().min(1, 'Password is required.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
	const { login } = useAuth();
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			username: '',
			password: '',
		},
	});

	const onSubmit = async (data: LoginFormValues) => {
		setIsLoading(true);
		setError(null);
		try {
			const user = await login(data.username, data.password);
			toast.success({description: 'Logged in successfully.'});
			if (user?.userType === 'SYSTEM' || user?.userType === 'IIFC_ADMIN') {
				router.push('/admin');
			} else {
				router.push('/jobseeker');
			}
		} catch (err: any) {
			setError(err.message || 'An unexpected error occurred. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<CardContent className='space-y-4'>
						{error && (
							<Alert variant='danger'>
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}
						<FormInput
							control={form.control}
							name='username'
							label='Username or Email'
							placeholder='you@example.com'
							required
						/>
						<FormInput
							control={form.control}
							name='password'
							label='Password'
							type='password'
							placeholder='Enter your password'
							required
						/>
						<div className='text-right text-sm'>
							<Link href='/forgot-password' className='text-primary hover:underline'>
								Forgot Password?
							</Link>
						</div>
					</CardContent>
					<CardFooter className='flex flex-col gap-4'>
						<Button type='submit' className='w-full' disabled={isLoading}>
							{isLoading ? (
								<Loader2 className='mr-2 h-4 w-4 animate-spin' />
							) : (
								<LogIn className='mr-2 h-4 w-4' />
							)}
							Log In
						</Button>
						<p className='text-sm text-center text-muted-foreground'>
							Don&apos;t have an account?{' '}
							<Link href='/signup' className='text-primary hover:underline font-semibold'>
								Sign up
							</Link>
						</p>
					</CardFooter>
				</form>
			</Form>
		</>
	);
}
