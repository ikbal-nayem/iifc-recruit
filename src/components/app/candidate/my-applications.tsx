
'use client';

import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

import type { Application, Job } from '@/lib/types';
import { applications as initialApplications, jobs } from '@/lib/data';

type ApplicationWithJob = Application & { job: Job | undefined };

export function MyApplications() {
  const [data, setData] = React.useState<ApplicationWithJob[]>(() => {
    return initialApplications.map(app => ({
      ...app,
      job: jobs.find(j => j.id === app.jobId)
    })).filter(app => app.job); // Filter out any apps where job wasn't found
  });

  const columns: ColumnDef<ApplicationWithJob>[] = [
    {
      accessorKey: 'job.title',
      header: 'Job Title',
      cell: ({ row }) => {
        const application = row.original;
        return (
          <Link href={`/jobs/${application.jobId}`} className="font-medium text-primary hover:underline">
            {application.job?.title}
          </Link>
        );
      },
    },
    {
      accessorKey: 'job.department',
      header: 'Department',
    },
    {
      accessorKey: 'applicationDate',
      header: 'Date Applied',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        const variant = 
            status === 'Hired' ? 'default' : 
            status === 'Interview' ? 'default' : 
            status === 'Offered' ? 'default' :
            status === 'Rejected' ? 'destructive' :
            'secondary';
        return <Badge variant={variant as any}>{status}</Badge>;
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-4">
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
                  You haven't applied for any jobs yet.
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
    </div>
  );
}
