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
import { PlusCircle, Trash, Save, FileText } from 'lucide-react';

interface ProfileFormProps {
  candidate: Candidate;
}

export function ProfileFormAcademic({ candidate }: ProfileFormProps) {
  const [academicHistory, setAcademicHistory] = React.useState(candidate.academicInfo);
  const [files, setFiles] = React.useState<Record<number, File[]>>({});

  const handleFileChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(prev => ({ ...prev, [index]: Array.from(event.target.files!) }));
    }
  };

  const handleRemoveFile = (index: number, fileIndex: number) => {
    setFiles(prev => ({
      ...prev,
      [index]: prev[index]?.filter((_, i) => i !== fileIndex) || [],
    }));
  };

  return (
    <Card className="glassmorphism">
      <CardHeader>
        <CardTitle>Academic History</CardTitle>
        <CardDescription>
          Your educational background.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {academicHistory.map((info, index) => (
          <div key={index} className="p-4 border rounded-lg relative">
            <div className="space-y-2">
                <Label>Degree</Label>
                <Input defaultValue={info.degree} />
            </div>
            <div className="space-y-2 mt-2">
                <Label>Institution</Label>
                <Input defaultValue={info.institution} />
            </div>
            <div className="space-y-2 mt-2">
                <Label>Graduation Year</Label>
                <Input type="number" defaultValue={info.graduationYear} />
            </div>
            <div className="space-y-2 mt-2">
              <Label htmlFor={`certs-${index}`}>Certificates</Label>
              <Input id={`certs-${index}`} type="file" multiple onChange={(e) => handleFileChange(index, e)} />
            </div>
             {files[index] && files[index].length > 0 && (
              <div className="mt-2 space-y-2">
                {files[index].map((file, fileIdx) => (
                   <div key={file.name} className="flex items-center justify-between p-2 rounded-md border bg-muted/50">
                      <div className="flex items-center gap-2 text-sm">
                        <FileText className="h-4 w-4" />
                        <span className="font-medium truncate max-w-xs">{file.name}</span>
                        <span className="text-muted-foreground text-xs">({(file.size / 1024).toFixed(1)} KB)</span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveFile(index, fileIdx)}>
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                   </div>
                ))}
              </div>
            )}
            <Button variant="ghost" size="icon" className="absolute top-2 right-2"><Trash className="h-4 w-4 text-destructive"/></Button>
          </div>
        ))}
         <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4"/>Add Education</Button>
      </CardContent>
      <CardFooter>
        <Button><Save className="mr-2 h-4 w-4"/>Save Changes</Button>
      </CardFooter>
    </Card>
  )
}
