
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
import { Textarea } from '@/components/ui/textarea';
import type { Candidate, ProfessionalInfo } from '@/lib/types';
import { PlusCircle, Trash, Save, Edit } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

const professionalInfoSchema = z.object({
  role: z.string().min(1, 'Role is required.'),
  company: z.string().min(1, 'Company is required.'),
  duration: z.string().min(1, 'Duration is required.'),
  responsibilities: z.array(z.string()).min(1, "At least one responsibility is required."),
});

type ProfessionalFormValues = z.infer<typeof professionalInfoSchema>;

interface ProfileFormProps {
  candidate: Candidate;
}

export function ProfileFormProfessional({ candidate }: ProfileFormProps) {
  const [history, setHistory] = React.useState(candidate.professionalInfo);
  const [editingId, setEditingId] = React.useState<number | null>(null);

  const form = useForm<ProfessionalFormValues>({
    resolver: zodResolver(professionalInfoSchema),
    defaultValues: { responsibilities: [] }
  });

  const editForm = useForm<ProfessionalFormValues>({
    resolver: zodResolver(professionalInfoSchoema),
  });

  const handleAddNew = (data: ProfessionalFormValues) => {
    setHistory([...history, data]);
    form.reset({ role: '', company: '', duration: '', responsibilities: [] });
  };
  
  const handleUpdate = (index: number, data: ProfessionalFormValues) => {
    const updatedHistory = [...history];
    updatedHistory[index] = data;
    setHistory(updatedHistory);
    setEditingId(null);
  };
  
  const handleRemove = (index: number) => {
    setHistory(history.filter((_, i) => i !== index));
  }

  const startEditing = (index: number, item: ProfessionalInfo) => {
    setEditingId(index);
    editForm.reset(item);
  }
  
  const renderItem = (item: ProfessionalInfo, index: number) => {
      if (editingId === index) {
        return (
            <form onSubmit={editForm.handleSubmit((data) => handleUpdate(index, data))}>
                <Card key={index} className="p-4 bg-muted/50">
                    <CardContent className="p-0 space-y-4">
                        <FormField control={editForm.control} name="role" render={({ field }) => (
                            <FormItem><Label>Role</Label><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                         <FormField control={editForm.control} name="company" render={({ field }) => (
                            <FormItem><Label>Company</Label><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                         <FormField control={editForm.control} name="duration" render={({ field }) => (
                            <FormItem><Label>Duration</Label><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                         <FormField control={editForm.control} name="responsibilities" render={({ field }) => (
                            <FormItem><Label>Responsibilities</Label><FormControl><Textarea {...field} onChange={(e) => field.onChange(e.target.value.split('\n'))} value={Array.isArray(field.value) ? field.value.join('\n') : ''} /></FormControl><FormMessage /></FormItem>
                        )}/>
                    </CardContent>
                    <CardFooter className="p-0 pt-4 flex justify-end gap-2">
                        <Button type="button" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                        <Button type="submit">Save</Button>
                    </CardFooter>
                </Card>
            </form>
        );
      }

      return (
        <Card key={index} className="p-4 flex justify-between items-start">
            <div>
                <p className="font-semibold">{item.role} at {item.company}</p>
                <p className="text-sm text-muted-foreground">{item.duration}</p>
                 <ul className="list-disc list-inside mt-2 text-sm text-muted-foreground space-y-1">
                    {item.responsibilities.slice(0, 2).map((resp, i) => <li key={i}>{resp}</li>)}
                    {item.responsibilities.length > 2 && <li className="text-xs">...and more</li>}
                </ul>
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
  }

  return (
     <div className="space-y-6">
        <Card className="glassmorphism">
            <CardHeader>
                <CardTitle>Your Professional Experience</CardTitle>
                <CardDescription>Listed below is your work history.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {history.map(renderItem)}
                 {history.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">No professional experience added yet.</p>
                )}
            </CardContent>
        </Card>
        
        <form onSubmit={form.handleSubmit(handleAddNew)}>
            <Card className="glassmorphism">
                <CardHeader>
                    <CardTitle>Add New Experience</CardTitle>
                    <CardDescription>Add a new role to your profile.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <FormField control={form.control} name="role" render={({ field }) => (
                        <FormItem><Label>Role</Label><FormControl><Input {...field} placeholder="e.g., Software Engineer" /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="company" render={({ field }) => (
                        <FormItem><Label>Company</Label><FormControl><Input {...field} placeholder="e.g., Google" /></FormControl><FormMessage /></FormItem>
                    )}/>
                     <FormField control={form.control} name="duration" render={({ field }) => (
                        <FormItem><Label>Duration</Label><FormControl><Input {...field} placeholder="e.g., Jan 2020 - Present" /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="responsibilities" render={({ field }) => (
                        <FormItem>
                            <Label>Responsibilities</Label>
                            <FormControl>
                                <Textarea 
                                    placeholder="Enter responsibilities, one per line."
                                    onChange={(e) => field.onChange(e.target.value.split('\n'))}
                                    value={Array.isArray(field.value) ? field.value.join('\n') : ''}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                </CardContent>
                <CardFooter>
                    <Button type="submit"><PlusCircle className="mr-2 h-4 w-4" /> Add to History</Button>
                </CardFooter>
            </Card>
        </form>
    </div>
  );
}

const professionalSchoema = z.object({
  role: z.string().min(1, 'Role is required.'),
  company: z.string().min(1, 'Company is required.'),
  duration: z.string().min(1, 'Duration is required.'),
  responsibilities: z.array(z.string()).min(1, "At least one responsibility is required."),
});

