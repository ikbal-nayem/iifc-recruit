
'use client';

import { PersonalInfoMasterData } from '@/app/(auth)/jobseeker/profile-edit/page';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FormCheckbox } from '@/components/ui/form-checkbox';
import { FormDatePicker } from '@/components/ui/form-datepicker';
import { FormInput } from '@/components/ui/form-input';
import { FormSelect } from '@/components/ui/form-select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { districts, divisions, upazilas } from '@/lib/bd-divisions-districts-upazilas';
import type { Candidate } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Linkedin, Mail, Phone, Save, Upload, Video } from 'lucide-react';
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
		console.log('New avatar file:', data.avatarFile);
		toast({
			title: 'Photo Updated',
			description: 'Your new profile photo has been saved.',
			variant: 'success',
		});
		// Here you would typically upload the file and then update the UI
	};

	return (
		<div className='p-6 rounded-lg border bg-card text-card-foreground shadow-sm glassmorphism'>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onImageSubmit)}>
					<div className='flex items-center gap-6'>
						<Image
							src={avatarPreview || avatar}
							alt='Admin Avatar'
							width={100}
							height={100}
							className='rounded-full object-cover h-24 w-24 border-2 border-primary/50'
							data-ai-hint='avatar person'
						/>
						<div className='flex-1 space-y-3'>
							<FormField
								control={form.control}
								name='avatarFile'
								render={({ field }) => (
									<FormItem>
										<FormLabel htmlFor='avatar-upload' className='sr-only'>
											Choose Photo
										</FormLabel>
										<FormControl>
											<Input
												id='avatar-upload'
												type='file'
												className='hidden'
												accept='image/png, image/jpeg, image/gif'
												onChange={handleFileChange}
											/>
										</FormControl>
										<Button asChild variant='outline' className='cursor-pointer'>
											<label htmlFor='avatar-upload'>
												<Upload className='mr-2 h-4 w-4' />
												Choose Photo
											</label>
										</Button>
										<p className='text-xs text-muted-foreground'>PNG, JPG, GIF up to 10MB</p>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type='submit' size='sm' disabled={!avatarFile}>
								Save Photo
							</Button>
						</div>
					</div>
				</form>
			</Form>
		</div>
	);
}

const personalInfoSchema = z.object({
	firstName: z.string().min(1, 'First name is required'),
	middleName: z.string().optional(),
	lastName: z.string().min(1, 'Last name is required'),
	fatherName: z.string().min(1, "Father's name is required"),
	motherName: z.string().min(1, "Mother's name is required"),
	email: z.string().email(),
	phone: z.string().min(1, 'Phone number is required'),
	headline: z.string().min(1, 'Headline is required'),

	dateOfBirth: z.string().min(1, 'Date of birth is required'),
	gender: z.string().min(1, 'Gender is required'),
	maritalStatus: z.string().min(1, 'Marital status is required'),
	nationality: z.string().min(1, 'Nationality is required'),
	religion: z.string().optional(),
	professionalStatus: z.string().optional(),

	nid: z.string().optional(),
	passportNo: z.string().optional(),
	birthCertificate: z.string().optional(),

	presentAddress: z.object({
		division: z.string().min(1, 'Division is required'),
		district: z.string().min(1, 'District is required'),
		upazila: z.string().min(1, 'Upazila is required'),
		line1: z.string().min(1, 'Address line is required'),
		postCode: z.string().min(1, 'Post code is required'),
	}),

	usePresentForPermanent: z.boolean().default(false),

	permanentAddress: z.object({
		division: z.string().min(1, 'Division is required'),
		district: z.string().min(1, 'District is required'),
		upazila: z.string().min(1, 'Upazila is required'),
		line1: z.string().min(1, 'Address line is required'),
		postCode: z.string().min(1, 'Post code is required'),
	}),

	linkedInProfile: z.string().url().optional().or(z.literal('')),
	videoProfile: z.string().url().optional().or(z.literal('')),
});

type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;

interface ProfileFormProps {
	candidate: Candidate;
	masterData: PersonalInfoMasterData;
}

