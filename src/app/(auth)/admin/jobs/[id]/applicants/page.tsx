
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
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreHorizontal, FileText, UserCheck, UserX, Star } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import type { Candidate, Application, Job } from '@/lib/types';
import { candidates as allCandidates, applications as allApplications, jobs } from '@/lib/data';
import { CandidateProfileView } from '@/components/app/candidate-profile-view';
import { notFound, useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

type Applicant = Candidate & { application: Application };

export default function JobApplicantsPage() {
  const params = useParams();
  const { toast } = useToast();
  const jobId = params.id as string;
  
  const job = jobs.find(j => j.id === jobId);

  const applicantsForJob = React.useMemo(() => {
    const appIds = allApplications.filter(app => app.jobId === jobId).map(app => app.candidateId);
    return allCandidates
      .filter(candidate => appIds.includes(candidate.id))
      .map(candidate => ({
        ...candidate,
        application: allApplications.find(app => app.jobId === jobId && app.candidateId === candidate.id)!,
      }));
  }, [jobId]);

  const [data, setData] = React.useState<Applicant[]>(applicantsForJob);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [selectedCandidate, setSelectedCandidate] = React.useState<Candidate | null>(null);

  const handleStatusChange = (applicationId: string, candidateName: string, newStatus: Application['status']) => {
    setData(prevData => prevData.map(applicant => 
        applicant.application.id === applicationId 
        ? { ...applicant, application: { ...applicant.application, status: newStatus } }
        : applicant
    ));
    toast({
        title: 'Status Updated',
        description: `${candidateName}'s status has been updated to ${newStatus}.`,
        variant: 'success'
    })
  }

  const columns: ColumnDef<Applicant>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
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
       accessorKey: 'application.applicationDate',
       header: 'Date Applied'
    },
    {
      accessorKey: 'application.status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.application.status;
        const variant = 
            status === 'Hired' ? 'default' : 
            status === 'Interview' ? 'default' : 
            status === 'Offered' ? 'default' :
            status === 'Shortlisted' ? 'default' :
            status === 'Rejected' ? 'destructive' :
            'secondary';
        return <Badge variant={variant as any}>{status}</Badge>;
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const applicant = row.original;
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
              <DropdownMenuItem onClick={() => setSelectedCandidate(applicant)}>
                <FileText className="mr-2 h-4 w-4" /> View Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleStatusChange(applicant.application.id, applicant.personalInfo.name, 'Shortlisted')}>
                <UserCheck className="mr-2 h-4 w-4" /> Shortlist
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange(applicant.application.id, applicant.personalInfo.name, 'Interview')}>
                <Star className="mr-2 h-4 w-4" /> Schedule Interview
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-500" onClick={() => handleStatusChange(applicant.application.id, applicant.personalInfo.name, 'Rejected')}>
                <UserX className="mr-2 h-4 w-4" /> Reject
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
  
  if (!job) {
    return notFound();
  }

  return (
    <div className="space-y-8">
       <div>
        <h1 className="text-3xl font-headline font-bold">Applicants for {job.title}</h1>
        <p className="text-muted-foreground">
          Manage candidates who applied for this position.
        </p>
      </div>
      <div className="rounded-md border glassmorphism">
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
                  No applicants for this job yet.
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
    </div>
  );
}
