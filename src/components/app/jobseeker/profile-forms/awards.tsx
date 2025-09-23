
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
import type { Candidate, Award } from '@/lib/types';
import { PlusCircle, Trash, Save, Edit, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { FormInput } from '@/components/ui/form-input';
import { FormDatePicker } from '@/components/ui/form-datepicker';

const awardSchema = z.object({
  name: z.string().min(1, 'Award name is required.'),
  awardingBody: z.string().min(1, 'Awarding body is required.'),
  dateReceived: z.string().min(1, 'Date is required.'),
});

type AwardFormValues = z.infer<typeof awardSchema>;

interface AwardFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: AwardFormValues) => Promise<boolean>;
    initialData?: Award;
    noun: string;
}

function AwardForm({ isOpen, onClose, onSubmit, initialData, noun }: AwardFormProps) {
    const form = useForm<AwardFormValues>({
        resolver: zodResolver(awardSchema),
        defaultValues: initialData || { name: '', awardingBody: '', dateReceived: '' },
    });
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    React.useEffect(() => {
        form.reset(initialData || { name: '', awardingBody: '', dateReceived: '' });
    }, [initialData, form]);

    const handleSubmit = async (data: AwardFormValues) => {
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
                    <DialogTitle>{initialData ? `Edit ${noun}` : `Add New ${noun}`}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
                        <FormInput control={form.control} name="name" label="Award Name" placeholder="e.g., Employee of the Month" required disabled={isSubmitting} />
                        <FormInput control={form.control} name="awardingBody" label="Awarding Body" placeholder="e.g., TechCorp" required disabled={isSubmitting} />
                        <FormDatePicker control={form.control} name="dateReceived" label="Date Received" required disabled={isSubmitting} />
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {initialData ? 'Save Changes' : 'Add Award'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

interface ProfileFormProps {
  candidate: Candidate;
}

export function ProfileFormAwards({ candidate }: ProfileFormProps) {
  const { toast } = useToast();
  const [history, setHistory] = React.useState(candidate.awards);
  const [editingItem, setEditingItem] = React.useState<Award | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = React.useState(false);

  const handleOpenForm = (item?: Award) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingItem(undefined);
  };
  
  const handleFormSubmit = async (data: AwardFormValues) => {
    // In a real app, this would be an API call.
    if (editingItem) {
        setHistory(history.map(item => item.name === editingItem.name && item.awardingBody === editingItem.awardingBody ? { ...item, ...data } : item));
        toast({ title: 'Success', description: 'Award updated successfully.', variant: 'success' });
    } else {
        setHistory([...history, data]);
        toast({ title: 'Success', description: 'Award added successfully.', variant: 'success' });
    }
    return true; // Simulate successful submission
  };
  
  const handleRemove = (itemToRemove: Award) => {
    setHistory(history.filter(item => item !== itemToRemove));
    toast({
        title: 'Entry Deleted',
        description: 'The award has been removed.',
        variant: 'success'
    })
  };

  const renderItem = (item: Award, index: number) => {
    return (
        <Card key={index} className="p-4 flex justify-between items-center">
            <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.awardingBody} - {format(new Date(item.dateReceived), "PPP")}</p>
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
                            This action cannot be undone. This will permanently delete this award.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleRemove(item)} className="bg-danger hover:bg-danger/90">Delete</AlertDialogAction>
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
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Your Awards & Recognitions</CardTitle>
                        <CardDescription>Listed below are your awards and recognitions.</CardDescription>
                    </div>
                     <Button onClick={() => handleOpenForm()}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add New
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {history.map(renderItem)}
                {history.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No awards added yet.</p>
                )}
            </CardContent>
        </Card>
        
        {isFormOpen && (
            <AwardForm
                isOpen={isFormOpen}
                onClose={handleCloseForm}
                onSubmit={handleFormSubmit}
                initialData={editingItem}
                noun="Award"
            />
        )}
    </div>
  );
}
