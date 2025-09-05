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

interface ProfileFormProps {
  candidate: Candidate;
}

export function ProfileFormProfessional({ candidate }: ProfileFormProps) {
  return (
    <Card className="glassmorphism">
      <CardHeader>
        <CardTitle>Professional Experience</CardTitle>
        <CardDescription>
          Your work history.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
         {candidate.professionalInfo.map((info, index) => (
          <div key={index} className="p-4 border rounded-lg relative">
            <div className="space-y-2">
                <Label>Role</Label>
                <Input defaultValue={info.role} />
            </div>
            <div className="space-y-2 mt-2">
                <Label>Company</Label>
                <Input defaultValue={info.company} />
            </div>
            <div className="space-y-2 mt-2">
                <Label>Duration</Label>
                <Input defaultValue={info.duration} />
            </div>
             <div className="space-y-2 mt-2">
                <Label>Responsibilities</Label>
                <Textarea defaultValue={info.responsibilities.join('\\n')} />
            </div>
            <Button variant="ghost" size="icon" className="absolute top-2 right-2"><Trash className="h-4 w-4 text-destructive"/></Button>
          </div>
        ))}
         <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4"/>Add Experience</Button>
      </CardContent>
      <CardFooter>
        <Button><Save className="mr-2 h-4 w-4"/>Save Changes</Button>
      </CardFooter>
    </Card>
  )
}
