'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/ui/form-input';
import { useToast } from '@/hooks/use-toast';
import { AuthService } from '@/services/api/auth.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';

const formSchema = z.object({
	email: z.string().email('Please enter a valid email address.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function ForgotPasswordPage() {
	const { toast } = useToast();
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

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
				title: 'OTP Sent',
				description: 'An OTP has been sent to your email address.',
				variant: 'success',
			});
			router.push(`/reset-password?email=${encodeURIComponent(data.email)}`);
		} catch (err: any) {
			setError(err.message || 'Failed to send OTP. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card className='w-full max-w-sm glassmorphism'>
			<CardHeader className='text-center'>
				<CardTitle className='text-2xl font-headline'>Forgot Password</CardTitle>
				<CardDescription>Enter your email to receive a password reset OTP.</CardDescription>
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
							label='Email'
							type='email'
							placeholder='you@example.com'
							required
						/>
						<Button type='submit' className='w-full' disabled={isLoading}>
							{isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
							Send OTP
						</Button>
						<div className='text-center text-sm'>
							<Link href='/login' className='text-primary hover:underline'>
								Back to Login
							</Link>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
