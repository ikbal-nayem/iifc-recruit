
'use client';
import { EditJobForm } from '@/components/app/admin/edit-job-form';
import { jobs } from '@/lib/data';
import { notFound } from 'next/navigation';


export default function EditJobPage({ params }: { params: { id: string } }) {
  const job = jobs.find((j) => j.id === params.id);

  if (!job) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Edit Job</h1>
        <p className="text-muted-foreground">
          Modify the details below to update the job posting.
        </p>
      </div>
      <EditJobForm job={job} />
    </div>
  );
}
