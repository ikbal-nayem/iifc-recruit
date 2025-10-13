
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
	return null;
}

export function JobRequestDetails({ initialJobRequest }: { initialJobRequest: JobRequest }) {
	const router = useRouter();
	const [request, setRequest] = React.useState<JobRequest>(initialJobRequest);

	const requestStatus = request.status;
	const requestStatusVariant =
		requestStatus === JobRequestStatus.COMPLETED
			? 'success'
			: requestStatus === JobRequestStatus.PROCESSING
			? 'info'
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
