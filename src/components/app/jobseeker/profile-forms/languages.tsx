
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
import type { Candidate, Language } from '@/lib/types';
import { PlusCircle, Trash, Save, Edit } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { FormSelect } from '@/components/ui/form-select';
import { MasterDataService } from '@/services/api/master-data.service';
import { FormAutocomplete } from '@/components/ui/form-autocomplete';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

const languageSchema = z.object({
  name: z.string().min(1, 'Language name is required.'),
  proficiency: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Native']),
});

type LanguageFormValues = z.infer<typeof languageSchema>;

interface ProfileFormProps {
  candidate: Candidate;
}

export function ProfileFormLanguages({ candidate }: ProfileFormProps) {
  const { toast } = useToast();
  const [history, setHistory] = React.useState(candidate.languages);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [languageOptions, setLanguageOptions] = React.useState<{label: string, value: string}[]>([]);

  React.useEffect(() => {
    MasterDataService.language.get().then(res => {
        setLanguageOptions(res.body.map(l => ({ label: l.name, value: l.name })));
    });
  }, []);

  const form = useForm<LanguageFormValues>({
    resolver: zodResolver(languageSchema),
    defaultValues: { name: '', proficiency: 'Intermediate' },
  });

  const editForm = useForm<LanguageFormValues>({
    resolver: zodResolver(languageSchema),
  });
  
  const handleAddNew = (data: LanguageFormValues) => {
    setHistory([...history, data]);
    form.reset({ name: '', proficiency: 'Intermediate' });
  };

  const handleUpdate = (index: number, data: LanguageFormValues) => {
    const updatedHistory = [...history];
    updatedHistory[index] = data;
    setHistory(updatedHistory);
    setEditingId(null);
  };
  
  const handleRemove = (index: number) => {
    setHistory(history.filter((_, i) => i !== index));
    toast({
        title: 'Entry Deleted',
        description: 'The language has been removed.',
        variant: 'success'
    })
  };

  const startEditing = (index: number, item: Language) => {
    setEditingId(index);
    editForm.reset(item);
  };

  const renderItem = (item: Language, index: number) => {
    if (editingId === index) {
      return (
         <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit((data) => handleUpdate(index, data))}>
                <Card key={index} className="p-4 bg-muted/50">
                    <CardContent className="p-0 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormAutocomplete
                            control={editForm.control}
                            name="name"
                            label="Language"
                            required
                            placeholder="Select a language"
                            options={languageOptions}
                        />
                        <FormSelect
                          control={editForm.control}
                          name="proficiency"
                          label="Proficiency"
                          required
                          options={[
                            { label: 'Beginner', value: 'Beginner' },
                            { label: 'Intermediate', value: 'Intermediate' },
                            { label: 'Advanced', value: 'Advanced' },
                            { label: 'Native', value: 'Native' },
                          ]}
                          placeholder="Select proficiency"
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
                <p className="text-sm text-muted-foreground">{item.proficiency}</p>
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
                  description='This action cannot be undone. This will permanently delete this language from your profile.'
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
                <CardTitle>Your Languages</CardTitle>
                <CardDescription>Listed below are the languages you speak.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {history.map(renderItem)}
                {history.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">No languages added yet.</p>
                )}
            </CardContent>
        </Card>
        
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddNew)}>
                <Card className="glassmorphism">
                    <CardHeader>
                        <CardTitle>Add New Language</CardTitle>
                        <CardDescription>Add a new language to your profile.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormAutocomplete
                            control={form.control}
                            name="name"
                            label="Language"
                            placeholder="Select a language"
                            required
                            options={languageOptions}
                        />
                        <FormSelect
                          control={form.control}
                          name="proficiency"
                          label="Proficiency"
                          required
                          options={[
                            { label: 'Beginner', value: 'Beginner' },
                            { label: 'Intermediate', value: 'Intermediate' },
                            { label: 'Advanced', value: 'Advanced' },
                            { label: 'Native', value: 'Native' },
                          ]}
                          placeholder="Select proficiency"
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
