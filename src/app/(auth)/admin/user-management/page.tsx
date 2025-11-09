import { UserList } from '@/components/app/admin/user-management/user-list';
import { IUser } from '@/interfaces/auth.interface';
import { IClientOrganization, IRole } from '@/interfaces/master-data.interface';
import { AuthService } from '@/services/api/auth.service';
import { MasterDataService } from '@/services/api/master-data.service';
import { UserService } from '@/services/api/user.service';

async function getData(): Promise<{
	roles: IRole[];
	organizations: IClientOrganization[];
	currentUser: IUser | null;
}> {
	try {
		const [rolesRes, userRes, orgsRes] = await Promise.allSettled([
			AuthService.getRoles(),
			UserService.getUserDetails(),
			MasterDataService.clientOrganization.getList({}),
		]);

		const allRoles = rolesRes.status === 'fulfilled' ? rolesRes.value.body || [] : [];
		const currentUser = userRes.status === 'fulfilled' ? userRes.value.body : null;
		const allOrganizations = orgsRes.status === 'fulfilled' ? orgsRes.value.body : [];

		return { roles: allRoles, currentUser, organizations: allOrganizations };
	} catch (error) {
		console.error('Failed to fetch data for user management:', error);
		return { roles: [], currentUser: null, organizations: [] };
	}
}

export default async function UserManagementPage() {
	const { roles, currentUser, organizations } = await getData();

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
			<UserList allRoles={roles} allOrganizations={organizations} />
		</div>
	);
}
