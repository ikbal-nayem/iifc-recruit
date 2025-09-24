import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminJobseekersLoading() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-10 w-64 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>
      <div className="space-y-4">
        {/* Filter section */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <Skeleton className="h-10 w-80" />
          <Skeleton className="h-10 w-40" />
        </div>
        
        {/* Table skeleton */}
        <Card className="glassmorphism">
          <div className="p-4">
            <div className="space-y-4">
              {/* Table header */}
              <div className="grid grid-cols-5 gap-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-8" />
                ))}
              </div>
              
              {/* Table rows */}
              {[...Array(5)].map((_, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-5 gap-4">
                  {[...Array(5)].map((_, colIndex) => (
                    <Skeleton key={colIndex} className="h-12" />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Card>
        
        {/* Pagination skeleton */}
        <div className="flex justify-end gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </div>
  );
}