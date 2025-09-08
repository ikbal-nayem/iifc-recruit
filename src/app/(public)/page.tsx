

import { JobListings } from '@/components/app/job-listings';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function Home() {
  return (
    <>
       <section className="w-full relative overflow-hidden py-20 md:py-32 lg:py-40 bg-background">
        <div className="absolute inset-0 z-0">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="pattern-circles" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
                        <circle id="pattern-circle" cx="20" cy="20" r="1" className="text-primary/10" fill="currentColor"></circle>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#pattern-circles)"></rect>
                 <style>
                    {`
                        @keyframes move {
                            0% { transform: translateY(0); }
                            100% { transform: translateY(-40px); }
                        }
                        #pattern-circles {
                            animation: move 4s linear infinite;
                        }
                    `}
                </style>
            </svg>
        </div>
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
