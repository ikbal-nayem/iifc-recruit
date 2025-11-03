
'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ICircular } from '@/interfaces/job.interface';
import { CircularService } from '@/services/api/circular.service';
import { format, isPast, parseISO } from 'date-fns';
import { Briefcase, DollarSign, Loader2, MapPin } from 'lucide-react';
import * as React from 'react';
import { JobApplicationClient } from '../jobseeker/job-application-client';

interface JobCircularDetailsProps {
	circularId: string;
}

export function JobCircularDetails({ circularId }: JobCircularDetailsProps) {
	const [job, setJob] = React.useState<ICircular | null>(null);
	const [isLoading, setIsLoading] = React.useState(true);

	React.useEffect(() => {
		if (circularId) {
			setIsLoading(true);
			CircularService.getDetails(circularId)
				.then((res) => setJob(res.body))
				.catch(() => setJob(null))
				.finally(() => setIsLoading(false));
		}
	}, [circularId]);

	if (isLoading) {
		return (
			<div className='p-6 space-y-4'>
				<Skeleton className='h-10 w-3/4' />
				<Skeleton className='h-5 w-1/2' />
				<Skeleton className='h-32 w-full' />
				<Skeleton className='h-24 w-full' />
			</div>
		);
	}

	if (!job) {
		return <div className='p-6 text-center'>Could not load job details.</div>;
	}

	const deadline = parseISO(job.circularEndDate);
	const today = new Date();
	const daysUntilDeadline = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

	return (
		<Card className='glassmorphism border-0 shadow-none'>
			<CardHeader className='p-6'>
				<div className='flex justify-between items-start gap-4'>
					<div className='flex-1'>
						<CardTitle className='font-headline text-3xl'>{job.postNameEn}</CardTitle>
						<CardDescription className='flex flex-wrap items-center gap-x-4 gap-y-2 pt-4'>
							<span className='flex items-center gap-2'>
								<Briefcase className='h-4 w-4' /> {job.clientOrganizationNameEn}
							</span>
							{job.outsourcingZoneNameEn && (
								<span className='flex items-center gap-2'>
									<MapPin className='h-4 w-4' /> {job.outsourcingZoneNameEn}
								</span>
							)}
							{(job.salaryFrom || job.salaryTo) && (
								<span className='flex items-center gap-2'>
									<DollarSign className='h-4 w-4' />
									{job.salaryFrom?.toLocaleString()}
									{job.salaryTo ? ` - ${job.salaryTo?.toLocaleString()}` : ''}
								</span>
							)}
						</CardDescription>
					</div>
					<div className='flex-shrink-0'>
						{!job.applied && !isPast(deadline) && (
							<JobApplicationClient
								jobTitle={job.postNameEn}
								jobOrganizationName={job.clientOrganizationNameEn}
								jobId={job.id}
							/>
						)}
					</div>
				</div>
			</CardHeader>
			<CardContent className='p-6 pt-0 space-y-6'>
				<div className='flex items-center gap-4 text-sm'>
					<Badge variant='secondary'>
						Posted: {format(parseISO(job.circularPublishDate), 'dd MMM, yyyy')}
					</Badge>
					<Badge
						variant={
							daysUntilDeadline <= 3 ? 'danger' : daysUntilDeadline <= 7 ? 'warning' : 'secondary'
						}
					>
						Deadline: {format(deadline, 'dd MMM, yyyy')}
					</Badge>
				</div>
				<div>
					<h3 className='font-semibold text-lg mb-2'>Job Description</h3>
					<p className='text-muted-foreground whitespace-pre-wrap'>{job.jobDescription}</p>
				</div>
				<div>
					<h3 className='font-semibold text-lg mb-2'>Responsibilities</h3>
					<ul className='ml-4 list-disc list-inside text-muted-foreground space-y-1 whitespace-pre-wrap'>
						{job.jobResponsibilities?.split('\n').map((r, i) => (
							<li key={i}>{r}</li>
						))}
					</ul>
				</div>
				<div>
					<h3 className='font-semibold text-lg mb-2'>Requirements</h3>
					<ul className='ml-4 list-disc list-inside text-muted-foreground space-y-1 whitespace-pre-wrap'>
						{job.jobRequirements.split('\n').map((r, i) => (
							<li key={i}>{r}</li>
						))}
					</ul>
				</div>
			</CardContent>
		</Card>
	);
}
