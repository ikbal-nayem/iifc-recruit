
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Publication } from '@/lib/types';
import { PlusCircle, Trash, Save, Edit, Link2, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form } from '@/components/ui/form';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { FormInput } from '@/components/ui/form-input';
import { FormDatePicker } from '@/components/ui/form-datepicker';
import { JobseekerProfileService } from '@/services/api/jobseeker-profile.service';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const publicationSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  publisher: z.string().min(1, 'Publisher is required.'),
  publicationDate: z.string().min(1, 'Publication date is required.'),
  url: z.string().url('Please enter a valid URL.'),
});

type PublicationFormValues = z.infer<typeof publicationSchema>;


interface PublicationFormProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: PublicationFormValues, id?: string) => Promise<boolean>;
	initialData?: Publication;
}

function PublicationForm({ isOpen, onClose, onSubmit, initialData }: PublicationFormProps) {
	const form = useForm<PublicationFormValues>({
		resolver: zodResolver(publicationSchema),
		defaultValues: initialData || { title: '', publisher: '', publicationDate: '', url: '' },
	});
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    React.useEffect(() => {
        form.reset(initialData || { title: '', publisher: '', publicationDate: '', url: '' });
    }, [initialData, form]);

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
					<DialogTitle>{initialData ? 'Edit Publication' : 'Add Publication'}</DialogTitle>
					<DialogDescription>
						{initialData ? 'Update the details of your publication.' : 'Enter the details for your new publication.'}
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4 py-4'>
						<FormInput control={form.control} name="title" label="Title" placeholder="e.g., The Future of AI" required disabled={isSubmitting} />
                        <FormInput control={form.control} name="publisher" label="Publisher" placeholder="e.g., Nature Journal" required disabled={isSubmitting}/>
                        <FormDatePicker control={form.control} name="publicationDate" label="Publication Date" required disabled={isSubmitting} />
                        <FormInput control={form.control} name="url" label="URL" placeholder="https://example.com/publication" required type="url" disabled={isSubmitting} />
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


export function ProfileFormPublications() {
  const { toast } = useToast();
  const [history, setHistory] = React.useState<Publication[]>([]);
  const [editingItem, setEditingItem] = React.useState<Publication | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  const loadPublications = React.useCallback(async () => {
    setIsLoading(true);
    try {
        const response = await JobseekerProfileService.publication.get();
        setHistory(response.body);
    } catch (error) {
        toast({
            title: 'Error',
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

  const handleFormSubmit = async (data: PublicationFormValues, id?: string): Promise<boolean> => {
    try {
        const response = id 
            ? await JobseekerProfileService.publication.update({ id, ...data })
            : await JobseekerProfileService.publication.add(data);
        
        toast({ description: response.message, variant: 'success' });
        loadPublications();
        return true;
    } catch (error: any) {
        toast({ title: 'Error', description: error.message || 'An error occurred.', variant: 'danger' });
        return false;
    }
  };

  const handleRemove = async (id: string) => {
    try {
        const response = await JobseekerProfileService.publication.delete(id);
        toast({ description: response.message || 'Publication deleted successfully.', variant: 'success' });
        loadPublications();
    } catch (error: any) {
        toast({ title: 'Error', description: error.message || 'Failed to delete publication.', variant: 'danger' });
    }
  };

  const handleOpenForm = (item?: Publication) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setEditingItem(undefined);
    setIsFormOpen(false);
  };

  const renderItem = (item: Publication) => {
    return (
        <Card key={item.id} className="p-4 flex justify-between items-start">
            <div>
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.publisher} - {format(new Date(item.publicationDate), "PPP")}</p>
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1 mt-1">
                    <Link2 className="h-3 w-3" />
                    View Publication
                </a>
            </div>
            <div className="flex gap-2">
                 <Button variant="ghost" size="icon" onClick={() => handleOpenForm(item)}>
                    <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Trash className="h-4 w-4 text-danger" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this publication.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleRemove(item.id!)} className="bg-danger hover:bg-danger/90">Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </Card>
    );
  };

  return (
    <div className="space-y-6">
        <Card className="glassmorphism">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Your Publications</CardTitle>
                    <CardDescription>Listed below is your published work.</CardDescription>
                </div>
                 <Button onClick={() => handleOpenForm()}>
                    <PlusCircle className='mr-2 h-4 w-4' />
                    Add Entry
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                {isLoading ? (
                    [...Array(2)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
                ) : history.length > 0 ? (
                    history.map(renderItem)
                ) : (
                    <p className="text-center text-muted-foreground py-8">No publications added yet.</p>
                )}
            </CardContent>
        </Card>
        
        <PublicationForm 
            isOpen={isFormOpen}
            onClose={handleCloseForm}
            onSubmit={handleFormSubmit}
            initialData={editingItem}
        />
    </div>
  );
}
