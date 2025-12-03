'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { FormAutocomplete } from '@/components/ui/form-autocomplete';
import { FormRadioGroup } from '@/components/ui/form-radio-group';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/constants/routes.constant';
import { toast } from '@/hooks/use-toast';
import { Language } from '@/interfaces/jobseeker.interface';
import { EnumDTO, ICommonMasterData } from '@/interfaces/master-data.interface';
import { JobseekerProfileService } from '@/services/api/jobseeker-profile.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Edit, Loader2, MoveRight, PlusCircle, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const languageSchema = z.object({
	languageId: z.coerce.string().min(1, 'Language is required.'),
	reading: z.string().min(1, 'Reading proficiency is required'),
	writing: z.string().min(1, 'Writing proficiency is required'),
	speaking: z.string().min(1, 'Speaking proficiency is required'),
	listening: z.string().min(1, 'Listening proficiency is required'),
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

const defaultValues = { languageId: '', reading: '', writing: '', speaking: '', listening: '' };

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
		defaultValues: {
			...defaultValues,
			reading: proficiencyOptions[0]?.value,
			writing: proficiencyOptions[0]?.value,
			speaking: proficiencyOptions[0]?.value,
			listening: proficiencyOptions[0]?.value,
		},
	});
	const [isSubmitting, setIsSubmitting] = React.useState(false);

	React.useEffect(() => {
		if (initialData) {
			form.reset({ ...initialData });
		} else {
			form.reset({
				...defaultValues,
				reading: proficiencyOptions[0]?.value,
				writing: proficiencyOptions[0]?.value,
				speaking: proficiencyOptions[0]?.value,
				listening: proficiencyOptions[0]?.value,
			});
		}
	}, [initialData, form, proficiencyOptions]);

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
			<DialogContent className='max-w-3xl'>
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

						<div className='space-y-4'>
							<p className='text-sm font-bold'>Proficiency Levels</p>
							<div className='space-y-2'>
								<FormRadioGroup
									control={form.control}
									name='reading'
									label='Reading'
									required
									options={proficiencyOptions.map((p) => ({ label: p.nameEn, value: p.value }))}
									orientation='horizontal'
								/>
							</div>
							<div className='space-y-2'>
								<FormRadioGroup
									control={form.control}
									name='writing'
									label='Writing'
									required
									options={proficiencyOptions.map((p) => ({ label: p.nameEn, value: p.value }))}
									orientation='horizontal'
								/>
							</div>
							<div className='space-y-2'>
								<FormRadioGroup
									control={form.control}
									name='speaking'
									label='Speaking'
									required
									options={proficiencyOptions.map((p) => ({ label: p.nameEn, value: p.value }))}
									orientation='horizontal'
								/>
							</div>
							<div className='space-y-2'>
								<FormRadioGroup
									control={form.control}
									name='listening'
									label='Listening'
									required
									options={proficiencyOptions.map((p) => ({ label: p.nameEn, value: p.value }))}
									orientation='horizontal'
								/>
							</div>
						</div>

						<DialogFooter className='pt-4'>
							<Button type='button' variant='outline' onClick={onClose} disabled={isSubmitting}>
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
	const router = useRouter();
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
			toast.error({
				description: 'Failed to load data.',
			});
		} finally {
			setIsLoading(false);
		}
	}, []);

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
			toast.success({ description: response.message });
			router.refresh();
			loadData();
			return true;
		} catch (error: any) {
			toast.error({ title: 'Error', description: error.message || 'An error occurred.' });
			return false;
		}
	};

	const handleRemove = async () => {
		if (!itemToDelete?.id) return;
		try {
			const response = await JobseekerProfileService.language.delete(itemToDelete.id);
			toast.success({ description: response.message || 'Language deleted successfully.' });
			router.refresh();
			loadData();
		} catch (error: any) {
			toast.error({
				title: 'Error',
				description: error.message || 'Failed to delete language.',
			});
		} finally {
			setItemToDelete(null);
		}
	};

	const getProficiencyLabel = (value?: string) => {
		return proficiencyOptions.find((p) => p.value === value)?.nameEn || value;
	};

	const renderItem = (item: Language) => {
		const languageName =
			languageOptions.find((l) => l.id === item.languageId)?.nameEn || item.language?.nameEn;
		return (
			<Card key={item.id} className='p-4 flex justify-between items-start'>
				<div className='space-y-1'>
					<p className='font-semibold'>{languageName}</p>
					<div className='flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground'>
						<span>
							Reading: <b>{getProficiencyLabel(item.reading)}</b>
						</span>
						<span>
							Writing: <b>{getProficiencyLabel(item.writing)}</b>
						</span>
						<span>
							Speaking: <b>{getProficiencyLabel(item.speaking)}</b>
						</span>
						<span>
							Listening: <b>{getProficiencyLabel(item.listening)}</b>
						</span>
					</div>
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
						[...Array(1)].map((_, i) => <Skeleton key={i} className='h-20 w-full' />)
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
			<div className='flex justify-between mt-8'>
				<Button variant='outline' onClick={() => router.push(ROUTES.JOB_SEEKER.PROFILE_EDIT.TRAINING)}>
					<ArrowLeft className='mr-2 h-4 w-4' /> Previous
				</Button>
				<Button onClick={() => router.push(ROUTES.JOB_SEEKER.PROFILE_EDIT.PUBLICATIONS)}>
					Next <MoveRight className='ml-2 h-4 w-4' />
				</Button>
			</div>
		</div>
	);
}
