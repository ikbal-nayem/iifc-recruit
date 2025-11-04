'use client';

import { ProfessionalExperienceMasterData } from '@/app/(auth)/jobseeker/profile-edit/professional/page';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FilePreviewer } from '@/components/ui/file-previewer';
import { Form } from '@/components/ui/form';
import { FormDatePicker } from '@/components/ui/form-datepicker';
import { FormFileUpload } from '@/components/ui/form-file-upload';
import { FormInput } from '@/components/ui/form-input';
import { FormSelect } from '@/components/ui/form-select';
import { FormSwitch } from '@/components/ui/form-switch';
import { FormTextarea } from '@/components/ui/form-textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { ProfessionalInfo } from '@/interfaces/jobseeker.interface';
import { makeFormData } from '@/lib/utils';
import { JobseekerProfileService } from '@/services/api/jobseeker-profile.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, parseISO } from 'date-fns';
import { Edit, FileText, Loader2, PlusCircle, Trash } from 'lucide-react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const professionalInfoSchema = z
	.object({
		positionTitle: z.string().min(1, 'Position Title is required.').max(100, 'Position Title is too long.'),
		// positionLevelId: z.coerce.string().min(1, 'Position Level is required.'),
		organizationNameEn: z.coerce
			.string()
			.min(1, 'Organization is required.')
			.max(100, 'Organization name is too long.'),
		// organizationId: z.coerce.string().min(1, 'Organization is required.'),
		responsibilities: z
			.string()
			.min(1, 'Please list at least one responsibility.')
			.max(1000, 'Responsibilities description is too long.')
			.optional(),
		joinDate: z.string().min(1, 'Join date is required.'),
		resignDate: z.string().optional(),
		isCurrent: z.boolean().default(false),
		salary: z.coerce.number().optional(),
		salaryCurrency: z.enum(['BDT', 'USD']).optional(),
		referenceName: z.string().optional(),
		referenceEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
		referencePhone: z.string().optional(),
		referencePostDept: z.string().optional(),
		certificateFile: z.any().optional(),
	})
	.refine((data) => (!data.isCurrent ? !!data.resignDate : true), {
		message: 'Resign date is required unless you are currently working here.',
		path: ['resignDate'],
	});

type ProfessionalFormValues = z.infer<typeof professionalInfoSchema>;

interface ProfessionalExperienceFormProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: ProfessionalFormValues) => Promise<boolean>;
	initialData?: ProfessionalInfo;
	masterData: ProfessionalExperienceMasterData;
}

const defaultValues: ProfessionalInfo = {
	positionTitle: '',
	// positionLevelId: '',
	organizationNameEn: '',
	// organizationId: '',
	responsibilities: '',
	joinDate: '',
	resignDate: '',
	isCurrent: false,
	salary: 0,
	salaryCurrency: 'BDT',
	referenceName: '',
	referenceEmail: '',
	referencePhone: '',
	referencePostDept: '',
	certificateFile: undefined,
};

