
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
import { Trash, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';


interface ProfileFormProps {
  candidate: Candidate;
}

export function ProfileFormSkills({ candidate }: ProfileFormProps) {
  const { toast } = useToast();
  const [skills, setSkills] = React.useState<string[]>(candidate.skills);
  const [newSkill, setNewSkill] = React.useState('');

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };
  
  const handleSaveChanges = () => {
    // In a real app, you would save the skills to the backend here.
    toast({
        title: 'Skills Updated',
        description: 'Your skills have been successfully saved.',
        variant: 'success'
    });
  }

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
                <Input 
                    placeholder="e.g. React" 
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }}
                />
                <Button variant="outline" onClick={handleAddSkill}>Add</Button>
            </div>
        </div>
         <div className="flex flex-wrap gap-2">
            {skills.map(skill => (
                <AlertDialog key={skill}>
                    <Badge variant="default" className="text-sm py-1 px-3">
                        {skill}
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="ml-1 h-4 w-4 text-primary-foreground/70 hover:text-primary-foreground">
                                <X className="h-3 w-3" />
                            </Button>
                        </AlertDialogTrigger>
                    </Badge>
                     <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the skill &quot;{skill}&quot;.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleRemoveSkill(skill)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            ))}
         </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveChanges}><Save className="mr-2 h-4 w-4"/>Save Changes</Button>
      </CardFooter>
    </Card>
  )
}
