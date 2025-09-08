
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';

const academicInfoSchema = z.object({
  degree: z.string().min(1, 'Degree is required.'),
  institution: z.string().min(1, 'Institution is required.'),
  graduationYear: z.coerce.number().min(1950, 'Invalid year.').max(new Date().getFullYear() + 5),
  certificateUrls: z.array(z.string()).optional(),
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
  const [history, setHistory] = React.useState(candidate.academicInfo);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [addFormFiles, setAddFormFiles] = React.useState<File[]>([]);
  const [editFormFiles, setEditFormFiles] = React.useState<File[]>([]);

  const form = useForm<AcademicFormValues>({
    resolver: zodResolver(academicInfoSchema),
    defaultValues: { degree: '', institution: '', graduationYear: undefined, certificateUrls: [] },
  });

  const editForm = useForm<AcademicFormValues>({
    resolver: zodResolver(academicInfoSchema),
  });
  
  const handleAddNew = (data: AcademicFormValues) => {
    // In a real app, you would upload files and get URLs here.
    const newEntry = { ...data, certificateUrls: addFormFiles.map(f => f.name) };
    setHistory([...history, newEntry]);
    form.reset({ degree: '', institution: '', graduationYear: undefined, certificateUrls: [] });
    setAddFormFiles([]);
  };

  const handleUpdate = (index: number, data: AcademicFormValues) => {
    const updatedHistory = [...history];
    // In a real app, you would upload files and get URLs here.
    const newEntry = { ...data, certificateUrls: editFormFiles.map(f => f.name) };
    updatedHistory[index] = newEntry;
    setHistory(updatedHistory);
    setEditingId(null);
    setEditFormFiles([]);
  };
  
  const handleRemove = (index: number) => {
    setHistory(history.filter((_, i) => i !== index));
  };

  const startEditing = (index: number, item: AcademicInfo) => {
    setEditingId(index);
    editForm.reset(item);
    // In a real app, you'd fetch existing files. Here we'll reset.
    setEditFormFiles([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFiles: React.Dispatch<React.SetStateAction<File[]>>) => {
      if (e.target.files) {
        setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
      }
  };
  
  const handleRemoveFile = (index: number, setFiles: React.Dispatch<React.SetStateAction<File[]>>) => {
      setFiles(prev => prev.filter((_, i) => i !== index));
  };

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
                            <FormLabel required>Degree</FormLabel>
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
                            <FormLabel required>Institution</FormLabel>
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
                            <FormLabel required>Graduation Year</FormLabel>
                            <FormControl><Input type="number" {...field} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
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
                                        <Input id={`edit-file-upload-${index}`} type="file" multiple className="hidden" onChange={(e) => handleFileChange(e, setEditFormFiles)} />
                                    </label>
                                </div>
                            </FormControl>
                             <div className="space-y-2 mt-2">
                                {item.certificateUrls?.map((url, i) => (
                                    <FilePreview key={i} file={url} onRemove={() => {
                                        const updatedCerts = [...item.certificateUrls || []];
                                        updatedCerts.splice(i, 1);
                                        editForm.setValue('certificateUrls', updatedCerts);
                                    }} />
                                ))}
                                {editFormFiles.map((file, i) => (
                                    <FilePreview key={i} file={file} onRemove={() => handleRemoveFile(i, setEditFormFiles)} />
                                ))}
                            </div>
                            <FormMessage />
                        </FormItem>
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
                            <FormLabel required>Degree</FormLabel>
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
                            <FormLabel required>Institution</FormLabel>
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
                            <FormLabel required>Graduation Year</FormLabel>
                            <FormControl><Input type="number" {...field} placeholder="e.g. 2024"/></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
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
                                        <Input id="add-file-upload" type="file" multiple className="hidden" onChange={(e) => handleFileChange(e, setAddFormFiles)} />
                                    </label>
                                </div>
                            </FormControl>
                            <div className="space-y-2 mt-2">
                                {addFormFiles.map((file, i) => (
                                    <FilePreview key={i} file={file} onRemove={() => handleRemoveFile(i, setAddFormFiles)} />
                                ))}
                            </div>
                            <FormMessage />
                        </FormItem>
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
