import { JobListings } from '@/components/app/candidate/job-listings';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
       <div className="space-y-8 max-w-7xl mx-auto">
        <div>
          <h1 className="text-3xl font-headline font-bold">Find Your Next Opportunity</h1>
          <p className="text-muted-foreground">
            Browse and apply for open positions that match your skills.
          </p>
        </div>
        <JobListings />
      </div>
    </main>
  );
}
