
import * as React from 'react';
import type { Candidate, Application, Job } from '@/lib/types';
import { candidates as allCandidates, applications as allApplications, jobs } from '@/lib/data';
import { notFound } from 'next/navigation';
import { JobApplicantsTable } from '@/components/app/admin/job-applicants-table';

type Applicant = Candidate & { application: Application };

async function getJobApplicants(jobId: string): Promise<{ job: Job, applicants: Applicant[] }> {
  await new Promise(resolve => setTimeout(resolve, 500));
  const job = jobs.find(j => j.id === jobId);

  if (!job) {
    notFound();
  }

  const applicantsForJob = allApplications
    .filter(app => app.jobId === jobId)
    .map(app => {
      const candidate = allCandidates.find(c => c.id === app.candidateId);
      if (!candidate) return null;
      return {
        ...candidate,
        application: app,
      };
    })
    .filter((a): a is Applicant => a !== null);
    
  return { job, applicants: applicantsForJob };
}


export default async function JobApplicantsPage({ params }: { params: { id: string } }) {
  const { job, applicants } = await getJobApplicants(params.id);

  return (
    <div className="space-y-8">
       <div>
        <h1 className="text-3xl font-headline font-bold">Applicants for {job.title}</h1>
        <p className="text-muted-foreground">
          Manage candidates who applied for this position.
        </p>
      </div>
      <JobApplicantsTable applicants={applicants} />
    </div>
  );
}
