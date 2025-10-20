

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
import { Dialog, DialogContent } from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

import { FileText, Send, Star, UserX } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { JobseekerProfileView } from '@/components/app/jobseeker/jobseeker-profile-view';
import type { Jobseeker } from '@/lib/types';
import { jobseekers as initialJobseekers } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { ActionItem, ActionMenu } from '../../ui/action-menu';
import { getStatusVariant } from '@/lib/utils';

export function JobseekerManagement() {
  const [data, setData] = React.useState<Jobseeker[]>(initialJobseekers);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [selectedJobseeker, setSelectedJobseeker] = React.useState<Jobseeker | null>(null);
  const { toast } = useToast();

  const handleStatusChange = (jobseekerId: string, newStatus: Jobseeker['status']) => {
    setData(prevData => prevData.map(js => 
        js.id === jobseekerId ? { ...js, status: newStatus } : js
    ));
    toast({
        title: 'Status Updated',
        description: `Jobseeker status updated to ${newStatus}.`,
        variant: 'success'
    })
  }

  const getActionItems = (jobseeker: Jobseeker): ActionItem[] => [
    {
        label: "View Full Profile",
        icon: <FileText className="mr-2 h-4 w-4" />,
        onClick: () => setSelectedJobseeker(jobseeker)
    },
    {
        label: "Contact",
        icon: <Send className="mr-2 h-4 w-4" />,
        onClick: () => toast({ description: `Contacting ${jobseeker.personalInfo.name}... (not implemented)`})
    },
    { isSeparator: true },
    {
        label: "Mark as Active",
        icon: <Star className="mr-2 h-4 w-4" />,
        onClick: () => handleStatusChange(jobseeker.id, 'Active')
    },
    {
        label: "Mark as Passive",
        icon: <UserX className="mr-2 h-4 w-4" />,
        onClick: () => handleStatusChange(jobseeker.id, 'Passive')
    }
  ];

  const columns: ColumnDef<Jobseeker>[] = [
    {
      accessorKey: 'personalInfo',
      header: 'Name',
      cell: ({ row }) => {
        const jobseeker = row.original;
        const { name, email, avatar } = jobseeker.personalInfo;
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
        return <div className="flex flex-wrap gap-1">{skills.slice(0,3).map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)}</div>;
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
       cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return <Badge variant={getStatusVariant(status)}>{status}</Badge>;
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const jobseeker = row.original;
        return <ActionMenu label='Actions' items={getActionItems(jobseeker)} />
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

  const renderMobileCard = (jobseeker: Jobseeker) => (
    <Card key={jobseeker.id} className="mb-4 glassmorphism">
      <div className="p-4 flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={jobseeker.personalInfo.avatar} alt={jobseeker.personalInfo.name} data-ai-hint="avatar" />
            <AvatarFallback>{jobseeker.personalInfo.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{jobseeker.personalInfo.name}</p>
            <div className="flex flex-wrap gap-1 mt-2">
                {jobseeker.skills.slice(0, 2).map(skill => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
            </div>
          </div>
        </div>
        <ActionMenu items={getActionItems(jobseeker)} />
      </div>
    </Card>
  );
  

  return (
    <div className="space-y-4">
      <Input
        placeholder="Filter by name, email, or skill..."
        value={(table.getColumn('personalInfo')?.getFilterValue() as string) ?? ''}
        onChange={(event) =>
          table.getColumn('personalInfo')?.setFilterValue(event.target.value)
        }
        className="max-w-sm"
      />
       {/* Mobile View */}
      <div className="md:hidden">
        {data.length > 0 ? (
           data.map(renderMobileCard)
        ) : (
            <div className="text-center py-16">
                <p className="text-muted-foreground">No jobseekers found.</p>
            </div>
        )}
      </div>
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
             <JobseekerProfileView jobseeker={selectedJobseeker} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
