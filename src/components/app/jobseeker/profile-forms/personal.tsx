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
import { FormTextarea } from '@/components/ui/form-textarea';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/auth-context';
import useLoader from '@/hooks/use-loader';
import { toast, useToast } from '@/hooks/use-toast';
import { IApiResponse, IFile } from '@/interfaces/common.interface';
import { PersonalInfo } from '@/interfaces/jobseeker.interface';
import { ICommonMasterData } from '@/interfaces/master-data.interface';
import { compressImage } from '@/lib/compresser';
import { makePreviewURL } from '@/lib/file-oparations';
import { JobseekerProfileService } from '@/services/api/jobseeker-profile.service';
import { MasterDataService } from '@/services/api/master-data.service';
import { UserService } from '@/services/api/user.service';
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
	id: z.string().optional(),
	firstName: z.string().min(1, 'First name is required'),
	lastName: z.string().min(1, 'Last name is required'),
	fatherName: z.string().min(1, "Father's name is required"),
	motherName: z.string().min(1, "Mother's name is required"),
	email: z.string().email(),
	phone: z
		.string()
		.min(1, 'Phone number is required')
		.max(11, 'Phone number too long')
		.regex(/^01[0-9]{9}$/, 'Invalid phone number'),
	careerObjective: z.string().max(500, 'Maximum 500 characters allowed').optional(),
	dateOfBirth: z.string().min(1, 'Date of birth is required'),
	gender: z.string().min(1, 'Gender is required'),
	maritalStatus: z.string().min(1, 'Marital status is required'),
	spouseName: z.string().max(50, 'Maximum 50 characters allowed').optional(),
	nationality: z.string().min(1, 'Nationality is required'),
	religion: z.string().optional(),
	nid: z.string().max(17, 'NID maximum 17 digits').min(10, 'NID minimum 10 digits'),
	passportNo: z.string().max(10, 'NID maximum 10 digits').optional(),
	birthCertificate: z
		.string()
		.max(17, 'NID maximum 17 digits')
		.regex(/^\d+$/, 'Birth certificate must be numeric')
		.optional(),
	presentDivisionId: z.coerce.string().optional(),
	presentDistrictId: z.coerce.string().optional(),
	presentUpazilaId: z.coerce.string().optional(),
	presentAddress: z.string().optional(),
	presentPostCode: z.coerce.number().optional(),
	sameAsPermanentAddress: z.boolean().default(false),
	permanentDivisionId: z.coerce.string().min(1, 'Division is required.'),
	permanentDistrictId: z.coerce.string().min(1, 'District is required.'),
	permanentUpazilaId: z.coerce.string().min(1, 'Upazila is required.'),
	permanentAddress: z.string().min(1, 'Address line is required.'),
	permanentPostCode: z.coerce.number().optional(),
	linkedInProfile: z
		.string()
		.url('Provide a valid LinkedIn profile URL')
		.max(150, 'Maximum 150 digits')
		.optional()
		.or(z.literal('')),
	videoProfile: z
		.string()
		.url('Provide a valid YouTube video URL')
		.max(150, 'Maximum 150 digits')
		.optional()
		.or(z.literal('')),
});

type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;

interface ProfileFormProps {
	personalInfo: PersonalInfo;
	masterData: PersonalInfoMasterData;
}

