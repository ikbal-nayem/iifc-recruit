
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FilePreviewer } from '@/components/ui/file-previewer';
import { Form } from '@/components/ui/form';
import { FormAutocomplete } from '@/components/ui/form-autocomplete';
import { FormFileUpload } from '@/components/ui/form-file-upload';
import { FormInput } from '@/components/ui/form-input';
import { FormRadioGroup } from '@/components/ui/form-radio-group';
import { FormSelect } from '@/components/ui/form-select';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/constants/routes.constant';
import { toast } from '@/hooks/use-toast';
import { ResultSystem } from '@/interfaces/common.interface';
import { AcademicInfo } from '@/interfaces/jobseeker.interface';
import { ICommonMasterData, IEducationInstitution } from '@/interfaces/master-data.interface';
import { makeFormData } from '@/lib/utils';
import { JobseekerProfileService } from '@/services/api/jobseeker-profile.service';
import { MasterDataService } from '@/services/api/master-data.service';
import { getInstitutionsAsync } from '@/services/async-api';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Edit, FileText, Loader2, MoveRight, PlusCircle, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const academicInfoSchema = z.object({
	degreeLevelId: z.string().min(1, 'Degree level is required'),
	domainNameEn: z.string().max(100, 'Domain must be at most 100 characters').optional(),
	institutionId: z.string().min(1, 'Institution is required'),
	degreeTitle: z
		.string()
		.min(1, 'Degree title is required')
		.max(100, 'Degree title must be at most 100 characters'),
	resultSystem: z.nativeEnum(ResultSystem).default(ResultSystem.GRADE),
	resultAchieved: z.string().optional(),
	cgpa: z.coerce.number().optional(),
	outOfCgpa: z.coerce.number().optional(),
	passingYear: z.string().min(4, 'Passing year is required'),
	duration: z.coerce.number().max(10, 'Duration must be at most 10 years').optional(),
	certificateFile: z.any().optional(),
});

type AcademicFormValues = z.infer<typeof academicInfoSchema>;

interface AcademicFormProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: any, id?: string) => Promise<boolean>;
	initialData?: AcademicInfo;
	noun: string;
	masterData: {
		degreeLevels: ICommonMasterData[];
		domains: ICommonMasterData[];
		institutions: IEducationInstitution[];
	};
}

const defaultValues = {
	degreeLevelId: undefined,
	domainNameEn: '',
	institutionId: undefined,
	degreeTitle: '',
	resultSystem: ResultSystem.GRADE,
	resultAchieved: '',
	cgpa: undefined,
	outOfCgpa: undefined,
	passingYear: '',
	duration: undefined,
	certificateFile: null,
};

