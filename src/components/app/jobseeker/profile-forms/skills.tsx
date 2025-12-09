'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { FormAutocomplete } from '@/components/ui/form-autocomplete';
import { FormInput } from '@/components/ui/form-input';
import { FormSelect } from '@/components/ui/form-select';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/constants/routes.constant';
import { toast, useToast } from '@/hooks/use-toast';
import { JobseekerSkill } from '@/interfaces/jobseeker.interface';
import { EnumDTO, ICommonMasterData } from '@/interfaces/master-data.interface';
import { JobseekerProfileService } from '@/services/api/jobseeker-profile.service';
import { MasterDataService } from '@/services/api/master-data.service';
import { getSkillsAsync } from '@/services/async-api';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Edit, Loader2, MoveRight, PlusCircle, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const skillSchema = z.object({
	skillId: z.coerce.string().min(1, 'Skill is required.'),
	yearsOfExperience: z.coerce.number().min(0, 'Years of experience must be 0 or more.'),
	proficiency: z.string().min(1, 'Proficiency level is required.'),
});

type SkillFormValues = z.infer<typeof skillSchema>;

const defaultValues = { skillId: '', yearsOfExperience: 0, proficiency: '' };

interface SkillFormProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: SkillFormValues, id?: string) => Promise<boolean>;
	initialData?: JobseekerSkill;
	noun: string;
	proficiencyOptions: EnumDTO[];
}

