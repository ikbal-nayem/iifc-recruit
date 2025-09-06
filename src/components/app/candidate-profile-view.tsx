'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MapPin, Building, Briefcase, GraduationCap, Award, BookOpen, Languages, Star, FileText, Download } from 'lucide-react';
import type { Candidate } from '@/lib/types';
import { Button } from '../ui/button';
import Link from 'next/link';

interface CandidateProfileViewProps {
    candidate: Candidate;
}

export function CandidateProfileView({ candidate }: CandidateProfileViewProps) {
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

  return (
    <div className="p-2 sm:p-4 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start gap-6">
            <Avatar className="h-24 w-24 border-4 border-background shadow-md">
                <AvatarImage src={personalInfo.avatar} alt={personalInfo.name} />
                <AvatarFallback>{personalInfo.firstName[0]}{personalInfo.lastName[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <h1 className="text-3xl font-bold font-headline">{personalInfo.firstName} {personalInfo.lastName}</h1>
                <p className="text-lg text-muted-foreground">{personalInfo.headline}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground mt-2">
                    <span className="flex items-center gap-2"><Mail className="h-4 w-4"/> {personalInfo.email}</span>
                    <span className="flex items-center gap-2"><Phone className="h-4 w-4"/> {personalInfo.phone}</span>
                    <span className="flex items-center gap-2"><MapPin className="h-4 w-4"/> {personalInfo.address.district}, {personalInfo.address.division}</span>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                {/* Professional Experience */}
                <Card className="glassmorphism">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Briefcase className="h-5 w-5"/> Professional Experience</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {professionalInfo.map((exp, index) => (
                            <div key={index} className="border-l-2 border-primary pl-4">
                                <h3 className="font-semibold">{exp.role}</h3>
                                <p className="text-sm text-muted-foreground">{exp.company}</p>
                                <p className="text-xs text-muted-foreground">{exp.duration}</p>
                                <ul className="list-disc list-inside mt-2 text-sm text-muted-foreground space-y-1">
                                    {exp.responsibilities.map((resp, i) => <li key={i}>{resp}</li>)}
                                </ul>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                 {/* Academic History */}
                <Card className="glassmorphism">
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
                </Card>
            </div>
            
            <div className="lg:col-span-1 space-y-6">
                 {/* Skills */}
                <Card className="glassmorphism">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Star className="h-5 w-5"/> Skills</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                       {skills.map(skill => (
                            <Badge key={skill} variant="secondary">{skill}</Badge>
                        ))}
                    </CardContent>
                </Card>

                {/* Languages */}
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
                 {/* Certifications */}
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

                 {/* Publications */}
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
                
                 {/* Awards */}
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
