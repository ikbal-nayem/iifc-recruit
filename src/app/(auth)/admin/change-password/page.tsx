import { ChangePasswordForm } from '@/components/app/change-password-form';

export default function AdminChangePasswordPage() {
	return (
		<div className="space-y-4">
			<div>
				<h1 className="text-3xl font-headline font-bold">Change Password</h1>
				<p className="text-muted-foreground">Manage your account security settings.</p>
			</div>
			<ChangePasswordForm />
		</div>
	);
}
