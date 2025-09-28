

'use client';

import * as React from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FormFileUpload } from '@/components/ui/form-file-upload';
import { Form } from '@/components/ui/form';

const applicationSchema = z.object({
    coverLetter: z.any().optional(),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

export function JobApplicationClient({ jobTitle }: { jobTitle: string }) {
  const { toast } = useToast();
  
  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
  });

  const handleApply = (data: ApplicationFormValues) => {
    // In a real app, you would handle the file upload here.
    console.log('Applying with cover letter:', data.coverLetter?.name);
    toast({
      title: 'Application Submitted!',
      description: `Your application for the ${jobTitle} position has been sent.`,
      variant: 'success',
    });
    form.reset(); // Reset after submission
  };


  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>
          <Send className="mr-2 h-4 w-4" />
          Apply Now
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apply for {jobTitle}</AlertDialogTitle>
          <AlertDialogDescription>
            You can optionally attach a cover letter (PDF) to your application. Your default profile will be submitted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleApply)} className="space-y-4 py-4">
                <FormFileUpload
                    control={form.control}
                    name="coverLetter"
                    label="Cover Letter (Optional PDF)"
                    accept=".pdf"
                />
                 <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction type="submit">Confirm & Apply</AlertDialogAction>
                </AlertDialogFooter>
            </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
