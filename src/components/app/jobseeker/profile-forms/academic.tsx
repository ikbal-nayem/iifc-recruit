
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FilePreviewer } from '@/components/ui/file-previewer';
import { Form } from '@/components/ui/form';
import { FormFileUpload } from '@/components/ui/form-file-upload';
import { FormInput } from '@/components/ui/form-input';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import type { AcademicInfo } from '@/lib/types';
import { makeFormData } from '@/lib/utils';
import { JobseekerProfileService } from '@/services/api/jobseeker-profile.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, FileText, Loader2, PlusCircle, Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const academicInfoSchema = z.object({
	degree: z.string().min(1, 'Degree is required.'),
	institution: z.string().min(1, 'Institution is required.'),
	graduationYear: z.coerce.number().min(1950, 'Invalid year.').max(new Date().getFullYear() + 5),
	certificateFile: z.any().optional(),
});

type AcademicFormValues = z.infer<typeof academicInfoSchema>;

interface AcademicFormProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: AcademicFormValues, id?: string) => Promise<boolean>;
	initialData?: AcademicInfo;
	noun: string;
}

const defaultValues = { degree: '', institution: '', graduationYear: undefined, certificateFile: null };

function AcademicForm({ isOpen, onClose, onSubmit, initialData, noun }: AcademicFormProps) {
	const form = useForm<AcademicFormValues>({
		resolver: zodResolver(academicInfoSchema),
		defaultValues: initialData || defaultValues,
	});

	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		form.reset(initialData || defaultValues);
	}, [initialData, form]);

	const handleSubmit = async (data: AcademicFormValues) => {
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
						<FormInput control={form.control} name='degree' label='Degree' required disabled={isSubmitting} />
						<FormInput
							control={form.control}
							name='institution'
							label='Institution'
							required
							disabled={isSubmitting}
						/>
						<FormInput
							control={form.control}
							name='graduationYear'
							label='Graduation Year'
							type='number'
							required
							disabled={isSubmitting}
						/>
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

export function ProfileFormAcademic() {
	const { toast } = useToast();
	const [history, setHistory] = React.useState<AcademicInfo[]>([]);
	const [editingItem, setEditingItem] = React.useState<AcademicInfo | undefined>(undefined);
	const [isFormOpen, setIsFormOpen] = React.useState(false);
	const [isLoading, setIsLoading] = React.useState(true);

	const loadAcademicInfo = React.useCallback(async () => {
		setIsLoading(true);
		try {
			const response = await JobseekerProfileService.academic.get();
			setHistory(response.body);
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to load academic history.',
				variant: 'danger',
			});
		} finally {
			setIsLoading(false);
		}
	}, [toast]);

	React.useEffect(() => {
		loadAcademicInfo();
	}, [loadAcademicInfo]);

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
			toast({ description: response.message, variant: 'success' });
			loadAcademicInfo();
			return true;
		} catch (error: any) {
			toast({ title: 'Error', description: error.message || 'An error occurred.', variant: 'danger' });
			return false;
		}
	};

	const handleRemove = async (id: string) => {
		try {
			await JobseekerProfileService.academic.delete(id);
			toast({
				title: 'Entry Deleted',
				description: 'The academic record has been removed.',
				variant: 'success',
			});
			loadAcademicInfo();
		} catch (error: any) {
			toast({
				title: 'Error',
				description: error.message || 'Failed to delete record.',
				variant: 'danger',
			});
		}
	};

	const renderItem = (item: AcademicInfo) => {
		return (
			<Card key={item.id} className='p-4 flex justify-between items-start'>
				<div>
					<p className='font-semibold'>{item.degree}</p>
					<p className='text-sm text-muted-foreground'>
						{item.institution} - {item.graduationYear}
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
				/>
			)}
		</div>
	);
}