export function ProfileFormPersonal({ candidate, masterData }: ProfileFormProps) {
	const { toast } = useToast();

	const form = useForm<PersonalInfoFormValues>({
		resolver: zodResolver(personalInfoSchema),
		defaultValues: {
			...candidate.personalInfo,
			presentAddress: candidate.personalInfo.presentAddress || {},
			permanentAddress: candidate.personalInfo.permanentAddress || {},
			usePresentForPermanent: false,
		},
	});

	const watchPresentAddress = form.watch('presentAddress');
	const usePresentForPermanent = form.watch('usePresentForPermanent');

	React.useEffect(() => {
		if (usePresentForPermanent) {
			form.setValue('permanentAddress', watchPresentAddress);
		}
	}, [usePresentForPermanent, watchPresentAddress, form]);

	const onSubmit = (data: PersonalInfoFormValues) => {
		toast({
			title: 'Profile Updated',
			description: 'Your personal information has been saved.',
			variant: 'success',
		});
		console.log(data);
	};

	const AddressFields = ({ type }: { type: 'presentAddress' | 'permanentAddress' }) => {
		const watchDivision = form.watch(`${type}.division`);
		const watchDistrict = form.watch(`${type}.district`);
		const disabled = type === 'permanentAddress' && usePresentForPermanent;

		const filteredDistricts = React.useMemo(() => {
			const selectedDivision = divisions.find((d) => d.name === watchDivision);
			if (!selectedDivision) return [];
			return districts.filter((d) => d.division_id === selectedDivision.id);
		}, [watchDivision]);

		const filteredUpazilas = React.useMemo(() => {
			const selectedDistrict = districts.find((d) => d.name === watchDistrict);
			if (!selectedDistrict) return [];
			return upazilas.filter((u) => u.district_id === selectedDistrict.id);
		}, [watchDistrict]);

		// This custom hook prevents infinite loops by only acting on actual changes.
		const usePrevious = <T,>(value: T) => {
			const ref = React.useRef<T>();
			React.useEffect(() => {
				ref.current = value;
			});
			return ref.current;
		};
		const prevDivision = usePrevious(watchDivision);
		const prevDistrict = usePrevious(watchDistrict);

		React.useEffect(() => {
			if (prevDivision !== watchDivision && form.getValues(`${type}.district`)) {
				form.setValue(`${type}.district`, '');
				form.setValue(`${type}.upazila`, '');
			}
		}, [watchDivision, prevDivision, form, type]);

		React.useEffect(() => {
			if (prevDistrict !== watchDistrict && form.getValues(`${type}.upazila`)) {
				form.setValue(`${type}.upazila`, '');
			}
		}, [watchDistrict, prevDistrict, form, type]);

		return (
			<div className='space-y-4'>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
					<FormSelect
						control={form.control}
						name={`${type}.division`}
						label='Division'
						placeholder='Select division'
						required
						disabled={disabled}
						options={divisions.map((d) => ({ label: d.name, value: d.name }))}
					/>
					<FormSelect
						control={form.control}
						name={`${type}.district`}
						label='District'
						placeholder='Select district'
						required
						disabled={disabled || !watchDivision}
						options={filteredDistricts.map((d) => ({ label: d.name, value: d.name }))}
					/>
					<FormSelect
						control={form.control}
						name={`${type}.upazila`}
						label='Upazila / Thana'
						placeholder='Select upazila'
						required
						disabled={disabled || !watchDistrict}
						options={filteredUpazilas.map((u) => ({ label: u.name, value: u.name }))}
					/>
				</div>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<FormInput control={form.control} name={`${type}.line1`} label='Address Line' disabled={disabled} required />
					<FormInput control={form.control} name={`${type}.postCode`} label='Post Code' disabled={disabled} required />
				</div>
			</div>
		);
	};

	return (
		<div className='space-y-6'>
			<ProfileImageCard avatar={candidate.personalInfo.avatar} />

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className='space-y-6'>
						<Card className='glassmorphism'>
							<CardHeader>
								<CardTitle>Basic Information</CardTitle>
								<CardDescription>This is your public-facing information.</CardDescription>
							</CardHeader>
							<CardContent className='space-y-6'>
								<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
									<FormInput
										control={form.control}
										name='firstName'
										label='First Name'
										placeholder='e.g. John'
										required
									/>
									<FormInput control={form.control} name='middleName' label='Middle Name' />
									<FormInput
										control={form.control}
										name='lastName'
										label='Last Name'
										placeholder='e.g. Doe'
										required
									/>
								</div>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<FormInput control={form.control} name='fatherName' label="Father's Name" required />
									<FormInput control={form.control} name='motherName' label="Mother's Name" required />
								</div>
								<FormInput
									control={form.control}
									name='headline'
									label='Headline'
									placeholder='e.g. Senior Frontend Developer'
									required
								/>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-4 items-start'>
									<FormDatePicker
										control={form.control}
										name='dateOfBirth'
										label='Date of Birth'
										required
										captionLayout='dropdown-buttons'
										fromYear={1960}
										toYear={new Date().getFullYear() - 18}
									/>
									<FormInput control={form.control} name='nationality' label='Nationality' required />
								</div>

								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<FormSelect
										control={form.control}
										name='gender'
										label='Gender'
										required
										placeholder='Select gender'
										options={masterData.genders.map((g) => ({ label: g.label, value: g.value }))}
									/>
									<FormSelect
										control={form.control}
										name='maritalStatus'
										label='Marital Status'
										required
										placeholder='Select marital status'
										options={masterData.maritalStatuses.map((s) => ({ label: s.label, value: s.value }))}
									/>
								</div>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<FormSelect
										control={form.control}
										name='religion'
										label='Religion'
										placeholder='Select religion'
										options={masterData.religions.map((r) => ({ label: r.label, value: r.value }))}
									/>
									<FormSelect
										control={form.control}
										name='professionalStatus'
										label='Professional Status'
										placeholder='Select status'
										options={masterData.professionalStatuses.map((s) => ({ label: s.label, value: s.value }))}
									/>
								</div>
							</CardContent>
						</Card>

						<Card className='glassmorphism'>
							<CardHeader>
								<CardTitle>Contact Information</CardTitle>
							</CardHeader>
							<CardContent className='space-y-6'>
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
														<Input type='email' {...field} className='pl-10 h-11' />
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
														<Input {...field} className='pl-10 h-11' />
													</div>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<div>
									<h3 className='text-md font-medium mb-2'>Present Address</h3>
									<AddressFields type='presentAddress' />
								</div>
								<div>
									<h3 className='text-md font-medium mb-2'>Permanent Address</h3>
									<FormCheckbox control={form.control} name='usePresentForPermanent' label='Same as present address' />
									<div className='mt-4'>
										<AddressFields type='permanentAddress' />
									</div>
								</div>
							</CardContent>
						</Card>

						<Card className='glassmorphism'>
							<CardHeader>
								<CardTitle>Identity & Profiles</CardTitle>
							</CardHeader>
							<CardContent className='space-y-6'>
								<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
									<FormInput control={form.control} name='nid' label='NID' />
									<FormInput control={form.control} name='passportNo' label='Passport No.' />
									<FormInput control={form.control} name='birthCertificate' label='Birth Certificate No.' />
								</div>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<FormField
										control={form.control}
										name='linkedInProfile'
										render={({ field }) => (
											<FormItem>
												<FormLabel>LinkedIn Profile</FormLabel>
												<FormControl>
													<div className='relative flex items-center'>
														<Linkedin className='absolute left-3 h-4 w-4 text-muted-foreground' />
														<Input {...field} className='pl-10' placeholder='https://linkedin.com/in/...' />
													</div>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name='videoProfile'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Video Profile</FormLabel>
												<FormControl>
													<div className='relative flex items-center'>
														<Video className='absolute left-3 h-4 w-4 text-muted-foreground' />
														<Input {...field} className='pl-10' placeholder='https://youtube.com/watch?v=...' />
													</div>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</CardContent>
						</Card>

						<CardFooter>
							<Button type='submit'>
								<Save className='mr-2 h-4 w-4' />
								Save Changes
							</Button>
						</CardFooter>
					</div>
				</form>
			</Form>
		</div>
	);
}
