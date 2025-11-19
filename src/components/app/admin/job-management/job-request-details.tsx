'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ROLES } from '@/constants/auth.constant';
import { ROUTES } from '@/constants/routes.constant';
import { useAuth } from '@/contexts/auth-context';
import { toast } from '@/hooks/use-toast';
import {
	JobRequest,
	JobRequestedPostStatus,
	JobRequestStatus,
	JobRequestType,
} from '@/interfaces/job.interface';
import { getStatusVariant } from '@/lib/color-mapping';
import { cn } from '@/lib/utils';
import { JobRequestService } from '@/services/api/job-request.service';
import { differenceInDays, format, parseISO } from 'date-fns';
import { ArrowLeft, Building, Check, CheckCircle, Edit, FileText, Loader2, Users } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { AttachmentsUpload } from './attachment-upload';

export function JobRequestDetails({ initialJobRequest }: { initialJobRequest: JobRequest }) {
	const router = useRouter();
	const { currectUser } = useAuth();
	const [request, setRequest] = React.useState<JobRequest>(initialJobRequest);
	const [isCompleting, setIsCompleting] = React.useState(false);
	const [isAccepting, setIsAccepting] = React.useState(false);

	const isIifcAdmin = currectUser?.roles.includes(ROLES.IIFC_ADMIN);

	const isDeadlineSoon = differenceInDays(parseISO(request.deadline), new Date()) <= 7;

	const handleMarkAsComplete = async () => {
		setIsCompleting(true);
		try {
			await JobRequestService.updateStatus(request.id!, JobRequestStatus.COMPLETED);
			toast.success({
				title: 'Request Completed',
				description: 'The job request has been marked as completed.',
			});
			router.push(ROUTES.JOB_REQUEST.COMPLETED);
		} catch (error: any) {
			toast.error({
				description: error.message || 'Failed to complete the job request.',
			});
		} finally {
			setIsCompleting(false);
		}
	};

	const handleAcceptRequest = async () => {
		setIsAccepting(true);
		try {
			await JobRequestService.updateStatus(request.id!, JobRequestStatus.PROCESSING);
			router.push(ROUTES.JOB_REQUEST.PROCESSING);
			toast.success({
				title: 'Request Accepted',
				description: 'The job request is now being processed.',
			});
		} catch (error: any) {
			toast.error({
				description: error.message || 'Failed to accept the job request.',
			});
		} finally {
			setIsAccepting(false);
		}
	};

	const canMarkAsComplete =
		request.status === JobRequestStatus.PROCESSING &&
		request.requestedPosts?.every((post) => post.status === JobRequestedPostStatus.SHORTLISTED);

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<Button variant='outline' onClick={() => router.back()}>
					<ArrowLeft className='mr-2 h-4 w-4' />
					Back to Requests
				</Button>
				{isIifcAdmin && (
					<div className='flex gap-2'>
						{request.status !== JobRequestStatus.COMPLETED && (
							<Button asChild variant='outline'>
								<Link href={ROUTES.JOB_REQUEST.EDIT(request.id)}>
									<Edit className='mr-2 h-4 w-4' /> Edit Request
								</Link>
							</Button>
						)}
						{request.status === JobRequestStatus.PROCESSING && (
							<Button
								variant='success'
								onClick={handleMarkAsComplete}
								disabled={!canMarkAsComplete || isCompleting}
							>
								{isCompleting ? (
									<Loader2 className='mr-2 h-4 w-4 animate-spin' />
								) : (
									<CheckCircle className='mr-2 h-4 w-4' />
								)}
								Mark as Complete
							</Button>
						)}
						{request.status === JobRequestStatus.PENDING && (
							<Button variant='success' onClick={handleAcceptRequest} disabled={isAccepting}>
								{isAccepting ? (
									<Loader2 className='mr-2 h-4 w-4 animate-spin' />
								) : (
									<Check className='mr-2 h-4 w-4' />
								)}
								Accept Request
							</Button>
						)}
					</div>
				)}
			</div>

			<Card className='glassmorphism'>
				<CardHeader>
					<CardTitle className='text-2xl font-headline'>
						{request.subject} <AttachmentsUpload onSuccess={() => {}} />
					</CardTitle>
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
						return (
							<Card key={index} className='p-4 border rounded-lg bg-muted/50 space-y-4'>
								<div className='flex items-start justify-between'>
									<div>
										<CardTitle className='text-xl font-semibold'>{post.post?.nameEn}</CardTitle>
									</div>
									<div className='flex items-center gap-2 text-right'>
										<div className='flex flex-col items-end gap-1'>
											<Badge variant={getStatusVariant(post.status)}>{post.statusDTO?.nameEn}</Badge>
											{!!post.circularPublishDate && !!post.circularEndDate && (
												<i className='text-purple-600/80 text-xs'>
													Circular: {format(new Date(post.circularPublishDate), 'dd/MM/yy')} -{' '}
													{format(new Date(post.circularEndDate), 'dd/MM/yy')}
												</i>
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
											{post.post?.outsourcingCategory?.nameEn && (
												<div>
													<p className='text-muted-foreground'>Category</p>
													<p className='font-medium'>{post.post.outsourcingCategory.nameEn}</p>
												</div>
											)}
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