function SkillForm({ isOpen, onClose, onSubmit, initialData, noun, proficiencyOptions }: SkillFormProps) {
	const form = useForm<SkillFormValues>({
		resolver: zodResolver(skillSchema),
		defaultValues: initialData || defaultValues,
	});
	const [isSubmitting, setIsSubmitting] = React.useState(false);

	React.useEffect(() => {
		form.reset(initialData ? { ...initialData } : defaultValues);
	}, [initialData, form]);

	const handleSubmit = async (data: SkillFormValues) => {
		setIsSubmitting(true);
		const success = await onSubmit(data, initialData?.id);
		if (success) {
			onClose();
		}
		setIsSubmitting(false);
	};

	const handleCreateSkill = async (name: string): Promise<ICommonMasterData | null> => {
		try {
			const response = await MasterDataService.skill.add({
				nameEn: name,
				nameBn: name,
				active: true,
			});
			toast.success({
				description: `Skill "${name}" created.`,
			});
			return response.body;
		} catch (error: any) {
			toast.error({
				description: error.message || 'Failed to create skill.',
			});
			return null;
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{initialData ? `Edit ${noun}` : `Add New ${noun}`}</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4 py-4'>
						<FormAutocomplete
							control={form.control}
							name='skillId'
							label='Skill'
							placeholder='Search for a skill'
							required
							loadOptions={getSkillsAsync}
							onCreate={handleCreateSkill}
							getOptionValue={(option) => option.id}
							getOptionLabel={(option) => option.nameEn}
							initialLabel={initialData?.skill?.nameEn}
						/>
						<FormInput
							control={form.control}
							name='yearsOfExperience'
							label='Years of Experience'
							type='number'
							required
						/>
						<FormSelect
							control={form.control}
							name='proficiency'
							label='Proficiency'
							required
							placeholder='Select proficiency'
							options={proficiencyOptions}
							getOptionLabel={(option) => option.nameEn}
							getOptionValue={(option) => option.value}
						/>
						<DialogFooter className='pt-4'>
							<Button type='button' variant='ghost' onClick={onClose} disabled={isSubmitting}>
								Cancel
							</Button>
							<Button type='submit' disabled={isSubmitting}>
								{isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
								{initialData ? 'Save Changes' : 'Add Skill'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

interface ProfileFormSkillsProps {
	proficiencyOptions: EnumDTO[];
}

export function ProfileFormSkills({ proficiencyOptions }: ProfileFormSkillsProps) {
	const router = useRouter();
	const { toast } = useToast();
	const [skills, setSkills] = React.useState<JobseekerSkill[]>([]);
	const [isLoading, setIsLoading] = React.useState(true);
	const [editingItem, setEditingItem] = React.useState<JobseekerSkill | undefined>(undefined);
	const [itemToDelete, setItemToDelete] = React.useState<JobseekerSkill | null>(null);
	const [isFormOpen, setIsFormOpen] = React.useState(false);

	const loadSkills = React.useCallback(async () => {
		setIsLoading(true);
		try {
			const response = await JobseekerProfileService.skill.get();
			setSkills(response.body);
		} catch (error) {
			toast.error({ title: 'Error', description: 'Failed to load skills.' });
		} finally {
			setIsLoading(false);
		}
	}, []);

	React.useEffect(() => {
		loadSkills();
	}, [loadSkills]);

	const handleOpenForm = (item?: JobseekerSkill) => {
		setEditingItem(item);
		setIsFormOpen(true);
	};

	const handleCloseForm = () => {
		setIsFormOpen(false);
		setEditingItem(undefined);
	};

	const handleFormSubmit = async (data: SkillFormValues, id?: string) => {
		try {
			const payload = { ...data, id };
			const response = id
				? await JobseekerProfileService.skill.update(payload as JobseekerSkill)
				: await JobseekerProfileService.skill.add(payload);
			toast({ description: response.message, variant: 'success' });
			router.refresh();
			loadSkills();
			return true;
		} catch (error: any) {
			toast({ title: 'Error', description: error.message || 'An error occurred.', variant: 'danger' });
			return false;
		}
	};

	const handleRemove = async () => {
		if (!itemToDelete?.id) return;
		try {
			await JobseekerProfileService.skill.delete(itemToDelete.id);
			toast({ description: 'Skill deleted successfully.', variant: 'success' });
			router.refresh();
			loadSkills();
		} catch (error: any) {
			toast({ title: 'Error', description: error.message || 'Failed to delete skill.', variant: 'danger' });
		} finally {
			setItemToDelete(null);
		}
	};

	const renderItem = (item: JobseekerSkill) => (
		<Card key={item.id} className='p-4 flex justify-between items-start'>
			<div>
				<p className='font-semibold'>{item.skill?.nameEn}</p>
				<p className='text-sm text-muted-foreground'>
					{item.yearsOfExperience} years of experience &middot; {item?.proficiencyDTO?.nameEn}
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

	return (
		<div className='space-y-4'>
			<Card className='glassmorphism'>
				<CardHeader>
					<div className='flex justify-between items-center'>
						<div className='space-y-1.5'>
							<CardTitle>Your Skills</CardTitle>
							<CardDescription>Highlight your expertise by adding your professional skills.</CardDescription>
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
					) : skills.length > 0 ? (
						skills.map(renderItem)
					) : (
						<p className='text-center text-muted-foreground py-8'>No skills added yet.</p>
					)}
				</CardContent>
			</Card>
			{isFormOpen && (
				<SkillForm
					isOpen={isFormOpen}
					onClose={handleCloseForm}
					onSubmit={handleFormSubmit}
					initialData={editingItem}
					noun='Skill'
					proficiencyOptions={proficiencyOptions}
				/>
			)}
			<ConfirmationDialog
				open={!!itemToDelete}
				onOpenChange={(open) => !open && setItemToDelete(null)}
				description={`Are you sure you want to delete the skill "${itemToDelete?.skill?.nameEn}"?`}
				onConfirm={handleRemove}
				confirmText='Delete'
			/>
			<div className='flex justify-between mt-8'>
				<Button variant='outline' onClick={() => router.push(ROUTES.JOB_SEEKER.PROFILE_EDIT.INTEREST)}>
					<ArrowLeft className='mr-2 h-4 w-4' /> Previous
				</Button>
				<Button onClick={() => router.push(ROUTES.JOB_SEEKER.PROFILE_EDIT.CERTIFICATIONS)}>
					Next <MoveRight className='ml-2 h-4 w-4' />
				</Button>
			</div>
		</div>
	);
}
