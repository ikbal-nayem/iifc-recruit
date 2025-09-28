
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FormAutocomplete } from '@/components/ui/form-autocomplete';
import { FormDatePicker } from '@/components/ui/form-datepicker';
import { FormInput } from '@/components/ui/form-input';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Training } from '@/interfaces/jobseeker.interface';
import { ICommonMasterData } from '@/interfaces/master-data.interface';
import { makePreviewURL } from '@/lib/utils';
import { JobseekerProfileService } from '@/services/api/jobseeker-profile.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, parseISO } from 'date-fns';
import { Edit, FileText, Loader2, PlusCircle, Trash, Upload, X } from 'lucide-react';
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
		certificate: z.any().optional(),
	})
	.refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
		message: 'End date cannot be before start date.',
		path: ['endDate'],
	});

type TrainingFormValues = z.infer<typeof trainingSchema>;

const defaultData = { name: '', institutionName: '', trainingTypeId: '', startDate: '', endDate: '' };

const FilePreview = ({ file, onRemove }: { file: File | string; onRemove: () => void }) => {
    const isFile = file instanceof File;
    const name = isFile ? file.name : file;
    const size = isFile ? `(${(file.size / 1024).toFixed(1)} KB)` : '';

    return (
        <div className="p-2 border rounded-lg flex items-center justify-between bg-muted/50">
            <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <div className="text-sm">
                    <p className="font-medium truncate max-w-xs">{name}</p>
                    {size && <p className="text-xs text-muted-foreground">{size}</p>}
                </div>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onRemove}>
                <X className="h-4 w-4" />
            </Button>
        </div>
    )
};


interface TrainingFormProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: TrainingFormValues, id?: number) => Promise<boolean>;
	initialData?: Training;
	noun: string;
	trainingTypes: ICommonMasterData[];
}

function TrainingForm({ isOpen, onClose, onSubmit, initialData, noun, trainingTypes }: TrainingFormProps) {
	const form = useForm<TrainingFormValues>({
		resolver: zodResolver(trainingSchema),
		defaultValues: initialData || defaultData,
	});
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		form.reset(initialData || defaultData);
	}, [initialData, form]);

	const handleSubmit = async (data: TrainingFormValues) => {
		setIsSubmitting(true);
		const success = await onSubmit(data, initialData?.id);
		if (success) {
			onClose();
		}
		setIsSubmitting(false);
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
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<FormInput
								control={form.control}
								name='institutionName'
								label='Institution'
								placeholder='e.g., Coursera'
								required
								disabled={isSubmitting}
							/>
							<div className='space-y-2'>
								<FormAutocomplete
									control={form.control}
									name='trainingTypeId'
									label='Training Type'
									placeholder='Select type'
									options={trainingTypes.map((t) => ({ value: t.id!, label: t.name }))}
									disabled={isSubmitting}
								/>
							</div>
						</div>
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
						<FormField
							control={form.control}
							name='certificate'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Certificate (Optional PDF)</FormLabel>
									<FormControl>
										<div className='relative flex items-center justify-center w-full'>
											<label
												htmlFor='certificate-upload'
												className='flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-background hover:bg-muted'
											>
												<div className='flex flex-col items-center justify-center pt-5 pb-6'>
													<Upload className='w-8 h-8 mb-2 text-muted-foreground' />
													<p className='text-sm text-muted-foreground'>
														<span className='font-semibold'>Click to upload</span> or drag and drop
													</p>
												</div>
												<Input
													id='certificate-upload'
													type='file'
													className='hidden'
													accept='.pdf'
													onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)}
												/>
											</label>
										</div>
									</FormControl>
                                    {field.value && (
                                        <div className="mt-2">
                                            <FilePreview file={field.value} onRemove={() => field.onChange(null)} />
                                        </div>
                                    )}
									<FormMessage />
								</FormItem>
							)}
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
	const { toast } = useToast();
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
			toast({ description: 'Failed to load trainings.', variant: 'danger' });
		} finally {
			setIsLoading(false);
		}
	}, [toast]);

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

	const handleFormSubmit = async (data: TrainingFormValues, id?: number) => {
		// In a real app, handle file upload here. For now, we'll just use the name.
		const certificateUrl = data.certificate
			? data.certificate.name
			: id
			? editingItem?.certificate
			: undefined;
		const payload = { ...data, certificateUrl };
		delete (payload as any).certificate;

		try {
			const response = id
				? await JobseekerProfileService.training.update({ ...payload, id })
				: await JobseekerProfileService.training.add(payload);
			toast({ description: response.message, variant: 'success' });
			loadTrainings();
			return true;
		} catch (error: any) {
			toast({ title: 'Error', description: error.message || 'An error occurred.', variant: 'danger' });
			return false;
		}
	};

	const handleRemove = async (id: number) => {
		try {
			const response = await JobseekerProfileService.training.delete(id);
			toast({ description: response.message || 'Training deleted successfully.', variant: 'success' });
			loadTrainings();
		} catch (error: any) {
			toast({
				title: 'Error',
				description: error.message || 'Failed to delete training.',
				variant: 'danger',
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
					{item.certificate && (
						<a
							href={makePreviewURL(item.certificate)}
							target='_blank'
							rel='noopener noreferrer'
							className='text-xs text-primary hover:underline flex items-center gap-1 mt-1'
						>
							<FileText className='h-3 w-3' />
							View Certificate
						</a>
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
