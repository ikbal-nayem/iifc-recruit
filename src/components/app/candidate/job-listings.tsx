'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, MapPin, Clock, ArrowRight, Building } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Job } from '@/lib/types';
import { jobs as allJobs } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

export function JobListings() {
  const [jobs, setJobs] = React.useState<Job[]>(allJobs.filter(j => j.status === 'Open'));
  const { toast } = useToast();
  const router = useRouter();

  const handleApply = (jobTitle: string) => {
    toast({
        title: "Login Required",
        description: `Please log in to apply for the ${jobTitle} position.`,
        variant: "destructive"
    })
    router.push('/login');
  }

  return (
    <div className="space-y-8">
        <div className="text-center">
            <h2 className="text-3xl font-headline font-bold">Recent Job Openings</h2>
            <p className="text-muted-foreground mt-2">Explore the latest opportunities from top companies.</p>
        </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <Dialog key={job.id}>
            <Card className="flex flex-col group hover:border-primary transition-all">
              <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="font-headline text-xl group-hover:text-primary transition-colors">{job.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2 pt-2">
                            <Building className="h-4 w-4" /> {job.department}
                        </CardDescription>
                    </div>
                     <Badge variant={job.type === 'Full-time' ? 'default' : 'secondary'}>{job.type}</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                 <p className="text-sm text-foreground/80 line-clamp-2">{job.description}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {job.location}</span>
                    <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> Posted {job.postedDate}</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <span className="font-semibold text-primary">{job.salaryRange}</span>
                <DialogTrigger asChild>
                  <Button variant="link" className="p-0 h-auto">
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </DialogTrigger>
              </CardFooter>
            </Card>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle className="font-headline text-2xl">{job.title}</DialogTitle>
                <DialogDescription className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2">
                    <span className="flex items-center gap-2"><Briefcase className="h-4 w-4" /> {job.department}</span>
                    <span className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {job.location}</span>
                    <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> {job.type}</span>
                </DialogDescription>
              </DialogHeader>
              <div className="max-h-[60vh] overflow-y-auto p-1 pr-4 space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Job Description</h3>
                  <p className="text-sm text-muted-foreground">{job.description}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Responsibilities</h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {job.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Requirements</h3>
                   <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {job.requirements.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => handleApply(job.title)}>Apply Now</Button>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
       <div className="text-center">
          <Button variant="outline">Load More Jobs</Button>
      </div>
    </div>
  );
}
