import { JobApplicationClient } from '@/components/app/jobseeker/job-application-client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { IObject } from '@/interfaces/common.interface';
import { ICircular } from '@/interfaces/job.interface';
import { CircularService } from '@/services/api/circular.service';
import { format, isPast, parseISO } from 'date-fns';
import { ArrowLeft, Briefcase, CheckCheck, DollarSign, MapPin } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

async function getJobDetails(id: string): Promise<ICircular | null> {
	try {
		const res = await CircularService.getDetails(id);
		return res.body;
	} catch (error) {
		console.error('Failed to load job details:', error);
		return null;
	}
}

export default async function JobDetailsPage({
	params,
	searchParams,
}: {
	params: Promise<{ id: string }>;
	searchParams: Promise<IObject>;
}) {
	const aParams = await params;
	const aSearchParams = await searchParams;

	const job = await getJobDetails(aParams.id);

	if (!job) {
		notFound();
	}

	const queryParams = new URLSearchParams(aSearchParams);
	const backUrl = `/jobseeker/find-job?${queryParams.toString()}`;

	const deadline = parseISO(job.circularEndDate);
	const today = new Date();
	const daysUntilDeadline = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

	return (
		<div className='container mx-auto px-4'>
			<div className='mb-6'>
				<Button variant='outline' asChild>
					<Link href={backUrl}>
						<ArrowLeft className='mr-2 h-4 w-4' />
						Back to Listings
					</Link>
				</Button>
			</div>
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
				<div className='lg:col-span-3'>
					<Card className='glassmorphism'>
						<CardHeader>
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
									{job.applied && (
										<Badge variant='lite-success'>
											<CheckCheck className='mr-2 h-4 w-4' />
											Applied
										</Badge>
									)}
								</div>
							</div>
						</CardHeader>
						<CardContent className='space-y-6'>
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
								<ul className='list-disc list-inside text-muted-foreground space-y-1 whitespace-pre-wrap'>
									{job.jobResponsibilities?.split('\n').map((r, i) => (
										<li key={i}>{r}</li>
									))}
								</ul>
							</div>
							<div>
								<h3 className='font-semibold text-lg mb-2'>Requirements</h3>
								<ul className='list-disc list-inside text-muted-foreground space-y-1 whitespace-pre-wrap'>
									{job.jobRequirements.split('\n').map((r, i) => (
										<li key={i}>{r}</li>
									))}
								</ul>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
