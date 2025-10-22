'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormLabel } from '@/components/ui/form';
import { FormInput } from '@/components/ui/form-input';
import { useToast } from '@/hooks/use-toast';
import { AuthService } from '@/services/api/auth.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z
	.object({
		firstName: z.string().min(1, 'First name is required.'),
		lastName: z.string().min(1, 'Last name is required.'),
		email: z.string().email('Please enter a valid email address.'),
		password: z.string().min(8, 'Password must be at least 8 characters.'),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	});

type SignupFormValues = z.infer<typeof formSchema>;

export default function SignupForm() {
	const { toast } = useToast();
	const router = useRouter();

	const form = useForm<SignupFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			firstName: '',
			lastName: '',
			email: '',
			password: '',
			confirmPassword: '',
		},
	});

	const onSubmit = async (data: SignupFormValues) => {
		try {
			await AuthService.signup(data);
			toast({
				title: 'Signup Successful',
				description: 'Your account has been created. Please log in.',
				variant: 'success',
			});
			router.push('/login');
		} catch (error: any) {
			toast({
				title: 'Signup Failed',
				description: error.message || 'An error occurred. Please try again.',
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
				<CardTitle className='font-headline'>Create an Account</CardTitle>
				<CardDescription>Join our talent network to find your next opportunity.</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
						<div className='grid grid-cols-2 gap-4'>
							<FormInput
								control={form.control}
								name='firstName'
								label='First Name'
								placeholder='e.g. John'
								required
							/>
							<FormInput
								control={form.control}
								name='lastName'
								label='Last Name'
								placeholder='e.g. Doe'
								required
							/>
						</div>
						<FormInput
							control={form.control}
							name='email'
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
							placeholder='••••••••'
							required
						/>
						<FormInput
							control={form.control}
							name='confirmPassword'
							label='Confirm Password'
							type='password'
							placeholder='••••••••'
							required
						/>

						<Button type='submit' className='w-full' disabled={form.formState.isSubmitting}>
							{form.formState.isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
							Create Account
						</Button>
					</form>
				</Form>
			</CardContent>
			<CardFooter className='flex-col items-start gap-4'>
				<div className='text-center w-full'>
					<p className='text-sm text-muted-foreground'>
						{'Already have an account? '}
						<Link href='/login' className='text-primary font-medium hover:underline'>
							Sign In
						</Link>
					</p>
				</div>
			</CardFooter>
		</Card>
	);
}
