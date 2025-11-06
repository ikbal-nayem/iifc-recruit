
import { UserList } from '@/components/app/admin/user-management/user-list';
import { AuthService } from '@/services/api/auth.service';

export default async function UserManagementPage() {
	const rolesRes = await AuthService.getRoles();
	const roles = rolesRes.body || [];

	return (
		<div className='space-y-8'>
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-headline font-bold'>User Management</h1>
					<p className='text-muted-foreground'>Manage users within your organization.</p>
				</div>
			</div>
			<UserList roles={roles} />
		</div>
	);
}
