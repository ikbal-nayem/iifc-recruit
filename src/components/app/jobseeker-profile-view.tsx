

'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MapPin, Building, Briefcase, GraduationCap, Award, BookOpen, Languages, Star, FileText, Download, User, Cake, Linkedin, Video } from 'lucide-react';
import type { Candidate } from '@/lib/types';
import { Button } from '../ui/button';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { Separator } from '../ui/separator';

interface JobseekerProfileViewProps {
    candidate: Candidate;
}

const formatDateRange = (fromDate: string, toDate?: string, isPresent?: boolean) => {
    const start = format(parseISO(fromDate), 'MMM yyyy');
    const end = isPresent ? 'Present' : toDate ? format(parseISO(toDate), 'MMM yyyy') : '';
    return `${start} - ${end}`;
};

export function JobseekerProfileView({ candidate }: JobseekerProfileViewProps) {
  const {
    personalInfo,
    professionalInfo,
    academicInfo,
    skills,
    certifications,
    languages,
    publications,
    awards,
    resumeUrl,
  } = candidate;

  const getFullName = () => {
    return [personalInfo.firstName, personalInfo.middleName, personalInfo.lastName].filter(Boolean).join(' ');
  }

  return (
    <div className="p-2 sm:p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start gap-6">
            <Avatar className="h-24 w-24 border-4 border-background shadow-md">
                <AvatarImage src={personalInfo.avatar} alt={getFullName()} />
                <AvatarFallback>{personalInfo.firstName?.[0]}{personalInfo.lastName?.[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <h1 className="text-3xl font-bold font-headline">{getFullName()}</h1>
                <p className="text-lg text-muted-foreground">{personalInfo.headline}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground mt-2">
                    <span className="flex items-center gap-2"><Mail className="h-4 w-4"/> {personalInfo.email}</span>
                    <span className="flex items-center gap-2"><Phone className="h-4 w-4"/> {personalInfo.phone}</span>
                </div>
                 <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground mt-2">
                    {personalInfo.linkedInProfile && (
                         <a href={personalInfo.linkedInProfile} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary"><Linkedin className="h-4 w-4"/> LinkedIn</a>
                    )}
                    {personalInfo.videoProfile && (
                         <a href={personalInfo.videoProfile} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary"><Video className="h-4 w-4"/> Video Profile</a>
                    )}
                </div>
            </div>
             <div className="flex-shrink-0">
                {resumeUrl && (
                    <Button asChild>
                        <Link href={resumeUrl} target="_blank" download>
                            <Download className="mr-2 h-4 w-4" /> Download CV
                        </Link>
                    </Button>
                )}
            </div>
        </div>
        
        <Separator />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
                <h4 className="font-semibold text-sm text-muted-foreground flex items-center gap-2"><User className="h-4 w-4" /> Personal Details</h4>
                <div className="text-sm space-y-1">
                    <p><span className="font-medium">Father's Name:</span> {personalInfo.fatherName}</p>
                    <p><span className="font-medium">Mother's Name:</span> {personalInfo.motherName}</p>
                    <p><span className="font-medium">Date of Birth:</span> {format(parseISO(personalInfo.dateOfBirth), 'do MMM, yyyy')}</p>
                    <p><span className="font-medium">Gender:</span> {personalInfo.gender}</p>
                    <p><span className="font-medium">Marital Status:</span> {personalInfo.maritalStatus}</p>
                    <p><span className="font-medium">Nationality:</span> {personalInfo.nationality}</p>
                    {personalInfo.nid && <p><span className="font-medium">NID:</span> {personalInfo.nid}</p>}
                    {personalInfo.passportNo && <p><span className="font-medium">Passport:</span> {personalInfo.passportNo}</p>}
                </div>
            </div>
             <div className="space-y-2">
                <h4 className="font-semibold text-sm text-muted-foreground flex items-center gap-2"><MapPin className="h-4 w-4" /> Present Address</h4>
                <address className="text-sm not-italic">
                    {personalInfo.presentAddress.line1}<br/>
                    {personalInfo.presentAddress.upazila}, {personalInfo.presentAddress.district} - {personalInfo.presentAddress.postCode}<br/>
                    {personalInfo.presentAddress.division}
                </address>
            </div>
            <div className="space-y-2">
                <h4 className="font-semibold text-sm text-muted-foreground flex items-center gap-2"><MapPin className="h-4 w-4" /> Permanent Address</h4>
                <address className="text-sm not-italic">
                    {personalInfo.permanentAddress.line1}<br/>
                    {personalInfo.permanentAddress.upazila}, {personalInfo.permanentAddress.district} - {personalInfo.permanentAddress.postCode}<br/>
                    {personalInfo.permanentAddress.division}
                </address>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                {professionalInfo.length > 0 && <Card className="glassmorphism">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Briefcase className="h-5 w-5"/> Professional Experience</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {professionalInfo.map((exp, index) => (
                            <div key={index} className="border-l-2 border-primary pl-4">
                                <h3 className="font-semibold">{exp.role}</h3>
                                <p className="text-sm text-muted-foreground">{exp.company}</p>
                                <p className="text-xs text-muted-foreground">{formatDateRange(exp.fromDate, exp.toDate, exp.isPresent)}</p>
                                <ul className="list-disc list-inside mt-2 text-sm text-muted-foreground space-y-1">
                                    {exp.responsibilities.map((resp, i) => <li key={i}>{resp}</li>)}
                                </ul>
                            </div>
                        ))}
                    </CardContent>
                </Card>}

                {academicInfo.length > 0 && <Card className="glassmorphism">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><GraduationCap className="h-5 w-5"/> Academic History</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {academicInfo.map((edu, index) => (
                            <div key={index}>
                                <h3 className="font-semibold">{edu.degree}</h3>
                                <p className="text-sm text-muted-foreground">{edu.institution}</p>
                                <p className="text-xs text-muted-foreground">Graduated: {edu.graduationYear}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>}
            </div>
            
            <div className="lg:col-span-1 space-y-6">
                {skills.length > 0 && <Card className="glassmorphism">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Star className="h-5 w-5"/> Skills</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                       {skills.map(skill => (
                            <Badge key={skill} variant="secondary">{skill}</Badge>
                        ))}
                    </CardContent>
                </Card>}

                {languages.length > 0 && (
                    <Card className="glassmorphism">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Languages className="h-5 w-5"/> Languages</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                           {languages.map(lang => (
                                <div key={lang.name} className="flex justify-between text-sm">
                                    <span>{lang.name}</span>
                                    <span className="text-muted-foreground">{lang.proficiency}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}
                {certifications.length > 0 && (
                    <Card className="glassmorphism">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5"/> Certifications</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                           {certifications.map((cert, index) => (
                               <div key={index}>
                                   <p className="font-semibold text-sm">{cert.name}</p>
                                   <p className="text-xs text-muted-foreground">{cert.issuingOrganization} - {cert.issueDate}</p>
                               </div>
                           ))}
                        </CardContent>
                    </Card>
                )}

                 {publications.length > 0 && (
                    <Card className="glassmorphism">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5"/> Publications</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                           {publications.map((pub, index) => (
                               <div key={index}>
                                   <a href={pub.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-sm hover:underline">{pub.title}</a>
                                   <p className="text-xs text-muted-foreground">{pub.publisher} - {pub.publicationDate}</p>
                               </div>
                           ))}
                        </CardContent>
                    </Card>
                 )}
                
                {awards.length > 0 && (
                    <Card className="glassmorphism">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Award className="h-5 w-5"/> Awards</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                           {awards.map((award, index) => (
                               <div key={index}>
                                   <p className="font-semibold text-sm">{award.name}</p>
                                   <p className="text-xs text-muted-foreground">{award.awardingBody} - {award.dateReceived}</p>
                               </div>
                           ))}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    </div>
  );
}
