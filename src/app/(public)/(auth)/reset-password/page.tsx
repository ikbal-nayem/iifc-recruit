'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/ui/form-input';
import { toast } from '@/hooks/use-toast';
import { AuthService } from '@/services/api/auth.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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

const translations = {
	en: {
		title: 'Reset Your Password',
		description: 'Enter the OTP sent to {{email}} and your new password.',
		otpLabel: 'OTP',
		otpPlaceholder: 'Enter 6-digit OTP',
		newPasswordLabel: 'New Password',
		newPasswordPlaceholder: 'Enter new password',
		confirmPasswordLabel: 'Confirm New Password',
		confirmPasswordPlaceholder: 'Confirm new password',
		resetButton: 'Reset Password',
		invalidRequest: 'Invalid request. Please start the forgot password process again.',
		goBack: 'Go Back',
		resetSuccess: 'Password Reset Successful',
		resetSuccessDesc: 'You can now log in with your new password.',
		resetError: 'Failed to reset password. Please check your OTP and try again.',
	},
	bn: {
		title: 'আপনার পাসওয়ার্ড রিসেট করুন',
		description: '{{email}}-এ পাঠানো OTP এবং আপনার নতুন পাসওয়ার্ড প্রবেশ করুন।',
		otpLabel: 'OTP',
		otpPlaceholder: '৬ অঙ্কের OTP প্রবেশ করুন',
		newPasswordLabel: 'নতুন পাসওয়ার্ড',
		newPasswordPlaceholder: 'নতুন পাসওয়ার্ড প্রবেশ করুন',
		confirmPasswordLabel: 'নতুন পাসওয়ার্ড নিশ্চিত করুন',
		confirmPasswordPlaceholder: 'নতুন পাসওয়ার্ড নিশ্চিত করুন',
		resetButton: 'পাসওয়ার্ড রিসেট করুন',
		invalidRequest: 'অবৈধ অনুরোধ। অনুগ্রহ করে পাসওয়ার্ড ভুলে যাওয়া প্রক্রিয়া শুরু করুন।',
		goBack: 'ফিরে যান',
		resetSuccess: 'পাসওয়ার্ড রিসেট সফল',
		resetSuccessDesc: 'এখন আপনি আপনার নতুন পাসওয়ার্ড দিয়ে লগইন করতে পারেন।',
		resetError: 'পাসওয়ার্ড রিসেট করতে ব্যর্থ। আপনার OTP পরীক্ষা করুন এবং আবার চেষ্টা করুন।',
	},
};

export default function ResetPasswordPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const email = searchParams.get('email');
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isClient, setIsClient] = useState(false);
	const [locale, setLocale] = useState<'en' | 'bn'>('en');

	useEffect(() => {
		setIsClient(true);
		const cookieLocale = document.cookie
			.split('; ')
			.find((row) => row.startsWith('NEXT_LOCALE='))
			?.split('=')[1] as 'en' | 'bn' | undefined;

		if (cookieLocale && (cookieLocale === 'en' || cookieLocale === 'bn')) {
			setLocale(cookieLocale);
		}
	}, []);

	const t = translations[locale];

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
				<p>{t.invalidRequest}</p>
				<Button asChild className='mt-4'>
					<Link href='/forgot-password'>{t.goBack}</Link>
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
			toast.success({
				title: t.resetSuccess,
				description: t.resetSuccessDesc,
			});
			router.push('/login');
		} catch (err: any) {
			setError(err.message || t.resetError);
		} finally {
			setIsLoading(false);
		}
	};

	if (!isClient) return null;

	return (
		<Card className='w-full max-w-sm glassmorphism'>
			<CardHeader className='text-center'>
				<CardTitle className='text-2xl font-headline'>{t.title}</CardTitle>
				<CardDescription>{t.description.replace('{{email}}', email)}</CardDescription>
			</CardHeader>
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
							name='otp'
							label={t.otpLabel}
							placeholder={t.otpPlaceholder}
							required
						/>
						<FormInput
							control={form.control}
							name='newPassword'
							label={t.newPasswordLabel}
							type='password'
							placeholder={t.newPasswordPlaceholder}
							required
						/>
						<FormInput
							control={form.control}
							name='confirmPassword'
							label={t.confirmPasswordLabel}
							type='password'
							placeholder={t.confirmPasswordPlaceholder}
							required
						/>
						<Button type='submit' className='w-full' disabled={isLoading}>
							{isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
							{t.resetButton}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
