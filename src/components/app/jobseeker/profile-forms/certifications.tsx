
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
import { ROUTES } from '@/constants/routes.constant';
import { toast } from '@/hooks/use-toast';
import { Certification } from '@/interfaces/jobseeker.interface';
import { ICommonMasterData } from '@/interfaces/master-data.interface';
import { makeFormData } from '@/lib/utils';
import { JobseekerProfileService } from '@/services/api/jobseeker-profile.service';
import { MasterDataService } from '@/services/api/master-data.service';
import { getCertificationsAsync } from '@/services/async-api';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, parseISO } from 'date-fns';
import { ArrowLeft, Edit, FileText, Loader2, MoveRight, PlusCircle, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const certificationSchema = z
	.object({
		issuingAuthority: z.string().min(1, 'Issuing organization is required.'),
		certificationId: z.coerce.string().optional(),
		examDate: z.string().optional(),
		issueDate: z.string().optional(),
		expireDate: z.string().optional(),
		score: z.string().optional(),
		outOf: z.string().optional(),
		certificateFile: z.any().refine((file) => file, 'Certificate file is required.'),
	})
	.refine(
		(data) => {
			if (data.issueDate && data.expireDate) {
				return new Date(data.issueDate) <= new Date(data.expireDate);
			}
			return true;
		},
		{
			message: 'Expiry date cannot be before issue date.',
			path: ['expireDate'],
		}
	)
	.refine(
		(data) => {
			if (data.examDate && data.issueDate) {
				return new Date(data.examDate) <= new Date(data.issueDate);
			}
			return true;
		},
		{
			message: 'Issue date cannot be before exam date.',
			path: ['issueDate'],
		}
	);

type CertificationFormValues = z.infer<typeof certificationSchema>;

const defaultData: CertificationFormValues = {
	issuingAuthority: '',
	certificationId: undefined,
	examDate: '',
	issueDate: '',
	expireDate: '',
	score: '',
	outOf: '',
	certificateFile: null,
};

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
		defaultValues: defaultData,
	});
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (initialData) {
			form.reset({
				...initialData,
				certificationId: initialData.certificationId,
			});
		} else {
			form.reset(defaultData);
		}
	}, [initialData, form]);

	const handleSubmit = (data: CertificationFormValues) => {
		setIsSubmitting(true);
		const payload: Certification = {
			...data,
			id: initialData?.id,
		};
		onSubmit(payload)
			.then(() => onClose())
			.finally(() => setIsSubmitting(false));
	};

	const handleCreateCertification = async (name: string): Promise<ICommonMasterData | null> => {
		try {
			const response = await MasterDataService.certification.add({
				nameEn: name,
				nameBn: name,
				active: true,
			});
			toast.success({
				description: `Certification "${name}" created.`,
			});
			return response.body;
		} catch (error: any) {
			toast.error({
				description: error.message || 'Failed to create certification.',
			});
			return null;
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{initialData ? `Edit ${noun}` : `Add ${noun} Info`}</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4 py-4'>
						<FormAutocomplete
							control={form.control}
							name='certificationId'
							label='Certification'
							placeholder='Search for a certification'
							loadOptions={getCertificationsAsync}
							onCreate={handleCreateCertification}
							getOptionValue={(option) => option.id!}
							getOptionLabel={(option) => option.nameEn}
							initialLabel={initialData?.certification?.nameEn}
							disabled={isSubmitting}
						/>
						<FormInput
							control={form.control}
							name='issuingAuthority'
							label='Issuing Authority'
							placeholder='e.g., Google'
							required
							disabled={isSubmitting}
						/>
						<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
							<FormDatePicker
								control={form.control}
								name='examDate'
								label='Exam Date'
								disabled={isSubmitting}
							/>
							<FormDatePicker
								control={form.control}
								name='issueDate'
								label='Issue Date'
								disabled={isSubmitting}
							/>
							<FormDatePicker
								control={form.control}
								name='expireDate'
								label='Expiry Date'
								disabled={isSubmitting}
							/>
						</div>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<FormInput control={form.control} name='score' label='Score' disabled={isSubmitting} />
							<FormInput control={form.control} name='outOf' label='Out Of' disabled={isSubmitting} />
						</div>

						<FormFileUpload
							control={form.control}
							name='certificateFile'
							label='Certificate'
							accept='.pdf, image/*'
							required
						/>
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
	const router = useRouter();
	const [history, setHistory] = useState<Certification[]>([]);
	const [editingItem, setEditingItem] = useState<Certification | undefined>(undefined);
	const [itemToDelete, setItemToDelete] = useState<Certification | null>(null);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	const loadData = React.useCallback(async () => {
		setIsLoading(true);
		try {
			const [certRes] = await Promise.all([JobseekerProfileService.certification.get()]);
			setHistory(certRes.body as Certification[]);
		} catch (error) {
			toast.error({
				description: 'Failed to load certifications.',
			});
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		loadData();
	}, [loadData]);

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
			toast.success({ description: response.message });
			router.refresh();
			loadData();
			return true;
		} catch (error: any) {
			toast.error({ description: error.message || 'An error occurred.' });
			return false;
		}
	};

	const handleRemove = async () => {
		if (!itemToDelete?.id) return;
		try {
			await JobseekerProfileService.certification.delete(itemToDelete.id);
			toast.success({ description: 'Certification deleted successfully.' });
			router.refresh();
			loadData();
		} catch (error: any) {
			toast.error({
				description: error.message || 'Failed to delete certification.',
			});
		} finally {
			setItemToDelete(null);
		}
	};

	const renderItem = (item: Certification) => {
		return (
			<Card key={item.id} className='p-4 flex justify-between items-start'>
				<div>
					<p className='font-semibold'>{item.certification?.nameEn}</p>
					<p className='text-sm text-muted-foreground'>{item.issuingAuthority}</p>
					{item.issueDate && (
						<p className='text-xs text-muted-foreground'>
							Issued: {format(parseISO(item.issueDate), 'MMM yyyy')}
						</p>
					)}
					{item.score && (
						<p className='text-xs text-muted-foreground'>
							Score: {item.score}
							{item.outOf && ` / ${item.outOf}`}
						</p>
					)}
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
					<Button variant='ghost' size='icon' onClick={() => setItemToDelete(item)}>
						<Trash className='h-4 w-4 text-danger' />
					</Button>
				</div>
			</Card>
		);
	};

	return (
		<div className='space-y-4'>
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
						[...Array(1)].map((_, i) => <Skeleton key={i} className='h-20 w-full' />)
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
			<ConfirmationDialog
				open={!!itemToDelete}
				onOpenChange={(open) => !open && setItemToDelete(null)}
				description='This will permanently delete this certification.'
				onConfirm={handleRemove}
				confirmText='Delete'
			/>
			<div className='flex justify-between mt-8'>
				<Button variant='outline' onClick={() => router.push(ROUTES.JOB_SEEKER.PROFILE_EDIT.SKILLS)}>
					<ArrowLeft className='mr-2 h-4 w-4' /> Previous
				</Button>
				<Button onClick={() => router.push(ROUTES.JOB_SEEKER.PROFILE_EDIT.TRAINING)}>
					Next <MoveRight className='ml-2 h-4 w-4' />
				</Button>
			</div>
		</div>
	);
}
