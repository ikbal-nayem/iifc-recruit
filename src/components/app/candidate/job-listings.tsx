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
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Briefcase, MapPin, Clock, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Job } from '@/lib/types';
import { jobs as allJobs } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

export function JobListings() {
  const [jobs, setJobs] = React.useState<Job[]>(allJobs.filter(j => j.status === 'Open'));
  const [searchTerm, setSearchTerm] = React.useState('');
  const { toast } = useToast();
  const router = useRouter();

  const handleApply = (jobTitle: string) => {
    // In a real app, you'd check for authentication here.
    // For this prototype, we'll just redirect to login.
    toast({
        title: "Login Required",
        description: `Please log in to apply for the ${jobTitle} position.`,
        variant: "destructive"
    })
    router.push('/');
  }

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by title or department..." 
            className="pl-10" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <Select>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="remote">Remote</SelectItem>
              <SelectItem value="ny">New York, NY</SelectItem>
              <SelectItem value="austin">Austin, TX</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Job Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full-time">Full-time</SelectItem>
              <SelectItem value="part-time">Part-time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="internship">Internship</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredJobs.map((job) => (
          <Dialog key={job.id}>
            <Card className="flex flex-col glassmorphism">
              <CardHeader>
                <CardTitle className="font-headline">{job.title}</CardTitle>
                <CardDescription>{job.salaryRange}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Briefcase className="h-4 w-4" /> <span>{job.department}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" /> <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" /> <span>{job.type}</span>
                </div>
                <p className="text-sm text-foreground/80 pt-2 line-clamp-3">{job.description}</p>
              </CardContent>
              <CardFooter>
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
    </div>
  );
}
