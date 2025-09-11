
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
  DialogFooter,
} from '@/components/ui/dialog';
import {
  RadioGroup,
  RadioGroupItem
} from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreHorizontal, FileText, UserCheck, UserX, Star, Send, Bell } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Candidate, Application } from '@/lib/types';
import { JobseekerProfileView } from '@/components/app/jobseeker-profile-view';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

type Applicant = Candidate & { application: Application };

interface JobApplicantsTableProps {
    applicants: Applicant[];
}

export function JobApplicantsTable({ applicants }: JobApplicantsTableProps) {
  const { toast } = useToast();
  const [data, setData] = React.useState<Applicant[]>(applicants);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [selectedApplicant, setSelectedApplicant] = React.useState<Candidate | null>(null);
  const [isNotifyDialogOpen, setIsNotifyDialogOpen] = React.useState(false);
  const [notificationChannel, setNotificationChannel] = React.useState<'email' | 'sms'>('email');

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
              <DropdownMenuItem onClick={() => setSelectedApplicant(applicant)}>
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
            <Badge variant={
                applicant.application.status === 'Hired' ? 'default' : 
                applicant.application.status === 'Interview' ? 'default' : 
                applicant.application.status === 'Offered' ? 'default' :
                applicant.application.status === 'Shortlisted' ? 'default' :
                applicant.application.status === 'Rejected' ? 'destructive' :
                'secondary'} className="mt-2">{applicant.application.status}</Badge>
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
              <DropdownMenuItem onClick={() => setSelectedApplicant(applicant)}>
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
      </div>
    </Card>
  );

  const selectedRowCount = Object.keys(rowSelection).length;

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
        <Select
          value={(table.getColumn('application_status')?.getFilterValue() as string) ?? 'all'}
          onValueChange={(value) =>
            table.getColumn('application_status')?.setFilterValue(value === 'all' ? null : value)
          }
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Applied">Applied</SelectItem>
            <SelectItem value="Screening">Screening</SelectItem>
            <SelectItem value="Shortlisted">Shortlisted</SelectItem>
            <SelectItem value="Interview">Interview</SelectItem>
            <SelectItem value="Offered">Offered</SelectItem>
            <SelectItem value="Hired">Hired</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        {selectedRowCount > 0 && (
            <Button onClick={() => setIsNotifyDialogOpen(true)}>
                <Bell className="mr-2 h-4 w-4" />
                Notify ({selectedRowCount})
            </Button>
        )}
      </div>
      
       {/* Mobile View */}
      <div className="md:hidden">
        {data.length > 0 ? (
           data.map(renderMobileCard)
        ) : (
            <div className="text-center py-16">
                <p className="text-muted-foreground">No applicants for this job yet.</p>
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
       <Dialog open={!!selectedApplicant} onOpenChange={(isOpen) => !isOpen && setSelectedApplicant(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedApplicant && (
             <JobseekerProfileView candidate={selectedApplicant} />
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={isNotifyDialogOpen} onOpenChange={setIsNotifyDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Send Notification to {selectedRowCount} Applicant(s)</DialogTitle>
                <DialogDescription>
                    Compose a message and choose the channel to notify the selected applicants.
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
                <RadioGroup defaultValue="email" onValueChange={(value: 'email' | 'sms') => setNotificationChannel(value)}>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="email" id="r-email" />
                        <Label htmlFor="r-email">Email</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sms" id="r-sms" />
                        <Label htmlFor="r-sms">SMS</Label>
                    </div>
                </RadioGroup>
                <Textarea placeholder={`Enter your message to send via ${notificationChannel}...`} rows={5} />
            </div>
            <DialogFooter>
                <Button variant="ghost" onClick={() => setIsNotifyDialogOpen(false)}>Cancel</Button>
                <Button onClick={() => {
                    toast({
                        title: 'Notifications Sent',
                        description: `A message has been sent via ${notificationChannel} to ${selectedRowCount} applicant(s).`,
                        variant: 'success'
                    });
                    setIsNotifyDialogOpen(false);
                    table.toggleAllPageRowsSelected(false);
                }}>
                    <Send className="mr-2 h-4 w-4" /> Send Message
                </Button>
            </DialogFooter>
        </DialogContent>
       </Dialog>
    </>
  );
}
