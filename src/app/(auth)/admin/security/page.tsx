
'use client';

import { ChangePasswordForm } from '@/components/app/change-password-form';

export default function AdminSecurityPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-headline font-bold">Security</h1>
				<p className="text-muted-foreground">Manage your account security settings.</p>
			</div>
			<ChangePasswordForm />
		</div>
	);
}
