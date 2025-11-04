'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FilePreviewer } from '@/components/ui/file-previewer';
import { Form } from '@/components/ui/form';
import { FormAutocomplete } from '@/components/ui/form-autocomplete';
import { FormDatePicker } from '@/components/ui/form-datepicker';
import { FormFileUpload } from '@/components/ui/form-file-upload';
import { FormInput } from '@/components/ui/form-input';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { Training } from '@/interfaces/jobseeker.interface';
import { ICommonMasterData } from '@/interfaces/master-data.interface';
import { makeFormData } from '@/lib/utils';
import { JobseekerProfileService } from '@/services/api/jobseeker-profile.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, parseISO } from 'date-fns';
import { Edit, FileText, Loader2, PlusCircle, Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const trainingSchema = z
	.object({
		name: z.string().min(1, 'Training name is required.'),
		institutionName: z.string().min(1, 'Institution is required.'),
		trainingTypeId: z.string().optional(),
		startDate: z.string().min(1, 'Start date is required.'),
		endDate: z.string().min(1, 'End date is required.'),
		certificateFile: z.any().optional(),
	})
	.refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
		message: 'End date cannot be before start date.',
		path: ['endDate'],
	});

type TrainingFormValues = z.infer<typeof trainingSchema>;

const defaultData = { name: '', institutionName: '', trainingTypeId: '', startDate: '', endDate: '' };

interface TrainingFormProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: Training) => Promise<boolean>;
	initialData?: Training;
	noun: string;
	trainingTypes: ICommonMasterData[];
}

function TrainingForm({ isOpen, onClose, onSubmit, initialData, noun, trainingTypes }: TrainingFormProps) {
	const form = useForm<TrainingFormValues>({
		resolver: zodResolver(trainingSchema),
		defaultValues: initialData
			? {
					...initialData,
					trainingTypeId: initialData.trainingTypeId?.toString(),
					certificateFile: initialData.certificateFile,
			  }
			: defaultData,
	});
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		form.reset(
			initialData
				? {
						...initialData,
						trainingTypeId: initialData.trainingTypeId?.toString(),
				  }
				: defaultData
		);
	}, [initialData, form]);

	const handleSubmit = (data: TrainingFormValues) => {
		setIsSubmitting(true);
		const payload: Training = {
			...data,
			id: initialData?.id,
			trainingTypeId: data.trainingTypeId,
		};

		onSubmit(payload)
			.then(() => onClose())
			.finally(() => setIsSubmitting(false));
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{initialData ? `Edit ${noun}` : `Add New ${noun}`}</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4 py-4'>
						<FormInput
							control={form.control}
							name='name'
							label='Training Name'
							placeholder='e.g., Advanced React'
							required
							disabled={isSubmitting}
						/>
						<FormInput
							control={form.control}
							name='institutionName'
							label='Institution'
							placeholder='e.g., Coursera'
							required
							disabled={isSubmitting}
						/>
						<FormAutocomplete
							control={form.control}
							name='trainingTypeId'
							label='Training Type'
							placeholder='Select type'
							options={trainingTypes}
							getOptionValue={(option) => option.id!.toString()}
							getOptionLabel={(option) => option.nameEn}
							disabled={isSubmitting}
						/>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<FormDatePicker
								control={form.control}
								name='startDate'
								label='Start Date'
								required
								disabled={isSubmitting}
							/>
							<FormDatePicker
								control={form.control}
								name='endDate'
								label='End Date'
								required
								disabled={isSubmitting}
							/>
						</div>
						<FormFileUpload
							control={form.control}
							name='certificateFile'
							label='CertificateFile'
							accept='.pdf, .image/*'
						/>
						<DialogFooter className='pt-4'>
							<Button type='button' variant='ghost' onClick={onClose} disabled={isSubmitting}>
								Cancel
							</Button>
							<Button type='submit' disabled={isSubmitting}>
								{isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
								{initialData ? 'Save Changes' : 'Add Training'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

export function ProfileFormTraining({ trainingTypes }: { trainingTypes: ICommonMasterData[] }) {
	const [history, setHistory] = useState<Training[]>([]);
	const [editingItem, setEditingItem] = useState<Training | undefined>(undefined);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	const loadTrainings = React.useCallback(async () => {
		setIsLoading(true);
		try {
			const [trainingsRes] = await Promise.all([JobseekerProfileService.training.get()]);
			setHistory(trainingsRes.body);
		} catch (error) {
			toast.error({ description: 'Failed to load trainings.' });
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		loadTrainings();
	}, [loadTrainings]);

	const handleOpenForm = (item?: Training) => {
		setEditingItem(item);
		setIsFormOpen(true);
	};

	const handleCloseForm = () => {
		setIsFormOpen(false);
		setEditingItem(undefined);
	};

	const handleFormSubmit = async (formData: Training) => {
		try {
			const response = await JobseekerProfileService.training.save(makeFormData(formData));
			toast.success({ description: response.message });
			loadTrainings();
			return true;
		} catch (error: any) {
			toast.error({ title: 'Error', description: error.message || 'An error occurred.' });
			return false;
		}
	};

	const handleRemove = async (id: string) => {
		try {
			const response = await JobseekerProfileService.training.delete(id);
			toast.success({ description: response.message || 'Training deleted successfully.' });
			loadTrainings();
		} catch (error: any) {
			toast.error({
				description: error.message || 'Failed to delete training.',
			});
		}
	};

	const renderItem = (item: Training) => {
		return (
			<Card key={item.id} className='p-4 flex justify-between items-start'>
				<div>
					<p className='font-semibold'>{item.name}</p>
					<p className='text-sm text-muted-foreground'>{item.institutionName}</p>
					<p className='text-xs text-muted-foreground'>
						{format(parseISO(item.startDate), 'MMM yyyy')} - {format(parseISO(item.endDate), 'MMM yyyy')}
					</p>
					{item.certificateFile && (
						<FilePreviewer file={item.certificateFile}>
							<button className='text-xs text-primary hover:underline flex items-center gap-1 mt-1'>
								<FileText className='h-3 w-3' />
								View CertificateFile
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
						description='This action cannot be undone. This will permanently delete this training record.'
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
							<CardTitle>Your Trainings</CardTitle>
							<CardDescription>Listed below are your completed trainings.</CardDescription>
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
						<p className='text-center text-muted-foreground py-8'>No trainings added yet.</p>
					)}
				</CardContent>
			</Card>

			{isFormOpen && (
				<TrainingForm
					isOpen={isFormOpen}
					onClose={handleCloseForm}
					onSubmit={handleFormSubmit}
					initialData={editingItem}
					noun='Training'
					trainingTypes={trainingTypes}
				/>
			)}
		</div>
	);
}
