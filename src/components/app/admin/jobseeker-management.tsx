

'use client';

import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreHorizontal, FileText, Star, Send, Briefcase, Mail, Phone, MapPin, Filter } from 'lucide-react';
import type { Candidate, Application, Job } from '@/lib/types';
import { candidates as initialCandidates, applications as allApplications, jobs as allJobs } from '@/lib/data';
import { JobseekerProfileView } from '@/components/app/jobseeker-profile-view';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type ApplicationWithJob = Application & { job: Job };

export function JobseekerManagement() {
  const [data, setData] = React.useState<Candidate[]>(initialCandidates);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [selectedJobseeker, setSelectedJobseeker] = React.useState<Candidate | null>(null);
  const [applicationsJobseeker, setApplicationsJobseeker] = React.useState<Candidate | null>(null);
  const [contactJobseeker, setContactJobseeker] = React.useState<Candidate | null>(null);

  const uniqueLocations = ['all', ...Array.from(new Set(initialCandidates.map(c => c.personalInfo.address?.district).filter(Boolean)))];
  const uniqueStatuses = ['all', 'Active', 'Passive', 'Hired'];

  const getJobseekerApplications = (jobseekerId: string): ApplicationWithJob[] => {
    return allApplications
      .filter(app => app.candidateId === jobseekerId)
      .map(app => {
        const job = allJobs.find(j => j.id === app.jobId);
        return job ? { ...app, job } : null;
      })
      .filter((a): a is ApplicationWithJob => a !== null);
  }
  
  const getFullName = (personalInfo: Candidate['personalInfo']) => {
    return [personalInfo.firstName, personalInfo.middleName, personalInfo.lastName].filter(Boolean).join(' ');
  }

  const columns: ColumnDef<Candidate>[] = [
    {
      accessorKey: 'personalInfo',
      header: 'Jobseeker',
      cell: ({ row }) => {
        const { email, avatar } = row.original.personalInfo;
        const name = getFullName(row.original.personalInfo);
        return (
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={avatar} alt={name} data-ai-hint="avatar" />
              <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{name}</div>
              <div className="text-sm text-muted-foreground">{email}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'skills',
      header: 'Top Skills',
      cell: ({ row }) => {
        const skills = row.getValue('skills') as string[];
        return (
          <div className="flex flex-wrap gap-1">
            {skills.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="secondary">{skill}</Badge>
            ))}
          </div>
        );
      },
    },
     {
      accessorKey: 'personalInfo.address.district',
      header: 'Location',
       cell: ({ row }) => {
        return row.original.personalInfo.address?.district || 'N/A';
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
       cell: ({ row }) => {
        const status = row.getValue('status') as string;
        const variant = status === 'Active' ? 'default' : status === 'Hired' ? 'outline' : 'secondary';
        return <Badge variant={variant as any}>{status}</Badge>;
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const jobseeker = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setSelectedJobseeker(jobseeker)}>
                <FileText className="mr-2 h-4 w-4" /> View Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setApplicationsJobseeker(jobseeker)}>
                <Briefcase className="mr-2 h-4 w-4" /> View Applications
              </DropdownMenuItem>
               <DropdownMenuItem onClick={() => setContactJobseeker(jobseeker)}>
                <Send className="mr-2 h-4 w-4" /> Contact Info
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });
  
  const renderMobileCard = (jobseeker: Candidate) => (
    <Card key={jobseeker.id} className="mb-4 glassmorphism">
      <div className="p-4 flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={jobseeker.personalInfo.avatar} alt={getFullName(jobseeker.personalInfo)} data-ai-hint="avatar" />
            <AvatarFallback>{jobseeker.personalInfo.firstName?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{getFullName(jobseeker.personalInfo)}</p>
            <p className="text-sm text-muted-foreground">{jobseeker.personalInfo.email}</p>
            <div className="flex flex-wrap gap-1 mt-2">
                {jobseeker.skills.slice(0, 3).map((skill) => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSelectedJobseeker(jobseeker)}>
              <FileText className="mr-2 h-4 w-4" /> View Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setApplicationsJobseeker(jobseeker)}>
              <Briefcase className="mr-2 h-4 w-4" /> View Applications
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setContactJobseeker(jobseeker)}>
              <Send className="mr-2 h-4 w-4" /> Contact Info
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );

  return (
    <div className="space-y-4">
      <Collapsible className="space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <Input
            placeholder="Filter by name or email..."
            value={(table.getColumn('personalInfo')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('personalInfo')?.setFilterValue(event.target.value)
            }
            className="max-w-sm w-full"
          />
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              Advanced Filters
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="p-4 rounded-lg bg-card/60 backdrop-blur-xl border border-border/20 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Filter by skills..."
              value={(table.getColumn('skills')?.getFilterValue() as string) ?? ''}
              onChange={(event) =>
                table.getColumn('skills')?.setFilterValue(event.target.value)
              }
            />
             <Select
              value={(table.getColumn('personalInfo_address_district')?.getFilterValue() as string) ?? 'all'}
              onValueChange={(value) =>
                table.getColumn('personalInfo_address_district')?.setFilterValue(value === 'all' ? null : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by location" />
              </SelectTrigger>
              <SelectContent>
                {uniqueLocations.map(loc => <SelectItem key={loc} value={loc}>{loc === 'all' ? 'All Locations' : loc}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select
              value={(table.getColumn('status')?.getFilterValue() as string) ?? 'all'}
              onValueChange={(value) =>
                table.getColumn('status')?.setFilterValue(value === 'all' ? null : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {uniqueStatuses.map(status => <SelectItem key={status} value={status}>{status === 'all' ? 'All Statuses' : status}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CollapsibleContent>
      </Collapsible>
      
       {/* Mobile View */}
        <div className="md:hidden">
            {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map(row => renderMobileCard(row.original))
            ) : (
                <div className="text-center py-16">
                    <p className="text-muted-foreground">No jobseekers found.</p>
                </div>
            )}
        </div>

      {/* Desktop View */}
      <div className="hidden md:block rounded-md border glassmorphism">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
       <Dialog open={!!selectedJobseeker} onOpenChange={(isOpen) => !isOpen && setSelectedJobseeker(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedJobseeker && (
             <JobseekerProfileView candidate={selectedJobseeker} />
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={!!applicationsJobseeker} onOpenChange={(isOpen) => !isOpen && setApplicationsJobseeker(null)}>
        <DialogContent className="max-w-2xl">
          {applicationsJobseeker && (
            <>
              <DialogHeader>
                <DialogTitle>Applications by {getFullName(applicationsJobseeker.personalInfo)}</DialogTitle>
                <DialogDescription>
                  A list of jobs this jobseeker has applied for.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-4 max-h-[60vh] overflow-y-auto">
                {getJobseekerApplications(applicationsJobseeker.id).map(app => (
                    <div key={app.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/50">
                        <div>
                            <Link href={`/admin/job-management/${app.job.id}/applicants`} className="font-semibold hover:underline">{app.job.title}</Link>
                            <p className="text-sm text-muted-foreground">{app.job.department}</p>
                        </div>
                        <Badge variant={app.status === 'Interview' ? 'default' : 'secondary'}>{app.status}</Badge>
                    </div>
                ))}
                {getJobseekerApplications(applicationsJobseeker.id).length === 0 && (
                    <p className="text-center text-muted-foreground py-8">This jobseeker has not applied to any jobs yet.</p>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={!!contactJobseeker} onOpenChange={(isOpen) => !isOpen && setContactJobseeker(null)}>
        <DialogContent className="sm:max-w-md">
          {contactJobseeker && (
            <>
                <DialogHeader>
                    <DialogTitle>Contact {getFullName(contactJobseeker.personalInfo)}</DialogTitle>
                    <DialogDescription>
                        Direct contact information for the jobseeker.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                     <div className="flex items-center gap-4">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <a href={`mailto:${contactJobseeker.personalInfo.email}`} className="text-sm hover:underline">{contactJobseeker.personalInfo.email}</a>
                     </div>
                      <div className="flex items-center gap-4">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <a href={`tel:${contactJobseeker.personalInfo.phone}`} className="text-sm hover:underline">{contactJobseeker.personalInfo.phone}</a>
                     </div>
                      <div className="flex items-start gap-4">
                        <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <p className="text-sm">
                            {contactJobseeker.personalInfo.address.line1}, {contactJobseeker.personalInfo.address.upazila}, {contactJobseeker.personalInfo.address.district}
                        </p>
                     </div>
                </div>
            </>
          )}
        </DialogContent>
       </Dialog>
    </div>
  );
}
