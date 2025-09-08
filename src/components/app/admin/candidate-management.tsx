
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
import { MoreHorizontal, FileText, Star, Send, Briefcase, Mail, Phone, MapPin } from 'lucide-react';
import type { Candidate, Application, Job } from '@/lib/types';
import { candidates as initialCandidates, applications as allApplications, jobs as allJobs } from '@/lib/data';
import { CandidateProfileView } from '@/components/app/candidate-profile-view';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

type ApplicationWithJob = Application & { job: Job };

export function CandidateManagement() {
  const [data, setData] = React.useState<Candidate[]>(initialCandidates);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [selectedCandidate, setSelectedCandidate] = React.useState<Candidate | null>(null);
  const [applicationsCandidate, setApplicationsCandidate] = React.useState<Candidate | null>(null);
  const [contactCandidate, setContactCandidate] = React.useState<Candidate | null>(null);


  const getCandidateApplications = (candidateId: string): ApplicationWithJob[] => {
    return allApplications
      .filter(app => app.candidateId === candidateId)
      .map(app => {
        const job = allJobs.find(j => j.id === app.jobId);
        return job ? { ...app, job } : null;
      })
      .filter((a): a is ApplicationWithJob => a !== null);
  }

  const columns: ColumnDef<Candidate>[] = [
    {
      accessorKey: 'personalInfo',
      header: 'Candidate',
      cell: ({ row }) => {
        const { name, email, avatar } = row.original.personalInfo;
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
        const candidate = row.original;
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
              <DropdownMenuItem onClick={() => setSelectedCandidate(candidate)}>
                <FileText className="mr-2 h-4 w-4" /> View Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setApplicationsCandidate(candidate)}>
                <Briefcase className="mr-2 h-4 w-4" /> View Applications
              </DropdownMenuItem>
               <DropdownMenuItem onClick={() => setContactCandidate(candidate)}>
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
  
  const renderMobileCard = (candidate: Candidate) => (
    <Card key={candidate.id} className="mb-4 glassmorphism">
      <div className="p-4 flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={candidate.personalInfo.avatar} alt={candidate.personalInfo.name} data-ai-hint="avatar" />
            <AvatarFallback>{candidate.personalInfo.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{candidate.personalInfo.name}</p>
            <p className="text-sm text-muted-foreground">{candidate.personalInfo.email}</p>
            <div className="flex flex-wrap gap-1 mt-2">
                {candidate.skills.slice(0, 3).map((skill) => (
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
            <DropdownMenuItem onClick={() => setSelectedCandidate(candidate)}>
              <FileText className="mr-2 h-4 w-4" /> View Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setApplicationsCandidate(candidate)}>
              <Briefcase className="mr-2 h-4 w-4" /> View Applications
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setContactCandidate(candidate)}>
              <Send className="mr-2 h-4 w-4" /> Contact Info
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Filter by candidate name..."
          value={(table.getColumn('personalInfo')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('personalInfo')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
         <Button variant="outline">Advanced Filters</Button>
      </div>
      
       {/* Mobile View */}
        <div className="md:hidden">
            {data.length > 0 ? (
                data.map(renderMobileCard)
            ) : (
                <div className="text-center py-16">
                    <p className="text-muted-foreground">No candidates found.</p>
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
       <Dialog open={!!selectedCandidate} onOpenChange={(isOpen) => !isOpen && setSelectedCandidate(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedCandidate && (
             <CandidateProfileView candidate={selectedCandidate} />
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={!!applicationsCandidate} onOpenChange={(isOpen) => !isOpen && setApplicationsCandidate(null)}>
        <DialogContent className="max-w-2xl">
          {applicationsCandidate && (
            <>
              <DialogHeader>
                <DialogTitle>Applications by {applicationsCandidate.personalInfo.name}</DialogTitle>
                <DialogDescription>
                  A list of jobs this candidate has applied for.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-4 max-h-[60vh] overflow-y-auto">
                {getCandidateApplications(applicationsCandidate.id).map(app => (
                    <div key={app.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/50">
                        <div>
                            <Link href={`/admin/jobs/${app.job.id}/applicants`} className="font-semibold hover:underline">{app.job.title}</Link>
                            <p className="text-sm text-muted-foreground">{app.job.department}</p>
                        </div>
                        <Badge variant={app.status === 'Interview' ? 'default' : 'secondary'}>{app.status}</Badge>
                    </div>
                ))}
                {getCandidateApplications(applicationsCandidate.id).length === 0 && (
                    <p className="text-center text-muted-foreground py-8">This candidate has not applied to any jobs yet.</p>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={!!contactCandidate} onOpenChange={(isOpen) => !isOpen && setContactCandidate(null)}>
        <DialogContent className="sm:max-w-md">
          {contactCandidate && (
            <>
                <DialogHeader>
                    <DialogTitle>Contact {contactCandidate.personalInfo.name}</DialogTitle>
                    <DialogDescription>
                        Direct contact information for the candidate.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                     <div className="flex items-center gap-4">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <a href={`mailto:${contactCandidate.personalInfo.email}`} className="text-sm hover:underline">{contactCandidate.personalInfo.email}</a>
                     </div>
                      <div className="flex items-center gap-4">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <a href={`tel:${contactCandidate.personalInfo.phone}`} className="text-sm hover:underline">{contactCandidate.personalInfo.phone}</a>
                     </div>
                      <div className="flex items-start gap-4">
                        <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <p className="text-sm">
                            {contactCandidate.personalInfo.address.line1}, {contactCandidate.personalInfo.address.upazila}, {contactCandidate.personalInfo.address.district}
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
