'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes.constant';
import { useAuth } from '@/contexts/auth-context';
import { ICircular } from '@/interfaces/job.interface';
import { convertEnToBn } from '@/lib/translator';
import { cn } from '@/lib/utils';
import { differenceInDays, endOfDay, format, isPast, parseISO } from 'date-fns';
import { Briefcase, MapPin, Users } from 'lucide-react';
import Link from 'next/link';

interface JobCardProps {
	job: ICircular;
	view?: 'grid' | 'list';
	searchParams?: any;
}

export function JobCard({ job, view = 'grid', searchParams }: JobCardProps) {
	const deadline = parseISO(job.circularEndDate);
	const isDeadlinePast = isPast(endOfDay(deadline));
	const daysLeft = differenceInDays(deadline, new Date()) + 1;
	const { isAuthenticated } = useAuth();

	let deadlineText: string;
	let deadlineColorClass = 'text-muted-foreground';

	if (isDeadlinePast) {
		deadlineText = 'Deadline Passed';
	} else {
		deadlineText = `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`;
		if (daysLeft <= 3) {
			deadlineColorClass = 'text-danger font-semibold';
		} else if (daysLeft <= 7) {
			deadlineColorClass = 'text-warning font-semibold';
		}
	}

	const queryParams = new URLSearchParams(searchParams);
	const cardUrl = isAuthenticated
		? `${ROUTES.JOB_SEEKER.JOB_DETAILS(job.id)}?${queryParams.toString()}`
		: `/jobs/${job.id}?${queryParams.toString()}`;

	return (
		<Link href={cardUrl} className='block h-full'>
			<Card
				className={cn(
					'h-full flex flex-col group glassmorphism card-hover transition-all duration-300',
					view === 'grid' ? 'min-h-[260px]' : 'sm:flex-row'
				)}
			>
				<CardHeader className={cn(view === 'list' && 'sm:w-2/3')}>
					<div className='space-y-1.5'>
						<CardTitle className='text-lg font-bold group-hover:text-primary transition-colors'>
							{job.postNameBn}
						</CardTitle>
						<CardDescription className='flex items-center gap-2 text-sm font-medium text-muted-foreground'>
							<Briefcase className='h-4 w-4' /> {job.clientOrganizationNameBn}
						</CardDescription>
					</div>
					<div className='text-sm text-muted-foreground line-clamp-2 pt-2' title={job.jobDescription}>
						{job.jobDescription}
					</div>
				</CardHeader>

				<CardContent
					className={cn(
						'flex flex-col justify-between flex-grow gap-4 pt-0',
						view === 'list' && 'sm:w-1/3 sm:border-l sm:pl-6 sm:pt-6'
					)}
				>
					<div className='space-y-2 text-sm'>
						{job.outsourcingZoneNameBn && (
							<div className='flex items-center gap-2 text-muted-foreground'>
								<MapPin className='h-4 w-4' />
								<span>{job.outsourcingZoneNameBn}</span>
							</div>
						)}
						<div className='flex items-center gap-2 text-muted-foreground'>
							<Users className='h-4 w-4' />
							<span>{convertEnToBn(job.vacancy)} জন</span>
						</div>
						{/* <div className='flex items-center gap-2 text-muted-foreground'>
							<Clock className='h-4 w-4' />
							<span>{job.outsourcing ? 'Outsourcing' : 'Permanent'}</span>
						</div> */}
					</div>
					<div className='flex items-center justify-between gap-2'>
						<Badge variant='outline'>Posted: {format(parseISO(job.circularPublishDate), 'dd MMM')}</Badge>
						<span className={cn('text-sm font-medium', deadlineColorClass)}>{deadlineText}</span>
					</div>
				</CardContent>
			</Card>
		</Link>
	);
}
