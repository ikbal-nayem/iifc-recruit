
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
  RowSelectionState,
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
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Jobseeker, Application } from '@/lib/types';
import { JobseekerProfileView } from '../../jobseeker/jobseeker-profile-view';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { ActionItem, ActionMenu } from '@/components/ui/action-menu';
import { getStatusVariant } from '@/lib/utils';

type Applicant = Jobseeker & { application: Application };

interface ApplicantsTableProps {
    applicants: Applicant[];
}

export function ApplicantsTable({ applicants }: ApplicantsTableProps) {
  const { toast } = useToast();
  const [data, setData] = React.useState<Applicant[]>(applicants);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [selectedApplicant, setSelectedApplicant] = React.useState<Jobseeker | null>(null);

  const handleStatusChange = (applicationId: string, applicantName: string, newStatus: Application['status']) => {
    setData(prevData => prevData.map(applicant => 
        applicant.application.id === applicationId 
        ? { ...applicant, application: { ...applicant.application, status: newStatus } }
        : applicant
    ));
    toast({
        title: 'Status Updated',
        description: `${applicantName}'s status has been updated to ${newStatus}.`,
        variant: 'success'
    })
  }

  const getActionItems = (applicant: Applicant): ActionItem[] => [
     {
        label: "View Profile",
        icon: <FileText className="mr-2 h-4 w-4" />,
        onClick: () => setSelectedApplicant(applicant)
    },
  ]


  const columns: ColumnDef<Applicant>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
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
      header: 'Applicant',
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
      id: 'actions',
      cell: ({ row }) => {
        const applicant = row.original;
        return <ActionMenu items={getActionItems(applicant)} />
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
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });
  
  const renderMobileCard = (applicant: Applicant) => (
    <Card key={applicant.id} className="mb-4 glassmorphism">
      <div className="p-4 flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={applicant.personalInfo.avatar} alt={applicant.personalInfo.name} data-ai-hint="avatar" />
            <AvatarFallback>{applicant.personalInfo.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{applicant.personalInfo.name}</p>
            <p className="text-sm text-muted-foreground">Applied: {applicant.application.applicationDate}</p>
          </div>
        </div>
        <ActionMenu items={getActionItems(applicant)} />
      </div>
    </Card>
  );

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Input
          placeholder="Filter by applicant name..."
          value={(table.getColumn('personalInfo')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('personalInfo')?.setFilterValue(event.target.value)
          }
          className="max-w-sm w-full"
        />
      </div>
      
       {/* Mobile View */}
      <div className="md:hidden mt-4">
        {data.length > 0 ? (
           data.map(renderMobileCard)
        ) : (
            <div className="text-center py-16">
                <p className="text-muted-foreground">No applicants found for this post.</p>
            </div>
        )}
      </div>

      <div className="hidden md:block rounded-md border glassmorphism mt-4">
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
                  No applicants found for this post.
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
       <Dialog open={!!selectedApplicant} onOpenChange={(isOpen) => !isOpen && setSelectedApplicant(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedApplicant && (
             <JobseekerProfileView jobseeker={selectedApplicant} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
