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

export function ProfileFormAwards({ candidate }: ProfileFormProps) {
    return (
        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle>Awards</CardTitle>
            <CardDescription>List your awards and recognitions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             {candidate.awards.map((award, index) => (
                <div key={index} className="p-4 border rounded-lg relative">
                    <div className="space-y-2">
                        <Label>Award Name</Label>
                        <Input defaultValue={award.name} />
                    </div>
                    <div className="space-y-2 mt-2">
                        <Label>Awarding Body</Label>
                        <Input defaultValue={award.awardingBody} />
                    </div>
                    <div className="space-y-2 mt-2">
                        <Label>Date Received</Label>
                        <Input type="date" defaultValue={award.dateReceived} />
                    </div>
                     <Button variant="ghost" size="icon" className="absolute top-2 right-2"><Trash className="h-4 w-4 text-destructive"/></Button>
                </div>
             ))}
            <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4"/>Add Award</Button>
          </CardContent>
          <CardFooter>
            <Button><Save className="mr-2 h-4 w-4"/>Save Changes</Button>
          </CardFooter>
        </Card>
    );
}
