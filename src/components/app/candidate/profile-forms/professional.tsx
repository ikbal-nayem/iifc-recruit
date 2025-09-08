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
import type { Candidate } from '@/lib/types';
import { PlusCircle, Trash, Save } from 'lucide-react';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

const professionalInfoSchema = z.object({
    role: z.string().min(1, 'Role is required.'),
    company: z.string().min(1, 'Company is required.'),
    duration: z.string().min(1, 'Duration is required.'),
    responsibilities: z.string().min(1, 'Responsibilities are required.'),
});

const formSchema = z.object({
  professionalInfo: z.array(z.object({
    role: z.string().min(1, 'Role is required.'),
    company: z.string().min(1, 'Company is required.'),
    duration: z.string().min(1, 'Duration is required.'),
    responsibilities: z.array(z.string()).min(1, "At least one responsibility is required."),
  })),
});

type ProfessionalFormValues = z.infer<typeof formSchema>;

interface ProfileFormProps {
  candidate: Candidate;
}

export function ProfileFormProfessional({ candidate }: ProfileFormProps) {
    const form = useForm<ProfessionalFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            professionalInfo: candidate.professionalInfo,
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'professionalInfo',
    });
    
    const onSubmit = (data: ProfessionalFormValues) => {
        console.log('Form data:', data);
        // Here you would handle form submission, e.g., API call
    };

    return (
        <FormProvider {...form}>
           <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card className="glassmorphism">
            <CardHeader>
                <CardTitle>Professional Experience</CardTitle>
                <CardDescription>
                Your work history.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {fields.map((field, index) => (
                <Card key={field.id} className="p-4 relative">
                    <CardContent className="p-0 space-y-4">
                        <FormField
                            control={form.control}
                            name={`professionalInfo.${index}.role`}
                            render={({ field }) => (
                                <FormItem>
                                    <Label>Role</Label>
                                    <FormControl>
                                        <Input {...field} placeholder="e.g. Senior Frontend Developer" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name={`professionalInfo.${index}.company`}
                            render={({ field }) => (
                                <FormItem>
                                    <Label>Company</Label>
                                    <FormControl>
                                        <Input {...field} placeholder="e.g. TechCorp" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name={`professionalInfo.${index}.duration`}
                            render={({ field }) => (
                                <FormItem>
                                    <Label>Duration</Label>
                                    <FormControl>
                                        <Input {...field} placeholder="e.g. 2019 - Present" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name={`professionalInfo.${index}.responsibilities`}
                            render={({ field }) => (
                                <FormItem>
                                    <Label>Responsibilities</Label>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Enter responsibilities, one per line."
                                            onChange={(e) => field.onChange(e.target.value.split('\n'))}
                                            value={Array.isArray(field.value) ? field.value.join('\n') : ''}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => remove(index)}
                    >
                        <Trash className="h-4 w-4 text-destructive" />
                    </Button>
                </Card>
                ))}
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => append({ role: '', company: '', duration: '', responsibilities: [] })}
                >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Experience
                </Button>
            </CardContent>
            <CardFooter>
                <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
                </Button>
            </CardFooter>
            </Card>
           </form>
        </FormProvider>
  );
}