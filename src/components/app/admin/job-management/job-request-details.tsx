
'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { JobRequest, JobRequestStatus, RequestedPost } from '@/interfaces/job.interface';
import { cn } from '@/lib/utils';
import { differenceInDays, format, parseISO } from 'date-fns';
import { ArrowLeft, Building, Calendar, Edit, FileText } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { jobseekers } from '@/lib/data';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown, UserPlus, X } from 'lucide-react';
import { Jobseeker } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { JobRequestType } from '@/interfaces/job.interface';

const getPostStatusVariant = (status?: string) => {
	switch (status) {
		case JobRequestStatus.PENDING:
			return 'warning';
		case 'IN_PROGRESS':
			return 'info';
		case 'EXAM':
			return 'default';
		case 'INTERVIEW':
			return 'success';
		default:
			return 'secondary';
	}
};

function PrimaryListManager({ post }: { post: RequestedPost }) {
	const [open, setOpen] = React.useState(false);
	const [primaryList, setPrimaryList] = React.useState<Jobseeker[]>([]);
	const [searchQuery, setSearchQuery] = React.useState('');

	const availableJobseekers = jobseekers.filter(
		(jobseeker) => !primaryList.some((pl) => pl.id === jobseeker.id)
	);

	const handleSelect = (jobseeker: Jobseeker) => {
		setPrimaryList((prev) => [...prev, jobseeker]);
		setOpen(false);
		setSearchQuery('');
	};

	const handleRemove = (jobseekerId: string) => {
		setPrimaryList((prev) => prev.filter((js) => js.id !== jobseekerId));
	};

	const getFullName = (personalInfo: any) => [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');

	return (
		<div className='mt-4 rounded-lg border p-4'>
			<div className='flex justify-between items-center mb-3'>
				<h4 className='font-semibold'>Primary List</h4>
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<Button variant='outline'>
							<UserPlus className='mr-2 h-4 w-4' />
							Add Candidate
						</Button>
					</PopoverTrigger>
					<PopoverContent className='w-[300px] p-0'>
						<Command>
							<CommandInput
								placeholder='Search jobseeker...'
								value={searchQuery}
								onValueChange={setSearchQuery}
							/>
							<CommandList>
								<CommandEmpty>No jobseeker found.</CommandEmpty>
								<CommandGroup>
									{availableJobseekers
										.filter((js) =>
											getFullName(js.personalInfo).toLowerCase().includes(searchQuery.toLowerCase())
										)
										.map((js) => (
											<CommandItem key={js.id} onSelect={() => handleSelect(js)}>
												{getFullName(js.personalInfo)}
											</CommandItem>
										))}
								</CommandGroup>
							</CommandList>
						</Command>
					</PopoverContent>
				</Popover>
			</div>
			{primaryList.length > 0 ? (
				<div className='space-y-2'>
					{primaryList.map((jobseeker) => (
						<div
							key={jobseeker.id}
							className='flex items-center justify-between p-2 rounded-md bg-muted/50'
						>
							<div className='flex items-center gap-3'>
								<Avatar className='h-8 w-8'>
									<AvatarImage src={jobseeker.personalInfo.profileImage?.filePath} />
									<AvatarFallback>{getFullName(jobseeker.personalInfo)[0]}</AvatarFallback>
								</Avatar>
								<span className='text-sm font-medium'>{getFullName(jobseeker.personalInfo)}</span>
							</div>
							<Button variant='ghost' size='icon' className='h-7 w-7' onClick={() => handleRemove(jobseeker.id)}>
								<X className='h-4 w-4' />
							</Button>
						</div>
					))}
				</div>
			) : (
				<p className='text-sm text-center text-muted-foreground py-4'>No candidates added to the primary list.</p>
			)}
		</div>
	);
}

export function JobRequestDetails({ initialJobRequest }: { initialJobRequest: JobRequest }) {
	const router = useRouter();
	const [request, setRequest] = React.useState<JobRequest>(initialJobRequest);

	const requestStatus = request.status;
	const requestStatusVariant =
		requestStatus === JobRequestStatus.SUCCESS
			? 'success'
			: requestStatus === JobRequestStatus.IN_PROGRESS
			? 'warning'
			: requestStatus === JobRequestStatus.PENDING
			? 'warning'
			: 'secondary';

	const isDeadlineSoon = differenceInDays(parseISO(request.deadline), new Date()) <= 7;

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<Button variant='outline' onClick={() => router.back()}>
					<ArrowLeft className='mr-2 h-4 w-4' />
					Back to Requests
				</Button>
				<Button asChild>
					<Link href={`/admin/job-management/request/edit/${request.id}`}>
						<Edit className='mr-2 h-4 w-4' /> Edit Request
					</Link>
				</Button>
			</div>

			<Card className='glassmorphism'>
				<CardHeader>
					<CardTitle className='text-2xl font-headline'>{request.subject}</CardTitle>
					<div className='text-sm text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1'>
						<span className='flex items-center gap-1.5'>
							<Building className='h-4 w-4' /> {request.clientOrganization?.nameEn}
						</span>
						<span className='flex items-center gap-1.5'>
							<FileText className='h-4 w-4' /> Memo: {request.memoNo}
						</span>
					</div>
				</CardHeader>
				<CardContent>
					<div className='grid grid-cols-2 md:grid-cols-4 gap-4 rounded-md border p-4 mb-6'>
						<div>
							<p className='font-medium text-muted-foreground text-sm'>Request Date</p>
							<p className='font-semibold'>{format(new Date(request.requestDate), 'PPP')}</p>
						</div>
						<div>
							<p className='font-medium text-muted-foreground text-sm'>Deadline</p>
							<p className={cn('font-semibold', isDeadlineSoon && 'text-danger')}>
								{format(new Date(request.deadline), 'PPP')}
							</p>
						</div>
						<div>
							<p className='font-medium text-muted-foreground text-sm'>Request Type</p>
							<Badge variant={request.type === JobRequestType.OUTSOURCING ? 'secondary' : 'outline'}>
								{request.typeDTO?.nameEn}
							</Badge>
						</div>
						<div>
							<p className='font-medium text-muted-foreground text-sm'>Status</p>
							<Badge variant={requestStatusVariant}>{request.statusDTO?.nameEn}</Badge>
						</div>
					</div>

					{request.description && (
						<div className='mb-6'>
							<h4 className='font-semibold mb-1'>Description</h4>
							<p className='text-sm text-muted-foreground'>{request.description}</p>
						</div>
					)}

					<div>
						<h3 className='text-lg font-bold mb-4'>Requested Posts</h3>
						<div className='space-y-4'>
							{request.requestedPosts.map((post, index) => (
								<div key={index} className='p-4 border rounded-lg bg-muted/30'>
									<div className='flex justify-between items-start'>
										<p className='font-bold text-lg'>
											{post.post?.nameEn} ({post.vacancy} Vacancies)
										</p>
										<Badge variant={getPostStatusVariant(post.status)}>{post.statusDTO?.nameEn}</Badge>
									</div>
									<div className='grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 text-muted-foreground mt-2 text-sm'>
										{post.experienceRequired && post.experienceRequired > 0 && (
											<span>
												Experience: <span className='font-medium text-foreground'>{post.experienceRequired} years</span>
											</span>
										)}
										{request.type === JobRequestType.OUTSOURCING ? (
											<>
												{post.outsourcingZone?.nameEn && (
													<span>
														Zone: <span className='font-medium text-foreground'>{post.outsourcingZone?.nameEn}</span>
													</span>
												)}
												{post.yearsOfContract && post.yearsOfContract > 0 && (
													<span>
														Contract: <span className='font-medium text-foreground'>{post.yearsOfContract} years</span>
													</span>
												)}
											</>
										) : (
											<>
												{(post.salaryFrom && post.salaryTo) && (
													<span>
														Salary:{' '}
														<span className='font-medium text-foreground'>
															{post.salaryFrom} - {post.salaryTo}
														</span>
													</span>
												)}
												{post.negotiable && <span>(Negotiable)</span>}
											</>
										)}
									</div>
									<PrimaryListManager post={post} />
								</div>
							))}
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