function AcademicForm({ isOpen, onClose, onSubmit, initialData, noun, masterData }: AcademicFormProps) {
	const form = useForm<AcademicFormValues>({
		resolver: zodResolver(academicInfoSchema),
		defaultValues: defaultValues,
	});

	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (initialData) {
			form.reset({
				...initialData,
				degreeLevelId: initialData.degreeLevel?.id,
				institutionId: initialData.institution?.id,
			});
		} else {
			form.reset(defaultValues);
		}
	}, [initialData, form]);

	const handleSubmit = async (data: AcademicFormValues) => {
		setIsSubmitting(true);
		const success = await onSubmit(data, initialData?.id);
		if (success) onClose();
		setIsSubmitting(false);
	};

	const handleCreateInstitution = async (name: string): Promise<IEducationInstitution | null> => {
		try {
			const response = await MasterDataService.educationInstitution.add({
				nameEn: name,
				nameBn: name,
				active: true,
			});
			toast.success({ description: `Institution "${name}" created.` });
			return response.body;
		} catch (error: any) {
			toast.error({ description: error.message || 'Failed to create institution.' });
			return null;
		}
	};

	const watchResultSystem = form.watch('resultSystem');

	const currentYear = new Date().getFullYear();
	const years = Array.from({ length: currentYear - 1959 }, (_, i) => {
		const year = currentYear - i;
		return { value: year.toString(), label: year.toString() };
	});

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='max-w-2xl'>
				<DialogHeader>
					<DialogTitle>{initialData ? `Edit ${noun}` : `Add ${noun} Info`}</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4 py-4 pr-1'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<FormAutocomplete
								control={form.control}
								name='degreeLevelId'
								label='Degree Level'
								required
								options={masterData.degreeLevels}
								getOptionValue={(option) => option.id}
								getOptionLabel={(option) => option.nameEn}
							/>
							<FormInput
								control={form.control}
								name='domainNameEn'
								label='Domain / Major Subject'
								placeholder='e.g., Science, Arts'
							/>
						</div>
						<FormInput
							control={form.control}
							name='degreeTitle'
							label='Degree Name'
							required
							placeholder='e.g., Bachelor of Science in CSE'
						/>
						<FormAutocomplete
							control={form.control}
							name='institutionId'
							label='Institution'
							required
							loadOptions={getInstitutionsAsync}
							onCreate={handleCreateInstitution}
							getOptionValue={(option) => option.id}
							getOptionLabel={(option) => option.nameEn}
							initialLabel={initialData?.institution?.nameEn}
						/>
						<FormRadioGroup
							control={form.control}
							name='resultSystem'
							label='Result System'
							required
							options={[
								{ value: ResultSystem.GRADE, label: 'Grade' },
								{ value: ResultSystem.DIVISION, label: 'Division' },
								{ value: ResultSystem.CLASS, label: 'Class' },
							]}
						/>
						{watchResultSystem === ResultSystem.GRADE ? (
							<div className='grid grid-cols-2 gap-4'>
								<FormInput control={form.control} name='cgpa' label='CGPA' type='number' step='0.01' />
								<FormInput control={form.control} name='outOfCgpa' label='Out of' type='number' />
							</div>
						) : (
							<FormInput control={form.control} name='resultAchieved' label='Result Achieved' />
						)}
						<div className='grid grid-cols-2 gap-4'>
							<FormSelect
								control={form.control}
								name='passingYear'
								label='Passing Year'
								required
								options={years}
								placeholder='Select year'
								getOptionLabel={(option) => option.label}
								getOptionValue={(option) => option.value}
							/>
							<FormInput control={form.control} name='duration' label='Duration (Years)' type='number' />
						</div>

						<FormFileUpload
							control={form.control}
							name='certificateFile'
							label='Certificate (Optional)'
							accept='.pdf, image/*'
						/>

						<DialogFooter className='pt-4'>
							<Button type='button' variant='ghost' onClick={onClose} disabled={isSubmitting}>
								Cancel
							</Button>
							<Button type='submit' disabled={isSubmitting}>
								{isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
								{initialData ? 'Save Changes' : 'Add Entry'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

interface ProfileFormAcademicProps {
	masterData: {
		degreeLevels: ICommonMasterData[];
		domains: ICommonMasterData[];
		institutions: IEducationInstitution[];
	};
}

export function ProfileFormAcademic({ masterData }: ProfileFormAcademicProps) {
	const router = useRouter();
	const [history, setHistory] = React.useState<AcademicInfo[]>([]);
	const [editingItem, setEditingItem] = React.useState<AcademicInfo | undefined>(undefined);
	const [isFormOpen, setIsFormOpen] = React.useState(false);
	const [isLoading, setIsLoading] = React.useState(true);

	const loadData = React.useCallback(async () => {
		setIsLoading(true);
		try {
			const academicRes = await JobseekerProfileService.academic.get();
			setHistory(academicRes.body as AcademicInfo[]);
		} catch (error) {
			toast.error({
				description: 'Failed to load academic history.',
			});
		} finally {
			setIsLoading(false);
		}
	}, []);

	React.useEffect(() => {
		loadData();
	}, [loadData]);

	const handleOpenForm = (item?: AcademicInfo) => {
		setEditingItem(item);
		setIsFormOpen(true);
	};

	const handleCloseForm = () => {
		setEditingItem(undefined);
		setIsFormOpen(false);
	};

	const handleFormSubmit = async (data: AcademicFormValues, id?: string) => {
		try {
			const payload: any = { ...data, id };
			const formData = makeFormData(payload);
			const response = await JobseekerProfileService.academic.save(formData);
			toast.success({ description: response.message });
			router.refresh();
			loadData();
			return true;
		} catch (error: any) {
			toast.error({ title: 'Error', description: error.message || 'An error occurred.' });
			return false;
		}
	};

	const handleRemove = async (id: string) => {
		try {
			await JobseekerProfileService.academic.delete(id);
			toast.success({
				title: 'Entry Deleted',
				description: 'The academic record has been removed.',
			});
			router.refresh();
			loadData();
		} catch (error: any) {
			toast.error({
				title: 'Error',
				description: error.message || 'Failed to delete record.',
			});
		}
	};

	const renderItem = (item: AcademicInfo) => {
		const resultText =
			item.resultSystem === ResultSystem.GRADE
				? `CGPA: ${item.cgpa}/${item.outOfCgpa}`
				: `Result: ${item.resultAchieved}`;
		return (
			<Card key={item.id} className='p-4 flex justify-between items-start'>
				<div>
					<p className='font-semibold'>{item.degreeTitle}</p>
					<p className='text-sm text-muted-foreground'>
						{item.institution.nameEn} | {item.degreeLevel.nameEn} in {item.degreeTitle}
					</p>
					<p className='text-xs text-muted-foreground'>
						{item.passingYear} | {resultText}
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
						description='This action cannot be undone. This will permanently delete this academic record.'
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
					<div className='flex justify-between items-center'>
						<div className='space-y-1.5'>
							<CardTitle>Your Academic History</CardTitle>
							<CardDescription>Listed below is your educational background.</CardDescription>
						</div>
						<Button onClick={() => handleOpenForm()}>
							<PlusCircle className='mr-2 h-4 w-4' />
							Add New
						</Button>
					</div>
				</CardHeader>
				<CardContent className='space-y-4'>
					{isLoading ? (
						[...Array(2)].map((_, i) => <Skeleton key={i} className='h-20 w-full' />)
					) : history.length > 0 ? (
						history.map(renderItem)
					) : (
						<p className='text-center text-muted-foreground py-8'>No academic history added yet.</p>
					)}
				</CardContent>
			</Card>

			{isFormOpen && (
				<AcademicForm
					isOpen={isFormOpen}
					onClose={handleCloseForm}
					onSubmit={handleFormSubmit}
					initialData={editingItem}
					noun='Education'
					masterData={masterData}
				/>
			)}

			<div className='flex justify-between mt-8'>
				<Button variant='outline' onClick={() => router.push(ROUTES.JOB_SEEKER.PROFILE_EDIT.PERSONAL)}>
					<ArrowLeft className='mr-2 h-4 w-4' /> Previous
				</Button>
				<Button onClick={() => router.push(ROUTES.JOB_SEEKER.PROFILE_EDIT.PROFESSIONAL)}>
					Next <MoveRight className='ml-2 h-4 w-4' />
				</Button>
			</div>
		</div>
	);
}
