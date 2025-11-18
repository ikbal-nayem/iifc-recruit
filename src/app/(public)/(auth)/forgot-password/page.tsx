'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/ui/form-input';
import { useToast } from '@/hooks/use-toast';
import { AuthService } from '@/services/api/auth.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
	email: z.string().email('Please enter a valid email address.'),
});

type FormValues = z.infer<typeof formSchema>;

const translations = {
	en: {
		title: 'Forgot Password',
		description: 'Enter your email to receive a password reset OTP.',
		emailLabel: 'Email/Phone Number',
		emailPlaceholder: 'you@example.com',
		sendOtp: 'Send OTP',
		backToLogin: 'Back to Login',
		otpSent: 'OTP Sent',
		otpSentDesc: 'An OTP has been sent to your email address.',
		errorDefault: 'Failed to send OTP. Please try again.',
	},
	bn: {
		title: 'পাসওয়ার্ড ভুলে গেছেন?',
		description: 'পাসওয়ার্ড রিসেট OTP পেতে আপনার ইমেল প্রবেশ করুন।',
		emailLabel: 'ইমেল/ফোন নম্বর',
		emailPlaceholder: 'you@example.com',
		sendOtp: 'OTP পাঠান',
		backToLogin: 'লগইনে ফিরে যান',
		otpSent: 'OTP পাঠানো হয়েছে',
		otpSentDesc: 'আপনার ইমেল ঠিকানায় একটি OTP পাঠানো হয়েছে।',
		errorDefault: 'OTP পাঠাতে ব্যর্থ। অনুগ্রহ করে আবার চেষ্টা করুন।',
	}
};

export default function ForgotPasswordPage() {
	const { toast } = useToast();
	const router = useRouter();
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

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
		},
	});

	const onSubmit = async (data: FormValues) => {
		setIsLoading(true);
		setError(null);
		try {
			await AuthService.forgotPassword(data.email);
			toast({
				title: t.otpSent,
				description: t.otpSentDesc,
				variant: 'success',
			});
			router.push(`/reset-password?email=${encodeURIComponent(data.email)}`);
		} catch (err: any) {
			setError(err.message || t.errorDefault);
		} finally {
			setIsLoading(false);
		}
	};

	if (!isClient) return null;

	return (
		<Card className='w-full max-w-sm glassmorphism'>
			<CardHeader className='text-center'>
				<CardTitle className='text-2xl font-headline'>{t.title}</CardTitle>
				<CardDescription>{t.description}</CardDescription>
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
							name='email'
							label={t.emailLabel}
							type='email'
							placeholder={t.emailPlaceholder}
							required
						/>
						<Button type='submit' className='w-full' disabled={isLoading}>
							{isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
							{t.sendOtp}
						</Button>
						<div className='text-center text-sm'>
							<Link href='/login' className='text-primary hover:underline'>
								{t.backToLogin}
							</Link>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
