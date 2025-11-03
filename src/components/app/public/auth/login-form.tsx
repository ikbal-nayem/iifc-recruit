'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/ui/form-input';
import { ROUTES } from '@/constants/routes.constant';
import { useAuth } from '@/contexts/auth-context';
import { SessionStorageService } from '@/services/storage.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
	username: z.string().email('Please enter a valid email address.'),
	password: z.string().min(1, 'Password is required.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function LoginForm() {
	const { login } = useAuth();
	const router = useRouter();
	const searchParams = useSearchParams();
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const redirectUrl = searchParams.get('redirectUrl');
		if (redirectUrl) {
			SessionStorageService.set('redirectUrl', redirectUrl);
		}
	}, [searchParams]);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: '',
			password: '',
		},
	});

	const onSubmit = async (data: FormValues) => {
		setIsLoading(true);
		setError(null);
		try {
			await login(data.username, data.password);
			const redirectUrl = SessionStorageService.get('redirectUrl');
			SessionStorageService.delete('redirectUrl');

			if (redirectUrl) {
				router.push(redirectUrl);
			} else {
				router.push(ROUTES.DASHBOARD.ADMIN);
			}
		} catch (err: any) {
			setError(err.message || 'Login failed. Please check your credentials.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<CardContent>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
					{error && (
						<Alert variant='danger'>
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}
					<FormInput
						control={form.control}
						name='username'
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
						placeholder='Enter your password'
						required
					/>
					<div className='flex items-center justify-between'>
						<div className='text-sm'>
							<Link href={ROUTES.AUTH.FORGOT_PASSWORD} className='text-primary hover:underline'>
								Forgot password?
							</Link>
						</div>
					</div>
					<Button type='submit' className='w-full' disabled={isLoading}>
						{isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
						Log In
					</Button>
					<div className='text-center text-sm'>
						Don&apos;t have an account?{' '}
						<Link href={ROUTES.AUTH.SIGNUP} className='text-primary hover:underline'>
							Sign up
						</Link>
					</div>
				</form>
			</Form>
		</CardContent>
	);
}