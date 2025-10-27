
'use client';

import { PersonalInfoMasterData } from '@/app/(auth)/jobseeker/profile-edit/page';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FormDatePicker } from '@/components/ui/form-datepicker';
import { FormInput } from '@/components/ui/form-input';
import { FormSelect } from '@/components/ui/form-select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { IApiResponse, IFile } from '@/interfaces/common.interface';
import { PersonalInfo } from '@/interfaces/jobseeker.interface';
import { ICommonMasterData } from '@/interfaces/master-data.interface';
import { makePreviewURL } from '@/lib/file-oparations';
import { JobseekerProfileService } from '@/services/api/jobseeker-profile.service';
import { MasterDataService } from '@/services/api/master-data.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { Linkedin, Loader2, Mail, Phone, Save, Upload, Video } from 'lucide-react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const profileImageSchema = z.object({
	avatarFile: z
		.any()
		.refine((file) => !!file, 'Please select an image.')
		.refine(
			(file) => ['image/jpeg', 'image/png'].includes(file?.type),
			'Only .jpg and .png formats are supported.'
		)
		.refine((file) => file?.size <= 2 * 1024 * 1024, `Max file size is 2MB.`),
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
						<Avatar className='h-28 w-28 border-2 border-primary/10'>
							<AvatarImage src={avatarPreview || makePreviewURL(profileImage?.filePath)} alt='Admin Avatar' />
							<AvatarFallback className='text-3xl'>
								{firstName?.[0]}
								{lastName?.[0]}
							</AvatarFallback>
						</Avatar>

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
												accept='image/png, image/jpeg'
												onChange={handleFileChange}
											/>
										</FormControl>
										<Button asChild variant='outline' className='cursor-pointer'>
											<label htmlFor='avatar-upload'>
												<Upload className='mr-2 h-4 w-4' />
												Choose Photo
											</label>
										</Button>
										<p className='text-xs text-muted-foreground'>PNG, JPG up to 2MB</p>
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
	id: z.number().optional(),
	firstName: z.string().min(1, 'First name is required'),
	middleName: z.string().optional(),
	lastName: z.string().min(1, 'Last name is required'),
	fatherName: z.string().min(1, "Father's name is required"),
	motherName: z.string().min(1, "Mother's name is required"),
	email: z.string().email(),
	phone: z.string().min(1, 'Phone number is required'),
	careerObjective: z.string().min(1, 'Career objective is required'),
	dateOfBirth: z.string().min(1, 'Date of birth is required'),
	gender: z.string().min(1, 'Gender is required'),
	maritalStatus: z.string().min(1, 'Marital status is required'),
	nationality: z.string().min(1, 'Nationality is required'),
	religion: z.string().optional(),
	// professionalStatus: z.string().optional(),
	nid: z.string().optional(),
	passportNo: z.string().optional(),
	birthCertificate: z.string().optional(),
	presentDivisionId: z.coerce.string().optional(),
	presentDistrictId: z.coerce.string().optional(),
	presentUpazilaId: z.coerce.string().optional(),
	presentAddress: z.string().optional(),
	presentPostCode: z.coerce.number().optional(),
	sameAsPresentAddress: z.boolean().default(false),
	permanentDivisionId: z.coerce.string().optional(),
	permanentDistrictId: z.coerce.string().optional(),
	permanentUpazilaId: z.coerce.string().optional(),
	permanentAddress: z.string().optional(),
	permanentPostCode: z.coerce.number().optional(),
	linkedInProfile: z.string().url().optional().or(z.literal('')),
	videoProfile: z.string().url().optional().or(z.literal('')),
});

type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;

interface ProfileFormProps {
	personalInfo: PersonalInfo;
	masterData: PersonalInfoMasterData;
}

