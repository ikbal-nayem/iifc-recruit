
'use client';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/ui/form-input';
import { toast } from '@/hooks/use-toast';
import { AuthService } from '@/services/api/auth.service';
import { UserService } from '@/services/api/user.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const passwordSchema = z
	.object({
		newPassword: z.string().min(8, 'Password must be at least 8 characters.'),
		confirmPassword: z.string(),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	});

type PasswordFormValues = z.infer<typeof passwordSchema>;

interface PasswordResetDialogProps {
	user: { id: string; fullName: string };
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function PasswordResetDialog({ user, open, onOpenChange }: PasswordResetDialogProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<PasswordFormValues>({
		resolver: zodResolver(passwordSchema),
		defaultValues: { newPassword: '', confirmPassword: '' },
	});

	const handleSubmit = async (data: PasswordFormValues) => {
		setIsSubmitting(true);
		try {
			await AuthService.changePassword({
				userId: user.id,
				newPassword: data.newPassword,
			});
			toast.success({
				title: 'Password Reset',
				description: `Password for ${user.fullName} has been successfully reset.`,
			});
			onOpenChange(false);
		} catch (error: any) {
			toast.error({
				title: 'Error',
				description: error.message || 'Failed to reset password.',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Reset Password</DialogTitle>
					<DialogDescription>
						You are about to reset the password for{' '}
						<span className='font-semibold text-foreground'>{user.fullName}</span>. Please enter a new password
						below.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4 py-2'>
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
						<DialogFooter className='pt-4'>
							<Button type='button' variant='ghost' onClick={() => onOpenChange(false)} disabled={isSubmitting}>
								Cancel
							</Button>
							<Button type='submit' disabled={isSubmitting}>
								{isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
								Reset Password
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
