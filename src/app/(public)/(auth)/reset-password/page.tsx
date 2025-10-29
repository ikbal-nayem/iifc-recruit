'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/ui/form-input';
import { useToast } from '@/hooks/use-toast';
import { AuthService } from '@/services/api/auth.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';

const resetSchema = z
	.object({
		otp: z.string().length(6, 'OTP must be 6 characters.'),
		newPassword: z.string().min(8, 'Password must be at least 8 characters.'),
		confirmPassword: z.string(),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	});

type ResetFormValues = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
	const { toast } = useToast();
	const router = useRouter();
	const searchParams = useSearchParams();
	const email = searchParams.get('email');
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<ResetFormValues>({
		resolver: zodResolver(resetSchema),
		defaultValues: {
			otp: '',
			newPassword: '',
			confirmPassword: '',
		},
	});

	if (!email) {
		return (
			<div className='text-center'>
				<p>Invalid request. Please start the forgot password process again.</p>
				<Button asChild className='mt-4'>
					<Link href='/forgot-password'>Go Back</Link>
				</Button>
			</div>
		);
	}

	const onSubmit = async (data: ResetFormValues) => {
		setIsLoading(true);
		setError(null);
		try {
			await AuthService.resetPassword({
				email,
				otp: data.otp,
				password: data.newPassword,
			});
			toast({
				title: 'Password Reset Successful',
				description: 'You can now log in with your new password.',
				variant: 'success',
			});
			router.push('/login');
		} catch (err: any) {
			setError(err.message || 'Failed to reset password. Please check your OTP and try again.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card className='w-full max-w-sm glassmorphism'>
			<CardHeader className='text-center'>
				<CardTitle className='text-2xl font-headline'>Reset Your Password</CardTitle>
				<CardDescription>Enter the OTP sent to {email} and your new password.</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
						{error && (
							<Alert variant='danger'>
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}
						<FormInput control={form.control} name='otp' label='OTP' placeholder='Enter 6-digit OTP' required />
						<FormInput
							control={form.control}
							name='newPassword'
							label='New Password'
							type='password'
							placeholder='Enter new password'
							required
						/>
						<FormInput
							control={form.control}
							name='confirmPassword'
							label='Confirm New Password'
							type='password'
							placeholder='Confirm new password'
							required
						/>
						<Button type='submit' className='w-full' disabled={isLoading}>
							{isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
							Reset Password
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
