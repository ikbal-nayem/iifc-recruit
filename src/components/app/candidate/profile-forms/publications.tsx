
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
import { Label } from '@/components/ui/label';
import type { Candidate, Publication } from '@/lib/types';
import { PlusCircle, Trash, Save, Edit, Link2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

const publicationSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  publisher: z.string().min(1, 'Publisher is required.'),
  publicationDate: z.string().min(1, 'Publication date is required.'),
  url: z.string().url('Please enter a valid URL.'),
});

type PublicationFormValues = z.infer<typeof publicationSchema>;

interface ProfileFormProps {
  candidate: Candidate;
}

export function ProfileFormPublications({ candidate }: ProfileFormProps) {
  const [history, setHistory] = React.useState(candidate.publications);
  const [editingId, setEditingId] = React.useState<number | null>(null);

  const form = useForm<PublicationFormValues>({
    resolver: zodResolver(publicationSchema),
    defaultValues: { title: '', publisher: '', publicationDate: '', url: '' },
  });

  const editForm = useForm<PublicationFormValues>({
    resolver: zodResolver(publicationSchema),
  });
  
  const handleAddNew = (data: PublicationFormValues) => {
    setHistory([...history, data]);
    form.reset({ title: '', publisher: '', publicationDate: '', url: '' });
  };

  const handleUpdate = (index: number, data: PublicationFormValues) => {
    const updatedHistory = [...history];
    updatedHistory[index] = data;
    setHistory(updatedHistory);
    setEditingId(null);
  };
  
  const handleRemove = (index: number) => {
    setHistory(history.filter((_, i) => i !== index));
  };

  const startEditing = (index: number, item: Publication) => {
    setEditingId(index);
    editForm.reset(item);
  };

  const renderItem = (item: Publication, index: number) => {
    if (editingId === index) {
      return (
         <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit((data) => handleUpdate(index, data))}>
                <Card key={index} className="p-4 bg-muted/50">
                    <CardContent className="p-0 space-y-4">
                        <FormField
                            control={editForm.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem><Label>Title</Label><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}
                        />
                        <FormField
                            control={editForm.control}
                            name="publisher"
                            render={({ field }) => (
                                <FormItem><Label>Publisher</Label><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}
                        />
                        <FormField
                            control={editForm.control}
                            name="publicationDate"
                            render={({ field }) => (
                                <FormItem><Label>Publication Date</Label><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                            )}
                        />
                         <FormField
                            control={editForm.control}
                            name="url"
                            render={({ field }) => (
                                <FormItem><Label>URL</Label><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
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
        <Card key={index} className="p-4 flex justify-between items-start">
            <div>
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.publisher} - {item.publicationDate}</p>
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1 mt-1">
                    <Link2 className="h-3 w-3" />
                    View Publication
                </a>
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
                <CardTitle>Your Publications</CardTitle>
                <CardDescription>Listed below is your published work.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {history.map(renderItem)}
                {history.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">No publications added yet.</p>
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
                         <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem><Label>Title</Label><FormControl><Input {...field} placeholder="e.g., The Future of AI" /></FormControl><FormMessage /></FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="publisher"
                            render={({ field }) => (
                                <FormItem><Label>Publisher</Label><FormControl><Input {...field} placeholder="e.g., Nature Journal" /></FormControl><FormMessage /></FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="publicationDate"
                            render={({ field }) => (
                                <FormItem><Label>Publication Date</Label><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="url"
                            render={({ field }) => (
                                <FormItem><Label>URL</Label><FormControl><Input {...field} placeholder="https://example.com/publication" /></FormControl><FormMessage /></FormItem>
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
