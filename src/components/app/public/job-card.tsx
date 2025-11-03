
'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ICircular } from '@/interfaces/job.interface';
import { cn } from '@/lib/utils';
import { differenceInDays, format, parseISO } from 'date-fns';
import { Building, CalendarDays, MapPin } from 'lucide-react';
import Link from 'next/link';

interface JobCardProps {
	job: ICircular;
	backUrl?: string;
}

export function JobCard({ job, backUrl }: JobCardProps) {
	const deadline = parseISO(job.circularEndDate);
	const daysRemaining = differenceInDays(deadline, new Date());

	let deadlineColor: 'success' | 'warning' | 'danger' = 'success';
	if (daysRemaining <= 7 && daysRemaining > 3) {
		deadlineColor = 'warning';
	} else if (daysRemaining <= 3) {
		deadlineColor = 'danger';
	}

	return (
		<Link href={`/jobs/${job.id}${backUrl ? `?${backUrl}` : ''}`} className='block group'>
			<Card className='h-full glassmorphism card-hover flex flex-col'>
				<CardHeader>
					<CardTitle className='font-bold group-hover:text-primary transition-colors'>{job.postNameEn}</CardTitle>
					<CardDescription className='flex items-center gap-2 pt-1 text-sm'>
						<Building className='h-4 w-4' />
						{job.clientOrganizationNameEn}
					</CardDescription>
				</CardHeader>
				<CardContent className='flex-grow space-y-4'>
					<p className='text-sm text-muted-foreground line-clamp-3'>{job.jobDescription}</p>
					<div className='flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground'>
						{job.outsourcingZoneNameEn && (
							<span className='flex items-center gap-2'>
								<MapPin className='h-4 w-4' /> {job.outsourcingZoneNameEn}
							</span>
						)}
						<Badge variant={`outline-${deadlineColor}`} className='flex items-center gap-2'>
							<CalendarDays className='h-4 w-4' />
							Deadline: {format(deadline, 'dd MMM, yyyy')}
						</Badge>
					</div>
				</CardContent>
			</Card>
		</Link>
	);
}
