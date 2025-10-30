
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
	const [avatarPreview, setAvatarPreview] = React.useState<string | null>(user.avatar);
	const [isImageSubmitting, setIsImageSubmitting] = React.useState(false);
	const [isDetailsSubmitting, setIsDetailsSubmitting] = React.useState(false);

	const imageForm = useForm<ProfileImageFormValues>({
		resolver: zodResolver(profileImageSchema),
	});

	const detailsForm = useForm<ProfileFormValues>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			firstName: nameParts[0] || '',
			lastName: nameParts.slice(1).join(' ') || '',
			email: user.email,
			phone: user.phone,
		},
	});

	const avatarFile = imageForm.watch('avatarFile');

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			imageForm.setValue('avatarFile', file, { shouldValidate: true });
			if (avatarPreview && avatarPreview.startsWith('blob:')) {
				URL.revokeObjectURL(avatarPreview);
			}
			setAvatarPreview(URL.createObjectURL(file));
			imageForm.clearErrors('avatarFile');
		}
	};

	const onImageSubmit = (data: ProfileImageFormValues) => {
		setIsImageSubmitting(true);
		const formData = new FormData();
		formData.append('file', data.avatarFile);

		UserService.saveProfileImage(formData)
			.then((res) => {
				toast({
					title: 'Photo Updated',
					description: res.message || 'Your new profile photo has been saved.',
					variant: 'success',
				});
				imageForm.reset();
			})
			.catch((err) => {
				toast({
					title: 'Upload Failed',
					description: err.message || 'There was a problem uploading your photo.',
					variant: 'danger',
				});
			})
			.finally(() => {
				setIsImageSubmitting(false);
			});
	};

	const onDetailsSubmit = (data: ProfileFormValues) => {
		setIsDetailsSubmitting(true);
		console.log(data);
		setTimeout(() => {
			toast({
				title: 'Profile Updated',
				description: 'Your personal information has been saved.',
				variant: 'success',
			});
			setIsDetailsSubmitting(false);
		}, 1000);
	};

	return (
		<Card className='glassmorphism'>
			<CardHeader>
				<CardTitle>Profile Details</CardTitle>
				<CardDescription>Update your photo and personal information here.</CardDescription>
			</CardHeader>
			<CardContent className='grid grid-cols-1 md:grid-cols-3 gap-8 pt-2'>
				<div className='md:col-span-1 space-y-4'>
					<h3 className='font-medium'>Profile Photo</h3>
					<Form {...imageForm}>
						<form onSubmit={imageForm.handleSubmit(onImageSubmit)} className='space-y-4'>
							<div className='flex flex-col items-center gap-4'>
								<Image
									src={avatarPreview || user.avatar}
									alt='Admin Avatar'
									width={128}
									height={128}
									className='rounded-full object-cover h-32 w-32 border-4 border-muted'
									data-ai-hint='avatar person'
								/>
								<FormField
									control={imageForm.control}
									name='avatarFile'
									render={() => (
										<FormItem>
											<FormControl>
												<Input
													id='avatar-upload'
													type='file'
													className='sr-only'
													accept='image/png, image/jpeg, image/gif'
													onChange={handleFileChange}
												/>
											</FormControl>
											<Button asChild variant='outline' className='w-full'>
												<label htmlFor='avatar-upload'>
													<Upload className='mr-2 h-4 w-4' /> Choose Photo
												</label>
											</Button>
											<p className='text-xs text-center text-muted-foreground pt-1'>PNG, JPG, GIF up to 10MB</p>
											<FormMessage className='text-center' />
										</FormItem>
									)}
								/>
							</div>
							<Button type='submit' className='w-full' disabled={!avatarFile || isImageSubmitting}>
								{isImageSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
								Save Photo
							</Button>
						</form>
					</Form>
				</div>

				<div className='md:col-span-2'>
					<Form {...detailsForm}>
						<form onSubmit={detailsForm.handleSubmit(onDetailsSubmit)} className='space-y-6'>
							<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
								<FormInput control={detailsForm.control} name='firstName' label='First Name' required />
								<FormInput control={detailsForm.control} name='lastName' label='Last Name' required />
							</div>
							<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
								<FormInput
									control={detailsForm.control}
									name='email'
									label='Email'
									type='email'
									required
									startIcon={<Mail className='h-4 w-4 text-muted-foreground' />}
								/>
								<FormInput
									control={detailsForm.control}
									name='phone'
									label='Phone'
									required
									startIcon={<Phone className='h-4 w-4 text-muted-foreground' />}
								/>
							</div>
							<div className='flex justify-end'>
								<Button type='submit' disabled={isDetailsSubmitting}>
									{isDetailsSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
									<Save className='mr-2 h-4 w-4' />
									Save Changes
								</Button>
							</div>
						</form>
					</Form>
				</div>
			</CardContent>
		</Card>
	);
}
