import { JobApplicationClient } from '@/components/app/jobseeker/job-application-client';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes.constant';
import { IObject } from '@/interfaces/common.interface';
import { ICircular } from '@/interfaces/job.interface';
import { IProfileCompletionStatus } from '@/interfaces/jobseeker.interface';
import { convertEnToBn } from '@/lib/translator';
import { CircularService } from '@/services/api/circular.service';
import { JobseekerProfileService } from '@/services/api/jobseeker-profile.service';
import { differenceInDays, endOfDay, format, isPast, parseISO } from 'date-fns';
import { ArrowLeft, Boxes, CheckCheck, MapPin, Users } from 'lucide-react';
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

async function getProfileCompletion(): Promise<IProfileCompletionStatus | null> {
	try {
		const res = await JobseekerProfileService.getProfileCompletion();
		return res.body;
	} catch (error) {
		console.error('Failed to load profile completion status', error);
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
	const profileCompletion = await getProfileCompletion();
	const aParams = await params;
	const aSearchParams = await searchParams;

	const job = await getJobDetails(aParams.id);

	if (!job) {
		notFound();
	}

	const queryParams = new URLSearchParams(aSearchParams);
	const backUrl = ROUTES.JOB_SEEKER.FIND_JOBS + `?${queryParams.toString()}`;

	const deadline = parseISO(job.circularEndDate);
	const isExpired = isPast(endOfDay(deadline));
	const daysUntilDeadline = differenceInDays(endOfDay(deadline), new Date());

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
			{profileCompletion?.completionPercentage! < 75 && (
				<Alert
					variant={profileCompletion?.completionPercentage! < 50 ? 'danger' : 'warning'}
					className='animate-bounce hover:paused'
				>
					<strong>
						Your profile completion is at {profileCompletion?.completionPercentage || 0}%. Please ensure your
						profile is at least 75% complete to apply for the job.
					</strong>
				</Alert>
			)}
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
				<div className='lg:col-span-3'>
					<Card className='glassmorphism'>
						<CardHeader>
							<div className='flex justify-between items-start gap-4'>
								<div className='flex-1'>
									<CardTitle className='font-headline text-3xl'>{job.postNameBn}</CardTitle>
									<CardDescription className='flex flex-wrap items-center gap-x-4 gap-y-2 pt-4'>
										{/* <span className='flex items-center gap-2'>
											<Briefcase className='h-4 w-4' /> {job.clientOrganizationNameBn}
										</span> */}
										<span className='flex items-center gap-2'>Circular ID: {job.sequenceNo}</span>
										{job.outsourcingCategoryNameBn && (
											<span className='flex items-center gap-2'>
												<Boxes className='h-4 w-4' /> {job.outsourcingCategoryNameBn}
											</span>
										)}
										{job.outsourcingZoneNameBn && (
											<span className='flex items-center gap-2'>
												<MapPin className='h-4 w-4' /> {job.outsourcingZoneNameBn}
											</span>
										)}
										{job.vacancy && (
											<span className='flex items-center gap-2'>
												<Users className='h-4 w-4' />
												<span>{convertEnToBn(job.vacancy)} জন</span>
											</span>
										)}
										{(job.salaryFrom || job.salaryTo) && (
											<span className='flex items-center gap-2 text-base'>
												৳ {convertEnToBn(job.salaryFrom?.toLocaleString())}
												{job.salaryTo ? ` - ${convertEnToBn(job.salaryTo?.toLocaleString())}` : ''}
											</span>
										)}
									</CardDescription>
								</div>
								{profileCompletion?.completionPercentage! >= 75 && (
									<div className='flex-shrink-0'>
										{!job.applied && !isExpired && (
											<JobApplicationClient
												jobTitle={job.postNameBn}
												// jobOrganizationName={job.clientOrganizationNameBn}
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
								)}
							</div>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='flex items-center gap-4 text-sm'>
								<Badge variant='secondary'>
									Posted: {format(parseISO(job.circularPublishDate), 'dd MMM, yyyy')}
								</Badge>
								<Badge variant={isExpired ? 'danger' : daysUntilDeadline <= 7 ? 'warning' : 'secondary'}>
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
				</div>
			</div>
		</div>
	);
}
