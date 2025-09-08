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
import type { Candidate } from '@/lib/types';
import { PlusCircle, Trash, Save } from 'lucide-react';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

const academicInfoSchema = z.object({
  degree: z.string().min(1, 'Degree is required.'),
  institution: z.string().min(1, 'Institution is required.'),
  graduationYear: z.coerce.number().min(1950, 'Invalid year.'),
});

const formSchema = z.object({
  academicInfo: z.array(academicInfoSchema),
});

type AcademicFormValues = z.infer<typeof formSchema>;

interface ProfileFormProps {
  candidate: Candidate;
}

export function ProfileFormAcademic({ candidate }: ProfileFormProps) {
  const form = useForm<AcademicFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      academicInfo: candidate.academicInfo,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'academicInfo',
  });
  
  const onSubmit = (data: AcademicFormValues) => {
    console.log('Form data:', data);
    // Here you would handle form submission, e.g., API call
  };


  return (
    <FormProvider {...form}>
       <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="glassmorphism">
        <CardHeader>
            <CardTitle>Academic History</CardTitle>
            <CardDescription>Your educational background.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            {fields.map((field, index) => (
            <Card key={field.id} className="p-4 relative">
                <CardContent className="p-0 space-y-4">
                <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name={`academicInfo.${index}.degree`}
                      render={({ field }) => (
                        <FormItem>
                           <Label>Degree</Label>
                           <FormControl>
                             <Input {...field} placeholder="e.g. B.S. in Computer Science"/>
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
                <div className="space-y-2 mt-2">
                     <FormField
                      control={form.control}
                      name={`academicInfo.${index}.institution`}
                      render={({ field }) => (
                        <FormItem>
                           <Label>Institution</Label>
                           <FormControl>
                             <Input {...field} placeholder="e.g. Stanford University"/>
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
                <div className="space-y-2 mt-2">
                     <FormField
                      control={form.control}
                      name={`academicInfo.${index}.graduationYear`}
                      render={({ field }) => (
                        <FormItem>
                           <Label>Graduation Year</Label>
                           <FormControl>
                             <Input type="number" {...field} placeholder="e.g. 2016"/>
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => remove(index)}
                >
                    <Trash className="h-4 w-4 text-destructive" />
                </Button>
                </CardContent>
            </Card>
            ))}
            <Button
            type="button"
            variant="outline"
            onClick={() => append({ degree: '', institution: '', graduationYear: new Date().getFullYear() })}
            >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Education
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