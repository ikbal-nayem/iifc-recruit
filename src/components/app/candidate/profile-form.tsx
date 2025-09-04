'use client';

import * as React from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
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
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Trash, Save, Upload } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
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

export function ProfileForm({ candidate }: ProfileFormProps) {
  return (
    <Tabs defaultValue="personal">
      <ScrollArea className="w-full whitespace-nowrap">
        <TabsList>
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="professional">Professional</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="languages">Languages</TabsTrigger>
          <TabsTrigger value="publications">Publications</TabsTrigger>
          <TabsTrigger value="awards">Awards</TabsTrigger>
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      
      <TabsContent value="personal">
        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              This is your public-facing information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue={candidate.personalInfo.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="headline">Headline</Label>
              <Input id="headline" defaultValue={candidate.personalInfo.headline} />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={candidate.personalInfo.email} />
                </div>
                <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" defaultValue={candidate.personalInfo.phone} />
                </div>
             </div>
             <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" defaultValue={candidate.personalInfo.location} />
            </div>
          </CardContent>
          <CardFooter>
            <Button><Save className="mr-2 h-4 w-4"/>Save Changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="academic">
        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle>Academic History</CardTitle>
            <CardDescription>
              Your educational background.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {candidate.academicInfo.map((info, index) => (
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
                <Button variant="ghost" size="icon" className="absolute top-2 right-2"><Trash className="h-4 w-4 text-destructive"/></Button>
              </div>
            ))}
             <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4"/>Add Education</Button>
          </CardContent>
          <CardFooter>
            <Button><Save className="mr-2 h-4 w-4"/>Save Changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="professional">
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
                    <Textarea defaultValue={info.responsibilities.join('\n')} />
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
      </TabsContent>

       <TabsContent value="skills">
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
      </TabsContent>

       <TabsContent value="certifications">
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
      </TabsContent>

      <TabsContent value="languages">
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
      </TabsContent>

      <TabsContent value="publications">
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
      </TabsContent>
      
      <TabsContent value="awards">
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
      </TabsContent>
    </Tabs>
  );
}
