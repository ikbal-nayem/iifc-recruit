
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
import { PlusCircle, Trash, Save, Edit, FileText, Upload } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';

const professionalInfoSchema = z.object({
  role: z.string().min(1, 'Role is required.'),
  company: z.string().min(1, 'Company is required.'),
  duration: z.string().min(1, 'Duration is required.'),
  responsibilities: z.string().min(1, 'Please list at least one responsibility.'),
  documentUrls: z.array(z.string()).optional(),
});

type ProfessionalFormValues = z.infer<typeof professionalInfoSchema>;

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

export function ProfileFormProfessional({ candidate }: ProfileFormProps) {
  const [history, setHistory] = React.useState(candidate.professionalInfo);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [addFormFiles, setAddFormFiles] = React.useState<File[]>([]);
  const [editFormFiles, setEditFormFiles] = React.useState<File[]>([]);

  const form = useForm<ProfessionalFormValues>({
    resolver: zodResolver(professionalInfoSchema),
    defaultValues: { role: '', company: '', duration: '', responsibilities: '', documentUrls: [] },
  });

  const editForm = useForm<ProfessionalFormValues>({
    resolver: zodResolver(professionalInfoSchema),
  });
  
  const handleAddNew = (data: ProfessionalFormValues) => {
    const newEntry: ProfessionalInfo = { 
        ...data,
        responsibilities: data.responsibilities.split('\n'),
        documentUrls: addFormFiles.map(f => f.name) 
    };
    setHistory([...history, newEntry]);
    form.reset({ role: '', company: '', duration: '', responsibilities: '', documentUrls: [] });
    setAddFormFiles([]);
  };

  const handleUpdate = (index: number, data: ProfessionalFormValues) => {
    const updatedHistory = [...history];
    const newEntry: ProfessionalInfo = { 
        ...data,
        responsibilities: data.responsibilities.split('\n'),
        documentUrls: editFormFiles.map(f => f.name) 
    };
    updatedHistory[index] = newEntry;
    setHistory(updatedHistory);
    setEditingId(null);
    setEditFormFiles([]);
  };
  
  const handleRemove = (index: number) => {
    setHistory(history.filter((_, i) => i !== index));
  };

  const startEditing = (index: number, item: ProfessionalInfo) => {
    setEditingId(index);
    editForm.reset({
        ...item,
        responsibilities: item.responsibilities.join('\n')
    });
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

  const renderItem = (item: ProfessionalInfo, index: number) => {
    if (editingId === index) {
      return (
         <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit((data) => handleUpdate(index, data))}>
                <Card key={index} className="p-4 bg-muted/50">
                    <CardContent className="p-0 space-y-4">
                        <FormField
                        control={editForm.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                            <Label>Role</Label>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={editForm.control}
                        name="company"
                        render={({ field }) => (
                            <FormItem>
                            <Label>Company</Label>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                         <FormField
                        control={editForm.control}
                        name="duration"
                        render={({ field }) => (
                            <FormItem>
                            <Label>Duration</Label>
                            <FormControl><Input {...field} placeholder="e.g., 2020 - Present" /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={editForm.control}
                        name="responsibilities"
                        render={({ field }) => (
                            <FormItem>
                            <Label>Responsibilities (one per line)</Label>
                            <FormControl><Textarea {...field} rows={4} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormItem>
                            <Label>Documents (Multi-file)</Label>
                             <FormControl>
                                <div className="relative flex items-center justify-center w-full">
                                    <label htmlFor={`edit-prof-file-upload-${index}`} className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-background hover:bg-muted">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                                            <p className="text-sm text-muted-foreground">
                                                <span className="font-semibold">Click to upload</span> or drag and drop
                                            </p>
                                        </div>
                                        <Input id={`edit-prof-file-upload-${index}`} type="file" multiple className="hidden" onChange={(e) => handleFileChange(e, setEditFormFiles)} />
                                    </label>
                                </div>
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
      <Card key={index} className="p-4 flex justify-between items-start">
          <div>
              <p className="font-semibold">{item.role}</p>
              <p className="text-sm text-muted-foreground">{item.company} &middot; {item.duration}</p>
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
                        <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                            <Label>Role</Label>
                            <FormControl><Input {...field} placeholder="e.g. Software Engineer"/></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                            <FormItem>
                            <Label>Company</Label>
                            <FormControl><Input {...field} placeholder="e.g. Google"/></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                            <FormItem>
                            <Label>Duration</Label>
                            <FormControl><Input {...field} placeholder="e.g. 2022 - Present"/></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="responsibilities"
                        render={({ field }) => (
                            <FormItem>
                            <Label>Responsibilities (one per line)</Label>
                            <FormControl><Textarea {...field} rows={4} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                         <FormItem>
                            <Label>Documents (Multi-file)</Label>
                             <FormControl>
                                <div className="relative flex items-center justify-center w-full">
                                    <label htmlFor="add-prof-file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-background hover:bg-muted">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                                            <p className="text-sm text-muted-foreground">
                                                <span className="font-semibold">Click to upload</span> or drag and drop
                                            </p>
                                        </div>
                                        <Input id="add-prof-file-upload" type="file" multiple className="hidden" onChange={(e) => handleFileChange(e, setAddFormFiles)} />
                                    </label>
                                </div>
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
