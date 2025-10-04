import { JobseekerProfileView } from '@/components/app/jobseeker-profile-view';
import { JobseekerProfileService } from '@/services/api/jobseeker-profile.service';

async function getProfileData() {
	try {
		const response = await JobseekerProfileService.getProfile();
		return response.body;
	} catch (error) {
		console.error('Failed to load jobseeker profile:', error);
		return null;
	}
}

export default async function JobseekerPublicProfilePage() {
	const jobseeker = await getProfileData();

	if (!jobseeker) {
		return (
			<div className='flex flex-col items-center justify-center h-full'>
				<p className='text-muted-foreground'>Could not load profile. Please try again later.</p>
			</div>
		);
	}

	return (
		<div className='space-y-8'>
			<div>
				<h1 className='text-3xl font-headline font-bold'>My Profile</h1>
				<p className='text-muted-foreground'>This is how your profile appears to recruiters.</p>
			</div>
			<div className='border rounded-lg bg-card text-card-foreground shadow-sm'>
				<JobseekerProfileView jobseeker={jobseeker} />
			</div>
		</div>
	);
}
