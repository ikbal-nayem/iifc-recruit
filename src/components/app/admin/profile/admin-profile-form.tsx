'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FormInput } from '@/components/ui/form-input';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/auth-context';
import useLoader from '@/hooks/use-loader';
import { toast, useToast } from '@/hooks/use-toast';
import { IFile } from '@/interfaces/common.interface';
import { compressImage } from '@/lib/compresser';
import { makePreviewURL } from '@/lib/file-oparations';
import { UserService } from '@/services/api/user.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Mail, Phone, Save } from 'lucide-react';
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

function ProfileImageCard({
	profileImage,
	firstName,
	lastName,
}: {
	profileImage?: IFile;
	firstName?: string;
	lastName?: string;
}) {
	const { toast } = useToast();
	const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useLoader(false);
	const { updateUserInfo } = useAuth();

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

	const onImageSubmit = async (data: ProfileImageFormValues) => {
		setIsSubmitting(true);
		try {
			const compressedFile = await compressImage(data.avatarFile);
			const formData = new FormData();
			formData.append('file', compressedFile);

			const res = await UserService.saveProfileImage(formData);
			toast({
				title: 'Photo Updated',
				description: res.message || 'Your new profile photo has been saved.',
				variant: 'success',
			});
			updateUserInfo({ profileImage: res.body });
			form.reset();
		} catch (err: any) {
			toast({
				title: 'Upload Failed',
				description: err.message || 'There was a problem uploading your photo.',
				variant: 'danger',
			});
		} finally {
			setIsSubmitting(false);
		}
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
							<Avatar className='h-20 w-20'>
								<AvatarImage
									src={avatarPreview || makePreviewURL(profileImage?.filePath)}
									alt='Admin Avatar'
								/>
								<AvatarFallback>
									{firstName?.[0]}
									{lastName?.[0]}
								</AvatarFallback>
							</Avatar>

							<FormField
								control={form.control}
								name='avatarFile'
								render={({ field }) => (
									<FormItem>
										<FormLabel htmlFor='avatar-upload' className='font-normal text-sm text-muted-foreground'>
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
		fullName: string;
		firstName: string;
		lastName: string;
		email: string;
		phone: string;
		avatar: string;
		profileImage?: IFile;
	};
}

const profileSchema = z.object({
	firstName: z.string().min(1, 'First name is required'),
	lastName: z.string().min(1, 'Last name is required'),
	email: z.string().email().optional(),
	phone: z.string().min(1, 'Phone number is required'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function AdminProfileForm({ user }: AdminProfileFormProps) {
	const [isDetailsSubmitting, setIsDetailsSubmitting] = React.useState(false);

	const form = useForm<ProfileFormValues>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			phone: user.phone,
		},
	});

	const onSubmit = (data: ProfileFormValues) => {
		setIsDetailsSubmitting(true);
		setTimeout(() => {
			toast.success({
				title: 'Profile Updated',
				description: 'Your personal information has been saved.',
			});
			setIsDetailsSubmitting(false);
		}, 1000);
	};

	return (
		<div className='space-y-6'>
			<ProfileImageCard
				profileImage={user.profileImage}
				firstName={form.getValues('firstName')}
				lastName={form.getValues('lastName')}
			/>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<Card className='glassmorphism'>
						<CardHeader>
							<CardTitle>Personal Details</CardTitle>
						</CardHeader>
						<CardContent className='space-y-6'>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<FormInput control={form.control} name='firstName' label='First Name' required />
								<FormInput control={form.control} name='lastName' label='Last Name' required />
							</div>

							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<FormInput
									control={form.control}
									name='email'
									label='Email'
									type='email'
									// required
									startIcon={<Mail className='h-4 w-4 text-muted-foreground' />}
								/>
								<FormInput
									control={form.control}
									name='phone'
									label='Phone'
									required
									startIcon={<Phone className='h-4 w-4 text-muted-foreground' />}
								/>
							</div>
						</CardContent>
						<CardFooter>
							<Button type='submit' disabled={isDetailsSubmitting}>
								{isDetailsSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
								<Save className='mr-2 h-4 w-4' />
								Save Changes
							</Button>
						</CardFooter>
					</Card>
				</form>
			</Form>
		</div>
	);
}
