'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FormInput } from '@/components/ui/form-input';
import { AUTH_INFO } from '@/constants/auth.constant';
import { useToast } from '@/hooks/use-toast';
import { IAuthInfo } from '@/interfaces/auth.interface';
import { AuthService } from '@/services/api/auth.service';
import { LocalStorageService } from '@/services/storage.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
	email: z.string().email('Please enter a valid email address.'),
	password: z.string().min(1, 'Password is required.'),
});

type LoginFormValues = z.infer<typeof formSchema>;

export default function LoginForm() {
	const { toast } = useToast();
	const router = useRouter();

	const form = useForm<LoginFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: { email: '', password: '' },
	});

	const onSubmit = async (data: LoginFormValues) => {
		try {
			const res = await AuthService.login(data);
			const authInfo: IAuthInfo = {
				accessToken: res.body.token,
				refreshToken: res.body.token,
				expiresIn: 3600,
			};
			LocalStorageService.set(AUTH_INFO, authInfo);
			toast({
				title: 'Login Successful',
				description: 'Welcome back!',
				variant: 'success',
			});
			router.push('/jobseeker');
		} catch (error: any) {
			toast({
				title: 'Login Failed',
				description: error.message || 'Please check your credentials and try again.',
				variant: 'danger',
			});
		}
	};

	return (
		<Card className='glassmorphism w-full'>
			<CardHeader className='text-center'>
				<div className='flex justify-center mb-4'>
					<Image src='/iifc-logo.png' alt='IIFC Logo' width={48} height={48} className='h-12 w-auto' />
				</div>
				<CardTitle className='font-headline'>Welcome Back!</CardTitle>
				<CardDescription>Sign in to your account to continue.</CardDescription>
			</CardHeader>
			<CardContent>
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
						<div className='space-y-2'>
							<div className='flex justify-between items-center'>
								<FormLabel required>Password</FormLabel>
								<Link href='#' className='text-xs text-primary hover:underline'>
									Forgot password?
								</Link>
							</div>
							<FormInput
								control={form.control}
								name='password'
								label=''
								type='password'
								placeholder='••••••••'
							/>
						</div>

						<Button type='submit' className='w-full' disabled={form.formState.isSubmitting}>
							{form.formState.isSubmitting ? (
								<Loader2 className='mr-2 h-4 w-4 animate-spin' />
							) : null}
							Sign In
						</Button>
					</form>
				</Form>
			</CardContent>
			<CardFooter className='flex-col items-start gap-4'>
				<div className='text-center w-full'>
					<p className='text-sm text-muted-foreground'>
						{"Don't have an account? "}
						<Link href='/signup' className='text-primary font-medium hover:underline'>
							Sign Up
						</Link>
					</p>
				</div>
			</CardFooter>
		</Card>
	);
}
