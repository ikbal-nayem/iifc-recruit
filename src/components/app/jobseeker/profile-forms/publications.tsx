
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
import { PlusCircle, Trash, Save, Edit, Link2 } from 'lucide-react';
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

const publicationSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  publisher: z.string().min(1, 'Publisher is required.'),
  publicationDate: z.string().min(1, 'Publication date is required.'),
  url: z.string().url('Please enter a valid URL.'),
});

type PublicationFormValues = z.infer<typeof publicationSchema>;


export function ProfileFormPublications() {
  const { toast } = useToast();
  const [history, setHistory] = React.useState<Publication[]>([]);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

   const form = useForm<PublicationFormValues>({
    resolver: zodResolver(publicationSchema),
    defaultValues: { title: '', publisher: '', publicationDate: '', url: '' },
  });

  const editForm = useForm<PublicationFormValues>({
    resolver: zodResolver(publicationSchema),
  });

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

  const handleAddNew = async (data: PublicationFormValues) => {
    try {
        const response = await JobseekerProfileService.publication.add(data);
        toast({ description: response.message, variant: 'success' });
        loadPublications();
        form.reset();
        return true;
    } catch (error: any) {
        toast({ title: 'Error', description: error.message || 'An error occurred.', variant: 'danger' });
        return false;
    }
  };

  const handleUpdate = async (data: PublicationFormValues, id: string) => {
     try {
        const response = await JobseekerProfileService.publication.update({ id, ...data });
        toast({ description: response.message, variant: 'success' });
        loadPublications();
        setEditingId(null);
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
  
  const startEditing = (item: Publication) => {
    setEditingId(item.id!);
    editForm.reset(item);
  };


  const renderItem = (item: Publication) => {
    if (editingId === item.id) {
        return (
            <Form {...editForm}>
                <form onSubmit={editForm.handleSubmit((data) => handleUpdate(data, item.id!))}>
                    <Card key={item.id} className="p-4 bg-muted/50">
                        <CardContent className="p-0 space-y-4">
                           <FormInput control={editForm.control} name="title" label="Title" required />
                           <FormInput control={editForm.control} name="publisher" label="Publisher" required />
                           <FormDatePicker control={editForm.control} name="publicationDate" label="Publication Date" required />
                           <FormInput control={editForm.control} name="url" label="URL" required />
                        </CardContent>
                        <CardFooter className="p-0 pt-4 flex justify-end gap-2">
                            <Button type="button" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                            <Button type="submit">Save</Button>
                        </CardFooter>
                    </Card>
                </form>
            </Form>
        );
    }

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
                 <Button variant="ghost" size="icon" onClick={() => startEditing(item)}>
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
            <CardHeader>
                <CardTitle>Your Publications</CardTitle>
                <CardDescription>Listed below is your published work.</CardDescription>
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
        
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddNew)}>
                <Card className="glassmorphism">
                    <CardHeader>
                        <CardTitle>Add New Publication</CardTitle>
                        <CardDescription>Add a new publication to your profile.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormInput control={form.control} name="title" label="Title" placeholder="e.g., The Future of AI" required />
                        <FormInput control={form.control} name="publisher" label="Publisher" placeholder="e.g., Nature Journal" required />
                        <FormDatePicker control={form.control} name="publicationDate" label="Publication Date" required />
                        <FormInput control={form.control} name="url" label="URL" placeholder="https://example.com/publication" required />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit"><PlusCircle className="mr-2 h-4 w-4" /> Add Entry</Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    </div>
  );
}