export function ProfileFormPersonal({ personalInfo, masterData }: ProfileFormProps) {
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
			...personalInfo,
			sameAsPresentAddress: personalInfo?.sameAsPresentAddress ?? true,
		},
	});

	const watchPresentDivisionId = form.watch('presentDivisionId');
	const watchPresentDistrictId = form.watch('presentDistrictId');
	const watchPermanentDivisionId = form.watch('permanentDivisionId');
	const watchPermanentDistrictId = form.watch('permanentDistrictId');
	const watchSameAsPresent = form.watch('sameAsPresentAddress');

	const useFetchDependentData = (
		watchId: string | undefined,
		fetcher: (id: string) => Promise<IApiResponse<ICommonMasterData[]>>,
		setData: React.Dispatch<React.SetStateAction<ICommonMasterData[]>>,
		setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
		resetFields: () => void
	) => {
		React.useEffect(() => {
			if (!watchId) {
				setData([]);
				resetFields();
				return;
			}
			setIsLoading(true);
			fetcher(String(watchId))
				.then((res) => setData(res.body))
				.catch(() => setData([]))
				.finally(() => setIsLoading(false));
			resetFields();
		}, [watchId]);
	};

	useFetchDependentData(
		watchPresentDivisionId,
		MasterDataService.country.getDistricts,
		setPresentDistricts,
		setIsLoadingPresentDistricts,
		() => {
			form.setValue('presentDistrictId', undefined);
			form.setValue('presentUpazilaId', undefined);
		}
	);

	useFetchDependentData(
		watchPresentDistrictId,
		MasterDataService.country.getUpazilas,
		setPresentUpazilas,
		setIsLoadingPresentUpazilas,
		() => form.setValue('presentUpazilaId', undefined)
	);

	useFetchDependentData(
		!watchSameAsPresent ? watchPermanentDivisionId : undefined,
		MasterDataService.country.getDistricts,
		setPermanentDistricts,
		setIsLoadingPermanentDistricts,
		() => {
			form.setValue('permanentDistrictId', undefined);
			form.setValue('permanentUpazilaId', undefined);
		}
	);

	useFetchDependentData(
		!watchSameAsPresent ? watchPermanentDistrictId : undefined,
		MasterDataService.country.getUpazilas,
		setPermanentUpazilas,
		setIsLoadingPermanentUpazilas,
		() => form.setValue('permanentUpazilaId', undefined)
	);

	const handleSameAsPresentChange = (checked: boolean) => {
		if (checked) {
			const presentValues = form.getValues([
				'presentDivisionId',
				'presentDistrictId',
				'presentUpazilaId',
				'presentAddress',
				'presentPostCode',
			]);
			form.setValue('permanentDivisionId', presentValues[0]);
			form.setValue('permanentDistrictId', presentValues[1]);
			form.setValue('permanentUpazilaId', presentValues[2]);
			form.setValue('permanentAddress', presentValues[3]);
			form.setValue('permanentPostCode', presentValues[4]);

			setPermanentDistricts(presentDistricts);
			setPermanentUpazilas(presentUpazilas);
		} else {
			// Optionally clear permanent address fields when unchecked
			form.setValue('permanentDivisionId', undefined);
			form.setValue('permanentDistrictId', undefined);
			form.setValue('permanentUpazilaId', undefined);
			form.setValue('permanentAddress', '');
			form.setValue('permanentPostCode', undefined);
		}
	};

	const onSubmit = (data: PersonalInfoFormValues) => {
		JobseekerProfileService.personalInfo
			.save(data as PersonalInfo)
			.then((res) => {
				toast({
					description: res.message || 'Your personal information has been saved.',
					variant: 'success',
				});
			})
			.catch((err) => {
				toast({
					title: 'Update Failed',
					description: err.message || 'There was a problem saving your profile.',
					variant: 'danger',
				});
			});
	};

	const isMasterDataMissing = !masterData.divisions || masterData.divisions.length === 0;

	return (
		<div className='space-y-6'>
			<ProfileImageCard
				profileImage={personalInfo?.profileImage}
				firstName={personalInfo?.firstName}
				lastName={personalInfo?.lastName}
			/>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} noValidate>
					<div className='space-y-6'>
						{isMasterDataMissing && (
							<Alert variant='warning'>
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
									name='careerObjective'
									label='Career Objective / Headline'
									placeholder='e.g. Senior Frontend Developer seeking new challenges...'
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
										options={masterData.genders}
										labelKey='nameEn'
										valueKey='value'
									/>
									<FormSelect
										control={form.control}
										name='maritalStatus'
										label='Marital Status'
										required
										placeholder='Select marital status'
										options={masterData.maritalStatuses}
										labelKey='nameEn'
										valueKey='value'
									/>
								</div>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<FormSelect
										control={form.control}
										name='religion'
										label='Religion'
										placeholder='Select religion'
										options={masterData.religions}
										labelKey='nameEn'
										valueKey='value'
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
									<FormInput
										control={form.control}
										name='email'
										label='Email'
										type='email'
										placeholder='you@example.com'
										required
										startIcon={<Mail className='h-4 w-4 text-muted-foreground' />}
									/>
									<FormInput
										control={form.control}
										name='phone'
										label='Phone'
										placeholder='+8801...'
										required
										startIcon={<Phone className='h-4 w-4 text-muted-foreground' />}
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
												options={masterData.divisions}
												labelKey='name'
												valueKey='id'
											/>
											<FormSelect
												control={form.control}
												name='presentDistrictId'
												label='District'
												placeholder='Select district'
												disabled={isLoadingPresentDistricts}
												options={presentDistricts}
												labelKey='name'
												valueKey='id'
											/>
											<FormSelect
												control={form.control}
												name='presentUpazilaId'
												label='Upazila / Thana'
												placeholder='Select upazila'
												disabled={isLoadingPresentUpazilas}
												options={presentUpazilas}
												labelKey='name'
												valueKey='id'
											/>
										</div>
										<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
											<FormInput control={form.control} name='presentAddress' label='Address Line' />
											<FormInput
												control={form.control}
												name='presentPostCode'
												label='Post Code'
												type='number'
											/>
										</div>
									</div>
								</div>
								<div>
									<h3 className='text-md font-medium mb-2'>Permanent Address</h3>
									<FormField
										control={form.control}
										name='sameAsPresentAddress'
										render={({ field }) => (
											<FormItem className='flex flex-row items-start space-x-3 space-y-0'>
												<FormControl>
													<Checkbox
														checked={field.value}
														onCheckedChange={(checked) => {
															field.onChange(checked);
															handleSameAsPresentChange(Boolean(checked));
														}}
													/>
												</FormControl>
												<FormLabel>Same as present address</FormLabel>
											</FormItem>
										)}
									/>

									{!watchSameAsPresent && (
										<div className='mt-4 space-y-4 rounded-md border p-4'>
											<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
												<FormSelect
													control={form.control}
													name='permanentDivisionId'
													label='Division'
													placeholder='Select division'
													disabled={watchSameAsPresent}
													options={masterData.divisions}
													labelKey='name'
													valueKey='id'
												/>
												<FormSelect
													control={form.control}
													name='permanentDistrictId'
													label='District'
													placeholder='Select district'
													disabled={watchSameAsPresent || isLoadingPermanentDistricts}
													options={permanentDistricts}
													labelKey='name'
													valueKey='id'
												/>
												<FormSelect
													control={form.control}
													name='permanentUpazilaId'
													label='Upazila / Thana'
													placeholder='Select upazila'
													disabled={watchSameAsPresent || isLoadingPermanentUpazilas}
													options={permanentUpazilas}
													labelKey='name'
													valueKey='id'
												/>
											</div>
											<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
												<FormInput
													control={form.control}
													name='permanentAddress'
													label='Address Line'
													disabled={watchSameAsPresent}
												/>
												<FormInput
													control={form.control}
													name='permanentPostCode'
													label='Post Code'
													type='number'
													disabled={watchSameAsPresent}
												/>
											</div>
										</div>
									)}
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
									<FormInput
										control={form.control}
										name='linkedInProfile'
										label='LinkedIn Profile'
										placeholder='https://linkedin.com/in/...'
										startIcon={<Linkedin className='h-4 w-4 text-muted-foreground' />}
									/>
									<FormInput
										control={form.control}
										name='videoProfile'
										label='Video Profile'
										placeholder='https://youtube.com/watch?v=...'
										startIcon={<Video className='h-4 w-4 text-muted-foreground' />}
									/>
								</div>
							</CardContent>
						</Card>

						<div className='pt-2 flex justify-center'>
							<Button type='submit'>
								<Save className='mr-2 h-4 w-4' />
								Save Changes
							</Button>
						</div>
					</div>
				</form>
			</Form>
		</div>
	);
}
