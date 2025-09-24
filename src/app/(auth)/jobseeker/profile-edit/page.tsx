import { ProfileFormPersonal } from '@/components/app/jobseeker/profile-forms/personal';
import { candidates } from '@/lib/data';
import { Suspense } from 'react';

export default function JobseekerProfilePersonalPage() {
	const candidate = candidates[0];

	return (
		<Suspense fallback={<div>Loading applications...</div>}>
			<ProfileFormPersonal candidate={candidate} />
		</Suspense>
	);
}
