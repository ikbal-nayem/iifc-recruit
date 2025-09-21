
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
import type { Candidate, AcademicInfo } from '@/lib/types';
import { PlusCircle, Trash, Save, Edit, FileText, Upload, X } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { FormInput } from '@/components/ui/form-input';

const academicInfoSchema = z.object({
  degree: z.string().min(1, 'Degree is required.'),
  institution: z.string().min(1, 'Institution is required.'),
  graduationYear: z.coerce.number().min(1950, 'Invalid year.').max(new Date().getFullYear() + 5),
  certificateFiles: z.any().optional(),
});

type AcademicFormValues = z.infer<typeof academicInfoSchema>;

interface ProfileFormProps {
  candidate: Candidate;
}

const FilePreview = ({ file, onRemove }: { file: File | string; onRemove: () => void }) => {
    const isFile = file instanceof File;
    const name = isFile ? file.name : file;
    const size = isFile ? `(${(file.size / 1024).toFixed(1)} KB)` : '';

    return (
        <div className="p-2 border rounded-lg flex items-center justify-between bg-muted/50">
            <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <div className="text-sm">
                    <p className="font-medium truncate max-w-xs">{name}</p>
                    {size && <p className="text-xs text-muted-foreground">{size}</p>}
                </div>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onRemove}>
                <X className="h-4 w-4" />
            </Button>
        </div>
    )
};


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
                        <FormField
                            control={editForm.control}
                            name="certificateFiles"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Certificates (Multi-file)</FormLabel>
                                    <FormControl>
                                        <div className="relative flex items-center justify-center w-full">
                                            <label htmlFor={`edit-file-upload-${index}`} className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-background hover:bg-muted">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                                                    <p className="text-sm text-muted-foreground">
                                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                                    </p>
                                                </div>
                                                <Input id={`edit-file-upload-${index}`} type="file" multiple className="hidden" onChange={(e) => field.onChange(Array.from(e.target.files || []))} />
                                            </label>
                                        </div>
                                    </FormControl>
                                    <div className="space-y-2 mt-2">
                                        {field.value?.map((file: File, i: number) => (
                                            <FilePreview key={i} file={file} onRemove={() => {
                                                const newFiles = [...field.value];
                                                newFiles.splice(i, 1);
                                                field.onChange(newFiles);
                                            }} />
                                        ))}
                                    </div>
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
                            This action cannot be undone. This will permanently delete this academic record.
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
                        <FormField
                            control={form.control}
                            name="certificateFiles"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Certificates (Multi-file)</FormLabel>
                                    <FormControl>
                                        <div className="relative flex items-center justify-center w-full">
                                            <label htmlFor="add-file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-background hover:bg-muted">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                                                    <p className="text-sm text-muted-foreground">
                                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                                    </p>
                                                </div>
                                                <Input id="add-file-upload" type="file" multiple className="hidden" onChange={(e) => field.onChange(Array.from(e.target.files || []))} />
                                            </label>
                                        </div>
                                    </FormControl>
                                    <div className="space-y-2 mt-2">
                                        {field.value?.map((file: File, i: number) => (
                                            <FilePreview key={i} file={file} onRemove={() => {
                                                const newFiles = [...field.value];
                                                newFiles.splice(i, 1);
                                                field.onChange(newFiles);
                                            }} />
                                        ))}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
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
