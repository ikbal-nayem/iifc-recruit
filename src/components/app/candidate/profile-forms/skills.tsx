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
import { Badge } from '@/components/ui/badge';
import { Trash, Save } from 'lucide-react';

interface ProfileFormProps {
  candidate: Candidate;
}

export function ProfileFormSkills({ candidate }: ProfileFormProps) {
  return (
    <Card className="glassmorphism">
      <CardHeader>
        <CardTitle>Skills</CardTitle>
        <CardDescription>
          Highlight your expertise. Add skills relevant to jobs you're interested in.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
            <Label>Add a new skill</Label>
            <div className="flex gap-2">
                <Input placeholder="e.g. React" />
                <Button variant="outline">Add</Button>
            </div>
        </div>
         <div className="flex flex-wrap gap-2">
            {candidate.skills.map(skill => (
                <Badge key={skill} variant="default" className="text-sm py-1 px-3">
                    {skill}
                    <Button variant="ghost" size="icon" className="ml-1 h-4 w-4 text-primary-foreground/70 hover:text-primary-foreground">
                        <Trash className="h-3 w-3" />
                    </Button>
                </Badge>
            ))}
         </div>
      </CardContent>
      <CardFooter>
        <Button><Save className="mr-2 h-4 w-4"/>Save Changes</Button>
      </CardFooter>
    </Card>
  )
}
