import { UserList } from '@/components/app/admin/user-management/user-list';
import { IUser } from '@/interfaces/auth.interface';
import { IRole } from '@/interfaces/master-data.interface';
import { AuthService } from '@/services/api/auth.service';
import { UserService } from '@/services/api/user.service';

async function getData(): Promise<{
	roles: IRole[];
	currentUser: IUser | null;
}> {
	try {
		const [rolesRes, userRes] = await Promise.allSettled([
			AuthService.getRoles(),
			UserService.getUserDetails(),
		]);

		const allRoles = rolesRes.status === 'fulfilled' ? rolesRes.value.body || [] : [];
		const currentUser = userRes.status === 'fulfilled' ? userRes.value.body : null;

		return { roles: allRoles, currentUser };
	} catch (error) {
		console.error('Failed to fetch data for user management:', error);
		return { roles: [], currentUser: null };
	}
}

export default async function UserManagementPage() {
	const { roles, currentUser } = await getData();

	return (
		<div className='space-y-8'>
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-headline font-bold'>User Management</h1>
					<p className='text-muted-foreground'>
						{currentUser?.organizationId
							? 'Manage users within your organization.'
							: 'Manage all users across the system.'}
					</p>
				</div>
			</div>
			<UserList allRoles={roles} />
		</div>
	);
}
