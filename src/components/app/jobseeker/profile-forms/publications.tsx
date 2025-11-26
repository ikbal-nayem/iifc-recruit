
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
import { Publication } from '@/interfaces/jobseeker.interface';
import { JobseekerProfileService } from '@/services/api/jobseeker-profile.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { ArrowLeft, Edit, Link2, Loader2, MoveRight, PlusCircle, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const publicationSchema = z.object({
	title: z.string().min(1, 'Title is required.').max(100, 'Title is too long.'),
	publisher: z.string().min(1, 'Publisher is required.').max(100, 'Publisher is too long.'),
	publicationDate: z.string().min(1, 'Publication date is required.'),
	url: z.string().url('Please enter a valid URL.').max(150, 'URL is too long.')
});

type PublicationFormValues = z.infer<typeof publicationSchema>;

const defaultData = { title: '', publisher: '', publicationDate: '', url: ''};

interface PublicationFormProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: PublicationFormValues, id?: string) => Promise<boolean>;
	initialData?: Publication;
	noun: string;
}

function PublicationForm({ isOpen, onClose, onSubmit, initialData, noun }: PublicationFormProps) {
	const form = useForm<PublicationFormValues>({
		resolver: zodResolver(publicationSchema),
		values: initialData || defaultData,
	});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (data: PublicationFormValues) => {
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
					<DialogTitle>{initialData ? `Edit ${noun}` : `Add ${noun}`}</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4 py-4'>
						<FormInput
							control={form.control}
							name='title'
							label='Title'
							placeholder='e.g., The Future of AI'
							required
							disabled={isSubmitting}
						/>
						<FormInput
							control={form.control}
							name='publisher'
							label='Publisher'
							placeholder='e.g., Nature Journal'
							required
							disabled={isSubmitting}
						/>
						<FormDatePicker
							control={form.control}
							name='publicationDate'
							label='Publication Date'
							required
							disabled={isSubmitting}
						/>
						<FormInput
							control={form.control}
							name='url'
							label='URL'
							placeholder='https://example.com/publication'
							required
							disabled={isSubmitting}
						/>
						<DialogFooter className='pt-4'>
							<Button type='button' variant='ghost' onClick={onClose} disabled={isSubmitting}>
								Cancel
							</Button>
							<Button type='submit' disabled={isSubmitting}>
								{isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
								{initialData ? 'Save Changes' : 'Add Publication'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

export function ProfileFormPublications() {
	const router = useRouter();
	const { toast } = useToast();
	const [history, setHistory] = React.useState<Publication[]>([]);
	const [editingItem, setEditingItem] = React.useState<Publication | undefined>(undefined);
	const [itemToDelete, setItemToDelete] = React.useState<Publication | null>(null);
	const [isFormOpen, setIsFormOpen] = React.useState(false);
	const [isLoading, setIsLoading] = React.useState(true);

	const loadPublications = React.useCallback(async () => {
		setIsLoading(true);
		try {
			const response = await JobseekerProfileService.publication.get();
			setHistory(response.body);
		} catch (error) {
			toast({
				description: 'Failed to load publications.',
				variant: 'danger',
			});
		} finally {
			setIsLoading(false);
		}
	}, [toast]);

	React.useEffect(() => {
		loadPublications();
	}, [loadPublications]);

	const handleOpenForm = (item?: Publication) => {
		setEditingItem(item);
		setIsFormOpen(true);
	};

	const handleCloseForm = () => {
		setIsFormOpen(false);
		setEditingItem(undefined);
	};

	const handleFormSubmit = async (data: PublicationFormValues, id?: string) => {
		const payload = { ...data };
		try {
			const response = id
				? await JobseekerProfileService.publication.update({ ...payload, id })
				: await JobseekerProfileService.publication.add(payload);
			toast({ description: response.message, variant: 'success' });
			loadPublications();
			return true;
		} catch (error: any) {
			toast({ title: 'Error', description: error.message || 'An error occurred.', variant: 'danger' });
			return false;
		}
	};

	const handleRemove = async () => {
		if (!itemToDelete?.id) return;
		try {
			const response = await JobseekerProfileService.publication.delete(itemToDelete.id);
			toast({ description: response.message || 'Publication deleted successfully.', variant: 'success' });
			loadPublications();
		} catch (error: any) {
			toast({
				title: 'Error',
				description: error.message || 'Failed to delete publication.',
				variant: 'danger',
			});
		} finally {
			setItemToDelete(null);
		}
	};

	const renderItem = (item: Publication) => {
		return (
			<Card key={item.id} className='p-4 flex justify-between items-start'>
				<div>
					<p className='font-semibold'>{item.title}</p>
					<p className='text-sm text-muted-foreground'>
						{item.publisher} - {format(new Date(item.publicationDate), 'PPP')}
					</p>
					<a
						href={item.url}
						target='_blank'
						rel='noopener noreferrer'
						className='text-xs text-primary hover:underline flex items-center gap-1 mt-1'
					>
						<Link2 className='h-3 w-3' />
						View Publication
					</a>
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
						<div className="space-y-1.5">
							<CardTitle>Your Publications</CardTitle>
							<CardDescription>Listed below is your published work.</CardDescription>
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
						<p className='text-center text-muted-foreground py-8'>No publications added yet.</p>
					)}
				</CardContent>
			</Card>

			{isFormOpen && (
				<PublicationForm
					isOpen={isFormOpen}
					onClose={handleCloseForm}
					onSubmit={handleFormSubmit}
					initialData={editingItem}
					noun='Publication'
				/>
			)}
			<ConfirmationDialog
				open={!!itemToDelete}
				onOpenChange={(open) => !open && setItemToDelete(null)}
				description='This action cannot be undone. This will permanently delete this publication.'
				onConfirm={handleRemove}
				confirmText='Delete'
			/>
			<div className='flex justify-between mt-8'>
				<Button variant='outline' onClick={() => router.push('/jobseeker/profile-edit/languages')}>
					<ArrowLeft className='mr-2 h-4 w-4' /> Previous
				</Button>
				<Button onClick={() => router.push('/jobseeker/profile-edit/awards')}>
					Next <MoveRight className='ml-2 h-4 w-4' />
				</Button>
			</div>
		</div>
	);
}
