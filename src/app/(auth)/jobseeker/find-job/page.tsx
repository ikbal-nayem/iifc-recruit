import { JobListings } from '@/components/app/public/job-listings';
import { Alert } from '@/components/ui/alert';
import { IProfileCompletionStatus } from '@/interfaces/jobseeker.interface';
import { JobseekerProfileService } from '@/services/api/jobseeker-profile.service';

async function getProfileCompletion(): Promise<IProfileCompletionStatus | null> {
	try {
		const res = await JobseekerProfileService.getProfileCompletion();
		return res.body;
	} catch (error) {
		console.error('Failed to load profile completion status', error);
		return null;
	}
}

export default async function JobseekerFindJobPage() {
	const profileCompletion = await getProfileCompletion();

	return (
		<div className='space-y-4'>
			<div>
				<h1 className='text-3xl font-headline font-bold'>Find a Job</h1>
				<p className='text-muted-foreground'>Search and filter through all available opportunities.</p>
			</div>
			{profileCompletion?.completionPercentage! < 75 && (
				<Alert
					variant={profileCompletion?.completionPercentage! < 50 ? 'danger' : 'warning'}
					className='animate-bounce hover:paused'
				>
					<p>
						Your profile completion is at {profileCompletion?.completionPercentage || 0}%. Please complete
						your profile at least 75% to apply for a job.
					</p>
				</Alert>
			)}
			<JobListings />
		</div>
	);
}
