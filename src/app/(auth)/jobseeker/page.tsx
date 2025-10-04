import { ProfileCompletion } from '@/components/app/jobseeker/profile-completion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { applications, jobseekers, jobs } from '@/lib/data';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function JobseekerDashboardPage() {
	const jobseeker = jobseekers[0];
	const jobseekerApplications = applications.filter((app) => app.jobseekerId === jobseeker.id).slice(0, 3);

	return (
		<div className='space-y-8'>
			<div>
				<h1 className='text-3xl font-headline font-bold'>Welcome, {jobseeker.personalInfo.firstName}!</h1>
				<p className='text-muted-foreground'>Here's an overview of your profile and applications.</p>
			</div>

			<div className='grid grid-cols-1 gap-8'>
				<div className='space-y-8'>
					<ProfileCompletion jobseeker={jobseeker} />

					<Card className='glassmorphism'>
						<CardHeader>
							<CardTitle>Recent Applications</CardTitle>
							<CardDescription>Track the status of your latest job applications.</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							{jobseekerApplications.map((app) => {
								const job = jobs.find((j) => j.id === app.jobId);
								if (!job) return null;
								return (
									<div
										key={app.id}
										className='flex items-center justify-between p-3 rounded-lg border bg-background/50'
									>
										<div>
											<Link href={`/jobs/${job.id}`} className='font-semibold hover:underline'>
												{job.title}
											</Link>
											<p className='text-sm text-muted-foreground'>{job.department}</p>
										</div>
										<Badge variant={app.status === 'Interview' ? 'default' : 'secondary'}>{app.status}</Badge>
									</div>
								);
							})}
						</CardContent>
						<CardFooter>
							<Button asChild variant='link' className='group'>
								<Link href='/jobseeker/applications'>
									View All Applications{' '}
									<ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
								</Link>
							</Button>
						</CardFooter>
					</Card>
				</div>
			</div>
		</div>
	);
}
