
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


import { MoreHorizontal, PlusCircle, Trash, Edit, FileText, Users } from 'lucide-react';
import Link from 'next/link';

import type { Job } from '@/lib/types';
import { jobs as initialJobs } from '@/lib/data';

export function JobManagement() {
  const [data, setData] = React.useState<Job[]>(initialJobs);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [selectedJob, setSelectedJob] = React.useState<Job | null>(null);

  const uniqueDepartments = ['all', ...Array.from(new Set(initialJobs.map(job => job.department)))];
  const uniqueLocations = ['all', ...Array.from(new Set(initialJobs.map(job => job.location)))];
  const uniqueStatuses = ['all', 'Open', 'Closed', 'Archived'];

  const columns: ColumnDef<Job>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => {
        const job = row.original;
        return (
          <Button variant="link" className="p-0 h-auto font-medium text-left" onClick={() => setSelectedJob(job)}>
            {job.title}
          </Button>
        )
      },
    },
    {
      accessorKey: 'department',
      header: 'Department',
    },
    {
      accessorKey: 'location',
      header: 'Location',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        const variant = status === 'Open' ? 'default' : status === 'Closed' ? 'secondary' : 'outline';
        return <Badge variant={variant as any}>{status}</Badge>;
      },
    },
    {
      accessorKey: 'postedDate',
      header: 'Posted Date',
    },
    {
      accessorKey: 'applicationDeadline',
      header: 'Deadline',
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const job = row.original;
        return (
          <AlertDialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => setSelectedJob(job)}>
                    <FileText className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                   <DropdownMenuItem asChild>
                    <Link href={`/admin/jobs/${job.id}/applicants`}>
                        <Users className="mr-2 h-4 w-4" />
                        View Applicants
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/jobs/${job.id}/edit`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <AlertDialogTrigger asChild>
                      <DropdownMenuItem className="text-red-600">
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                      </DropdownMenuItem>
                  </AlertDialogTrigger>
                </DropdownMenuContent>
              </DropdownMenu>
               <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the
                    job posting and all related application data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
          </AlertDialog>
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

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <Input
          placeholder="Filter by job title..."
          value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('title')?.setFilterValue(event.target.value)
          }
          className="max-w-sm w-full"
        />
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
             <Select
                value={(table.getColumn('department')?.getFilterValue() as string) ?? 'all'}
                onValueChange={(value) => table.getColumn('department')?.setFilterValue(value === 'all' ? null : value)}
             >
                <SelectTrigger className="w-full sm:w-auto md:w-[180px]">
                    <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                     {uniqueDepartments.map(dep => <SelectItem key={dep} value={dep}>{dep === 'all' ? 'All Departments' : dep}</SelectItem>)}
                </SelectContent>
             </Select>
            <Select
                 value={(table.getColumn('status')?.getFilterValue() as string) ?? 'all'}
                 onValueChange={(value) => table.getColumn('status')?.setFilterValue(value === 'all' ? null : value)}
            >
                <SelectTrigger className="w-full sm:w-auto md:w-[180px]">
                    <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                    {uniqueStatuses.map(status => <SelectItem key={status} value={status}>{status === 'all' ? 'All Statuses' : status}</SelectItem>)}
                </SelectContent>
            </Select>
             <Button asChild>
                <Link href="/admin/jobs/create">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Job
                </Link>
            </Button>
        </div>
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

       <Dialog open={!!selectedJob} onOpenChange={(isOpen) => !isOpen && setSelectedJob(null)}>
        <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedJob && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedJob.title}</DialogTitle>
                <DialogDescription>
                  {selectedJob.department} &middot; {selectedJob.location}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                 <div>
                    <h3 className="font-semibold text-lg mb-2">Job Description</h3>
                    <p className="text-sm text-muted-foreground">{selectedJob.description}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-lg mb-2">Responsibilities</h3>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        {selectedJob.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold text-lg mb-2">Requirements</h3>
                     <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        {selectedJob.requirements.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                </div>
                <div className="flex items-center gap-4 text-sm pt-4">
                    <Badge variant="secondary">Posted: {selectedJob.postedDate}</Badge>
                    <Badge variant="destructive">Deadline: {selectedJob.applicationDeadline}</Badge>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
