
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
import { Textarea } from '@/components/ui/textarea';
import type { Candidate, ProfessionalInfo } from '@/lib/types';
import { PlusCircle, Trash, Edit, FileText } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { FormInput } from '@/components/ui/form-input';
import { FormDatePicker } from '@/components/ui/form-datepicker';
import { FormSwitch } from '@/components/ui/form-switch';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { FormFileUpload } from '@/components/ui/form-file-upload';

const professionalInfoSchema = z.object({
  role: z.string().min(1, 'Role is required.'),
  company: z.string().min(1, 'Company is required.'),
  fromDate: z.string().min(1, 'Start date is required.'),
  toDate: z.string().optional(),
  isPresent: z.boolean(),
  responsibilities: z.string().min(1, 'Please list at least one responsibility.'),
  documentFiles: z.array(z.any()).optional(),
}).refine(data => !data.isPresent ? !!data.toDate : true, {
    message: "End date is required unless you are currently working here.",
    path: ["toDate"],
});


type ProfessionalFormValues = z.infer<typeof professionalInfoSchema>;

interface ProfileFormProps {
  candidate: Candidate;
}

export function ProfileFormProfessional({ candidate }: ProfileFormProps) {
  const { toast } = useToast();
  const [history, setHistory] = React.useState(candidate.professionalInfo);
  const [editingId, setEditingId] = React.useState<number | null>(null);

  const form = useForm<ProfessionalFormValues>({
    resolver: zodResolver(professionalInfoSchema),
    defaultValues: { role: '', company: '', fromDate: '', toDate: '', isPresent: false, responsibilities: '', documentFiles: [] },
  });

  const editForm = useForm<ProfessionalFormValues>({
    resolver: zodResolver(professionalInfoSchema),
  });
  
  const handleAddNew = (data: ProfessionalFormValues) => {
    const newEntry: ProfessionalInfo = { 
        ...data,
        toDate: data.isPresent ? undefined : data.toDate,
        responsibilities: data.responsibilities.split('\n'),
        documentUrls: data.documentFiles?.map((f: File) => f.name) || []
    };
    delete (newEntry as any).documentFiles;
    setHistory([...history, newEntry]);
    form.reset({ role: '', company: '', fromDate: '', toDate: '', isPresent: false, responsibilities: '', documentFiles: [] });
  };

  const handleUpdate = (index: number, data: ProfessionalFormValues) => {
    const updatedHistory = [...history];
    const newEntry: ProfessionalInfo = { 
        ...data,
        toDate: data.isPresent ? undefined : data.toDate,
        responsibilities: data.responsibilities.split('\n'),
        documentUrls: data.documentFiles?.map((f: File) => f.name) || history[index].documentUrls || []
    };
    delete (newEntry as any).documentFiles;
    updatedHistory[index] = newEntry;
    setHistory(updatedHistory);
    setEditingId(null);
  };
  
  const handleRemove = (index: number) => {
    setHistory(history.filter((_, i) => i !== index));
    toast({ title: 'Entry Deleted', description: 'The professional record has been removed.', variant: 'success'});
  };

  const startEditing = (index: number, item: ProfessionalInfo) => {
    setEditingId(index);
    editForm.reset({
        ...item,
        responsibilities: item.responsibilities.join('\n'),
        documentFiles: [],
    });
  };

  const renderItem = (item: ProfessionalInfo, index: number) => {
    const watchIsPresent = editForm.watch("isPresent");

    if (editingId === index) {
      return (
         <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit((data) => handleUpdate(index, data))}>
                <Card key={index} className="p-4 bg-muted/50">
                    <CardContent className="p-0 space-y-4">
                        <FormInput
                            control={editForm.control}
                            name="role"
                            label="Role"
                            required
                        />
                        <FormInput
                            control={editForm.control}
                            name="company"
                            label="Company"
                            required
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                             <FormDatePicker
                                control={editForm.control}
                                name="fromDate"
                                label="From"
                                required
                             />
                             <FormDatePicker
                                control={editForm.control}
                                name="toDate"
                                label="To"
                                required={!watchIsPresent}
                                disabled={watchIsPresent}
                                disabledDays={(date) => new Date(editForm.getValues("fromDate")) > date || date > new Date()}
                             />
                        </div>
                         <FormSwitch
                            control={editForm.control}
                            name="isPresent"
                            label="I currently work here"
                         />

                        <FormField
                        control={editForm.control}
                        name="responsibilities"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel required>Responsibilities (one per line)</FormLabel>
                            <FormControl><Textarea {...field} rows={4} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormFileUpload
                            control={editForm.control}
                            name="documentFiles"
                            label="Documents"
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
    
    const fromDate = format(parseISO(item.fromDate), 'MMM yyyy');
    const toDate = item.isPresent ? 'Present' : item.toDate ? format(parseISO(item.toDate), 'MMM yyyy') : '';


    return (
      <Card key={index} className="p-4 flex justify-between items-start">
          <div>
              <p className="font-semibold">{item.role}</p>
              <p className="text-sm text-muted-foreground">{item.company} &middot; {fromDate} - {toDate}</p>
              {item.documentUrls && item.documentUrls.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                      {item.documentUrls.map((url, i) => (
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
                  description='This will permanently delete this professional record.'
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
                <CardTitle>Your Professional History</CardTitle>
                <CardDescription>Listed below is your work experience.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {history.map(renderItem)}
                {history.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">No professional history added yet.</p>
                )}
            </CardContent>
        </Card>
        
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddNew)}>
                <Card className="glassmorphism">
                    <CardHeader>
                        <CardTitle>Add New Experience</CardTitle>
                        <CardDescription>Add a new role to your profile.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormInput
                            control={form.control}
                            name="role"
                            label="Role"
                            placeholder="e.g. Software Engineer"
                            required
                        />
                        <FormInput
                            control={form.control}
                            name="company"
                            label="Company"
                            placeholder="e.g. Google"
                            required
                        />
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                            <FormDatePicker
                                control={form.control}
                                name="fromDate"
                                label="From"
                                required
                            />
                             <FormDatePicker
                                control={form.control}
                                name="toDate"
                                label="To"
                                required={!form.watch('isPresent')}
                                disabled={form.watch('isPresent')}
                                disabledDays={(date) => new Date(form.getValues("fromDate")) > date || date > new Date()}
                             />
                        </div>
                        <FormSwitch
                            control={form.control}
                            name="isPresent"
                            label="I currently work here"
                        />

                        <FormField
                        control={form.control}
                        name="responsibilities"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel required>Responsibilities (one per line)</FormLabel>
                            <FormControl><Textarea {...field} rows={4} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormFileUpload
                            control={form.control}
                            name="documentFiles"
                            label="Documents"
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
