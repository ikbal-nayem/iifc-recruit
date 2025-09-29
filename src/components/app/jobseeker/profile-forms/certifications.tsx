'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FilePreviewer } from '@/components/ui/file-previewer';
import { Form } from '@/components/ui/form';
import { FormDatePicker } from '@/components/ui/form-datepicker';
import { FormFileUpload } from '@/components/ui/form-file-upload';
import { FormInput } from '@/components/ui/form-input';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Certification } from '@/interfaces/jobseeker.interface';
import { makeFormData } from '@/lib/utils';
import { JobseekerProfileService } from '@/services/api/jobseeker-profile.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, parseISO } from 'date-fns';
import { Edit, FileText, Loader2, PlusCircle, Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const certificationSchema = z.object({
	name: z.string().min(1, 'Certificate name is required.'),
	issuingOrganization: z.string().min(1, 'Issuing organization is required.'),
	issueDate: z.string().min(1, 'Issue date is required.'),
	proof: z.any().optional(),
});

type CertificationFormValues = z.infer<typeof certificationSchema>;

const defaultData = { name: '', issuingOrganization: '', issueDate: '' };

interface CertificationFormProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: Certification) => Promise<boolean>;
	initialData?: Certification;
	noun: string;
}

function CertificationForm({ isOpen, onClose, onSubmit, initialData, noun }: CertificationFormProps) {
	const form = useForm<CertificationFormValues>({
		resolver: zodResolver(certificationSchema),
		defaultValues: initialData || defaultData,
	});
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		form.reset(initialData || defaultData);
	}, [initialData, form]);

	const handleSubmit = (data: CertificationFormValues) => {
		setIsSubmitting(true);
		const payload: Certification = { ...data, id: initialData?.id };

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
							label='Certificate Name'
							placeholder='e.g., Certified React Developer'
							required
							disabled={isSubmitting}
						/>
						<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
							<div className='md:col-span-2'>
								<FormInput
									control={form.control}
									name='issuingOrganization'
									label='Issuing Organization'
									placeholder='e.g., Vercel'
									required
									disabled={isSubmitting}
								/>
							</div>
							<FormDatePicker
								control={form.control}
								name='issueDate'
								label='Issue Date'
								required
								disabled={isSubmitting}
							/>
						</div>
						<FormFileUpload control={form.control} name='proof' label='Proof' accept='.pdf, image/*' />
						<DialogFooter className='pt-4'>
							<Button type='button' variant='ghost' onClick={onClose} disabled={isSubmitting}>
								Cancel
							</Button>
							<Button type='submit' disabled={isSubmitting}>
								{isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
								{initialData ? 'Save Changes' : 'Add Certification'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

export default function ProfileFormCertifications() {
	const { toast } = useToast();
	const [history, setHistory] = useState<Certification[]>([]);
	const [editingItem, setEditingItem] = useState<Certification | undefined>(undefined);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	const loadCertifications = React.useCallback(async () => {
		setIsLoading(true);
		try {
			const response = await JobseekerProfileService.certification.get();
			setHistory(response.body);
		} catch (error) {
			toast({
				description: 'Failed to load certifications.',
				variant: 'danger',
			});
		} finally {
			setIsLoading(false);
		}
	}, [toast]);

	useEffect(() => {
		loadCertifications();
	}, [loadCertifications]);

	const handleOpenForm = (item?: Certification) => {
		setEditingItem(item);
		setIsFormOpen(true);
	};

	const handleCloseForm = () => {
		setIsFormOpen(false);
		setEditingItem(undefined);
	};

	const handleFormSubmit = async (formData: Certification) => {
		try {
			const response = await JobseekerProfileService.certification.save(makeFormData(formData));
			toast({ description: response.message, variant: 'success' });
			loadCertifications();
			return true;
		} catch (error: any) {
			toast({ title: 'Error', description: error.message || 'An error occurred.', variant: 'danger' });
			return false;
		}
	};

	const handleRemove = async (id: number) => {
		try {
			await JobseekerProfileService.certification.delete(id);
			toast({ description: 'Certification deleted successfully.', variant: 'success' });
			loadCertifications();
		} catch (error: any) {
			toast({
				title: 'Error',
				description: error.message || 'Failed to delete certification.',
				variant: 'danger',
			});
		}
	};

	const renderItem = (item: Certification) => {
		return (
			<Card key={item.id} className='p-4 flex justify-between items-start'>
				<div>
					<p className='font-semibold'>{item.name}</p>
					<p className='text-sm text-muted-foreground'>
						{item.issuingOrganization} - {format(parseISO(item.issueDate), 'MMM yyyy')}
					</p>
					{item.proof && (
						<FilePreviewer file={item.proof}>
							<button className='text-xs text-primary hover:underline flex items-center gap-1 mt-1'>
								<FileText className='h-3 w-3' />
								View Proof
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
						description='This will permanently delete this certification.'
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
							<CardTitle>Your Certifications</CardTitle>
							<CardDescription>Listed below are your professional certifications.</CardDescription>
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
						<p className='text-center text-muted-foreground py-8'>No certifications added yet.</p>
					)}
				</CardContent>
			</Card>

			{isFormOpen && (
				<CertificationForm
					isOpen={isFormOpen}
					onClose={handleCloseForm}
					onSubmit={handleFormSubmit}
					initialData={editingItem}
					noun='Certification'
				/>
			)}
		</div>
	);
}