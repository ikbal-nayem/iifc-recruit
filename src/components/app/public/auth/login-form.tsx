'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import NProgress from 'nprogress';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/ui/form-input';
import { COMMON_URL } from '@/constants/common.constant';
import { useToast } from '@/hooks/use-toast';
import { AuthService } from '@/services/api/auth.service';
import { Alert, AlertDescription } from '../../../ui/alert';
import { SessionStorageService } from '@/services/storage.service';
import { AUTH_INFO } from '@/constants/auth.constant';
import { setAuthHeader } from '@/config/api.config';

const loginSchema = z.object({
	email: z.string().email({ message: 'Please enter a valid email address.' }),
	password: z.string().min(1, { message: 'Password is required.' }),
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
		form.clearErrors();
		setIsLoading(true);

		AuthService.login(data)
			.then((res) => {
				const { token } = res.body;
				SessionStorageService.set(AUTH_INFO, { accessToken: token });
				setAuthHeader(token);
				router.push('/admin');
				toast({
					description: res?.message || 'Login successful!',
					variant: 'success',
				});
			})
			.catch((error) => {
				form.setError('root', { message: error?.message || 'Login failed. Please try again.' });
			})
			.finally(() => {
				NProgress.done();
				setIsLoading(false);
			});
	};

	return (
		<Card className='glassmorphism'>
			<CardHeader className='text-center'>
				<div className='flex justify-center mb-4'>
					<Image src={COMMON_URL.SITE_LOGO} alt='IIFC Logo' width={48} height={48} className='h-12 w-auto' />
				</div>
				<CardTitle className='text-3xl font-bold font-headline'>Welcome Back</CardTitle>
				<CardDescription className='pt-2'>Enter your credentials to access your account.</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4' noValidate>
						<FormInput
							control={form.control}
							name='email'
							label='Email'
							type='email'
							placeholder='you@example.com'
							required
							startIcon={<Mail className='h-4 w-4 text-muted-foreground' />}
						/>
						<FormInput
							control={form.control}
							name='password'
							label='Password'
							type='password'
							placeholder='••••••••'
							required
							startIcon={<Lock className='h-4 w-4 text-muted-foreground' />}
						/>
						<div className='flex justify-end'>
							<Button variant='link' asChild className='p-0 h-auto'>
								<Link href='#'>Forgot Password?</Link>
							</Button>
						</div>

						{form.formState.errors.root?.message && (
							<Alert variant='danger' iconClassName='h-4 w-4'>
								<AlertDescription>{form.formState.errors.root?.message}</AlertDescription>
							</Alert>
						)}

						<Button type='submit' className='w-full h-11 text-base' disabled={isLoading}>
							{isLoading ? 'Signing in...' : 'Sign In'}
						</Button>
					</form>
				</Form>
			</CardContent>
			<CardFooter className='flex-col items-start gap-4'>
				<div className='text-center text-sm w-full'>
					Don&apos;t have an account?{' '}
					<Link href='/signup' className='font-semibold text-primary hover:underline'>
						Sign Up
					</Link>
				</div>
			</CardFooter>
		</Card>
	);
}
