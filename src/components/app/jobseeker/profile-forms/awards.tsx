
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { FormDatePicker } from '@/components/ui/form-datepicker';
import { FormInput } from '@/components/ui/form-input';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Award } from '@/interfaces/jobseeker.interface';
import { makeReqDateFormat } from '@/lib/utils';
import { JobseekerProfileService } from '@/services/api/jobseeker-profile.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Edit, Loader2, PlusCircle, Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const awardSchema = z.object({
	name: z.string().min(1, 'Award name is required.'),
	description: z.string().min(1, 'Awarding body is required.'),
	date: z.string().min(1, 'Date is required.'),
});

type AwardFormValues = z.infer<typeof awardSchema>;

const defaultData = { name: '', description: '', date: '' };

interface AwardFormProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: AwardFormValues, id?: number) => Promise<boolean>;
	initialData?: Award;
	noun: string;
}

function AwardForm({ isOpen, onClose, onSubmit, initialData, noun }: AwardFormProps) {
	const form = useForm<AwardFormValues>({
		resolver: zodResolver(awardSchema),
		defaultValues: initialData ? { ...initialData, date: makeReqDateFormat(initialData.date) } : defaultData,
	});
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		form.reset(initialData ? { ...initialData, date: makeReqDateFormat(initialData.date) } : defaultData);
	}, [initialData, form]);

	const handleSubmit = async (data: AwardFormValues) => {
		setIsSubmitting(true);
		onSubmit(data, initialData?.id)
			.then((res) => onClose())
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
							label='Award Name'
							placeholder='e.g., Employee of the Month'
							required
							disabled={isSubmitting}
						/>
						<FormInput
							control={form.control}
							name='description'
							label='Awarding Body'
							placeholder='e.g., TechCorp'
							required
							disabled={isSubmitting}
						/>
						<FormDatePicker
							control={form.control}
							name='date'
							label='Date Received'
							required
							disabled={isSubmitting}
						/>
						<DialogFooter className='pt-4'>
							<Button type='button' variant='ghost' onClick={onClose} disabled={isSubmitting}>
								Cancel
							</Button>
							<Button type='submit' disabled={isSubmitting}>
								{isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
								{initialData ? 'Save Changes' : 'Add Award'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

export function ProfileFormAwards() {
	const { toast } = useToast();
	const [history, setHistory] = React.useState<Award[]>([]);
	const [editingItem, setEditingItem] = React.useState<Award | undefined>(undefined);
	const [itemToDelete, setItemToDelete] = React.useState<Award | null>(null);
	const [isFormOpen, setIsFormOpen] = React.useState(false);
	const [isLoading, setIsLoading] = React.useState(true);

	const loadAwards = React.useCallback(async () => {
		setIsLoading(true);
		try {
			const response = await JobseekerProfileService.award.get();
			setHistory(response.body);
		} catch (error) {
			toast({
				description: 'Failed to load awards.',
				variant: 'danger',
			});
		} finally {
			setIsLoading(false);
		}
	}, [toast]);

	React.useEffect(() => {
		loadAwards();
	}, [loadAwards]);

	const handleOpenForm = (item?: Award) => {
		setEditingItem(item);
		setIsFormOpen(true);
	};

	const handleCloseForm = () => {
		setIsFormOpen(false);
		setEditingItem(undefined);
	};

	const handleFormSubmit = async (data: AwardFormValues, id?: number) => {
		const payload = { ...data };
		try {
			const response = id
				? await JobseekerProfileService.award.update({ ...payload, id })
				: await JobseekerProfileService.award.add(payload);
			toast({ description: response.message, variant: 'success' });
			loadAwards();
			return true;
		} catch (error: any) {
			toast({ title: 'Error', description: error.message || 'An error occurred.', variant: 'danger' });
			return false;
		}
	};

	const handleRemove = async () => {
		if (!itemToDelete?.id) return;
		try {
			const response = await JobseekerProfileService.award.delete(itemToDelete.id);
			toast({ description: response.message || 'Award deleted successfully.', variant: 'success' });
			loadAwards();
		} catch (error: any) {
			toast({
				title: 'Error',
				description: error.message || 'Failed to delete award.',
				variant: 'danger',
			});
		} finally {
			setItemToDelete(null);
		}
	};

	const renderItem = (item: Award) => {
		return (
			<Card key={item.id} className='p-4 flex justify-between items-start'>
				<div>
					<p className='font-semibold'>{item.name}</p>
					<p className='text-sm text-muted-foreground'>
						{item.description} - {format(new Date(item.date), 'PPP')}
					</p>
				</div>
				<div className='flex gap-2'>
					<Button variant='ghost' size='icon' onClick={() => handleOpenForm(item)}>
						<Edit className='h-4 w-4' />
					</Button>
					<Button variant='ghost' size='icon' onClick={() => setItemToDelete(item)}>
						<Trash className='h-4 w-4 text-danger' />
					</Button>
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
							<CardTitle>Your Awards & Recognitions</CardTitle>
							<CardDescription>Listed below are your awards and recognitions.</CardDescription>
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
						<p className='text-center text-muted-foreground py-8'>No awards added yet.</p>
					)}
				</CardContent>
			</Card>

			{isFormOpen && (
				<AwardForm
					isOpen={isFormOpen}
					onClose={handleCloseForm}
					onSubmit={handleFormSubmit}
					initialData={editingItem}
					noun='Award'
				/>
			)}

			<ConfirmationDialog
				open={!!itemToDelete}
				onOpenChange={(open) => !open && setItemToDelete(null)}
				description='This action cannot be undone. This will permanently delete this award.'
				onConfirm={handleRemove}
				confirmText='Delete'
			/>
		</div>
	);
}
