import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function ApplicationsLoading() {
  return (
    <div className='space-y-8'>
      <div>
        <h1 className='text-3xl font-headline font-bold'>My Applications</h1>
        <p className='text-muted-foreground'>
          Track the status of all your job applications.
        </p>
      </div>
      <div className="space-y-4">
        {/* Filter and search section */}
        <div className="flex flex-wrap gap-4">
          <Skeleton className="h-10 w-full md:w-64" /> {/* Search input */}
          <Skeleton className="h-10 w-32" /> {/* Filter button */}
        </div>

        {/* Applications list */}
        {[1, 2, 3].map((index) => (
          <Card key={index} className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Job info */}
              <div className="flex-1 space-y-3">
                <Skeleton className="h-6 w-3/4" /> {/* Job title */}
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-5 w-24" /> {/* Company */}
                  <Skeleton className="h-5 w-20" /> {/* Location */}
                  <Skeleton className="h-5 w-28" /> {/* Job type */}
                </div>
                <div className="flex gap-4">
                  <Skeleton className="h-5 w-32" /> {/* Applied date */}
                  <Skeleton className="h-5 w-24" /> {/* Status */}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-24" /> {/* View button */}
                <Skeleton className="h-9 w-24" /> {/* Withdraw button */}
              </div>
            </div>
          </Card>
        ))}

        {/* Pagination */}
        <div className="flex justify-end gap-2 mt-4">
          <Skeleton className="h-9 w-24" /> {/* Previous button */}
          <Skeleton className="h-9 w-24" /> {/* Next button */}
        </div>
      </div>
    </div>
  );
}