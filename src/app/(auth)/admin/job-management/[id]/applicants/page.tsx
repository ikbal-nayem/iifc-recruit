

'use client';
import * as React from 'react';
import type { Jobseeker, Application, Job } from '@/lib/types';
import { jobseekers as allJobseekers, applications as allApplications, jobs } from '@/lib/data';
import { notFound } from 'next/navigation';
import { JobApplicantsTable } from '@/components/app/admin/job-applicants-table';
import { Badge } from '@/components/ui/badge';
import { Calendar, Building2 } from 'lucide-react';

type Applicant = Jobseeker & { application: Application };

async function getJobApplicants(jobId: string): Promise<{ job: Job, applicants: Applicant[] }> {
  const job = jobs.find(j => j.id === jobId);

  if (!job) {
    notFound();
  }

  const applicantsForJob = allApplications
    .filter(app => app.jobId === jobId)
    .map(app => {
      const jobseeker = allJobseekers.find(c => c.id === app.jobseekerId);
      if (!jobseeker) return null;
      return {
        ...jobseeker,
        application: app,
      };
    })
    .filter((a): a is Applicant => a !== null);
    
  return { job, applicants: applicantsForJob };
}


export default async function JobApplicantsPage({ params }: { params: { id: string } }) {
  const { job, applicants } = await getJobApplicants(params?.id);

  return (
    <div className="space-y-8">
       <div>
        <h1 className="text-3xl font-headline font-bold">Applicants for {job.title}</h1>
         <div className='flex flex-wrap items-center gap-x-4 gap-y-2 pt-2 text-muted-foreground'>
            <span className='flex items-center gap-2'>
                <Building2 className='h-4 w-4' /> {job.department}
            </span>
            <Badge variant='secondary'>Posted: {job.postedDate}</Badge>
            <Badge variant='danger'>Deadline: {job.applicationDeadline}</Badge>
        </div>
      </div>
      <JobApplicantsTable applicants={applicants} />
    </div>
  );
}
