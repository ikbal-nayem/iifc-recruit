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

export function ProfileFormPublications({ candidate }: ProfileFormProps) {
    return (
        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle>Publications</CardTitle>
            <CardDescription>List your published work.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             {candidate.publications.map((pub, index) => (
                <div key={index} className="p-4 border rounded-lg relative">
                    <div className="space-y-2">
                        <Label>Title</Label>
                        <Input defaultValue={pub.title} />
                    </div>
                    <div className="space-y-2 mt-2">
                        <Label>Publisher</Label>
                        <Input defaultValue={pub.publisher} />
                    </div>
                    <div className="space-y-2 mt-2">
                        <Label>Publication Date</Label>
                        <Input type="date" defaultValue={pub.publicationDate} />
                    </div>
                    <div className="space-y-2 mt-2">
                        <Label>URL</Label>
                        <Input defaultValue={pub.url} />
                    </div>
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2"><Trash className="h-4 w-4 text-destructive"/></Button>
                </div>
             ))}
            <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4"/>Add Publication</Button>
          </CardContent>
          <CardFooter>
            <Button><Save className="mr-2 h-4 w-4"/>Save Changes</Button>
          </CardFooter>
        </Card>
    );
}
