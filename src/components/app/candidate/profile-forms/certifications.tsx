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

interface ProfileFormProps {
  candidate: Candidate;
}

export function ProfileFormCertifications({ candidate }: ProfileFormProps) {
    return (
        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle>Certifications</CardTitle>
            <CardDescription>List your professional certifications.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {candidate.certifications.map((cert, index) => (
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
                  <Label>Proof</Label>
                  <Input type="file" />
                </div>
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
