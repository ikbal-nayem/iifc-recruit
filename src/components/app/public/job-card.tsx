
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ICircular } from '@/interfaces/job.interface';
import { cn } from '@/lib/utils';
import { differenceInDays, format, parseISO } from 'date-fns';
import { Building, Clock, DollarSign, MapPin, Calendar } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface JobCardProps {
	job: ICircular;
	viewMode: 'grid' | 'list';
}

export function JobCard({ job, viewMode }: JobCardProps) {
	const daysUntilDeadline = differenceInDays(parseISO(job.circularEndDate), new Date());
	let deadlineClass = '';
	if (daysUntilDeadline <= 3) {
		deadlineClass = 'border-danger/50';
	} else if (daysUntilDeadline <= 7) {
		deadlineClass = 'border-warning/50';
	}

	const isList = viewMode === 'list';

	return (
		<Link href={`/jobs/${job.id}`} className='block group'>
			<Card
				className={cn(
					'w-full h-full flex flex-col transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-lg',
					deadlineClass,
					isList ? 'flex-row' : 'flex-col'
				)}
			>
				<div
					className={cn(
						'flex items-center p-4 gap-4',
						isList ? 'w-1/3 border-r' : 'border-b'
					)}
				>
					<Image
						src={`https://logo.clearbit.com/${job.clientOrganizationNameEn.toLowerCase().replace(/\s/g, '')}.com`}
						alt={`${job.clientOrganizationNameEn} logo`}
						width={isList ? 64 : 48}
						height={isList ? 64 : 48}
						className='rounded-md bg-muted'
						onError={(e) => {
							e.currentTarget.src = '/iifc-logo.png';
						}}
					/>
					<div className='flex-1'>
						<h3
							className={cn(
								'font-semibold group-hover:text-primary transition-colors',
								isList ? 'text-lg' : 'text-base'
							)}
						>
							{job.postNameEn}
						</h3>
						<p className='text-sm text-muted-foreground flex items-center gap-2'>
							<Building className='h-4 w-4' />
							{job.clientOrganizationNameEn}
						</p>
					</div>
				</div>
				<CardContent className='p-4 flex flex-col flex-1 justify-between'>
					<div className='flex flex-col gap-2 text-sm text-muted-foreground'>
						<div className='flex items-center gap-2'>
							<MapPin className='h-4 w-4 shrink-0' />
							<span>{job.outsourcingZoneNameEn || 'Various Locations'}</span>
						</div>
						<div className='flex items-center gap-2'>
							<Clock className='h-4 w-4 shrink-0' />
							<Badge variant={job.outsourcing ? 'secondary' : 'outline'}>
								{job.outsourcing ? 'Outsourcing' : 'Permanent'}
							</Badge>
						</div>
						{(job.salaryFrom || job.salaryTo) && (
							<div className='flex items-center gap-2'>
								<DollarSign className='h-4 w-4 shrink-0' />
								<span>
									{job.salaryFrom} - {job.salaryTo}
								</span>
							</div>
						)}
					</div>

					<div className='flex items-center gap-2 text-sm mt-4 pt-4 border-t'>
						<Calendar className={cn('h-4 w-4', deadlineClass && 'text-current')} />
						<span className={cn('font-medium', deadlineClass && 'text-current')}>
							Deadline: {format(parseISO(job.circularEndDate), 'dd MMM, yyyy')}
						</span>
					</div>
				</CardContent>
			</Card>
		</Link>
	);
}

