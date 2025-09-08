

import { JobListings } from '@/components/app/job-listings';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function Home() {
  return (
    <>
       <section className="w-full py-20 md:py-32 lg:py-40 hero-gradient">
        <div className="container relative z-10 mx-auto px-4 md:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold mb-4">
              Find Your Next Career Move
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Search through thousands of open positions in your field. Your dream job is waiting.
            </p>
          </div>
          <div className="max-w-2xl mx-auto mt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-2 rounded-lg bg-background shadow-lg border">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Job title or keywords"
                  className="w-full h-12 pl-12 text-base border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
               <Button size="lg" className="w-full h-12 text-base font-bold" asChild>
                 <Link href="/jobs">
                    <Search className="mr-2 h-5 w-5" />
                    Find Jobs
                 </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 py-16">
        <JobListings isPaginated={false} showFilters={false} itemLimit={6} />
         <div className="text-center mt-8">
          <Button variant="outline" asChild>
            <Link href="/jobs">Load More Jobs</Link>
          </Button>
      </div>
      </div>
    </>
  );
}
