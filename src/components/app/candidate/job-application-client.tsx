
'use client';

import * as React from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Send, Upload, FileText, X } from 'lucide-react';
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
  const [coverLetter, setCoverLetter] = React.useState<File | null>(null);

  const handleApply = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // In a real app, you would handle the file upload here.
    console.log('Applying with cover letter:', coverLetter?.name);
    toast({
      title: 'Application Submitted!',
      description: `Your application for the ${jobTitle} position has been sent.`,
      variant: 'success',
    });
    setCoverLetter(null); // Reset after submission
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
        setCoverLetter(file);
    } else if (file) {
        toast({
            title: 'Invalid File Type',
            description: 'Please upload your cover letter as a PDF file.',
            variant: 'destructive',
        });
    }
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
        <div className="space-y-4 py-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="cover-letter-upload">Cover Letter (Optional PDF)</Label>
                {!coverLetter ? (
                  <div className="relative flex items-center justify-center w-full">
                      <label htmlFor="cover-letter-upload" className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-6 h-6 mb-2 text-muted-foreground" />
                              <p className="text-xs text-muted-foreground">
                                  <span className="font-semibold">Upload Cover Letter</span>
                              </p>
                          </div>
                          <Input id="cover-letter-upload" type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
                      </label>
                  </div>
                ) : (
                  <div className="p-2 border rounded-lg flex items-center justify-between bg-muted/50">
                      <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-primary" />
                          <div className="text-sm">
                              <p className="font-medium truncate max-w-xs">{coverLetter.name}</p>
                              <p className="text-xs text-muted-foreground">{`${(coverLetter.size / 1024).toFixed(1)} KB`}</p>
                          </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setCoverLetter(null)}>
                          <X className="h-4 w-4" />
                      </Button>
                  </div>
                )}
            </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setCoverLetter(null)}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleApply}>Confirm & Apply</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
