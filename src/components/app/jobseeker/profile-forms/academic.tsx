
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
import type { Candidate, AcademicInfo } from '@/lib/types';
import { PlusCircle, Trash, Edit, FileText } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { FormInput } from '@/components/ui/form-input';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { FormFileUpload } from '@/components/ui/form-file-upload';

const academicInfoSchema = z.object({
  degree: z.string().min(1, 'Degree is required.'),
  institution: z.string().min(1, 'Institution is required.'),
  graduationYear: z.coerce.number().min(1950, 'Invalid year.').max(new Date().getFullYear() + 5),
  certificateFiles: z.array(z.any()).optional(),
});

type AcademicFormValues = z.infer<typeof academicInfoSchema>;

interface ProfileFormProps {
  candidate: Candidate;
}


export function ProfileFormAcademic({ candidate }: ProfileFormProps) {
  const { toast } = useToast();
  const [history, setHistory] = React.useState(candidate.academicInfo);
  const [editingId, setEditingId] = React.useState<number | null>(null);

  const form = useForm<AcademicFormValues>({
    resolver: zodResolver(academicInfoSchema),
    defaultValues: { degree: '', institution: '', graduationYear: undefined, certificateFiles: [] },
  });

  const editForm = useForm<AcademicFormValues>({
    resolver: zodResolver(academicInfoSchema),
  });
  
  const handleAddNew = (data: AcademicFormValues) => {
    // In a real app, you would upload files and get URLs here.
    const newEntry = { ...data, certificateUrls: data.certificateFiles?.map((f: File) => f.name) || [] };
    delete (newEntry as any).certificateFiles;
    setHistory([...history, newEntry]);
    form.reset({ degree: '', institution: '', graduationYear: undefined, certificateFiles: [] });
  };

  const handleUpdate = (index: number, data: AcademicFormValues) => {
    const updatedHistory = [...history];
    const newEntry = { ...data, certificateUrls: data.certificateFiles?.map((f: File) => f.name) || [] };
    delete (newEntry as any).certificateFiles;
    updatedHistory[index] = newEntry;
    setHistory(updatedHistory);
    setEditingId(null);
  };
  
  const handleRemove = (index: number) => {
    setHistory(history.filter((_, i) => i !== index));
    toast({
        title: 'Entry Deleted',
        description: 'The academic record has been removed.',
        variant: 'success'
    })
  };

  const startEditing = (index: number, item: AcademicInfo) => {
    setEditingId(index);
    editForm.reset({...item, certificateFiles: []});
  };

  const renderItem = (item: AcademicInfo, index: number) => {
    if (editingId === index) {
      return (
         <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit((data) => handleUpdate(index, data))}>
                <Card key={index} className="p-4 bg-muted/50">
                    <CardContent className="p-0 space-y-4">
                        <FormInput
                            control={editForm.control}
                            name="degree"
                            label="Degree"
                            required
                        />
                        <FormInput
                            control={editForm.control}
                            name="institution"
                            label="Institution"
                            required
                        />
                        <FormInput
                            control={editForm.control}
                            name="graduationYear"
                            label="Graduation Year"
                            type="number"
                            required
                        />
                        <FormFileUpload
                            control={editForm.control}
                            name="certificateFiles"
                            label="Certificates"
                            accept=".pdf"
                            multiple
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
                {item.certificateUrls && item.certificateUrls.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                        {item.certificateUrls.map((url, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                                <FileText className="h-3 w-3 mr-1" />
                                {url.split('/').pop()}
                            </Badge>
                        ))}
                    </div>
                )}
            </div>
            <div className="flex gap-2">
                 <Button variant="ghost" size="icon" onClick={() => startEditing(index, item)}>
                    <Edit className="h-4 w-4" />
                </Button>
                <ConfirmationDialog
                    trigger={
                        <Button variant="ghost" size="icon">
                            <Trash className="h-4 w-4 text-danger" />
                        </Button>
                    }
                    description='This action cannot be undone. This will permanently delete this academic record.'
                    onConfirm={() => handleRemove(index)}
                    confirmText='Delete'
                />
            </div>
        </Card>
    );
  };

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
                        <FormInput
                            control={form.control}
                            name="degree"
                            label="Degree"
                            placeholder="e.g. B.S. in Computer Science"
                            required
                        />
                        <FormInput
                            control={form.control}
                            name="institution"
                            label="Institution"
                            placeholder="e.g. Stanford University"
                            required
                        />
                        <FormInput
                            control={form.control}
                            name="graduationYear"
                            label="Graduation Year"
                            placeholder="e.g. 2024"
                            type="number"
                            required
                        />
                        <FormFileUpload
                            control={form.control}
                            name="certificateFiles"
                            label="Certificates"
                            accept=".pdf"
                            multiple
                        />
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
