'use client';

import { EnumOption } from '@/app/(auth)/jobseeker/profile-edit/page';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { FormAutocomplete } from '@/components/ui/form-autocomplete';
import { FormDatePicker } from '@/components/ui/form-datepicker';
import { FormInput } from '@/components/ui/form-input';
import { FormSelect } from '@/components/ui/form-select';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { ChildInfo, FamilyInfo } from '@/interfaces/jobseeker.interface';
import { ICommonMasterData } from '@/interfaces/master-data.interface';
import { makeReqDateFormat } from '@/lib/utils';
import { JobseekerProfileService } from '@/services/api/jobseeker-profile.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Edit, Loader2, PlusCircle, Save, Trash } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// Zod schema for a single child
const childSchema = z.object({
	id: z.number().optional(),
	name: z.string().min(1, 'Child name is required.'),
	gender: z.string().min(1, 'Gender is required.'),
	dob: z.string().min(1, 'Date of birth is required.'),
	serialNo: z.coerce.number().min(1, 'Serial number is required.'),
});

type ChildFormValues = z.infer<typeof childSchema>;

// Child Form Component (for Dialog)
interface ChildFormProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: ChildFormValues) => Promise<boolean>;
	initialData?: ChildFormValues;
	genders: EnumOption[];
}

