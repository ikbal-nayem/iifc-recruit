
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { FormInput } from '@/components/ui/form-input';
import { useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { AuthService } from '@/services/api/auth.service';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';

const signupSchema = z
	.object({
		firstName: z.string().min(1, 'First name is required.'),
		lastName: z.string().min(1, 'Last name is required.'),
		email: z.string().email('Please enter a valid email.'),
		password: z
			.string()
			.min(8, 'Password must be at least 8 characters long.')
			.regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
			.regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
			.regex(/[0-9]/, 'Password must contain at least one number.'),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupForm() {
	const { toast } = useToast();
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const form = useForm<SignupFormValues>({
		resolver: zodResolver(signupSchema),
		defaultValues: {
			firstName: '',
			lastName: '',
			email: '',
			password: '',
			confirmPassword: '',
		},
	});

	async function onSubmit(data: SignupFormValues) {
		setIsLoading(true);
		setError(null);
		try {
			await AuthService.signup({
				firstName: data.firstName,
				lastName: data.lastName,
				email: data.email,
				password: data.password,
			});
			toast({
				title: 'Account Created!',
				description: 'You can now log in with your new credentials.',
				variant: 'success',
			});
			router.push('/login');
		} catch (err: any) {
			setError(err.message || 'An unexpected error occurred. Please try again.');
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Card className='w-full max-w-sm glassmorphism'>
			<CardHeader className='text-center'>
				<CardTitle className='text-2xl font-headline'>Create an Account</CardTitle>
				<CardDescription>Join our platform to find your next opportunity.</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
						{error && (
							<Alert variant='danger'>
								<AlertDescription className='flex items-center gap-2'>
									<AlertCircle className='h-4 w-4' />
									{error}
								</AlertDescription>
							</Alert>
						)}
						<div className='grid grid-cols-2 gap-4'>
							<FormInput control={form.control} name='firstName' label='First Name' required disabled={isLoading}/>
							<FormInput control={form.control} name='lastName' label='Last Name' required disabled={isLoading}/>
						</div>
						<FormInput
							control={form.control}
							name='email'
							label='Email'
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
							required
							disabled={isLoading}
						/>
						<FormInput
							control={form.control}
							name='confirmPassword'
							label='Confirm Password'
							type='password'
							required
							disabled={isLoading}
						/>
						<Button type='submit' className='w-full' disabled={isLoading}>
							{isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
							Create Account
						</Button>
					</form>
				</Form>
				<div className='mt-4 text-center text-sm'>
					Already have an account?{' '}
					<Link href='/login' className='underline text-primary'>
						Sign in
					</Link>
				</div>
			</CardContent>
		</Card>
	);
}
