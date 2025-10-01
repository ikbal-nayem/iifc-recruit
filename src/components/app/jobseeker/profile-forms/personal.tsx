
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
import type { Candidate } from '@/lib/types';
import { JobseekerProfileService } from '@/services/api/jobseeker-profile.service';
import { MasterDataService } from '@/services/api/master-data.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { Linkedin, Mail, Phone, Save, Upload, Video, Loader2, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { ICommonMasterData } from '@/interfaces/master-data.interface';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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

		JobseekerProfileService.personalInfo
			.saveProfileImage(formData)
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
							<Button type='submit' size='sm' disabled={!avatarFile || isSubmitting}>
								{isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
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

	presentDivisionId: z.coerce.number().min(1, 'Division is required'),
	presentDistrictId: z.coerce.number().min(1, 'District is required'),
	presentUpazilaId: z.coerce.number().min(1, 'Upazila is required'),
	presentAddress: z.string().min(1, 'Address line is required'),
	presentPostCode: z.coerce.number().min(1000, 'Post code is required'),

	sameAsPresentAddress: z.boolean().default(false),

	permanentDivisionId: z.coerce.number().min(1, 'Division is required'),
	permanentDistrictId: z.coerce.number().min(1, 'District is required'),
	permanentUpazilaId: z.coerce.number().min(1, 'Upazila is required'),
	permanentAddress: z.string().min(1, 'Address line is required'),
	permanentPostCode: z.coerce.number().min(1000, 'Post code is required'),

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

	const [presentDistricts, setPresentDistricts] = React.useState<ICommonMasterData[]>([]);
	const [presentUpazilas, setPresentUpazilas] = React.useState<ICommonMasterData[]>([]);
	const [permanentDistricts, setPermanentDistricts] = React.useState<ICommonMasterData[]>([]);
	const [permanentUpazilas, setPermanentUpazilas] = React.useState<ICommonMasterData[]>([]);

	const [isLoadingPresentDistricts, setIsLoadingPresentDistricts] = React.useState(false);
	const [isLoadingPresentUpazilas, setIsLoadingPresentUpazilas] = React.useState(false);
	const [isLoadingPermanentDistricts, setIsLoadingPermanentDistricts] = React.useState(false);
	const [isLoadingPermanentUpazilas, setIsLoadingPermanentUpazilas] = React.useState(false);

	const form = useForm<PersonalInfoFormValues>({
		resolver: zodResolver(personalInfoSchema),
		defaultValues: {
			...candidate.personalInfo,
			presentDivisionId: candidate.personalInfo.presentAddress.divisionId,
			presentDistrictId: candidate.personalInfo.presentAddress.districtId,
			presentUpazilaId: candidate.personalInfo.presentAddress.upazilaId,
			presentAddress: candidate.personalInfo.presentAddress.line1,
			presentPostCode: candidate.personalInfo.presentAddress.postCode as number,
			permanentDivisionId: candidate.personalInfo.permanentAddress.divisionId,
			permanentDistrictId: candidate.personalInfo.permanentAddress.districtId,
			permanentUpazilaId: candidate.personalInfo.permanentAddress.upazilaId,
			permanentAddress: candidate.personalInfo.permanentAddress.line1,
			permanentPostCode: candidate.personalInfo.permanentAddress.postCode as number,
			sameAsPresentAddress: false,
		},
	});

	const watchPresentDivisionId = form.watch('presentDivisionId');
	const watchPresentDistrictId = form.watch('presentDistrictId');
	const watchPermanentDivisionId = form.watch('permanentDivisionId');
	const watchPermanentDistrictId = form.watch('permanentDistrictId');
	const watchSameAsPresent = form.watch('sameAsPresentAddress');
	const watchPresentAddressFields = form.watch([
		'presentDivisionId',
		'presentDistrictId',
		'presentUpazilaId',
		'presentAddress',
		'presentPostCode',
	]);

	// Copy present address to permanent address if checkbox is ticked
	React.useEffect(() => {
		if (watchSameAsPresent) {
			form.setValue('permanentDivisionId', watchPresentAddressFields[0]);
			form.setValue('permanentDistrictId', watchPresentAddressFields[1]);
			form.setValue('permanentUpazilaId', watchPresentAddressFields[2]);
			form.setValue('permanentAddress', watchPresentAddressFields[3]);
			form.setValue('permanentPostCode', watchPresentAddressFields[4]);
			setPermanentDistricts(presentDistricts);
			setPermanentUpazilas(presentUpazilas);
		}
	}, [watchSameAsPresent, watchPresentAddressFields, form, presentDistricts, presentUpazilas]);

	// Fetch districts when division changes
	const useFetchDistricts = (
		divisionId: number,
		setDistricts: React.Dispatch<React.SetStateAction<ICommonMasterData[]>>,
		setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
		resetDistrict: () => void
	) => {
		React.useEffect(() => {
			if (!divisionId) {
				setDistricts([]);
				return;
			}
			setIsLoading(true);
			MasterDataService.country
				.getDistricts(String(divisionId))
				.then((res) => {
					setDistricts(res.body);
					resetDistrict();
				})
				.catch(() => setDistricts([]))
				.finally(() => setIsLoading(false));
		}, [divisionId]);
	};

	// Fetch upazilas when district changes
	const useFetchUpazilas = (
		districtId: number,
		setUpazilas: React.Dispatch<React.SetStateAction<ICommonMasterData[]>>,
		setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
		resetUpazila: () => void
	) => {
		React.useEffect(() => {
			if (!districtId) {
				setUpazilas([]);
				return;
			}
			setIsLoading(true);
			MasterDataService.country
				.getUpazilas(String(districtId))
				.then((res) => {
					setUpazilas(res.body);
					resetUpazila();
				})
				.catch(() => setUpazilas([]))
				.finally(() => setIsLoading(false));
		}, [districtId]);
	};

	// Hooks for Present Address
	useFetchDistricts(watchPresentDivisionId, setPresentDistricts, setIsLoadingPresentDistricts, () => {
		form.setValue('presentDistrictId', 0);
		form.setValue('presentUpazilaId', 0);
	});
	useFetchUpazilas(watchPresentDistrictId, setPresentUpazilas, setIsLoadingPresentUpazilas, () =>
		form.setValue('presentUpazilaId', 0)
	);

	// Hooks for Permanent Address (only if not same as present)
	useFetchDistricts(
		!watchSameAsPresent ? watchPermanentDivisionId : 0,
		setPermanentDistricts,
		setIsLoadingPermanentDistricts,
		() => {
			form.setValue('permanentDistrictId', 0);
			form.setValue('permanentUpazilaId', 0);
		}
	);
	useFetchUpazilas(
		!watchSameAsPresent ? watchPermanentDistrictId : 0,
		setPermanentUpazilas,
		setIsLoadingPermanentUpazilas,
		() => form.setValue('permanentUpazilaId', 0)
	);

	const onSubmit = (data: PersonalInfoFormValues) => {
		toast({
			title: 'Profile Updated',
			description: 'Your personal information has been saved.',
			variant: 'success',
		});
		console.log(data);
	};

	const isMasterDataMissing = !masterData.divisions || masterData.divisions.length === 0;

	return (
		<div className='space-y-6'>
			<ProfileImageCard avatar={candidate.personalInfo.avatar} />

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className='space-y-6'>
						{isMasterDataMissing && (
							<Alert variant='warning'>
								<AlertCircle className='h-4 w-4' />
								<AlertTitle>Master Data Unavailable</AlertTitle>
								<AlertDescription>
									Could not load necessary data for addresses. The address fields will be disabled. Please try
									refreshing the page or contact support.
								</AlertDescription>
							</Alert>
						)}

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
									<h3 className='text-md font-medium mb-4'>Present Address</h3>
									<div className='space-y-4 rounded-md border p-4'>
										<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
											<FormSelect
												control={form.control}
												name='presentDivisionId'
												label='Division'
												placeholder='Select division'
												required
												disabled={isMasterDataMissing}
												options={masterData.divisions.map((d) => ({
													label: d.name,
													value: d.id!.toString(),
												}))}
											/>
											<FormSelect
												control={form.control}
												name='presentDistrictId'
												label='District'
												placeholder='Select district'
												required
												disabled={isLoadingPresentDistricts || isMasterDataMissing}
												options={presentDistricts.map((d) => ({ label: d.name, value: d.id!.toString() }))}
											/>
											<FormSelect
												control={form.control}
												name='presentUpazilaId'
												label='Upazila / Thana'
												placeholder='Select upazila'
												required
												disabled={isLoadingPresentUpazilas || isMasterDataMissing}
												options={presentUpazilas.map((u) => ({ label: u.name, value: u.id!.toString() }))}
											/>
										</div>
										<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
											<FormInput control={form.control} name='presentAddress' label='Address Line' required />
											<FormInput
												control={form.control}
												name='presentPostCode'
												label='Post Code'
												type='number'
												required
											/>
										</div>
									</div>
								</div>
								<div>
									<h3 className='text-md font-medium mb-2'>Permanent Address</h3>
									<FormCheckbox
										control={form.control}
										name='sameAsPresentAddress'
										label='Same as present address'
										disabled={isMasterDataMissing}
									/>
									<div className='mt-4 space-y-4 rounded-md border p-4'>
										<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
											<FormSelect
												control={form.control}
												name='permanentDivisionId'
												label='Division'
												placeholder='Select division'
												required
												disabled={watchSameAsPresent || isMasterDataMissing}
												options={masterData.divisions.map((d) => ({
													label: d.name,
													value: d.id!.toString(),
												}))}
											/>
											<FormSelect
												control={form.control}
												name='permanentDistrictId'
												label='District'
												placeholder='Select district'
												required
												disabled={watchSameAsPresent || isLoadingPermanentDistricts || isMasterDataMissing}
												options={permanentDistricts.map((d) => ({
													label: d.name,
													value: d.id!.toString(),
												}))}
											/>
											<FormSelect
												control={form.control}
												name='permanentUpazilaId'
												label='Upazila / Thana'
												placeholder='Select upazila'
												required
												disabled={watchSameAsPresent || isLoadingPermanentUpazilas || isMasterDataMissing}
												options={permanentUpazilas.map((u) => ({
													label: u.name,
													value: u.id!.toString(),
												}))}
											/>
										</div>
										<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
											<FormInput
												control={form.control}
												name='permanentAddress'
												label='Address Line'
												disabled={watchSameAsPresent}
												required
											/>
											<FormInput
												control={form.control}
												name='permanentPostCode'
												label='Post Code'
												type='number'
												disabled={watchSameAsPresent}
												required
											/>
										</div>
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
