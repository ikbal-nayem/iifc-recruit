
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
import { Input } from '@/components/ui/input';
import type { Candidate, Award } from '@/lib/types';
import { PlusCircle, Trash, Save, Edit } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

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
                        <FormField
                            control={editForm.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem><FormLabel required>Award Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}
                        />
                        <FormField
                            control={editForm.control}
                            name="awardingBody"
                            render={({ field }) => (
                                <FormItem><FormLabel required>Awarding Body</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}
                        />
                        <FormField
                            control={editForm.control}
                            name="dateReceived"
                            render={({ field }) => (
                                <FormItem><FormLabel required>Date Received</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
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
                <p className="text-sm text-muted-foreground">{item.awardingBody} - {item.dateReceived}</p>
            </div>
            <div className="flex gap-2">
                 <Button variant="ghost" size="icon" onClick={() => startEditing(index, item)}>
                    <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleRemove(index)}>
                    <Trash className="h-4 w-4 text-destructive" />
                </Button>
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
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem><FormLabel required>Award Name</FormLabel><FormControl><Input {...field} placeholder="e.g. Employee of the Month" /></FormControl><FormMessage /></FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="awardingBody"
                            render={({ field }) => (
                                <FormItem><FormLabel required>Awarding Body</FormLabel><FormControl><Input {...field} placeholder="e.g. TechCorp" /></FormControl><FormMessage /></FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="dateReceived"
                            render={({ field }) => (
                                <FormItem><FormLabel required>Date Received</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
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
