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

export default function CandidateProfileResumePage() {
    const [file, setFile] = React.useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
    const { toast } = useToast();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.type === 'application/pdf' && selectedFile.size <= 5 * 1024 * 1024) { // 5MB limit
                setFile(selectedFile);
                const url = URL.createObjectURL(selectedFile);
                setPreviewUrl(url);
            } else {
                toast({
                    title: 'Invalid File',
                    description: 'Please upload a PDF file smaller than 5MB.',
                    variant: 'destructive',
                });
            }
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(null);
    }
    
    return (
        <Card className="glassmorphism">
            <CardHeader>
                <CardTitle>Upload Resume</CardTitle>
                <CardDescription>
                    Upload your CV/Resume in PDF format. This will be shared with recruiters.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="resume-upload">Resume/CV (PDF, max 5MB)</Label>
                    <div className="relative flex items-center justify-center w-full">
                        <label htmlFor="resume-upload" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                                <p className="mb-2 text-sm text-muted-foreground">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-muted-foreground">PDF (MAX. 5MB)</p>
                            </div>
                            <Input id="resume-upload" type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
                        </label>
                    </div>
                </div>

                {file && previewUrl && (
                    <div>
                         <Label>Preview</Label>
                         <div className="mt-2 p-4 border rounded-lg relative">
                            <div className="flex items-center gap-4">
                                <FileText className="h-10 w-10 text-primary" />
                                <div className="flex-1">
                                    <p className="font-medium text-sm truncate">{file.name}</p>
                                    <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={handleRemoveFile}>
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
                <Button disabled={!file}>Upload & Save</Button>
            </CardFooter>
        </Card>
    );
}
