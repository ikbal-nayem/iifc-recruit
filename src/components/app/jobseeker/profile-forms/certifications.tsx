

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
import type { Candidate, Certification } from '@/lib/types';
import { PlusCircle, Trash, Save, Edit, FileText, Upload, X, Link2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Link from 'next/link';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

const certificationSchema = z.object({
  name: z.string().min(1, 'Certificate name is required.'),
  issuingOrganization: z.string().min(1, 'Issuing organization is required.'),
  issueDate: z.string().min(1, 'Issue date is required.'),
  proofFile: z.any().optional(),
});

type CertificationFormValues = z.infer<typeof certificationSchema>;

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


export function ProfileFormCertifications({ candidate }: ProfileFormProps) {
  const { toast } = useToast();
  const [history, setHistory] = React.useState(candidate.certifications);
  const [editingId, setEditingId] = React.useState<number | null>(null);

  const form = useForm<CertificationFormValues>({
    resolver: zodResolver(certificationSchema),
    defaultValues: { name: '', issuingOrganization: '', issueDate: '', proofFile: null },
  });

  const editForm = useForm<CertificationFormValues>({
    resolver: zodResolver(certificationSchema),
  });
  
  const handleAddNew = (data: CertificationFormValues) => {
    // In a real app, you would upload file and get URL here.
    const newEntry = { ...data, proofUrl: data.proofFile ? data.proofFile.name : '' };
    delete (newEntry as any).proofFile;
    setHistory([...history, newEntry]);
    form.reset({ name: '', issuingOrganization: '', issueDate: '', proofFile: null });
  };

  const handleUpdate = (index: number, data: CertificationFormValues) => {
    const updatedHistory = [...history];
    const newEntry = { ...data, proofUrl: data.proofFile ? data.proofFile.name : history[index].proofUrl };
    delete (newEntry as any).proofFile;
    updatedHistory[index] = newEntry;
    setHistory(updatedHistory);
    setEditingId(null);
  };
  
  const handleRemove = (index: number) => {
    setHistory(history.filter((_, i) => i !== index));
    toast({
        title: 'Entry Deleted',
        description: 'The certification has been removed.',
        variant: 'success'
    })
  };

  const startEditing = (index: number, item: Certification) => {
    setEditingId(index);
    editForm.reset({...item, proofFile: null});
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
                                <FormItem><FormLabel required>Certificate Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}
                        />
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={editForm.control}
                                name="issuingOrganization"
                                render={({ field }) => (
                                    <FormItem><FormLabel required>Issuing Organization</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )}
                            />
                            <FormField
                                control={editForm.control}
                                name="issueDate"
                                render={({ field }) => (
                                    <FormItem><FormLabel required>Issue Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                                )}
                            />
                        </div>
                        <FormField
                          control={editForm.control}
                          name="proofFile"
                          render={({ field }) => (
                            <FormItem>
                                <FormLabel>Proof (PDF)</FormLabel>
                                <FormControl>
                                    <div className="relative flex items-center justify-center w-full">
                                        <label htmlFor={`edit-file-upload-${index}`} className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-background hover:bg-muted">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                                                <p className="text-sm text-muted-foreground">
                                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                                </p>
                                            </div>
                                            <Input id={`edit-file-upload-${index}`} type="file" className="hidden" onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)} />
                                        </label>
                                    </div>
                                </FormControl>
                                {field.value ? (
                                    <div className="mt-2">
                                        <FilePreview file={field.value} onRemove={() => field.onChange(null)} />
                                    </div>
                                ) : item.proofUrl && (
                                    <div className="mt-2">
                                        <FilePreview file={item.proofUrl} onRemove={() => editForm.setValue('proofUrl', '')} />
                                    </div>
                                )}
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
                                This action cannot be undone. This will permanently delete this certification.
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
                                <FormItem><FormLabel required>Certificate Name</FormLabel><FormControl><Input {...field} placeholder="e.g. Certified React Developer"/></FormControl><FormMessage /></FormItem>
                            )}
                        />
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="issuingOrganization"
                                render={({ field }) => (
                                    <FormItem><FormLabel required>Issuing Organization</FormLabel><FormControl><Input {...field} placeholder="e.g. Vercel"/></FormControl><FormMessage /></FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="issueDate"
                                render={({ field }) => (
                                    <FormItem><FormLabel required>Issue Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                                )}
                            />
                        </div>
                        <FormField
                          control={form.control}
                          name="proofFile"
                          render={({ field }) => (
                            <FormItem>
                                <FormLabel>Proof (PDF)</FormLabel>
                                <FormControl>
                                    <div className="relative flex items-center justify-center w-full">
                                        <label htmlFor="add-file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-background hover:bg-muted">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                                                <p className="text-sm text-muted-foreground">
                                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                                </p>
                                            </div>
                                            <Input id="add-file-upload" type="file" className="hidden" onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)} />
                                        </label>
                                    </div>
                                </FormControl>
                                {field.value && (
                                    <div className="mt-2">
                                        <FilePreview file={field.value} onRemove={() => field.onChange(null)} />
                                    </div>
                                )}
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
