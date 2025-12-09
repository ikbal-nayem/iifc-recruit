import { ProfileCompletion } from '@/components/app/jobseeker/profile-completion';
import { ProfileTabs } from '@/components/app/jobseeker/profile-forms/profile-tabs';
import { IProfileCompletionStatus } from '@/interfaces/jobseeker.interface';
import { JobseekerProfileService } from '@/services/api/jobseeker-profile.service';
import * as React from 'react';

async function getProfileCompletion(): Promise<IProfileCompletionStatus | null> {
	try {
		const res = await JobseekerProfileService.getProfileCompletion();
		return res.body;
	} catch (error) {
		console.error('Failed to load profile completion status', error);
		return null;
	}
}

export default async function JobseekerProfileLayout({ children }: { children: React.ReactNode }) {
	const profileCompletion = await getProfileCompletion();

	return (
		<div className='space-y-4'>
			<h1 className='text-3xl font-headline font-bold'>Edit Your Profile</h1>

			{profileCompletion && (
				<div className='my-6'>
					<ProfileCompletion profileCompletion={profileCompletion} isCompact={true} />
				</div>
			)}

			<div className='space-y-4'>
				<div className='border-b'>
					<div className='flex flex-wrap items-center gap-2 pb-2'>
						<ProfileTabs />
					</div>
				</div>
				<div className='pt-4'>{children}</div>
			</div>
		</div>
	);
}
