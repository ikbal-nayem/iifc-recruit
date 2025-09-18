
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Combobox, ComboboxEmpty, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxList } from '@/components/ui/combobox';

import { MapPin, Clock, ArrowRight, Building, Search, List, LayoutGrid, Calendar, ChevronsUpDown, Check } from 'lucide-react';
import Link from 'next/link';
import type { Job } from '@/lib/types';
import { jobs as allJobs } from '@/lib/data';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';


interface JobListingsProps {
  isPaginated?: boolean;
  showFilters?: boolean;
  itemLimit?: number;
}

export function JobListings({ isPaginated = true, showFilters = true, itemLimit }: JobListingsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [jobs, setJobs] = React.useState<Job[]>(allJobs.filter(j => j.status === 'Open'));
  const [filteredJobs, setFilteredJobs] = React.useState<Job[]>(jobs);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [view, setView] = React.useState<'grid' | 'list'>('grid');

  const [filters, setFilters] = React.useState({
    keyword: searchParams.get('keyword') || '',
    location: searchParams.get('location') || 'all',
    department: searchParams.get('department') || 'all',
    type: searchParams.get('type') || 'all',
  });
  
  const [departmentPopoverOpen, setDepartmentPopoverOpen] = React.useState(false);


  const jobsPerPage = 9;

  const uniqueLocations = ['all', ...Array.from(new Set(allJobs.map(job => job.location)))];
  const uniqueDepartments = ['all', ...Array.from(new Set(allJobs.map(job => job.department)))];
  
  const isJobseekerRoute = pathname.startsWith('/jobseeker');

  React.useEffect(() => {
    let results = jobs;
    const currentParams = new URLSearchParams(searchParams.toString());

    if (filters.keyword) {
      results = results.filter(job => 
        job.title.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        job.description.toLowerCase().includes(filters.keyword.toLowerCase())
      );
      currentParams.set('keyword', filters.keyword);
    } else {
        currentParams.delete('keyword');
    }

    if (filters.location !== 'all') {
      results = results.filter(job => job.location === filters.location);
       currentParams.set('location', filters.location);
    } else {
        currentParams.delete('location');
    }
    
    if (filters.department !== 'all') {
      results = results.filter(job => job.department === filters.department);
      currentParams.set('department', filters.department);
    } else {
      currentParams.delete('department');
    }

    if (filters.type !== 'all') {
      results = results.filter(job => job.type === filters.type);
      currentParams.set('type', filters.type);
    } else {
      currentParams.delete('type');
    }

    const newUrl = `${pathname}?${currentParams.toString()}`;
    // We use replace to avoid adding to browser history for every filter change
    if (typeof window !== 'undefined' && window.location.search !== `?${currentParams.toString()}`) {
      router.replace(newUrl, { scroll: false });
    }

    setFilteredJobs(results);
    setCurrentPage(1);
  }, [filters, jobs, pathname, router, searchParams]);


  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const paginatedJobs = isPaginated 
    ? filteredJobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage)
    : filteredJobs.slice(0, itemLimit);

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: 'easeOut',
      },
    }),
  };


  const JobCard = ({ job, view, index }: { job: Job, view: 'grid' | 'list', index: number}) => {
    const queryParams = new URLSearchParams();
    if (filters.keyword) queryParams.set('keyword', filters.keyword);
    if (filters.location !== 'all') queryParams.set('location', filters.location);
    if (filters.department !== 'all') queryParams.set('department', filters.department);
    if (filters.type !== 'all') queryParams.set('type', filters.type);

    const jobUrl = `${isJobseekerRoute ? '/jobseeker' : ''}/jobs/${job.id}?${queryParams.toString()}`;
    
    if (view === 'list') {
        return (
          <motion.div
            custom={index}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            <Card key={job.id} className="w-full group glassmorphism card-hover">
                <div className="flex flex-col sm:flex-row items-start justify-between p-6 gap-4">
                    <div className="flex-grow">
                        <CardTitle className="font-headline text-xl group-hover:text-primary transition-colors">
                        <Link href={jobUrl} className="stretched-link">
                            {job.title}
                        </Link>
                        </CardTitle>
                        <CardDescription className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-2 text-sm">
                        <span className="flex items-center gap-2"><Building className="h-4 w-4" /> {job.department}</span>
                        <span className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {job.location}</span>
                        </CardDescription>
                         <p className="text-sm text-foreground/80 line-clamp-3 mt-3">{job.description}</p>
                    </div>
                    <div className="flex flex-col sm:items-end sm:text-right gap-2 shrink-0 pt-2 sm:pt-0">
                        <Badge variant={job.type === 'Full-time' ? 'default' : 'secondary'} className="whitespace-nowrap">{job.type}</Badge>
                        <span className="font-semibold text-primary">{job.salaryRange}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1.5"><Clock className="h-3 w-3" /> Posted {formatDistanceToNow(new Date(job.postedDate), { addSuffix: true })}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1.5"><Calendar className="h-3 w-3" /> Deadline: {job.applicationDeadline}</span>
                    </div>
                </div>
            </Card>
           </motion.div>
        );
    }
    return (
       <motion.div
            custom={index}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="h-full"
        >
            <Link href={jobUrl} className="block h-full">
                <Card key={job.id} className="flex flex-col h-full group glassmorphism card-hover">
                    <CardHeader className="flex-grow">
                        <div className="flex justify-between items-start">
                            <CardTitle className="font-headline text-xl group-hover:text-primary transition-colors">
                                {job.title}
                            </CardTitle>
                            <Badge variant={job.type === 'Full-time' ? 'default' : 'secondary'} className="whitespace-nowrap">{job.type}</Badge>
                        </div>
                    <CardDescription className="flex items-center gap-2 pt-2">
                        <Building className="h-4 w-4" /> {job.department}
                    </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{job.description}</p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {job.location}</span>
                            <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> {formatDistanceToNow(new Date(job.postedDate), { addSuffix: true })}</span>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center mt-auto">
                        <span className="font-semibold text-primary">{job.salaryRange}</span>
                        <div className="flex items-center text-primary font-medium text-sm">
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                    </CardFooter>
                </Card>
            </Link>
        </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {showFilters && (
        <div className="p-4 rounded-lg bg-card/60 backdrop-blur-xl border border-border/20 shadow-sm space-y-4">
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
              <Popover open={departmentPopoverOpen} onOpenChange={setDepartmentPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={departmentPopoverOpen}
                    className="w-full justify-between h-11"
                  >
                    {filters.department === 'all' ? 'All Departments' : filters.department}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <Combobox>
                    <ComboboxInput placeholder="Search department..." />
                    <ComboboxList>
                      <ComboboxEmpty>No department found.</ComboboxEmpty>
                      <ComboboxGroup>
                        {uniqueDepartments.map((dep) => (
                          <ComboboxItem
                            key={dep}
                            value={dep}
                            onSelect={(currentValue) => {
                              handleFilterChange('department', currentValue === filters.department ? 'all' : currentValue);
                              setDepartmentPopoverOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                filters.department === dep ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {dep === 'all' ? 'All Departments' : dep}
                          </ComboboxItem>
                        ))}
                      </ComboboxGroup>
                    </ComboboxList>
                  </Combobox>
                </PopoverContent>
              </Popover>
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
          <div className="flex items-center justify-between border-t pt-4">
             <p className="text-sm text-muted-foreground">{filteredJobs.length} jobs found</p>
             <div className="flex items-center gap-2">
                 <Button variant={view === 'grid' ? 'default' : 'ghost'} size="icon" onClick={() => setView('grid')}>
                    <LayoutGrid className="h-5 w-5" />
                 </Button>
                 <Button variant={view === 'list' ? 'default' : 'ghost'} size="icon" onClick={() => setView('list')}>
                    <List className="h-5 w-5" />
                 </Button>
             </div>
          </div>
        </div>
      )}

      {paginatedJobs.length > 0 ? (
        <div className={cn("gap-6", view === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3' : 'flex flex-col')}>
          {paginatedJobs.map((job, index) => (
             <JobCard key={job.id} job={job} view={view} index={index} />
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
