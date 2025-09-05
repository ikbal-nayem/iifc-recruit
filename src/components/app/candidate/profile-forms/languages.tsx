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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ProfileFormProps {
  candidate: Candidate;
}

export function ProfileFormLanguages({ candidate }: ProfileFormProps) {
    return (
        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle>Languages</CardTitle>
            <CardDescription>Add the languages you speak.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             {candidate.languages.map((lang, index) => (
                <div key={index} className="p-4 border rounded-lg relative">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Language</Label>
                            <Input defaultValue={lang.name} />
                        </div>
                         <div className="space-y-2">
                            <Label>Proficiency</Label>
                            <Select defaultValue={lang.proficiency}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select proficiency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Beginner">Beginner</SelectItem>
                                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                                    <SelectItem value="Advanced">Advanced</SelectItem>
                                    <SelectItem value="Native">Native</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2"><Trash className="h-4 w-4 text-destructive"/></Button>
                </div>
             ))}
            <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4"/>Add Language</Button>
          </CardContent>
          <CardFooter>
            <Button><Save className="mr-2 h-4 w-4"/>Save Changes</Button>
          </CardFooter>
        </Card>
    );
}
