
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ICircular } from '@/interfaces/job.interface';
import { cn } from '@/lib/utils';
import { differenceInDays, format, parseISO } from 'date-fns';
import { Building, Calendar, MapPin, Tag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface JobCardProps {
	job: ICircular;
	view: 'grid' | 'list';
}

export function JobCard({ job, view }: JobCardProps) {
	const searchParams = useSearchParams();
	const queryParams = new URLSearchParams(searchParams.toString());
	const href = `/jobs/${job.id}?${queryParams.toString()}`;

	const daysUntilDeadline = differenceInDays(parseISO(job.circularEndDate), new Date());
	const deadlineColor =
		daysUntilDeadline <= 3 ? 'text-danger' : daysUntilDeadline <= 7 ? 'text-warning' : 'text-muted-foreground';

	return (
		<Link href={href} className='group block'>
			<Card
				className={cn(
					'flex h-full flex-col transition-all duration-300 ease-in-out group-hover:border-primary group-hover:shadow-lg',
					view === 'grid' ? 'glassmorphism' : 'flex-row items-center glassmorphism'
				)}
			>
				<div
					className={cn(
						'relative flex-shrink-0',
						view === 'grid' ? 'h-48 w-full' : 'h-full w-32 hidden sm:block'
					)}
				>
					<Image
						src={`https://picsum.photos/seed/${job.id}/400/200`}
						alt={job.postNameEn}
						layout='fill'
						objectFit='cover'
						className={cn('transition-transform duration-300 group-hover:scale-105', view === 'grid' ? 'rounded-t-lg' : 'rounded-l-lg')}
						data-ai-hint='office building'
					/>
					<div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
					<Badge
						className='absolute top-2 right-2'
						variant={job.outsourcing ? 'secondary' : 'default'}
					>
						{job.outsourcing ? 'Outsourcing' : 'Permanent'}
					</Badge>
				</div>
				<div className='flex flex-1 flex-col p-4'>
					<CardHeader className='p-0'>
						<CardTitle className='font-headline text-lg group-hover:text-primary'>{job.postNameEn}</CardTitle>
						<CardDescription className='flex items-center gap-1.5 pt-1 text-sm'>
							<Building className='h-4 w-4 shrink-0' />
							<span className='truncate'>{job.clientOrganizationNameEn}</span>
						</CardDescription>
					</CardHeader>
					<CardContent className='flex-grow p-0 pt-3'>
						<p className='text-sm text-muted-foreground line-clamp-2'>{job.jobDescription}</p>
					</CardContent>
					<div className='mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground'>
						{job.outsourcingZoneNameEn && (
							<div className='flex items-center gap-1.5'>
								<MapPin className='h-3.5 w-3.5' /> {job.outsourcingZoneNameEn}
							</div>
						)}
						{job.outsourcingCategoryNameEn && (
							<div className='flex items-center gap-1.5'>
								<Tag className='h-3.5 w-3.5' /> {job.outsourcingCategoryNameEn}
							</div>
						)}
					</div>
					<div className='mt-3 flex items-center justify-between border-t pt-3'>
						<div className={cn('flex items-center gap-1.5 text-xs font-semibold', deadlineColor)}>
							<Calendar className='h-3.5 w-3.5' />
							<span>Deadline: {format(parseISO(job.circularEndDate), 'dd MMM, yyyy')}</span>
						</div>
					</div>
				</div>
			</Card>
		</Link>
	);
}
