import { ProfileCompletion } from '@/components/app/jobseeker/profile-completion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes.constant';
import { IProfileCompletionStatus } from '@/interfaces/jobseeker.interface';
import { applications, jobs, jobseekers } from '@/lib/data';
import { JobseekerProfileService } from '@/services/api/jobseeker-profile.service';
import { ArrowRight, Briefcase, FileText, Star } from 'lucide-react';
import Link from 'next/link';

async function getProfileCompletionData(): Promise<IProfileCompletionStatus> {
	try {
		const response = await JobseekerProfileService.getProfileCompletion();
		return response.body;
	} catch (error) {
		console.error('Failed to load profile completion:', error);
		// Return a default/empty state on error
		return {
			completionPercentage: 0,
			formCompletionStatus: [],
		};
	}
}

export default async function JobseekerDashboardPage() {
	const jobseeker = jobseekers[0];
	const jobseekerApplications = applications.filter((app) => app.jobseekerId === jobseeker.id);
	const recentApplications = jobseekerApplications.slice(0, 3);
	const profileCompletionData = await getProfileCompletionData();

	const stats = {
		totalApplications: jobseekerApplications.length,
		interviews: jobseekerApplications.filter((app) => app.status === 'Interview').length,
		activeApplications: jobseekerApplications.filter(
			(app) => !['Hired', 'Rejected', 'Closed'].includes(app.status)
		).length,
	};

	return (
		<div className='space-y-8'>
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-8 items-start'>
				<div className='lg:col-span-2 space-y-2'>
					<h1 className='text-3xl font-headline font-bold'>Welcome, {jobseeker.personalInfo.firstName}!</h1>
					<p className='text-muted-foreground'>Here's an overview of your job search journey.</p>
				</div>
			</div>

			<ProfileCompletion profileCompletion={profileCompletionData} />

			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
				<Card className='glassmorphism card-hover'>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Total Applications</CardTitle>
						<FileText className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{stats.totalApplications}</div>
						<p className='text-xs text-muted-foreground'>Across all jobs</p>
					</CardContent>
				</Card>
				<Card className='glassmorphism card-hover'>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Active Applications</CardTitle>
						<Briefcase className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{stats.activeApplications}</div>
						<p className='text-xs text-muted-foreground'>Currently in consideration</p>
					</CardContent>
				</Card>
				<Card className='glassmorphism card-hover'>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Interviews</CardTitle>
						<Star className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{stats.interviews}</div>
						<p className='text-xs text-muted-foreground'>Scheduled or completed</p>
					</CardContent>
				</Card>
			</div>

			<Card className='glassmorphism'>
				<CardHeader>
					<CardTitle>Recent Applications</CardTitle>
					<CardDescription>Track the status of your latest job applications.</CardDescription>
				</CardHeader>
				<CardContent className='space-y-4'>
					{recentApplications.map((app) => {
						const job = jobs.find((j) => j.id === app.jobId);
						if (!job) return null;
						return (
							<div
								key={app.id}
								className='flex items-center justify-between p-3 rounded-lg border bg-background/50'
							>
								<div>
									<Link href={`/jobseeker/jobs/${job.id}`} className='font-semibold hover:underline'>
										{job.title}
									</Link>
									<p className='text-sm text-muted-foreground'>{job.department}</p>
								</div>
								<Badge variant={app.status === 'Interview' ? 'default' : 'secondary'}>{app.status}</Badge>
							</div>
						);
					})}
					{recentApplications.length === 0 && (
						<div className='text-center py-8 text-muted-foreground'>
							<p>You haven't applied to any jobs recently.</p>
						</div>
					)}
				</CardContent>
				<CardFooter>
					<Button asChild variant='link' className='group'>
						<Link href={ROUTES.JOB_SEEKER.APPLICATIONS}>
							View All Applications{' '}
							<ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
						</Link>
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
