
'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { JobRequest, JobRequestStatus, RequestedPost } from '@/interfaces/job.interface';
import { cn, getStatusVariant } from '@/lib/utils';
import { differenceInDays, format, parseISO } from 'date-fns';
import { ArrowLeft, Building, Calendar, Edit, FileText } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { JobRequestType } from '@/interfaces/job.interface';
import { Separator } from '@/components/ui/separator';

function PrimaryListManager({ post }: { post: RequestedPost }) {
	return null;
}

export function JobRequestDetails({ initialJobRequest }: { initialJobRequest: JobRequest }) {
	const router = useRouter();
	const [request] = React.useState<JobRequest>(initialJobRequest);

	const isDeadlineSoon = differenceInDays(parseISO(request.deadline), new Date()) <= 7;

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<Button variant='outline' onClick={() => router.back()}>
					<ArrowLeft className='mr-2 h-4 w-4' />
					Back to Requests
				</Button>
				<Button asChild>
					<Link href={`/admin/recruitment/request/edit/${request.id}`}>
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
							<Badge variant={getStatusVariant(request.status)}>{request.statusDTO?.nameEn}</Badge>
						</div>
					</div>

					{request.description && (
						<div>
							<h4 className='font-semibold mb-1'>Description</h4>
							<p className='text-sm text-muted-foreground'>{request.description}</p>
						</div>
					)}
				</CardContent>
			</Card>

			<Card className='glassmorphism'>
				<CardHeader>
					<CardTitle>Requested Posts</CardTitle>
					<CardDescription>Details of each post included in this request.</CardDescription>
				</CardHeader>
				<CardContent className='space-y-4'>
					{request.requestedPosts.map((post, index) => (
						<Card key={index} className='bg-muted/30'>
							<CardHeader className='pb-4'>
								<div className='flex items-start justify-between'>
									<CardTitle className='text-xl font-semibold'>
										{post.post?.nameEn} ({post.vacancy} Vacancies)
									</CardTitle>
									<Badge variant={getStatusVariant(post.status)}>{post.statusDTO?.nameEn}</Badge>
								</div>
							</CardHeader>
							<CardContent>
								<Separator className='mb-4' />
								<div className='grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 text-sm'>
									{post.experienceRequired && post.experienceRequired > 0 && (
										<div>
											<p className='text-muted-foreground'>Experience</p>
											<p className='font-medium'>{post.experienceRequired} years</p>
										</div>
									)}
									{request.type === JobRequestType.OUTSOURCING ? (
										<>
											{post.outsourcingZone?.nameEn && (
												<div>
													<p className='text-muted-foreground'>Zone</p>
													<p className='font-medium'>{post.outsourcingZone?.nameEn}</p>
												</div>
											)}
											{post.yearsOfContract && post.yearsOfContract > 0 ? (
												<div>
													<p className='text-muted-foreground'>Contract Period</p>
													<p className='font-medium'>{post.yearsOfContract} years</p>
												</div>
											) : null}
										</>
									) : (
										<>
											{(post.salaryFrom && post.salaryTo) && (
												<div>
													<p className='text-muted-foreground'>Salary Range</p>
													<p className='font-medium'>
														{post.salaryFrom} - {post.salaryTo}
													</p>
												</div>
											)}
											{post.negotiable && (
												<div>
													<p className='text-muted-foreground'>Salary</p>
													<p className='font-medium'>Negotiable</p>
												</div>
											)}
										</>
									)}
								</div>
							</CardContent>
						</Card>
					))}
				</CardContent>
			</Card>
		</div>
	);
}
