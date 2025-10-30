
'use client';

import { AdminProfileForm } from '@/components/app/admin/profile/admin-profile-form';
import { useAuth } from '@/contexts/auth-context';
import { Suspense } from 'react';
import AdminProfileLoading from './loading';

export default function AdminProfilePage() {
	const { currectUser } = useAuth();

	if (!currectUser) {
		return <AdminProfileLoading />;
	}

	const user = {
		name: currectUser.fullName || `${currectUser.firstName} ${currectUser.lastName}`,
		email: currectUser.email,
		phone: currectUser.phone || '',
		avatar: currectUser.profileImage?.filePath || '',
		profileImage: currectUser.profileImage,
	};

	return (
		<Suspense fallback={<AdminProfileLoading />}>
			<div className='space-y-8'>
				<div>
					<h1 className='text-3xl font-headline font-bold'>My Profile</h1>
					<p className='text-muted-foreground'>Manage your profile information.</p>
				</div>
				<AdminProfileForm user={user} />
			</div>
		</Suspense>
	);
}
