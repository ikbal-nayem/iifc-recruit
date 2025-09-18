
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';
import { FormInput } from '@/components/ui/form-input';
import { FormSelect } from '@/components/ui/form-select';
import { FormDatePicker } from '@/components/ui/form-datepicker';

const jobSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  department: z.string().min(1, 'Department is required.'),
  location: z.string().min(1, 'Location is required.'),
  type: z.enum(['Full-time', 'Contract', 'Internship']),
  salaryRange: z.string().min(1, 'Salary range is required.'),
  applicationDeadline: z.string().min(1, 'Application deadline is required.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  responsibilities: z.string().min(10, 'Responsibilities must be at least 10 characters.'),
  requirements: z.string().min(10, 'Requirements must be at least 10 characters.'),
});

type JobFormValues = z.infer<typeof jobSchema>;

export function CreateJobForm() {
  const { toast } = useToast();
  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
        title: '',
        department: '',
        location: '',
        type: 'Full-time',
        salaryRange: '',
        applicationDeadline: '',
        description: '',
        responsibilities: '',
        requirements: '',
    },
  });

  function onSubmit(data: JobFormValues) {
    console.log(data);
    toast({
      title: 'Job Posted Successfully!',
      description: `The job "${data.title}" has been created.`,
      variant: 'success',
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                    control={form.control}
                    name="title"
                    label="Job Title"
                    placeholder="e.g. Senior Frontend Developer"
                    required
                />
                 <FormInput
                    control={form.control}
                    name="department"
                    label="Department"
                    placeholder="e.g. Engineering"
                    required
                />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormInput
                    control={form.control}
                    name="location"
                    label="Location"
                    placeholder="e.g. Dhaka, Bangladesh"
                    required
                />
                 <FormSelect
                    control={form.control}
                    name="type"
                    label="Job Type"
                    placeholder="Select a job type"
                    options={[
                        { label: 'Full-time', value: 'Full-time' },
                        { label: 'Contract', value: 'Contract' },
                        { label: 'Internship', value: 'Internship' },
                    ]}
                 />
                 <FormInput
                    control={form.control}
                    name="salaryRange"
                    label="Salary Range"
                    placeholder="e.g. BDT 80,000 - 120,000"
                    required
                 />
             </div>
             <FormDatePicker
                control={form.control}
                name="applicationDeadline"
                label="Application Deadline"
                required
             />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide a detailed description of the job."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="responsibilities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsibilities</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="List the key responsibilities. Enter each on a new line."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                   <FormDescription>
                    Enter each responsibility on a new line.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="requirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Requirements</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="List the job requirements. Enter each on a new line."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                   <FormDescription>
                    Enter each requirement on a new line.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Post Job
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
