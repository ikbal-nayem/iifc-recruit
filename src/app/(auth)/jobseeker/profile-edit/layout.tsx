import { ProfileTabs } from '@/components/app/jobseeker/profile-forms/profile-tabs';
import * as React from 'react';

export default function JobseekerProfileLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className='space-y-8'>
			<div>
				<h1 className='text-3xl font-headline font-bold'>Edit Your Profile</h1>
				<p className='text-muted-foreground'>Keep your profile updated to attract the best opportunities.</p>
			</div>
			<div className='space-y-4'>
				<div className='relative border-b'>
					<div className='flex flex-wrap items-center gap-x-6 gap-y-2'>
						<ProfileTabs />
					</div>
				</div>
				<div className='pt-4'>{children}</div>
			</div>
		</div>
	);
}