function ChildForm({ isOpen, onClose, onSubmit, initialData, genders }: ChildFormProps) {
	const form = useForm<ChildFormValues>({
		resolver: zodResolver(childSchema),
		defaultValues: initialData || { name: '', gender: '', dob: '', serialNo: 1 },
	});
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		form.reset(initialData || { name: '', gender: '', dob: '', serialNo: 1 });
	}, [initialData, form]);

	const handleSubmit = async (data: ChildFormValues) => {
		setIsSubmitting(true);
		const success = await onSubmit(data);
		if (success) {
			onClose();
		}
		setIsSubmitting(false);
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{initialData?.id ? 'Edit Child' : 'Add New Child'}</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4 py-4'>
						<FormInput
							control={form.control}
							name='serialNo'
							label='Serial No.'
							required
							type='number'
							placeholder='e.g. 1'
						/>
						<FormInput control={form.control} name='name' label='Name' required placeholder="Child's Name" />
						<FormSelect
							control={form.control}
							name='gender'
							label='Gender'
							required
							placeholder='Select gender'
							options={genders}
						/>
						<FormDatePicker
							control={form.control}
							name='dob'
							label='Date of Birth'
							required
							fromYear={new Date().getFullYear() - 50}
							toYear={new Date().getFullYear()}
							captionLayout='dropdown-buttons'
						/>
						<DialogFooter className='pt-4'>
							<Button type='button' variant='ghost' onClick={onClose} disabled={isSubmitting}>
								Cancel
							</Button>
							<Button type='submit' disabled={isSubmitting}>
								{isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
								{initialData?.id ? 'Save Changes' : 'Add Child'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

// Main Family Form Component
const familySchema = z.object({
	id: z.number().optional(),
	name: z.string().min(1, "Spouse's name is required."),
	profession: z.string().min(1, "Spouse's profession is required."),
	status: z.string().optional(),
	ownDistrictId: z.coerce.number().optional(),
});

type FamilyFormValues = z.infer<typeof familySchema>;

interface ProfileFormFamilyProps {
	districts: ICommonMasterData[];
	initialData?: FamilyInfo;
	spouseStatuses: EnumOption[];
	genders: EnumOption[];
}

export function ProfileFormFamily({
	districts,
	initialData,
	spouseStatuses,
	genders,
}: ProfileFormFamilyProps) {
	const { toast } = useToast();
	const [isSavingSpouse, setIsSavingSpouse] = useState(false);
	const [children, setChildren] = useState<ChildInfo[]>(initialData?.children || []);
	const [isChildFormOpen, setIsChildFormOpen] = useState(false);
	const [editingChild, setEditingChild] = useState<ChildInfo | undefined>(undefined);
	const [isLoadingChildren, setIsLoadingChildren] = useState(true);

	const form = useForm<FamilyFormValues>({
		resolver: zodResolver(familySchema),
		defaultValues: {
			id: initialData?.id,
			name: initialData?.name,
			profession: initialData?.profession,
			status: initialData?.status,
			ownDistrictId: initialData?.ownDistrictId,
		},
	});

	const loadChildren = useCallback(async () => {
		setIsLoadingChildren(true);
		try {
			const res = await JobseekerProfileService.children.get();
			setChildren(res.body || []);
		} catch (error) {
			console.error('Failed to load children:', error);
			toast({ title: 'Error', description: "Could not load children's information." });
		} finally {
			setIsLoadingChildren(false);
		}
	}, [toast]);

	useEffect(() => {
		loadChildren();
	}, [loadChildren]);

	useEffect(() => {
		form.reset({
			id: initialData?.id,
			name: initialData?.name,
			profession: initialData?.profession,
			status: initialData?.status,
			ownDistrictId: initialData?.ownDistrictId,
		});
	}, [initialData, form]);

	const onSpouseSubmit = async (data: FamilyFormValues) => {
		setIsSavingSpouse(true);
		try {
			const spouseResponse = await JobseekerProfileService.spouse.save(data as FamilyInfo);
			toast({ description: spouseResponse.message || 'Spouse information saved.', variant: 'success' });
			form.reset({ ...form.getValues(), id: spouseResponse.body.id });
		} catch (error: any) {
			toast({
				title: 'Error',
				description: error?.message || 'Failed to save spouse information.',
				variant: 'danger',
			});
		} finally {
			setIsSavingSpouse(false);
		}
	};

	const handleOpenChildForm = (child?: ChildInfo) => {
		setEditingChild(child);
		setIsChildFormOpen(true);
	};

	const handleCloseChildForm = () => {
		setEditingChild(undefined);
		setIsChildFormOpen(false);
	};

	const handleChildFormSubmit = async (data: ChildFormValues) => {
		try {
			const isUpdate = !!data.id;
			const response = isUpdate
				? await JobseekerProfileService.children.update(data as ChildInfo)
				: await JobseekerProfileService.children.add(data);
			toast({ description: response.message, variant: 'success' });
			loadChildren(); // Reload children list
			return true;
		} catch (error: any) {
			toast({ title: 'Error', description: error.message, variant: 'danger' });
			return false;
		}
	};

	const handleChildDelete = async (id: number) => {
		try {
			await JobseekerProfileService.children.delete(id);
			toast({ description: 'Child successfully deleted.', variant: 'success' });
			loadChildren();
		} catch (error: any) {
			toast({ title: 'Error', description: error.message, variant: 'danger' });
		}
	};

	return (
		<div className='space-y-6'>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSpouseSubmit)} className='space-y-6'>
					<Card className='glassmorphism'>
						<CardHeader>
							<CardTitle>Spouse Information</CardTitle>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<FormInput
									control={form.control}
									name='name'
									label="Spouse's Name"
									required
									placeholder="Spouse's full name"
								/>
								<FormInput
									control={form.control}
									name='profession'
									label="Spouse's Profession"
									required
									placeholder='e.g., Doctor, Teacher'
								/>
							</div>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<FormSelect
									control={form.control}
									name='status'
									label='Spouse Status'
									placeholder='Select a status'
									options={spouseStatuses}
								/>
								<FormAutocomplete
									control={form.control}
									name='ownDistrictId'
									label="Spouse's Home District"
									placeholder='Select a district'
									options={districts.map((d) => ({ value: d.id!, label: d.name }))}
								/>
							</div>
						</CardContent>
						<CardFooter>
							<Button type='submit' disabled={isSavingSpouse}>
								{isSavingSpouse ? (
									<Loader2 className='mr-2 h-4 w-4 animate-spin' />
								) : (
									<Save className='mr-2 h-4 w-4' />
								)}
								Save Spouse Information
							</Button>
						</CardFooter>
					</Card>
				</form>
			</Form>

			<Card className='glassmorphism'>
				<CardHeader>
					<div className='flex justify-between items-center'>
						<div>
							<CardTitle>Children Information</CardTitle>
							<CardDescription>Add details for each of your children.</CardDescription>
						</div>
						<Button type='button' variant='outline' onClick={() => handleOpenChildForm()}>
							<PlusCircle className='mr-2 h-4 w-4' /> Add Child
						</Button>
					</div>
				</CardHeader>
				<CardContent className='space-y-4'>
					{isLoadingChildren ? (
						<Skeleton className='h-20 w-full' />
					) : children.length > 0 ? (
						children.map((child: any) => (
							<Card key={child.id} className='p-4 flex justify-between items-start'>
								<div>
									<p className='font-semibold'>
										{child.serialNo}. {child.name}
									</p>
									<p className='text-sm text-muted-foreground'>
										{child.genderDTO?.label || child.gender} - Born on {format(new Date(child.dob), 'PPP')}
									</p>
								</div>
								<div className='flex items-center'>
									<Button
										variant='ghost'
										size='icon'
										onClick={() =>
											handleOpenChildForm({
												...child,
												dob: makeReqDateFormat(child.dob),
											})
										}
									>
										<Edit className='h-4 w-4' />
									</Button>
									<ConfirmationDialog
										trigger={
											<Button variant='ghost' size='icon'>
												<Trash className='h-4 w-4 text-danger' />
											</Button>
										}
										onConfirm={() => handleChildDelete(child.id!)}
										description={`Are you sure you want to delete ${child.name}? This action cannot be undone.`}
										confirmText='Delete'
									/>
								</div>
							</Card>
						))
					) : (
						<p className='text-center text-muted-foreground py-8'>No children added yet.</p>
					)}
				</CardContent>
			</Card>

			{isChildFormOpen && (
				<ChildForm
					isOpen={isChildFormOpen}
					onClose={handleCloseChildForm}
					onSubmit={handleChildFormSubmit}
					initialData={editingChild}
					genders={genders}
				/>
			)}
		</div>
	);
}
