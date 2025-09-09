
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
import { Upload, FileText, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

const resumeSchema = z.object({
    resumeFile: z.any()
        .refine(file => file?.size <= 5 * 1024 * 1024, `Max file size is 5MB.`)
        .refine(file => file?.type === 'application/pdf', 'Only .pdf files are accepted.')
});

type ResumeFormValues = z.infer<typeof resumeSchema>;

export default function CandidateProfileResumePage() {
    const { toast } = useToast();
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

    const form = useForm<ResumeFormValues>({
        resolver: zodResolver(resumeSchema),
        defaultValues: {
            resumeFile: null,
        }
    });

    const resumeFile = form.watch('resumeFile');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, fieldChange: (value: File | null) => void) => {
        const file = event.target.files?.[0] || null;
        fieldChange(file);
    };

    React.useEffect(() => {
        if (resumeFile) {
            const url = URL.createObjectURL(resumeFile);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setPreviewUrl(null);
        }
    }, [resumeFile]);
    
    const onSubmit = (data: ResumeFormValues) => {
        console.log(data);
        toast({
            title: 'Resume Uploaded',
            description: 'Your new resume has been saved.',
            variant: 'success'
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card className="glassmorphism">
                    <CardHeader>
                        <CardTitle>Upload Resume</CardTitle>
                        <CardDescription>
                            Upload your CV/Resume in PDF format. This will be shared with recruiters.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <FormField
                            control={form.control}
                            name="resumeFile"
                            render={({ field }) => (
                                <FormItem>
                                    <Label htmlFor="resume-upload">Resume/CV (PDF, max 5MB)</Label>
                                    <FormControl>
                                        <div className="relative flex items-center justify-center w-full">
                                            <label htmlFor="resume-upload" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                                                    <p className="mb-2 text-sm text-muted-foreground">
                                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">PDF (MAX. 5MB)</p>
                                                </div>
                                                <Input id="resume-upload" type="file" className="hidden" accept=".pdf" onChange={(e) => handleFileChange(e, field.onChange)} />
                                            </label>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {resumeFile && previewUrl && (
                            <div>
                                <Label>Preview</Label>
                                <div className="mt-2 p-4 border rounded-lg relative">
                                    <div className="flex items-center gap-4">
                                        <FileText className="h-10 w-10 text-primary" />
                                        <div className="flex-1">
                                            <p className="font-medium text-sm truncate">{resumeFile.name}</p>
                                            <p className="text-xs text-muted-foreground">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => form.setValue('resumeFile', null)}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="mt-4 aspect-video">
                                        <iframe src={previewUrl} className="w-full h-full rounded-md border" title="Resume Preview" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={!resumeFile || !form.formState.isValid}>Upload & Save</Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    );
}
