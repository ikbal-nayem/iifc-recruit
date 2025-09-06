'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Clock, ArrowRight, Building, Search } from 'lucide-react';
import Link from 'next/link';
import type { Job } from '@/lib/types';
import { jobs as allJobs } from '@/lib/data';

interface JobListingsProps {
  isPaginated?: boolean;
  showFilters?: boolean;
  itemLimit?: number;
}

export function JobListings({ isPaginated = true, showFilters = true, itemLimit }: JobListingsProps) {
  const [jobs, setJobs] = React.useState<Job[]>(allJobs.filter(j => j.status === 'Open'));
  const [filteredJobs, setFilteredJobs] = React.useState<Job[]>(jobs);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [filters, setFilters] = React.useState({
    keyword: '',
    location: 'all',
    department: 'all',
    type: 'all',
  });

  const jobsPerPage = 9;

  const uniqueLocations = ['all', ...Array.from(new Set(allJobs.map(job => job.location)))];
  const uniqueDepartments = ['all', ...Array.from(new Set(allJobs.map(job => job.department)))];

  React.useEffect(() => {
    let results = jobs;

    if (filters.keyword) {
      results = results.filter(job => 
        job.title.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        job.description.toLowerCase().includes(filters.keyword.toLowerCase())
      );
    }

    if (filters.location !== 'all') {
      results = results.filter(job => job.location === filters.location);
    }
    
    if (filters.department !== 'all') {
      results = results.filter(job => job.department === filters.department);
    }

    if (filters.type !== 'all') {
      results = results.filter(job => job.type === filters.type);
    }

    setFilteredJobs(results);
    setCurrentPage(1);
  }, [filters, jobs]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const paginatedJobs = isPaginated 
    ? filteredJobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage)
    : filteredJobs.slice(0, itemLimit);

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  return (
    <div className="space-y-8">
      {showFilters && (
        <div className="p-4 rounded-lg bg-card/60 backdrop-blur-xl border border-border/20 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Keyword or Title" 
                  className="pl-10 h-11"
                  value={filters.keyword}
                  onChange={(e) => handleFilterChange('keyword', e.target.value)}
                />
              </div>
              <Select value={filters.location} onValueChange={(value) => handleFilterChange('location', value)}>
                <SelectTrigger className="h-11"><SelectValue placeholder="All Locations" /></SelectTrigger>
                <SelectContent>
                    {uniqueLocations.map(loc => <SelectItem key={loc} value={loc}>{loc === 'all' ? 'All Locations' : loc}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filters.department} onValueChange={(value) => handleFilterChange('department', value)}>
                <SelectTrigger className="h-11"><SelectValue placeholder="All Departments" /></SelectTrigger>
                <SelectContent>
                    {uniqueDepartments.map(dep => <SelectItem key={dep} value={dep}>{dep === 'all' ? 'All Departments' : dep}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
                <SelectTrigger className="h-11"><SelectValue placeholder="All Types" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                </SelectContent>
              </Select>
          </div>
        </div>
      )}

      {paginatedJobs.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {paginatedJobs.map((job) => (
              <Card key={job.id} className="flex flex-col group glassmorphism hover:border-primary transition-all">
                <CardHeader>
                  <div className="flex justify-between items-start">
                      <div>
                          <CardTitle className="font-headline text-xl group-hover:text-primary transition-colors">
                            <Link href={`/jobs/${job.id}`} className="stretched-link">
                              {job.title}
                            </Link>
                          </CardTitle>
                          <CardDescription className="flex items-center gap-2 pt-2">
                              <Building className="h-4 w-4" /> {job.department}
                          </CardDescription>
                      </div>
                      <Badge variant={job.type === 'Full-time' ? 'default' : 'secondary'}>{job.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                  <p className="text-sm text-foreground/80 line-clamp-2">{job.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {job.location}</span>
                      <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> Posted {job.postedDate}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <span className="font-semibold text-primary">{job.salaryRange}</span>
                  <Button variant="link" asChild className="p-0 h-auto">
                      <Link href={`/jobs/${job.id}`}>
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                  </Button>
                </CardFooter>
              </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No jobs found matching your criteria.</p>
        </div>
      )}

      {isPaginated && filteredJobs.length > jobsPerPage && (
        <div className="flex justify-center items-center space-x-2">
          <Button 
            variant="outline"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</span>
          <Button 
            variant="outline"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
