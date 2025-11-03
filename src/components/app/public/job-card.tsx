import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ICircular } from '@/interfaces/job.interface';
import { cn } from '@/lib/utils';
import { differenceInDays, format, parseISO } from 'date-fns';
import { ArrowRight, Building, Calendar, MapPin } from 'lucide-react';
import Link from 'next/link';

interface JobCardProps {
	job: ICircular;
	searchParams?: Record<string, string>;
}

export function JobCard({ job, searchParams }: JobCardProps) {
	const daysUntilDeadline = differenceInDays(parseISO(job.circularEndDate), new Date());
	const isDeadlineSoon = daysUntilDeadline <= 7 && daysUntilDeadline >= 0;
	const isOutsourcing = job.jobRequestType === 'OUTSOURCING';

	const queryParams = new URLSearchParams(searchParams).toString();
	const href = `/jobs/${job.id}?${queryParams}`;

	return (
		<Link href={href} className='group block'>
			<Card className='glassmorphism card-hover h-full flex flex-col'>
				<CardHeader className='pb-4'>
					<div className='flex justify-between items-start gap-4'>
						<CardTitle className='font-headline text-lg group-hover:text-primary transition-colors'>
							{job.postNameEn}
						</CardTitle>
						<Badge variant={isOutsourcing ? 'secondary' : 'outline'}>
							{isOutsourcing ? 'Outsourcing' : 'Permanent'}
						</Badge>
					</div>
					<CardDescription className='flex items-center gap-2 pt-1'>
						<Building className='h-4 w-4' />
						{job.clientOrganizationNameEn}
					</CardDescription>
				</CardHeader>
				<CardContent className='flex-grow space-y-4 text-sm'>
					<div className='flex items-center text-muted-foreground gap-2'>
						<MapPin className='h-4 w-4 shrink-0' />
						<span>{job.outsourcingZoneNameEn || 'Not specified'}</span>
					</div>
					<div
						className={cn(
							'flex items-center gap-2 font-medium',
							isDeadlineSoon ? 'text-warning' : 'text-muted-foreground'
						)}
					>
						<Calendar className='h-4 w-4 shrink-0' />
						<span>Deadline: {format(parseISO(job.circularEndDate), 'dd MMM, yyyy')}</span>
					</div>
				</CardContent>
				<div className='p-4 pt-0 text-primary font-semibold flex items-center justify-end text-sm'>
					View Details <ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
				</div>
			</Card>
		</Link>
	);
}
