
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { FormAutocomplete } from '@/components/ui/form-autocomplete';
import { FormSelect } from '@/components/ui/form-select';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Language } from '@/interfaces/jobseeker.interface';
import { ICommonMasterData, EnumDTO } from '@/interfaces/master-data.interface';
import { JobseekerProfileService } from '@/services/api/jobseeker-profile.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, Loader2, PlusCircle, Trash } from 'lucide-react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const languageSchema = z.object({
	languageId: z.coerce.string().min(1, 'Language is required.'),
	proficiency: z.string().min(1, 'Proficiency is required'),
});

type LanguageFormValues = z.infer<typeof languageSchema>;

interface LanguageFormProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: LanguageFormValues, id?: string) => Promise<boolean>;
	initialData?: Language;
	noun: string;
	languageOptions: ICommonMasterData[];
	proficiencyOptions: EnumDTO[];
}

const defaultValues = { languageId: '', proficiency: '' };

function LanguageForm({
	isOpen,
	onClose,
	onSubmit,
	initialData,
	noun,
	languageOptions,
	proficiencyOptions,
}: LanguageFormProps) {
	const form = useForm<LanguageFormValues>({
		resolver: zodResolver(languageSchema),
		values: initialData || defaultValues,
	});
	const [isSubmitting, setIsSubmitting] = React.useState(false);

	const handleSubmit = async (data: LanguageFormValues) => {
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
						<FormAutocomplete
							control={form.control}
							name='languageId'
							label='Language'
							placeholder='Select a language'
							required
							options={languageOptions}
							getOptionLabel={(option) => option.nameEn}
							getOptionValue={(option) => option.id!}
							disabled={isSubmitting}
						/>
						<FormSelect
							control={form.control}
							name='proficiency'
							label='Proficiency'
							required
							options={proficiencyOptions}
							placeholder='Select proficiency'
							getOptionLabel={(option) => option.nameEn}
							getOptionValue={(option) => option.value}
							disabled={isSubmitting}
						/>
						<DialogFooter className='pt-4'>
							<Button type='button' variant='ghost' onClick={onClose} disabled={isSubmitting}>
								Cancel
							</Button>
							<Button type='submit' disabled={isSubmitting}>
								{isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
								{initialData ? 'Save Changes' : 'Add Language'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

interface ProfileFormLanguagesProps {
	languageOptions: ICommonMasterData[];
	proficiencyOptions: EnumDTO[];
}

export function ProfileFormLanguages({ languageOptions, proficiencyOptions }: ProfileFormLanguagesProps) {
	const { toast } = useToast();
	const [history, setHistory] = React.useState<Language[]>([]);
	const [editingItem, setEditingItem] = React.useState<Language | undefined>(undefined);
	const [itemToDelete, setItemToDelete] = React.useState<Language | null>(null);
	const [isFormOpen, setIsFormOpen] = React.useState(false);
	const [isLoading, setIsLoading] = React.useState(true);

	const loadData = React.useCallback(async () => {
		setIsLoading(true);
		try {
			const languagesRes = await JobseekerProfileService.language.get();
			setHistory(languagesRes.body);
		} catch (error) {
			toast({
				description: 'Failed to load data.',
				variant: 'danger',
			});
		} finally {
			setIsLoading(false);
		}
	}, [toast]);

	React.useEffect(() => {
		loadData();
	}, [loadData]);

	const handleOpenForm = (item?: Language) => {
		setEditingItem(item);
		setIsFormOpen(true);
	};

	const handleCloseForm = () => {
		setIsFormOpen(false);
		setEditingItem(undefined);
	};

	const handleFormSubmit = async (data: LanguageFormValues, id?: string) => {
		const payload = { ...data };
		try {
			const response = id
				? await JobseekerProfileService.language.update({ ...payload, id })
				: await JobseekerProfileService.language.add(payload);
			toast({ description: response.message, variant: 'success' });
			loadData();
			return true;
		} catch (error: any) {
			toast({ title: 'Error', description: error.message || 'An error occurred.', variant: 'danger' });
			return false;
		}
	};

	const handleRemove = async () => {
		if (!itemToDelete?.id) return;
		try {
			const response = await JobseekerProfileService.language.delete(itemToDelete.id);
			toast({ description: response.message || 'Language deleted successfully.', variant: 'success' });
			loadData();
		} catch (error: any) {
			toast({
				title: 'Error',
				description: error.message || 'Failed to delete language.',
				variant: 'danger',
			});
		} finally {
			setItemToDelete(null);
		}
	};

	const renderItem = (item: Language) => {
		const languageName = languageOptions.find((l) => l.id === item.languageId)?.nameEn || item.language?.nameEn;
		return (
			<Card key={item.id} className='p-4 flex justify-between items-center'>
				<div>
					<p className='font-semibold'>{languageName}</p>
					<p className='text-sm text-muted-foreground'>{item?.proficiencyDTO?.nameEn}</p>
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
							<CardTitle>Your Languages</CardTitle>
							<CardDescription>Listed below are the languages you speak.</CardDescription>
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
						<p className='text-center text-muted-foreground py-8'>No languages added yet.</p>
					)}
				</CardContent>
			</Card>

			{isFormOpen && (
				<LanguageForm
					isOpen={isFormOpen}
					onClose={handleCloseForm}
					onSubmit={handleFormSubmit}
					initialData={editingItem}
					noun='Language'
					languageOptions={languageOptions}
					proficiencyOptions={proficiencyOptions}
				/>
			)}
			<ConfirmationDialog
				open={!!itemToDelete}
				onOpenChange={(open) => !open && setItemToDelete(null)}
				description='This action cannot be undone. This will permanently delete this language from your profile.'
				onConfirm={handleRemove}
				confirmText='Delete'
			/>
		</div>
	);
}
