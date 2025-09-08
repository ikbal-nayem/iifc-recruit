
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
import { PlusCircle, Trash, Save, Edit, FileText } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
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

const FilePreview = ({ file, onRemove }: { file: File; onRemove: () => void }) => (
    <Badge variant="secondary" className="flex items-center gap-2">
      <FileText className="h-3 w-3" />
      <span className="truncate max-w-xs">{file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
      <Button variant="ghost" size="icon" className="h-4 w-4 text-muted-foreground hover:text-foreground" onClick={onRemove}>
        <Trash className="h-3 w-3" />
      </Button>
    </Badge>
);

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
                        <FormItem>
                            <Label>Certificates (Multi-file)</Label>
                            <FormControl>
                                <Input type="file" multiple onChange={(e) => handleFileChange(e, setEditFormFiles)} className="h-auto"/>
                            </FormControl>
                            <div className="flex flex-wrap gap-2 mt-2">
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
                         <FormItem>
                            <Label>Certificates (Multi-file)</Label>
                            <FormControl>
                                <Input type="file" multiple onChange={(e) => handleFileChange(e, setAddFormFiles)} className="h-auto"/>
                            </FormControl>
                            <div className="flex flex-wrap gap-2 mt-2">
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
