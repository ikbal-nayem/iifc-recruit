
import { CreateJobForm } from '@/components/app/admin/create-job-form';

export default function CreateJobPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Create New Job</h1>
        <p className="text-muted-foreground">
          Fill in the details below to post a new job opening.
        </p>
      </div>
      <CreateJobForm />
    </div>
  );
}
