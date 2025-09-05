'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
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
import { PlusCircle, Trash, Save, Upload, User, Mail, Phone, MapPin, Building, GraduationCap, Briefcase, Award, Languages, Book, Certificate } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Image from 'next/image';

interface ProfileFormProps {
  candidate: Candidate;
}

export function ProfileForm({ candidate }: ProfileFormProps) {
  const [activeTab, setActiveTab] = React.useState('personal');

  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setActiveTab(hash);
      } else {
        setActiveTab('personal');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    window.location.hash = value;
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <ScrollArea className="w-full whitespace-nowrap rounded-md border">
        <TabsList className="bg-background">
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
             <div className="flex items-center gap-6">
                <div className="relative">
                    <Image src={candidate.personalInfo.avatar} alt="Candidate Avatar" width={80} height={80} className="rounded-full" />
                    <Button size="icon" variant="outline" className="absolute bottom-0 right-0 h-8 w-8 rounded-full">
                        <Upload className="h-4 w-4" />
                        <Input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"/>
                    </Button>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="photo-upload">Profile Photo</Label>
                    <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                </div>
             </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" defaultValue={candidate.personalInfo.firstName} placeholder="e.g. John" />
                </div>
                <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" defaultValue={candidate.personalInfo.lastName} placeholder="e.g. Doe"/>
                </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="headline">Headline</Label>
              <Input id="headline" defaultValue={candidate.personalInfo.headline} placeholder="e.g. Senior Frontend Developer"/>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative flex items-center">
                        <Mail className="absolute left-3 h-4 w-4 text-muted-foreground" />
                        <Input id="email" type="email" defaultValue={candidate.personalInfo.email} className="pl-10" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                     <div className="relative flex items-center">
                        <Phone className="absolute left-3 h-4 w-4 text-muted-foreground" />
                        <Input id="phone" defaultValue={candidate.personalInfo.phone} className="pl-10" />
                    </div>
                </div>
             </div>
             <div>
                <Label>Address</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <div className="space-y-2">
                        <Label htmlFor="division" className="text-xs">Division</Label>
                        <Input id="division" defaultValue={candidate.personalInfo.address.division} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="district" className="text-xs">District</Label>
                        <Input id="district" defaultValue={candidate.personalInfo.address.district} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="upazila" className="text-xs">Upazila / Thana</Label>
                        <Input id="upazila" defaultValue={candidate.personalInfo.address.upazila} />
                    </div>
                </div>
                 <div className="space-y-2 mt-4">
                    <Label htmlFor="addressLine1" className="text-xs">Address Line 1</Label>
                    <Input id="addressLine1" defaultValue={candidate.personalInfo.address.line1} />
                </div>
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
                <div className="space-y-2 mt-2">
                  <Label>Certificates</Label>
                  <Input type="file" multiple />
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
