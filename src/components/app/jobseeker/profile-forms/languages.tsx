
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Language } from '@/lib/types';
import { PlusCircle, Trash, Edit, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { FormSelect } from '@/components/ui/form-select';
import { MasterDataService } from '@/services/api/master-data.service';
import { FormAutocomplete } from '@/components/ui/form-autocomplete';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { JobseekerProfileService } from '@/services/api/jobseeker-profile.service';

const languageSchema = z.object({
  name: z.string().min(1, 'Language name is required.'),
  proficiency: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Native']),
});

type LanguageFormValues = z.infer<typeof languageSchema>;

interface LanguageFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: LanguageFormValues, id?: string) => Promise<boolean>;
    initialData?: Language;
    noun: string;
    languageOptions: { label: string, value: string }[];
}

function LanguageForm({ isOpen, onClose, onSubmit, initialData, noun, languageOptions }: LanguageFormProps) {
    const form = useForm<LanguageFormValues>({
        resolver: zodResolver(languageSchema),
        defaultValues: initialData || { name: '', proficiency: 'Intermediate' },
    });
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    React.useEffect(() => {
        form.reset(initialData || { name: '', proficiency: 'Intermediate' });
    }, [initialData, form]);

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
                    <DialogTitle>{initialData ? `Edit ${noun}` : `Add New ${noun}`}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
                       <FormAutocomplete
                            control={form.control}
                            name="name"
                            label="Language"
                            placeholder="Select a language"
                            required
                            options={languageOptions}
                            disabled={isSubmitting}
                        />
                        <FormSelect
                          control={form.control}
                          name="proficiency"
                          label="Proficiency"
                          required
                          options={[
                            { label: 'Beginner', value: 'Beginner' },
                            { label: 'Intermediate', value: 'Intermediate' },
                            { label: 'Advanced', value: 'Advanced' },
                            { label: 'Native', value: 'Native' },
                          ]}
                          placeholder="Select proficiency"
                          disabled={isSubmitting}
                        />
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {initialData ? 'Save Changes' : 'Add Language'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export function ProfileFormLanguages() {
	const { toast } = useToast();
	const [history, setHistory] = React.useState<Language[]>([]);
	const [editingItem, setEditingItem] = React.useState<Language | undefined>(undefined);
	const [isFormOpen, setIsFormOpen] = React.useState(false);
	const [isLoading, setIsLoading] = React.useState(true);
	const [languageOptions, setLanguageOptions] = React.useState<{ label: string; value: string }[]>([]);

	const loadLanguages = React.useCallback(async () => {
		setIsLoading(true);
		try {
			const [languagesRes, masterLanguagesRes] = await Promise.all([
				JobseekerProfileService.language.get(),
				MasterDataService.language.get(),
			]);
			setHistory(languagesRes.body);
			setLanguageOptions(masterLanguagesRes.body.map((l) => ({ label: l.name, value: l.name })));
		} catch (error) {
			toast({
				description: 'Failed to load languages.',
				variant: 'danger',
			});
		} finally {
			setIsLoading(false);
		}
	}, [toast]);

	React.useEffect(() => {
		loadLanguages();
	}, [loadLanguages]);

	const handleOpenForm = (item?: Language) => {
		setEditingItem(item);
		setIsFormOpen(true);
	};

	const handleCloseForm = () => {
		setIsFormOpen(false);
		setEditingItem(undefined);
	};

	const handleFormSubmit = async (data: LanguageFormValues, id?: string) => {
		const payload = { ...data, userId: 2 }; // Assuming user ID is 2
		try {
			const response = id
				? await JobseekerProfileService.language.update({ ...payload, id })
				: await JobseekerProfileService.language.add(payload);
			toast({ description: response.message, variant: 'success' });
			loadLanguages();
			return true;
		} catch (error: any) {
			toast({ title: 'Error', description: error.message || 'An error occurred.', variant: 'danger' });
			return false;
		}
	};

	const handleRemove = async (id: string) => {
		try {
			const response = await JobseekerProfileService.language.delete(id);
			toast({ description: response.message || 'Language deleted successfully.', variant: 'success' });
			loadLanguages();
		} catch (error: any) {
			toast({
				title: 'Error',
				description: error.message || 'Failed to delete language.',
				variant: 'danger',
			});
		}
	};

	const renderItem = (item: Language) => {
		return (
			<Card key={item.id} className='p-4 flex justify-between items-center'>
				<div>
					<p className='font-semibold'>{item.name}</p>
					<p className='text-sm text-muted-foreground'>{item.proficiency}</p>
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
						description='This action cannot be undone. This will permanently delete this language from your profile.'
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
						<div>
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
				/>
			)}
		</div>
	);
}
