

'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Jobseeker } from '@/lib/types';
import { CheckCircle, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function calculateProfileCompletion(jobseeker: Jobseeker): number {
  let score = 0;
  const totalFields = 9; // personal, academic, professional, skills, certs, langs, pubs, awards, trainings

  if (jobseeker.personalInfo.firstName && jobseeker.personalInfo.lastName && jobseeker.personalInfo.email) score++;
  if (jobseeker.academicInfo.length > 0) score++;
  if (jobseeker.professionalInfo.length > 0) score++;
  if (jobseeker.skills.length > 0) score++;
  if (jobseeker.certifications.length > 0) score++;
  if (jobseeker.languages.length > 0) score++;
  if (jobseeker.publications.length > 0) score++;
  if (jobseeker.awards.length > 0) score++;
  if (jobseeker.trainings.length > 0) score++;
  
  return Math.round((score / totalFields) * 100);
}

const checklistItems = [
    { id: 'personalInfo', label: 'Personal Info', href: '/jobseeker/profile-edit' },
    { id: 'academicInfo', label: 'Academic History', href: '/jobseeker/profile-edit/academic' },
    { id: 'professionalInfo', label: 'Work Experience', href: '/jobseeker/profile-edit/professional' },
    { id: 'skills', label: 'Skills', href: '/jobseeker/profile-edit/skills' },
    { id: 'resume', label: 'Upload Resume', href: '/jobseeker/profile-edit/resume' },
];

function isSectionComplete(jobseeker: Jobseeker, section: string): boolean {
    switch (section) {
        case 'personalInfo':
            return !!(jobseeker.personalInfo.firstName && jobseeker.personalInfo.lastName && jobseeker.personalInfo.email);
        case 'academicInfo':
        case 'professionalInfo':
        case 'skills':
        case 'certifications':
        case 'languages':
        case 'publications':
        case 'awards':
        case 'trainings':
        case 'resumes':
            return Array.isArray(jobseeker[section as keyof Jobseeker]) && (jobseeker[section as keyof Jobseeker] as any[]).length > 0;
        case 'resume': // for the single resume object
            return !!jobseeker.resume?.file;
        default:
            return false;
    }
}


export function ProfileCompletion({ jobseeker }: { jobseeker: Jobseeker }) {
  const completionPercentage = calculateProfileCompletion(jobseeker);

  return (
    <Card className="glassmorphism card-hover h-full flex flex-col">
      <CardHeader>
        <CardTitle>Profile Strength</CardTitle>
        <CardDescription>
          Complete your profile to stand out to recruiters.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center text-center space-y-4">
        <div className="relative h-32 w-32">
            <svg className="h-full w-full" viewBox="0 0 100 100">
                <circle
                className="stroke-current text-gray-200"
                strokeWidth="10"
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                ></circle>
                <circle
                className="stroke-current text-primary"
                strokeWidth="10"
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - completionPercentage / 100)}`}
                transform="rotate(-90 50 50)"
                style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
                ></circle>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold">{completionPercentage}%</span>
            </div>
        </div>
        <div className='space-y-3 pt-4 text-left w-full'>
            <h4 className="font-semibold text-center pb-2">Quick Actions</h4>
            {checklistItems.map(item => {
                 const completed = isSectionComplete(jobseeker, item.id);
                 return (
                    <Link key={item.id} href={item.href}>
                        <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors">
                            {completed ? <CheckCircle className="h-5 w-5 text-primary" /> : <Circle className="h-5 w-5 text-muted-foreground" />}
                            <span className={completed ? 'text-foreground' : 'text-muted-foreground'}>{item.label}</span>
                        </div>
                    </Link>
                 )
            })}
        </div>
         <Button asChild className="w-full mt-auto">
            <Link href="/jobseeker/profile-edit">
                Complete Your Profile
            </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
