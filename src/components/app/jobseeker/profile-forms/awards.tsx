
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
import type { Candidate, Award } from '@/lib/types';
import { PlusCircle, Trash, Save, Edit, CalendarIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { FormInput } from '@/components/ui/form-input';

const awardSchema = z.object({
  name: z.string().min(1, 'Award name is required.'),
  awardingBody: z.string().min(1, 'Awarding body is required.'),
  dateReceived: z.string().min(1, 'Date is required.'),
});

type AwardFormValues = z.infer<typeof awardSchema>;

interface ProfileFormProps {
  candidate: Candidate;
}

export function ProfileFormAwards({ candidate }: ProfileFormProps) {
  const { toast } = useToast();
  const [history, setHistory] = React.useState(candidate.awards);
  const [editingId, setEditingId] = React.useState<number | null>(null);

  const form = useForm<AwardFormValues>({
    resolver: zodResolver(awardSchema),
    defaultValues: { name: '', awardingBody: '', dateReceived: '' },
  });

  const editForm = useForm<AwardFormValues>({
    resolver: zodResolver(awardSchema),
  });
  
  const handleAddNew = (data: AwardFormValues) => {
    setHistory([...history, data]);
    form.reset({ name: '', awardingBody: '', dateReceived: '' });
  };

  const handleUpdate = (index: number, data: AwardFormValues) => {
    const updatedHistory = [...history];
    updatedHistory[index] = data;
    setHistory(updatedHistory);
    setEditingId(null);
  };
  
  const handleRemove = (index: number) => {
    setHistory(history.filter((_, i) => i !== index));
    toast({
        title: 'Entry Deleted',
        description: 'The award has been removed.',
        variant: 'success'
    })
  };

  const startEditing = (index: number, item: Award) => {
    setEditingId(index);
    editForm.reset(item);
  };

  const renderItem = (item: Award, index: number) => {
    if (editingId === index) {
      return (
         <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit((data) => handleUpdate(index, data))}>
                <Card key={index} className="p-4 bg-muted/50">
                    <CardContent className="p-0 space-y-4">
                        <FormInput
                            control={editForm.control}
                            name="name"
                            label="Award Name"
                            required
                        />
                        <FormInput
                            control={editForm.control}
                            name="awardingBody"
                            label="Awarding Body"
                            required
                        />
                        <FormField
                            control={editForm.control}
                            name="dateReceived"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel required>Date Received</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(new Date(field.value), "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value ? new Date(field.value) : undefined}
                                                onSelect={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
        <Card key={index} className="p-4 flex justify-between items-center">
            <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.awardingBody} - {format(new Date(item.dateReceived), "PPP")}</p>
            </div>
            <div className="flex gap-2">
                 <Button variant="ghost" size="icon" onClick={() => startEditing(index, item)}>
                    <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Trash className="h-4 w-4 text-destructive" />
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
                        <AlertDialogAction onClick={() => handleRemove(index)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
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
                <CardTitle>Your Awards & Recognitions</CardTitle>
                <CardDescription>Listed below are your awards and recognitions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {history.map(renderItem)}
                {history.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">No awards added yet.</p>
                )}
            </CardContent>
        </Card>
        
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddNew)}>
                <Card className="glassmorphism">
                    <CardHeader>
                        <CardTitle>Add New Award</CardTitle>
                        <CardDescription>Add a new award to your profile.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormInput
                            control={form.control}
                            name="name"
                            label="Award Name"
                            placeholder="e.g. Employee of the Month"
                            required
                        />
                        <FormInput
                            control={form.control}
                            name="awardingBody"
                            label="Awarding Body"
                            placeholder="e.g. TechCorp"
                            required
                        />
                        <FormField
                            control={form.control}
                            name="dateReceived"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel required>Date Received</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(new Date(field.value), "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value ? new Date(field.value) : undefined}
                                                onSelect={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit"><PlusCircle className="mr-2 h-4 w-4" /> Add to History</Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    </div>
  );
}
