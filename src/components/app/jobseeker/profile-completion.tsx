
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Candidate } from '@/lib/types';
import { CheckCircle, Circle } from 'lucide-react';

function calculateProfileCompletion(candidate: Candidate): number {
  let score = 0;
  const totalFields = 8; // personal, academic, professional, skills, certs, langs, pubs, awards

  if (candidate.personalInfo.firstName && candidate.personalInfo.lastName && candidate.personalInfo.email) score++;
  if (candidate.academicInfo.length > 0) score++;
  if (candidate.professionalInfo.length > 0) score++;
  if (candidate.skills.length > 0) score++;
  if (candidate.certifications.length > 0) score++;
  if (candidate.languages.length > 0) score++;
  if (candidate.publications.length > 0) score++;
  if (candidate.awards.length > 0) score++;
  
  return (score / totalFields) * 100;
}

const checklistItems = [
    { id: 'personalInfo', label: 'Personal Information' },
    { id: 'academicInfo', label: 'Academic History' },
    { id: 'professionalInfo', label: 'Professional Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'languages', label: 'Languages' },
    { id: 'publications', label: 'Publications' },
    { id: 'awards', label: 'Awards' },
]

function isSectionComplete(candidate: Candidate, section: string): boolean {
    switch (section) {
        case 'personalInfo':
            return !!(candidate.personalInfo.firstName && candidate.personalInfo.lastName && candidate.personalInfo.email);
        case 'academicInfo':
        case 'professionalInfo':
        case 'skills':
        case 'certifications':
        case 'languages':
        case 'publications':
        case 'awards':
            return Array.isArray(candidate[section as keyof Candidate]) && (candidate[section as keyof Candidate] as any[]).length > 0;
        default:
            return false;
    }
}


export function ProfileCompletion({ candidate }: { candidate: Candidate }) {
  const completionPercentage = calculateProfileCompletion(candidate);

  return (
    <Card className="glassmorphism">
      <CardHeader>
        <CardTitle>Profile Completion</CardTitle>
        <CardDescription>
          A complete profile is more likely to be viewed by recruiters.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Progress value={completionPercentage} className="w-full" />
          <p className="text-right text-sm text-muted-foreground mt-2">{completionPercentage.toFixed(0)}% Complete</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {checklistItems.map(item => {
                 const completed = isSectionComplete(candidate, item.id);
                 return (
                    <div key={item.id} className="flex items-center gap-2">
                        {completed ? <CheckCircle className="h-5 w-5 text-primary" /> : <Circle className="h-5 w-5 text-muted-foreground" />}
                        <span className={completed ? 'text-foreground' : 'text-muted-foreground'}>{item.label}</span>
                    </div>
                 )
            })}
        </div>
      </CardContent>
    </Card>
  );
}
