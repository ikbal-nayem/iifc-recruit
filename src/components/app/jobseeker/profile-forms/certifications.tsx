
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
import type { Candidate, Certification } from '@/lib/types';
import { PlusCircle, Trash, Edit, FileText } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form } from '@/components/ui/form';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { FormInput } from '@/components/ui/form-input';
import { FormDatePicker } from '@/components/ui/form-datepicker';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { FormFileUpload } from '@/components/ui/form-file-upload';

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
                        <FormInput
                            control={editForm.control}
                            name="name"
                            label="Certificate Name"
                            required
                        />
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className='md:col-span-2'>
                                <FormInput
                                    control={editForm.control}
                                    name="issuingOrganization"
                                    label="Issuing Organization"
                                    required
                                />
                            </div>
                            <FormDatePicker
                                control={editForm.control}
                                name="issueDate"
                                label="Issue Date"
                                required
                            />
                        </div>
                        <FormFileUpload
                            control={editForm.control}
                            name="proofFile"
                            label="Proof"
                            accept=".pdf"
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
                <ConfirmationDialog
                    trigger={
                        <Button variant="ghost" size="icon">
                            <Trash className="h-4 w-4 text-danger" />
                        </Button>
                    }
                    description='This action cannot be undone. This will permanently delete this certification.'
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
                        <FormInput
                            control={form.control}
                            name="name"
                            label="Certificate Name"
                            placeholder="e.g. Certified React Developer"
                            required
                        />
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                                <FormInput
                                    control={form.control}
                                    name="issuingOrganization"
                                    label="Issuing Organization"
                                    placeholder="e.g. Vercel"
                                    required
                                />
                            </div>
                            <FormDatePicker
                                control={form.control}
                                name="issueDate"
                                label="Issue Date"
                                required
                            />
                        </div>
                        <FormFileUpload
                            control={form.control}
                            name="proofFile"
                            label="Proof"
                            accept=".pdf"
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