export function ProfileFormPersonal({ personalInfo, masterData }: ProfileFormProps) {
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
			sameAsPermanentAddress: personalInfo?.sameAsPermanentAddress ?? true,
		},
	});

	const watchPresentDivisionId = form.watch('presentDivisionId');
	const watchPresentDistrictId = form.watch('presentDistrictId');
	const watchPermanentDivisionId = form.watch('permanentDivisionId');
	const watchPermanentDistrictId = form.watch('permanentDistrictId');
	const watchSameAsPermanent = form.watch('sameAsPermanentAddress');
	const isMarried = form.watch('maritalStatus') === 'MARRIED';

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

	// For Present Address
	useFetchDependentData(
		!watchSameAsPermanent ? watchPresentDivisionId : undefined,
		MasterDataService.country.getDistricts,
		setPresentDistricts,
		setIsLoadingPresentDistricts,
		() => {
			form.setValue('presentDistrictId', undefined);
			form.setValue('presentUpazilaId', undefined);
		}
	);

	useFetchDependentData(
		!watchSameAsPermanent ? watchPresentDistrictId : undefined,
		MasterDataService.country.getUpazilas,
		setPresentUpazilas,
		setIsLoadingPresentUpazilas,
		() => form.setValue('presentUpazilaId', undefined)
	);

	// For Permanent Address
	useFetchDependentData(
		watchPermanentDivisionId,
		MasterDataService.country.getDistricts,
		setPermanentDistricts,
		setIsLoadingPermanentDistricts,
		() => {
			form.setValue('permanentDistrictId', '');
			form.setValue('permanentUpazilaId', '');
		}
	);

	useFetchDependentData(
		watchPermanentDistrictId,
		MasterDataService.country.getUpazilas,
		setPermanentUpazilas,
		setIsLoadingPermanentUpazilas,
		() => form.setValue('permanentUpazilaId', '')
	);

	const handleSameAsPermanentChange = (checked: boolean) => {
		if (checked) {
			const permanentValues = form.getValues([
				'permanentDivisionId',
				'permanentDistrictId',
				'permanentUpazilaId',
				'permanentAddress',
				'permanentPostCode',
			]);
			form.setValue('presentDivisionId', permanentValues[0]);
			form.setValue('presentDistrictId', permanentValues[1]);
			form.setValue('presentUpazilaId', permanentValues[2]);
			form.setValue('presentAddress', permanentValues[3]);
			form.setValue('presentPostCode', permanentValues[4]);

			setPresentDistricts(permanentDistricts);
			setPresentUpazilas(permanentUpazilas);
		} else {
			form.setValue('presentDivisionId', undefined);
			form.setValue('presentDistrictId', undefined);
			form.setValue('presentUpazilaId', undefined);
			form.setValue('presentAddress', '');
			form.setValue('presentPostCode', undefined);
		}
	};

	const onSubmit = (data: PersonalInfoFormValues) => {
		JobseekerProfileService.personalInfo
			.save(data as PersonalInfo)
			.then((res) => {
				toast.success({
					description: res.message || 'Your personal information has been saved.',
				});
			})
			.catch((err) => {
				toast.error({
					title: 'Update Failed',
					description: err.message || 'There was a problem saving your profile.',
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
								<FormTextarea
									control={form.control}
									name='careerObjective'
									label='Career Objective / Headline'
									placeholder='e.g. Senior Frontend Developer seeking new challenges...'
									rows={3}
									maxLength={500}
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
										getOptionLabel={(option) => option.nameEn}
										getOptionValue={(option) => option.value}
									/>
									<FormSelect
										control={form.control}
										name='religion'
										label='Religion'
										placeholder='Select religion'
										options={masterData.religions}
										getOptionLabel={(option) => option.nameEn}
										getOptionValue={(option) => option.value}
									/>
								</div>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<FormSelect
										control={form.control}
										name='maritalStatus'
										label='Marital Status'
										required
										placeholder='Select marital status'
										options={masterData.maritalStatuses}
										getOptionLabel={(option) => option.nameEn}
										getOptionValue={(option) => option.value}
									/>
									{isMarried && <FormInput control={form.control} name='spouseName' label='Spouse Name' />}
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
										placeholder='01XXXXXXXXX'
										required
										startIcon={<Phone className='h-4 w-4 text-muted-foreground' />}
									/>
								</div>
								<div>
									<h3 className='text-md font-medium mb-4'>Permanent Address</h3>
									<div className='space-y-4 rounded-md border p-4'>
										<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
											<FormSelect
												control={form.control}
												name='permanentDivisionId'
												label='Division'
												placeholder='Select division'
												required
												options={masterData.divisions}
												getOptionLabel={(option) => option.nameEn}
												getOptionValue={(option) => option.id}
											/>
											<FormSelect
												control={form.control}
												name='permanentDistrictId'
												label='District'
												placeholder='Select district'
												required
												disabled={isLoadingPermanentDistricts}
												options={permanentDistricts}
												getOptionLabel={(option) => option.nameEn}
												getOptionValue={(option) => option.id}
											/>
											<FormSelect
												control={form.control}
												name='permanentUpazilaId'
												label='Upazila / Thana'
												placeholder='Select upazila'
												required
												disabled={isLoadingPermanentUpazilas}
												options={permanentUpazilas}
												getOptionLabel={(option) => option.nameEn}
												getOptionValue={(option) => option.id}
											/>
										</div>
										<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
											<FormInput
												control={form.control}
												name='permanentAddress'
												label='Address Line'
												required
											/>
											<FormInput
												control={form.control}
												name='permanentPostCode'
												label='Post Code'
												type='number'
											/>
										</div>
									</div>
								</div>

								<div>
									<h3 className='text-md font-medium mb-2'>Present Address</h3>
									<FormField
										control={form.control}
										name='sameAsPermanentAddress'
										render={({ field }) => (
											<FormItem className='flex flex-row items-start space-x-3 space-y-0'>
												<FormControl>
													<Checkbox
														checked={field.value}
														onCheckedChange={(checked) => {
															field.onChange(checked);
															handleSameAsPermanentChange(Boolean(checked));
														}}
													/>
												</FormControl>
												<FormLabel>Same as permanent address</FormLabel>
											</FormItem>
										)}
									/>

									{!watchSameAsPermanent && (
										<div className='mt-4 space-y-4 rounded-md border p-4'>
											<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
												<FormSelect
													control={form.control}
													name='presentDivisionId'
													label='Division'
													placeholder='Select division'
													disabled={watchSameAsPermanent}
													options={masterData.divisions}
													getOptionLabel={(option) => option.nameEn}
													getOptionValue={(option) => option.id}
												/>
												<FormSelect
													control={form.control}
													name='presentDistrictId'
													label='District'
													placeholder='Select district'
													disabled={watchSameAsPermanent || isLoadingPresentDistricts}
													options={presentDistricts}
													getOptionLabel={(option) => option.nameEn}
													getOptionValue={(option) => option.id}
												/>
												<FormSelect
													control={form.control}
													name='presentUpazilaId'
													label='Upazila / Thana'
													placeholder='Select upazila'
													disabled={watchSameAsPermanent || isLoadingPresentUpazilas}
													options={presentUpazilas}
													getOptionLabel={(option) => option.nameEn}
													getOptionValue={(option) => option.id}
												/>
											</div>
											<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
												<FormInput
													control={form.control}
													name='presentAddress'
													label='Address Line'
													disabled={watchSameAsPermanent}
												/>
												<FormInput
													control={form.control}
													name='presentPostCode'
													label='Post Code'
													type='number'
													disabled={watchSameAsPermanent}
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
									<FormInput control={form.control} name='nid' label='NID' required />
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
