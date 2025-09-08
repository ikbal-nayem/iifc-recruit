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

export function ProfileFormCertifications({ candidate }: ProfileFormProps) {
    const [certifications, setCertifications] = React.useState(candidate.certifications);
    const [files, setFiles] = React.useState<Record<number, File | null>>({});

    const handleFileChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files?.[0]) {
        setFiles(prev => ({...prev, [index]: event.target.files![0]}));
      }
    };
    
    const handleRemoveFile = (index: number) => {
        setFiles(prev => ({ ...prev, [index]: null }));
    };

    return (
        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle>Certifications</CardTitle>
            <CardDescription>List your professional certifications.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {certifications.map((cert, index) => (
              <div key={index} className="p-4 border rounded-lg relative">
                <div className="space-y-2">
                  <Label>Certificate Name</Label>
                  <Input defaultValue={cert.name} />
                </div>
                <div className="space-y-2 mt-2">
                  <Label>Issuing Organization</Label>
                  <Input defaultValue={cert.issuingOrganization} />
                </div>
                 <div className="space-y-2 mt-2">
                  <Label>Issue Date</Label>
                  <Input type="date" defaultValue={cert.issueDate} />
                </div>
                <div className="space-y-2 mt-2">
                  <Label htmlFor={`proof-${index}`}>Proof</Label>
                  <Input id={`proof-${index}`} type="file" onChange={(e) => handleFileChange(index, e)}/>
                </div>
                {files[index] && (
                  <div className="mt-2 flex items-center justify-between p-2 rounded-md border bg-muted/50">
                    <div className="flex items-center gap-2 text-sm">
                        <FileText className="h-4 w-4" />
                        <span className="font-medium truncate max-w-xs">{files[index]!.name}</span>
                        <span className="text-muted-foreground text-xs">({(files[index]!.size / 1024).toFixed(1)} KB)</span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveFile(index)}>
                        <Trash className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                )}
                <Button variant="ghost" size="icon" className="absolute top-2 right-2"><Trash className="h-4 w-4 text-destructive"/></Button>
              </div>
            ))}
            <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4"/>Add Certification</Button>
          </CardContent>
          <CardFooter>
            <Button><Save className="mr-2 h-4 w-4"/>Save Changes</Button>
          </CardFooter>
        </Card>
    );
}