function ProfessionalExperienceForm({
	isOpen,
	onClose,
	onSubmit,
	initialData,
	masterData,
}: ProfessionalExperienceFormProps) {
	const form = useForm<ProfessionalFormValues>({
		resolver: zodResolver(professionalInfoSchema),
		defaultValues: defaultValues,
	});

	const [isSubmitting, setIsSubmitting] = React.useState(false);

	React.useEffect(() => {
		if (initialData) {
			form.reset({
				...initialData,
				// positionLevelId: initialData.positionLevel?.id,
				// organizationId: initialData.organization?.id,
			});
		} else {
			form.reset(defaultValues);
		}
	}, [initialData, form]);

	const handleSubmit = async (data: ProfessionalFormValues) => {
		setIsSubmitting(true);
		const success = await onSubmit(data);
		if (success) {
			onClose();
		}
		setIsSubmitting(false);
	};

	const watchIsCurrent = form.watch('isCurrent');

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='max-w-2xl' closeOnOutsideClick={false}>
				<DialogHeader>
					<DialogTitle>{initialData ? 'Edit Experience' : 'Add Experience Info'}</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4 pr-1'>
						<FormInput
							control={form.control}
							name='organizationNameEn'
							label='Organization/Company Name'
							placeholder='e.g., ABC Ltd.'
							required
						/>
						<FormInput
							control={form.control}
							name='positionTitle'
							label='Position Title'
							placeholder='e.g., Software Engineer'
							required
						/>
						{/* <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<FormAutocomplete
								control={form.control}
								name='organizationId'
								label='Organization'
								placeholder='Select an organization'
								required
								options={masterData.organizations}
								getOptionValue={(option) => option.id!.toString()}
								getOptionLabel={(option) => option.nameEn}
							/>
							<FormAutocomplete
								control={form.control}
								name='positionLevelId'
								label='Position Level'
								placeholder='Select a level'
								required
								options={masterData.positionLevels}
								getOptionValue={(option) => option.id!.toString()}
								getOptionLabel={(option) => option.nameEn}
							/>
						</div> */}
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4 items-start'>
							<FormDatePicker control={form.control} name='joinDate' label='Join Date' required />
							<FormDatePicker
								control={form.control}
								name='resignDate'
								label='Resign Date'
								required={!watchIsCurrent}
								disabled={watchIsCurrent}
							/>
						</div>
						<FormSwitch control={form.control} name='isCurrent' label='I currently work here' />
						<FormTextarea
							control={form.control}
							name='responsibilities'
							label='Responsibilities'
							placeholder='Describe your key responsibilities...'
							rows={4}
							maxLength={1000}
						/>
						<FormFileUpload
							control={form.control}
							name='certificateFile'
							label='Experience Certificate (Optional)'
							accept='.pdf, image/*'
						/>
						<CardTitle className='text-lg pt-4'>Additional Information (Optional)</CardTitle>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<FormInput control={form.control} name='salary' label='Salary' type='number' />
							<FormSelect
								control={form.control}
								name='salaryCurrency'
								label='Currency'
								options={[
									{ label: 'BDT', value: 'BDT' },
									{ label: 'USD', value: 'USD' },
								]}
								getOptionLabel={(option) => option.label}
								getOptionValue={(option) => option.value}
							/>
						</div>
						<CardTitle className='text-lg pt-4'>Reference (Optional)</CardTitle>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<FormInput control={form.control} name='referenceName' label='Reference Name' />
							<FormInput control={form.control} name='referencePostDept' label='Reference Position & Dept.' />
						</div>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<FormInput control={form.control} name='referenceEmail' label='Reference Email' type='email' />
							<FormInput control={form.control} name='referencePhone' label='Reference Phone' />
						</div>
						<DialogFooter className='pt-4 sticky bottom-0 bg-background pb-2'>
							<Button type='button' variant='ghost' onClick={onClose} disabled={isSubmitting}>
								Cancel
							</Button>
							<Button type='submit' disabled={isSubmitting}>
								{isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
								Save Changes
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

interface ProfileFormProps {
	masterData: ProfessionalExperienceMasterData;
}

export function ProfileFormProfessional({ masterData }: ProfileFormProps) {
	const [history, setHistory] = React.useState<ProfessionalInfo[]>([]);
	const [editingItem, setEditingItem] = React.useState<ProfessionalInfo | undefined>(undefined);
	const [isFormOpen, setIsFormOpen] = React.useState(false);
	const [isLoading, setIsLoading] = React.useState(true);

	const loadExperience = React.useCallback(async () => {
		setIsLoading(true);
		try {
			const response = await JobseekerProfileService.experience.get();
			setHistory(response.body);
		} catch (error) {
			toast.error({
				description: 'Failed to load professional experience.',
			});
		} finally {
			setIsLoading(false);
		}
	}, []);

	React.useEffect(() => {
		loadExperience();
	}, [loadExperience]);

	const handleFormSubmit = async (data: ProfessionalFormValues) => {
		try {
			const payload: any = { ...data, id: editingItem?.id };
			const formData = makeFormData(payload);
			const response = await JobseekerProfileService.experience.save(formData);
			toast.success({ description: response.message });
			loadExperience();
			return true;
		} catch (error: any) {
			toast.error({
				description: error?.message || 'Failed to save experience.',
			});
			return false;
		}
	};

	const handleRemove = async (id: string) => {
		try {
			await JobseekerProfileService.experience.delete(id);
			toast.success({
				title: 'Entry Deleted',
				description: 'The professional record has been removed.',
			});
			loadExperience();
		} catch (error: any) {
			toast.error({
				description: error.message || 'Failed to delete experience.',
			});
		}
	};

	const handleOpenForm = (item?: ProfessionalInfo) => {
		setEditingItem(item);
		setIsFormOpen(true);
	};

	const handleCloseForm = () => {
		setEditingItem(undefined);
		setIsFormOpen(false);
	};

	const renderItem = (item: ProfessionalInfo) => {
		const joinDate = format(parseISO(item.joinDate), 'MMM yyyy');
		const resignDate = item.isCurrent
			? 'Present'
			: item.resignDate
			? format(parseISO(item.resignDate), 'MMM yyyy')
			: '';

		return (
			<Card key={item.id} className='p-4 flex justify-between items-start'>
				<div>
					<p className='font-semibold'>{item.positionTitle}</p>
					<p className='text-xs text-muted-foreground'>
						{joinDate} - {resignDate}
					</p>
					{item.certificateFile && (
						<FilePreviewer file={item.certificateFile}>
							<button className='text-xs text-primary hover:underline flex items-center gap-1 mt-1'>
								<FileText className='h-3 w-3' />
								View Certificate
							</button>
						</FilePreviewer>
					)}
				</div>
				<div className='flex gap-2'>
					<Button variant='ghost' size='icon' onClick={() => handleOpenForm(item)}>
						<Edit className='h-4 w-4' />
					</Button>
					<ConfirmationDialog
						trigger={
							<Button variant='ghost' size='icon'>
								<Trash className='h-4 w-4 text-danger' />
							</Button>
						}
						description='This will permanently delete this professional record.'
						onConfirm={() => handleRemove(item.id!)}
						confirmText='Delete'
					/>
				</div>
			</Card>
		);
	};

	return (
		<div className='space-y-6'>
			<Card className='glassmorphism'>
				<CardHeader>
					<div className='flex items-center justify-between'>
						<div>
							<CardTitle>Your Professional History</CardTitle>
							<CardDescription>Listed below is your work experience.</CardDescription>
						</div>
						<Button onClick={() => handleOpenForm()}>
							<PlusCircle className='mr-2 h-4 w-4' /> Add New
						</Button>
					</div>
				</CardHeader>
				<CardContent className='space-y-4'>
					{isLoading ? (
						[...Array(2)].map((_, i) => <Skeleton key={i} className='h-20 w-full' />)
					) : history.length > 0 ? (
						history.map(renderItem)
					) : (
						<p className='text-center text-muted-foreground py-4'>No professional history added yet.</p>
					)}
				</CardContent>
			</Card>

			{isFormOpen && (
				<ProfessionalExperienceForm
					isOpen={isFormOpen}
					onClose={handleCloseForm}
					onSubmit={handleFormSubmit}
					initialData={editingItem}
					masterData={masterData}
				/>
			)}
		</div>
	);
}
