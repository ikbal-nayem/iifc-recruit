import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { IObject } from '@/interfaces/common.interface';
import { ICircular } from '@/interfaces/job.interface';
import { CircularService } from '@/services/api/circular.service';
import { format, parseISO } from 'date-fns';
import { ArrowLeft, Briefcase, Clock, DollarSign, MapPin } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JobDetailClient } from '../../../../components/app/jobseeker/job-detail-client';

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

	const queryParams = new URLSearchParams(aSearchParams as Record<string, string>);
	const backUrl = `/jobs?${queryParams.toString()}`;

	return (
		<div className='container mx-auto px-4 py-5'>
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
										<span className='flex items-center gap-2'>
											<Clock className='h-4 w-4' /> {job.outsourcing ? 'Outsourcing' : 'Permanent'}
										</span>
										{(job.salaryFrom || job.salaryTo) && (
											<span className='flex items-center gap-2'>
												<DollarSign className='h-4 w-4' /> {job.salaryFrom} - {job.salaryTo}
											</span>
										)}
									</CardDescription>
								</div>
								<div className='flex-shrink-0'>
									<JobDetailClient jobTitle={job.postNameEn} />
								</div>
							</div>
						</CardHeader>
						<CardContent className='space-y-6'>
							<div className='flex items-center gap-4 text-sm'>
								<Badge variant='secondary'>
									Posted: {format(parseISO(job.circularPublishDate), 'dd MMM, yyyy')}
								</Badge>
								<Badge variant='danger'>
									Deadline: {format(parseISO(job.circularEndDate), 'dd MMM, yyyy')}
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
