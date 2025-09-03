// src/app/(public)/jobs/page.tsx
import { JobListings } from '@/components/app/candidate/job-listings';

export default function JobsPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-headline font-bold">Find Your Next Opportunity</h1>
        <p className="text-muted-foreground">
          Browse and apply for open positions that match your skills.
        </p>
      </div>
      <JobListings />
    </div>
  );
}
