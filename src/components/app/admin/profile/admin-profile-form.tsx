
'use client';

import { ChangePasswordForm } from '@/components/app/change-password-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FormInput } from '@/components/ui/form-input';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { UserService } from '@/services/api/user.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Mail, Phone, Save, Upload } from 'lucide-react';
import Image from 'next/image';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const profileImageSchema = z.object({
	avatarFile: z
		.any()
		.refine((file) => !!file, 'Please select an image.')
		.refine(
			(file) => ['image/jpeg', 'image/png', 'image/gif'].includes(file?.type),
			'Only .jpg, .png, and .gif formats are supported.'
		)
		.refine((file) => file?.size <= 10 * 1024 * 1024, `Max file size is 10MB.`),
});

type ProfileImageFormValues = z.infer<typeof profileImageSchema>;

function ProfileImageCard({ avatar }: { avatar: string }) {
	const { toast } = useToast();
	const [avatarPreview, setAvatarPreview] = React.useState<string | null>(avatar);
	const [isSubmitting, setIsSubmitting] = React.useState(false);

	const form = useForm<ProfileImageFormValues>({
		resolver: zodResolver(profileImageSchema),
	});

	const avatarFile = form.watch('avatarFile');

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			form.setValue('avatarFile', file, { shouldValidate: true });
			if (avatarPreview && avatarPreview.startsWith('blob:')) {
				URL.revokeObjectURL(avatarPreview);
			}
			setAvatarPreview(URL.createObjectURL(file));
			form.clearErrors('avatarFile');
		}
	};

	const onImageSubmit = (data: ProfileImageFormValues) => {
		setIsSubmitting(true);
		const formData = new FormData();
		formData.append('file', data.avatarFile);

		UserService.saveProfileImage(formData)
			.then((res) => {
				toast({
					title: 'Photo Updated',
					description: res.message || 'Your new profile photo has been saved.',
					variant: 'success',
				});
				form.reset();
			})
			.catch((err) => {
				toast({
					title: 'Upload Failed',
					description: err.message || 'There was a problem uploading your photo.',
					variant: 'danger',
				});
			})
			.finally(() => {
				setIsSubmitting(false);
			});
	};

	return (
		<Card className='glassmorphism'>
			<CardHeader>
				<CardTitle>Profile Photo</CardTitle>
			</CardHeader>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onImageSubmit)}>
					<CardContent className='space-y-4'>
						<div className='flex items-center gap-6'>
							<Image
								src={avatarPreview || avatar}
								alt='Admin Avatar'
								width={80}
								height={80}
								className='rounded-full object-cover h-20 w-20 border'
								data-ai-hint='avatar person'
							/>
							<FormField
								control={form.control}
								name='avatarFile'
								render={({ field }) => (
									<FormItem>
										<FormLabel
											htmlFor='avatar-upload'
											className='font-normal text-sm text-muted-foreground'
										>
											<Button asChild variant='outline'>
												<span>Choose Photo</span>
											</Button>
											<FormControl>
												<Input
													id='avatar-upload'
													type='file'
													className='sr-only'
													accept='image/png, image/jpeg, image/gif'
													onChange={handleFileChange}
												/>
											</FormControl>
											<p className='text-xs pt-2'>PNG, JPG, GIF up to 10MB</p>
										</FormLabel>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</CardContent>
					<CardFooter>
						<Button type='submit' disabled={!avatarFile || isSubmitting}>
							{isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
							Save Photo
						</Button>
					</CardFooter>
				</form>
			</Form>
		</Card>
	);
}

interface AdminProfileFormProps {
	user: {
		name: string;
		email: string;
		phone: string;
		avatar: string;
	};
}

const profileSchema = z.object({
	firstName: z.string().min(1, 'First name is required'),
	lastName: z.string().min(1, 'Last name is required'),
	email: z.string().email(),
	phone: z.string().min(1, 'Phone number is required'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function AdminProfileForm({ user }: AdminProfileFormProps) {
	const { toast } = useToast();
	const nameParts = user.name.split(' ');

	const form = useForm<ProfileFormValues>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			firstName: nameParts[0] || '',
			lastName: nameParts.slice(1).join(' ') || '',
			email: user.email,
			phone: user.phone,
		},
	});

	const onSubmit = (data: ProfileFormValues) => {
		toast({
			title: 'Profile Updated',
			description: 'Your personal information has been saved.',
			variant: 'success',
		});
		console.log(data);
	};

	return (
		<div className='space-y-6'>
			<ProfileImageCard avatar={user.avatar} />
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<Card className='glassmorphism pt-6'>
						<CardHeader>
							<CardTitle>Personal Details</CardTitle>
						</CardHeader>
						<CardContent className='space-y-6'>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<FormInput control={form.control} name='firstName' label='First Name' placeholder='e.g. John' required />
								<FormInput control={form.control} name='lastName' label='Last Name' placeholder='e.g. Doe' required />
							</div>

							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<FormField
									control={form.control}
									name='email'
									render={({ field }) => (
										<FormItem>
											<FormLabel required>Email</FormLabel>
											<FormControl>
												<div className='relative flex items-center'>
													<Mail className='absolute left-3 h-4 w-4 text-muted-foreground' />
													<Input type='email' {...field} className='pl-10' />
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='phone'
									render={({ field }) => (
										<FormItem>
											<FormLabel required>Phone</FormLabel>
											<FormControl>
												<div className='relative flex items-center'>
													<Phone className='absolute left-3 h-4 w-4 text-muted-foreground' />
													<Input {...field} className='pl-10' />
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</CardContent>
						<CardFooter>
							<Button type='submit'>
								<Save className='mr-2 h-4 w-4' />
								Save Changes
							</Button>
						</CardFooter>
					</Card>
				</form>
			</Form>
			<ChangePasswordForm />
		</div>
	);
}
