
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/ui/form-input';
import { toast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save } from 'lucide-react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { AuthService } from '@/services/api/auth.service';

const changePasswordSchema = z
	.object({
		currentPassword: z.string().min(1, 'Current password is required'),
		newPassword: z.string().min(8, 'New password must be at least 8 characters.'),
		confirmPassword: z.string(),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "New passwords don't match",
		path: ['confirmPassword'],
	});

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export function ChangePasswordForm() {
	const [isLoading, setIsLoading] = React.useState(false);

	const form = useForm<ChangePasswordFormValues>({
		resolver: zodResolver(changePasswordSchema),
		defaultValues: {
			currentPassword: '',
			newPassword: '',
			confirmPassword: '',
		},
	});

	const onSubmit = (data: ChangePasswordFormValues) => {
		setIsLoading(true);
		AuthService.changePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword })
			.then(() => {
				toast.success({
					title: 'Password Updated',
					description: 'Your password has been changed successfully.',
				});
				form.reset();
			})
			.catch((err: any) => {
				toast.error({
					title: 'Update Failed',
					description: err.message || 'There was a problem changing your password.',
				});
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<Card className='glassmorphism'>
					<CardContent className='space-y-4 pt-6'>
						<FormInput
							control={form.control}
							name='currentPassword'
							label='Current Password'
							type='password'
							required
						/>
						<FormInput
							control={form.control}
							name='newPassword'
							label='New Password'
							type='password'
							required
						/>
						<FormInput
							control={form.control}
							name='confirmPassword'
							label='Confirm New Password'
							type='password'
							required
						/>
					</CardContent>
					<CardFooter>
						<Button type='submit' disabled={isLoading}>
							{isLoading ? (
								<Loader2 className='mr-2 h-4 w-4 animate-spin' />
							) : (
								<Save className='mr-2 h-4 w-4' />
							)}
							Save Changes
						</Button>
					</CardFooter>
				</Card>
			</form>
		</Form>
	);
}
