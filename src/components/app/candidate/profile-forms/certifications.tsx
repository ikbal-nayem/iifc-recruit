
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
import { PlusCircle, Trash, Save, Edit, FileText } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';

const certificationSchema = z.object({
  name: z.string().min(1, 'Certificate name is required.'),
  issuingOrganization: z.string().min(1, 'Issuing organization is required.'),
  issueDate: z.string().min(1, 'Issue date is required.'),
  proofUrl: z.string().optional(),
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

  const form = useForm<CertificationFormValues>({
    resolver: zodResolver(certificationSchema),
    defaultValues: { name: '', issuingOrganization: '', issueDate: '' },
  });

  const editForm = useForm<CertificationFormValues>({
    resolver: zodResolver(certificationSchema),
  });
  
  const handleAddNew = (data: CertificationFormValues) => {
    setHistory([...history, data]);
    form.reset({ name: '', issuingOrganization: '', issueDate: '' });
  };

  const handleUpdate = (index: number, data: CertificationFormValues) => {
    const updatedHistory = [...history];
    updatedHistory[index] = data;
    setHistory(updatedHistory);
    setEditingId(null);
  };
  
  const handleRemove = (index: number) => {
    setHistory(history.filter((_, i) => i !== index));
  };

  const startEditing = (index: number, item: Certification) => {
    setEditingId(index);
    editForm.reset(item);
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
                            <FormItem>
                            <Label>Certificate Name</Label>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={editForm.control}
                        name="issuingOrganization"
                        render={({ field }) => (
                            <FormItem>
                            <Label>Issuing Organization</Label>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={editForm.control}
                        name="issueDate"
                        render={({ field }) => (
                            <FormItem>
                            <Label>Issue Date</Label>
                            <FormControl><Input type="date" {...field} /></FormControl>
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
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.issuingOrganization} - {item.issueDate}</p>
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
                            <FormItem>
                            <Label>Certificate Name</Label>
                            <FormControl><Input {...field} placeholder="e.g. Certified React Developer"/></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="issuingOrganization"
                        render={({ field }) => (
                            <FormItem>
                            <Label>Issuing Organization</Label>
                            <FormControl><Input {...field} placeholder="e.g. Vercel"/></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="issueDate"
                        render={({ field }) => (
                            <FormItem>
                            <Label>Issue Date</Label>
                            <FormControl><Input type="date" {...field} /></FormControl>
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
