
'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ROUTES } from '@/constants/routes.constant';
import { toast } from '@/hooks/use-toast';
import {
	JobRequest,
	JobRequestedPostStatus,
	JobRequestStatus,
	JobRequestType,
	RequestedPost,
} from '@/interfaces/job.interface';
import { getStatusVariant } from '@/lib/color-mapping';
import { cn } from '@/lib/utils';
import { JobRequestService } from '@/services/api/job-request.service';
import { differenceInDays, format, isFuture, parseISO } from 'date-fns';
import { ArrowLeft, Building, CheckCircle, Edit, FileText, Loader2, Pencil, Users } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';

export function JobRequestDetails({ initialJobRequest }: { initialJobRequest: JobRequest }) {
	const router = useRouter();
	const [request, setRequest] = React.useState<JobRequest>(initialJobRequest);
	const [isCompleting, setIsCompleting] = React.useState(false);

	const isDeadlineSoon = differenceInDays(parseISO(request.deadline), new Date()) <= 7;

	const handleMarkAsComplete = async () => {
		setIsCompleting(true);
		try {
			await JobRequestService.updateStatus(request.id!, JobRequestStatus.COMPLETED);
			toast.success({
				title: 'Request Completed',
				description: 'The job request has been marked as completed.',
			});
			router.push(ROUTES.JOB_REQUEST_COMPLETED);
		} catch (error: any) {
			toast.error({
				description: error.message || 'Failed to complete the job request.',
			});
		} finally {
			setIsCompleting(false);
		}
	};

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<Button variant='outline' onClick={() => router.back()}>
					<ArrowLeft className='mr-2 h-4 w-4' />
					Back to Requests
				</Button>
				<div className='flex gap-2'>
					{request.status === JobRequestStatus.PROCESSING && (
						<Button variant='lite-success' onClick={handleMarkAsComplete} disabled={isCompleting}>
							{isCompleting ? (
								<Loader2 className='mr-2 h-4 w-4 animate-spin' />
							) : (
								<CheckCircle className='mr-2 h-4 w-4' />
							)}
							Mark as Complete
						</Button>
					)}
					<Button asChild>
						<Link href={ROUTES.JOB_REQUEST_EDIT(request.id)}>
							<Edit className='mr-2 h-4 w-4' /> Edit Request
						</Link>
					</Button>
				</div>
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
					{request.requestedPosts?.map((post, index) => {
						const isCircularPublished = post.status === JobRequestedPostStatus.CIRCULAR_PUBLISHED;
						const isCircularEditable =
							isCircularPublished && post.circularEndDate && isFuture(parseISO(post.circularEndDate));
						return (
							<Card key={index} className='p-4 border rounded-lg bg-muted/30 space-y-4'>
								<div className='flex items-start justify-between'>
									<div>
										<CardTitle className='text-xl font-semibold'>{post.post?.nameEn}</CardTitle>
									</div>
									<div className='flex items-center gap-2 text-right'>
										<div className='flex flex-col items-end gap-1'>
											<Badge variant={getStatusVariant(post.status)}>
												{post.statusDTO?.nameEn}
												{isCircularEditable && (
													<Pencil
														className='ms-1 h-3 w-3 hover:scale-x-110'
														role='button'
													/>
												)}
											</Badge>
											{isCircularPublished && post.circularEndDate && (
												<p className='text-xs text-muted-foreground'>
													Ends: {format(parseISO(post.circularEndDate), 'PPP')}
												</p>
											)}
										</div>
									</div>
								</div>

								<Separator />

								<div className='grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 text-sm'>
									<div>
										<p className='text-muted-foreground'>Vacancies</p>
										<p className='font-medium flex items-center gap-1.5'>
											<Users className='h-4 w-4' />
											{post.vacancy}
										</p>
									</div>
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
											{post.salaryFrom && post.salaryTo && (
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
							</Card>
						);
					})}
				</CardContent>
			</Card>
		</div>
	);
}
