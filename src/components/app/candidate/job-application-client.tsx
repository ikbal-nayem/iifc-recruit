
'use client';

import * as React from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send, Upload } from 'lucide-react';
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

export function JobApplicationClient({ jobTitle }: { jobTitle: string }) {
  const { toast } = useToast();

  const handleApply = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    toast({
      title: 'Application Submitted!',
      description: `Your application for the ${jobTitle} position has been sent.`,
      variant: 'success',
    });
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
            You can optionally add a custom resume or cover letter for this application.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4 py-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="resume">Custom Resume (Optional)</Label>
                <div className="relative flex items-center justify-center w-full">
                    <label htmlFor="resume-upload" className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-6 h-6 mb-2 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground">
                                <span className="font-semibold">Upload Resume</span>
                            </p>
                        </div>
                        <Input id="resume-upload" type="file" className="hidden" accept=".pdf,.doc,.docx" />
                    </label>
                </div>
            </div>
             <div className="grid w-full gap-1.5">
                <Label htmlFor="cover-letter">Cover Letter (Optional)</Label>
                <Textarea placeholder="Type your cover letter here." id="cover-letter" />
            </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleApply}>Confirm & Apply</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

