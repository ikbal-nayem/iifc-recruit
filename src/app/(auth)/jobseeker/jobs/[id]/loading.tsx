import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

export default function JobseekerJobDetailsLoading() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className="mb-6">
        <Button variant="outline" disabled>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Listings
        </Button>
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        <div className='lg:col-span-3'>
          <Card className='glassmorphism'>
            <CardHeader>
              <div className='flex justify-between items-start gap-4'>
                <div className='flex-1'>
                  <Skeleton className="h-8 w-3/4 mb-3" />
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-28" />
                  </div>
                  <Skeleton className="h-5 w-1/2" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Skeleton className="h-6 w-32 mb-3" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
              <div>
                <Skeleton className="h-6 w-40 mb-3" />
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-4 w-full" />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}