import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

export default function JobListingsLoading() {
  return (
    <>
      <section className="w-full py-16 md:py-24 hero-gradient">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <Skeleton className="h-12 w-48 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="space-y-8">
          {/* Search and filters */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Skeleton className="h-10 flex-1 max-w-md" />
              <Skeleton className="h-10 w-40" />
            </div>
            <div className="flex flex-wrap gap-4">
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-10 w-40" />
            </div>
          </div>

          {/* Job cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="glassmorphism">
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <div className="space-y-2 mb-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-28" />
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-2">
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
          </div>
        </div>
      </div>
    </>
  );
}