
'use client';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/ui/form-input';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { AuthService } from '@/services/api/auth.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const signupSchema = z
	.object({
		firstName: z.string().min(1, 'First name is required'),
		lastName: z.string().min(1, 'Last name is required'),
		email: z.string().email('Please enter a valid email.'),
		password: z
			.string()
			.min(8, 'Password must be at least 8 characters long.')
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
				'Password must contain at least one uppercase letter, one lowercase letter, and one number.'
			),
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
	const [isLoading, setIsLoading] = React.useState(false);

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

	const onSubmit = async (data: SignupFormValues) => {
		setIsLoading(true);
		try {
			await AuthService.signup({
				firstName: data.firstName,
				lastName: data.lastName,
				email: data.email,
				password: data.password,
			});
			toast({
				title: 'Account Created!',
				description: 'Your account has been successfully created. Please log in.',
				variant: 'success',
			});
			router.push('/login');
		} catch (error: any) {
			toast({
				title: 'Signup Failed',
				description: error?.message || 'There was a problem creating your account.',
				variant: 'danger',
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='w-full space-y-6'>
			<div className='text-center'>
				<h1 className='text-3xl font-bold font-headline'>Create an Account</h1>
				<p className='text-muted-foreground'>Start your journey with us today.</p>
			</div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
					<div className='grid grid-cols-2 gap-4'>
						<FormInput control={form.control} name='firstName' label='First Name' placeholder='John' required />
						<FormInput control={form.control} name='lastName' label='Last Name' placeholder='Doe' required />
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
					<Button type='submit' className='w-full' disabled={isLoading}>
						{isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
						Create Account
					</Button>
				</form>
			</Form>
			<div className='relative'>
				<Separator />
				<div className='absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center'>
					<span className='bg-background px-2 text-sm text-muted-foreground'>OR</span>
				</div>
			</div>
			<p className='text-center text-sm'>
				Already have an account?{' '}
				<Button variant='link' className='p-0 h-auto' asChild>
					<Link href='/login'>Sign in</Link>
				</Button>
			</p>
		</div>
	);
}
