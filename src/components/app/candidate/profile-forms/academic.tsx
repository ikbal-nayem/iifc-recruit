
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
import type { Candidate, AcademicInfo } from '@/lib/types';
import { PlusCircle, Trash, Save, Edit, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

const academicInfoSchema = z.object({
  degree: z.string().min(1, 'Degree is required.'),
  institution: z.string().min(1, 'Institution is required.'),
  graduationYear: z.coerce.number().min(1950, 'Invalid year.').max(new Date().getFullYear() + 5),
});

type AcademicFormValues = z.infer<typeof academicInfoSchema>;

interface ProfileFormProps {
  candidate: Candidate;
}

export function ProfileFormAcademic({ candidate }: ProfileFormProps) {
  const [history, setHistory] = React.useState(candidate.academicInfo);
  const [editingId, setEditingId] = React.useState<number | null>(null);

  const form = useForm<AcademicFormValues>({
    resolver: zodResolver(academicInfoSchema),
  });

  const editForm = useForm<AcademicFormValues>({
    resolver: zodResolver(academicInfoSchema),
  });

  const handleAddNew = (data: AcademicFormValues) => {
    setHistory([...history, data]);
    form.reset({ degree: '', institution: '', graduationYear: undefined });
  };

  const handleUpdate = (index: number, data: AcademicFormValues) => {
    const updatedHistory = [...history];
    updatedHistory[index] = data;
    setHistory(updatedHistory);
    setEditingId(null);
  };
  
  const handleRemove = (index: number) => {
    setHistory(history.filter((_, i) => i !== index));
  }

  const startEditing = (index: number, item: AcademicInfo) => {
    setEditingId(index);
    editForm.reset(item);
  }

  const renderItem = (item: AcademicInfo, index: number) => {
    if (editingId === index) {
      return (
         <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit((data) => handleUpdate(index, data))}>
                <Card key={index} className="p-4 bg-muted/50">
                    <CardContent className="p-0 space-y-4">
                        <FormField
                        control={editForm.control}
                        name="degree"
                        render={({ field }) => (
                            <FormItem>
                            <Label>Degree</Label>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={editForm.control}
                        name="institution"
                        render={({ field }) => (
                            <FormItem>
                            <Label>Institution</Label>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={editForm.control}
                        name="graduationYear"
                        render={({ field }) => (
                            <FormItem>
                            <Label>Graduation Year</Label>
                            <FormControl><Input type="number" {...field} /></FormControl>
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
                <p className="font-semibold">{item.degree}</p>
                <p className="text-sm text-muted-foreground">{item.institution} - {item.graduationYear}</p>
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
    )
  }

  return (
    <div className="space-y-6">
        <Card className="glassmorphism">
            <CardHeader>
                <CardTitle>Your Academic History</CardTitle>
                <CardDescription>Listed below is your educational background.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {history.map(renderItem)}
                {history.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">No academic history added yet.</p>
                )}
            </CardContent>
        </Card>
        
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddNew)}>
                <Card className="glassmorphism">
                    <CardHeader>
                        <CardTitle>Add New Education</CardTitle>
                        <CardDescription>Add a new degree to your profile.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                        control={form.control}
                        name="degree"
                        render={({ field }) => (
                            <FormItem>
                            <Label>Degree</Label>
                            <FormControl><Input {...field} placeholder="e.g. B.S. in Computer Science"/></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="institution"
                        render={({ field }) => (
                            <FormItem>
                            <Label>Institution</Label>
                            <FormControl><Input {...field} placeholder="e.g. Stanford University"/></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="graduationYear"
                        render={({ field }) => (
                            <FormItem>
                            <Label>Graduation Year</Label>
                            <FormControl><Input type="number" {...field} placeholder="e.g. 2024"/></FormControl>
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
