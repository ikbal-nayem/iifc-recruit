
'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ICircular } from '@/interfaces/job.interface';
import { cn } from '@/lib/utils';
import { differenceInDays, format, isPast, parseISO } from 'date-fns';
import { Building, CalendarDays, MapPin } from 'lucide-react';
import Link from 'next/link';

interface JobCardProps {
	job: ICircular;
	backUrl: string;
	view: 'grid' | 'list';
}

export function JobCard({ job, backUrl, view }: JobCardProps) {
	const deadline = parseISO(job.circularEndDate);
	const isPastDeadline = isPast(deadline);
	const daysRemaining = differenceInDays(deadline, new Date());

	const deadlineColorClass = isPastDeadline
		? 'border-l-danger'
		: daysRemaining <= 3
		? 'border-l-warning'
		: 'border-l-primary';

	const deadlineText = isPastDeadline
		? `Deadline Passed`
		: daysRemaining < 1
		? `Apply Today`
		: `${daysRemaining} days left`;

	const containerClasses = cn(
		'group flex h-full w-full flex-col overflow-hidden rounded-lg border-l-4 bg-card text-card-foreground shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5',
		deadlineColorClass,
		view === 'list' && 'md:flex-row'
	);

	const contentClasses = cn(
		'flex flex-1 flex-col justify-between p-4',
		view === 'list' && 'md:p-6'
	);

	return (
		<Link href={`${backUrl.split('?')[0]}/${job.id}?${backUrl.split('?')[1] || ''}`} className='h-full'>
			<Card className={containerClasses}>
				<CardContent className={contentClasses}>
					<div className='flex-1'>
						<div className='mb-2 flex items-start justify-between'>
							<h3 className='text-lg font-semibold leading-tight text-foreground transition-colors group-hover:text-primary'>
								{job.postNameEn}
							</h3>
						</div>

						<div className='mb-3 flex items-center gap-x-4 gap-y-1 text-sm text-muted-foreground'>
							<span className='inline-flex items-center gap-1.5'>
								<Building className='h-4 w-4' />
								{job.clientOrganizationNameEn}
							</span>
							{job.outsourcingZoneNameEn && (
								<span className='inline-flex items-center gap-1.5'>
									<MapPin className='h-4 w-4' />
									{job.outsourcingZoneNameEn}
								</span>
							)}
						</div>
						<p className='mb-4 line-clamp-2 text-sm text-muted-foreground'>{job.jobDescription}</p>
					</div>

					<div className='flex items-center justify-between text-xs text-muted-foreground'>
						<div className='flex items-center gap-1.5'>
							<CalendarDays className='h-4 w-4' />
							<span>{deadlineText}</span>
						</div>
						<Badge variant={job.outsourcing ? 'secondary' : 'outline'}>
							{job.outsourcing ? 'Outsourcing' : 'Permanent'}
						</Badge>
					</div>
				</CardContent>
			</Card>
		</Link>
	);
}
