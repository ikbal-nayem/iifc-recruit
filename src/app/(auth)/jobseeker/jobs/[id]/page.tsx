

import { jobs as allJobs } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, MapPin, Clock, Building, DollarSign, Calendar, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { JobApplicationClient } from '@/components/app/jobseeker/job-application-client';

export default function JobDetailsPage({ params, searchParams }: { params: { id: string }, searchParams: { [key: string]: string | string[] | undefined } }) {
	const job = allJobs.find((j) => j.id === params?.id);

	if (!job) {
		notFound();
	}
	
	const queryParams = new URLSearchParams();
    for (const key in searchParams) {
        const value = searchParams[key];
        if (typeof value === 'string') {
            queryParams.set(key, value);
        }
    }
    const backUrl = `/jobseeker/find-job?${queryParams.toString()}`;

	return (
		<div className='container mx-auto px-4 py-8'>
            <div className="mb-6">
                <Button variant="outline" asChild>
                    <Link href={backUrl}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
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
									<CardTitle className='font-headline text-3xl'>{job.title}</CardTitle>
									<CardDescription className='flex flex-wrap items-center gap-x-4 gap-y-2 pt-4'>
										<span className='flex items-center gap-2'>
											<Briefcase className='h-4 w-4' /> {job.department}
										</span>
										<span className='flex items-center gap-2'>
											<MapPin className='h-4 w-4' /> {job.location}
										</span>
										<span className='flex items-center gap-2'>
											<Clock className='h-4 w-4' /> {job.type}
										</span>
										<span className='flex items-center gap-2'>
											<DollarSign className='h-4 w-4' /> {job.salaryRange}
										</span>
									</CardDescription>
								</div>
								<div className='flex-shrink-0'>
									<JobApplicationClient jobTitle={job.title} />
								</div>
							</div>
						</CardHeader>
						<CardContent className='space-y-6'>
							<div className='flex items-center gap-4 text-sm'>
								<Badge variant='secondary'>Posted: {job.postedDate}</Badge>
								<Badge variant='destructive'>Deadline: {job.applicationDeadline}</Badge>
							</div>
							<div>
								<h3 className='font-semibold text-lg mb-2'>Job Description</h3>
								<p className='text-muted-foreground'>{job.description}</p>
							</div>
							<div>
								<h3 className='font-semibold text-lg mb-2'>Responsibilities</h3>
								<ul className='list-disc list-inside text-muted-foreground space-y-1'>
									{job.responsibilities.map((r, i) => (
										<li key={i}>{r}</li>
									))}
								</ul>
							</div>
							<div>
								<h3 className='font-semibold text-lg mb-2'>Requirements</h3>
								<ul className='list-disc list-inside text-muted-foreground space-y-1'>
									{job.requirements.map((r, i) => (
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
