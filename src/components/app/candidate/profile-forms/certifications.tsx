
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
import type { Candidate, Certification } from '@/lib/types';
import { PlusCircle, Trash, Save, Edit, FileText, Upload } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const certificationSchema = z.object({
  name: z.string().min(1, 'Certificate name is required.'),
  issuingOrganization: z.string().min(1, 'Issuing organization is required.'),
  issueDate: z.string().min(1, 'Issue date is required.'),
  proofUrl: z.string().url().optional().or(z.literal('')),
});

type CertificationFormValues = z.infer<typeof certificationSchema>;

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

export function ProfileFormCertifications({ candidate }: ProfileFormProps) {
  const [history, setHistory] = React.useState(candidate.certifications);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [addFormFile, setAddFormFile] = React.useState<File | null>(null);
  const [editFormFile, setEditFormFile] = React.useState<File | null>(null);

  const form = useForm<CertificationFormValues>({
    resolver: zodResolver(certificationSchema),
    defaultValues: { name: '', issuingOrganization: '', issueDate: '', proofUrl: '' },
  });

  const editForm = useForm<CertificationFormValues>({
    resolver: zodResolver(certificationSchema),
  });
  
  const handleAddNew = (data: CertificationFormValues) => {
    // In a real app, you would upload file and get URL here.
    const newEntry = { ...data, proofUrl: addFormFile ? addFormFile.name : '' };
    setHistory([...history, newEntry]);
    form.reset({ name: '', issuingOrganization: '', issueDate: '', proofUrl: '' });
    setAddFormFile(null);
  };

  const handleUpdate = (index: number, data: CertificationFormValues) => {
    const updatedHistory = [...history];
    // In a real app, you would upload file and get URL here.
    const newEntry = { ...data, proofUrl: editFormFile ? editFormFile.name : data.proofUrl };
    updatedHistory[index] = newEntry;
    setHistory(updatedHistory);
    setEditingId(null);
    setEditFormFile(null);
  };
  
  const handleRemove = (index: number) => {
    setHistory(history.filter((_, i) => i !== index));
  };

  const startEditing = (index: number, item: Certification) => {
    setEditingId(index);
    editForm.reset(item);
    setEditFormFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFile: React.Dispatch<React.SetStateAction<File | null>>) => {
      if (e.target.files && e.target.files.length > 0) {
        setFile(e.target.files[0]);
      }
  };
  
  const handleRemoveFile = (setFile: React.Dispatch<React.SetStateAction<File | null>>) => {
      setFile(null);
  };

  const renderItem = (item: Certification, index: number) => {
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
                                <FormItem><Label>Certificate Name</Label><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}
                        />
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={editForm.control}
                                name="issuingOrganization"
                                render={({ field }) => (
                                    <FormItem><Label>Issuing Organization</Label><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )}
                            />
                            <FormField
                                control={editForm.control}
                                name="issueDate"
                                render={({ field }) => (
                                    <FormItem><Label>Issue Date</Label><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                                )}
                            />
                        </div>
                        <FormItem>
                            <Label>Proof (PDF)</Label>
                            <FormControl>
                                <div className="relative flex items-center justify-center w-full">
                                    <label htmlFor={`edit-file-upload-${index}`} className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-background hover:bg-muted">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                                            <p className="text-sm text-muted-foreground">
                                                <span className="font-semibold">Click to upload</span> or drag and drop
                                            </p>
                                        </div>
                                        <Input id={`edit-file-upload-${index}`} type="file" className="hidden" onChange={(e) => handleFileChange(e, setEditFormFile)} />
                                    </label>
                                </div>
                            </FormControl>
                             {editFormFile ? (
                                <div className="mt-2">
                                    <FilePreview file={editFormFile} onRemove={() => handleRemoveFile(setEditFormFile)} />
                                </div>
                            ) : item.proofUrl && (
                                 <div className="mt-2">
                                     <Badge variant="secondary" className="flex items-center gap-2">
                                        <FileText className="h-3 w-3" />
                                        <span className="truncate max-w-xs">{item.proofUrl.split('/').pop()}</span>
                                    </Badge>
                                 </div>
                            )}
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
        <Card key={index} className="p-4 flex justify-between items-start">
            <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.issuingOrganization} - {item.issueDate}</p>
                 {item.proofUrl && (
                    <Link href={item.proofUrl} target="_blank" className="text-xs text-primary hover:underline flex items-center gap-1 mt-1">
                        <FileText className="h-3 w-3" />
                        View Certificate
                    </Link>
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
                <CardTitle>Your Certifications</CardTitle>
                <CardDescription>Listed below are your professional certifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {history.map(renderItem)}
                {history.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">No certifications added yet.</p>
                )}
            </CardContent>
        </Card>
        
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddNew)}>
                <Card className="glassmorphism">
                    <CardHeader>
                        <CardTitle>Add New Certification</CardTitle>
                        <CardDescription>Add a new certification to your profile.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem><Label>Certificate Name</Label><FormControl><Input {...field} placeholder="e.g. Certified React Developer"/></FormControl><FormMessage /></FormItem>
                            )}
                        />
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="issuingOrganization"
                                render={({ field }) => (
                                    <FormItem><Label>Issuing Organization</Label><FormControl><Input {...field} placeholder="e.g. Vercel"/></FormControl><FormMessage /></FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="issueDate"
                                render={({ field }) => (
                                    <FormItem><Label>Issue Date</Label><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                                )}
                            />
                        </div>
                         <FormItem>
                            <Label>Proof (PDF)</Label>
                            <FormControl>
                                <div className="relative flex items-center justify-center w-full">
                                    <label htmlFor="add-file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-background hover:bg-muted">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                                            <p className="text-sm text-muted-foreground">
                                                <span className="font-semibold">Click to upload</span> or drag and drop
                                            </p>
                                        </div>
                                        <Input id="add-file-upload" type="file" className="hidden" onChange={(e) => handleFileChange(e, setAddFormFile)} />
                                    </label>
                                </div>
                            </FormControl>
                            {addFormFile && (
                                <div className="mt-2">
                                    <FilePreview file={addFormFile} onRemove={() => handleRemoveFile(setAddFormFile)} />
                                </div>
                            )}
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
