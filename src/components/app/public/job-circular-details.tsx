'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DATE_FORMAT } from '@/constants/common.constant';
import { useAuth } from '@/contexts/auth-context';
import { toast } from '@/hooks/use-toast';
import { ICircular } from '@/interfaces/job.interface';
import { getStatusVariant } from '@/lib/color-mapping';
import { convertEnToBn } from '@/lib/translator';
import { CircularService } from '@/services/api/circular.service';
import { endOfDay, format, isPast, parseISO } from 'date-fns';
import { ArrowLeft, Boxes, CheckCheck, Loader2, MapPin, Users } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { JobApplicationClient } from '../jobseeker/job-application-client';
import { JobDetailClient } from '../jobseeker/job-detail-client';

interface JobCircularDetailsProps {
	circularId: string;
	isReadOnly?: boolean;
}

export function JobCircularDetails({ circularId, isReadOnly = false }: JobCircularDetailsProps) {
	const { isAuthenticated } = useAuth();
	const [job, setJob] = useState<ICircular | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const searchParams = useSearchParams();

	useEffect(() => {
		async function getJobDetails(id: string) {
			setIsLoading(true);
			try {
				const res = await CircularService.getDetails(id);
				setJob(res.body);
			} catch (error) {
				console.error('Failed to load job details:', error);
				toast.error({
					description: 'Failed to load job details.',
				});
			} finally {
				setIsLoading(false);
			}
		}

		if (circularId) {
			getJobDetails(circularId);
		}
	}, [circularId]);

	if (isLoading) {
		return (
			<div className='flex items-center justify-center p-8 h-96'>
				<Loader2 className='h-8 w-8 animate-spin text-primary' />
			</div>
		);
	}

	if (!job) {
		return <div className='p-8 text-center'>Job details not found.</div>;
	}

	const queryParams = new URLSearchParams(searchParams.toString());
	const backUrl = `/jobs?${queryParams.toString()}`;

	const deadline = parseISO(job.circularEndDate);
	const isDeadlinePast = isPast(endOfDay(deadline));

	const renderApplyButton = () => {
		if (isReadOnly || isDeadlinePast) return null;

		if (job.applied) {
			return (
				<Badge variant='lite-success' className='h-10 px-4'>
					<CheckCheck className='mr-2 h-4 w-4' />
					Applied
				</Badge>
			);
		}

		return isAuthenticated ? (
			<JobApplicationClient
				jobTitle={job.postNameBn}
				jobOrganizationName={job.clientOrganizationNameBn}
				jobId={job.id}
			/>
		) : (
			<JobDetailClient jobTitle={job.postNameBn} jobId={job.id} />
		);
	};

	return (
		<div className='container mx-auto px-4 py-5'>
			{!isReadOnly && (
				<div className='mb-6'>
					<Button variant='outline' asChild>
						<Link href={backUrl}>
							<ArrowLeft className='mr-2 h-4 w-4' />
							Back to Listings
						</Link>
					</Button>
				</div>
			)}
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
				<div className='lg:col-span-3'>
					<Card className='glassmorphism'>
						<CardHeader>
							<div className='flex flex-col sm:flex-row justify-between items-start gap-4'>
								<div className='flex-1'>
									<CardTitle className='font-headline text-3xl'>{job.postNameBn}</CardTitle>
									<CardDescription className='flex flex-wrap items-center gap-x-4 gap-y-2 pt-4'>
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
								<div className='flex-shrink-0'>{renderApplyButton()}</div>
							</div>
						</CardHeader>
						<CardContent className='space-y-6'>
							<div className='flex items-center gap-4 text-sm'>
								<Badge variant='secondary'>
									Posted: {format(parseISO(job.circularPublishDate), DATE_FORMAT.CASUAL)}
								</Badge>
								<Badge variant={getStatusVariant(isDeadlinePast ? 'expired' : '')}>
									Deadline: {format(deadline, DATE_FORMAT.CASUAL)}
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
