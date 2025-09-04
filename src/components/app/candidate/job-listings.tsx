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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, ArrowRight, Building } from 'lucide-react';
import Link from 'next/link';
import type { Job } from '@/lib/types';
import { jobs as allJobs } from '@/lib/data';

export function JobListings() {
  const [jobs, setJobs] = React.useState<Job[]>(allJobs.filter(j => j.status === 'Open'));

  return (
    <div className="space-y-8">
        <div className="text-center">
            <h2 className="text-3xl font-headline font-bold">Recent Job Openings</h2>
            <p className="text-muted-foreground mt-2">Explore the latest opportunities from top companies.</p>
        </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
            <Card key={job.id} className="flex flex-col group hover:border-primary transition-all">
              <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="font-headline text-xl group-hover:text-primary transition-colors">
                          <Link href={`/jobs/${job.id}`} className="stretched-link">
                            {job.title}
                          </Link>
                        </CardTitle>
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
                <Button variant="link" asChild className="p-0 h-auto">
                    <Link href={`/jobs/${job.id}`}>
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
              </CardFooter>
            </Card>
        ))}
      </div>
       <div className="text-center">
          <Button variant="outline">Load More Jobs</Button>
      </div>
    </div>
  );
}
