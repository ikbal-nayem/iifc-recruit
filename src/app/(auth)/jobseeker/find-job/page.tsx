
import { JobListings } from '@/components/app/job-listings';

export default function JobseekerFindJobPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Find a Job</h1>
        <p className="text-muted-foreground">
          Search and filter through all available opportunities.
        </p>
      </div>
      <JobListings />
    </div>
  );
}
