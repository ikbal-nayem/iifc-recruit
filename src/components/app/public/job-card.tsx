
'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ICircular } from '@/interfaces/job.interface';
import { getStatusVariant } from '@/lib/color-mapping';
import { cn } from '@/lib/utils';
import { differenceInDays, format, parseISO } from 'date-fns';
import { Building, Calendar, MapPin, Search } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import { useForm } from 'react-hook-form';

interface JobCardProps {
	job: ICircular;
	searchParams: Record<string, string>;
	view: 'grid' | 'list';
}

export function JobCard({ job, searchParams, view }: JobCardProps) {
	const queryParams = new URLSearchParams(searchParams);
	const jobUrl = `/jobs/${job.id}?${queryParams.toString()}`;

	const daysUntilDeadline = differenceInDays(parseISO(job.circularEndDate), new Date());
	const deadlineColorClass =
		daysUntilDeadline <= 3 ? 'text-danger' : daysUntilDeadline <= 7 ? 'text-warning' : 'text-muted-foreground';

	return (
		<Link href={jobUrl} className='block group'>
			<Card
				className={cn(
					'glassmorphism card-hover transition-all duration-300 h-full flex flex-col',
					view === 'list' && 'md:flex-row'
				)}
			>
				<div className='flex flex-col flex-1 p-6'>
					<CardHeader className='p-0 mb-4'>
						<CardTitle className='font-headline text-lg group-hover:text-primary transition-colors'>
							{job.postNameEn}
						</CardTitle>
						<CardDescription className='flex items-center gap-2 pt-1 text-sm'>
							<Building className='h-4 w-4' /> {job.clientOrganizationNameEn}
						</CardDescription>
					</CardHeader>

					<CardContent className='p-0 flex-grow'>
						<p className='text-sm text-muted-foreground line-clamp-2'>{job.jobDescription}</p>
					</CardContent>

					<div className='p-0 pt-4 mt-auto'>
						<div className='flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground'>
							{job.outsourcingZoneNameEn && (
								<span className='flex items-center gap-1.5'>
									<MapPin className='h-4 w-4' /> {job.outsourcingZoneNameEn}
								</span>
							)}
							<span className={cn('flex items-center gap-1.5', deadlineColorClass)}>
								<Calendar className='h-4 w-4' />
								Deadline: {format(parseISO(job.circularEndDate), 'dd MMM, yyyy')}
							</span>
						</div>
					</div>
				</div>
			</Card>
		</Link>
	);
}
