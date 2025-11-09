import { UserList } from '@/components/app/admin/user-management/user-list';
import { AuthService } from '@/services/api/auth.service';
import { MasterDataService } from '@/services/api/master-data.service';
import { UserService } from '@/services/api/user.service';
import { IClientOrganization, IRole } from '@/interfaces/master-data.interface';
import { IUser } from '@/interfaces/auth.interface';

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

		let filteredRoles = allRoles;

		if (currentUser && currentUser.organizationId) {
			const organization = currentUser.organization;
			if (organization) {
				if (organization.isClient) {
					filteredRoles = allRoles.filter((role) => role.roleCode?.startsWith('CLIENT_'));
				} else if (organization.isExaminer) {
					filteredRoles = allRoles.filter((role) => role.roleCode?.startsWith('EXAMINER_'));
				} else {
					// For admin's own organization that might not be client/examiner
					filteredRoles = allRoles.filter((role) => role.roleCode?.startsWith('IIFC_'));
				}
			}
		} else if (currentUser?.userType !== 'SYSTEM') {
			// If not super admin and no organization, maybe show nothing or default roles
			filteredRoles = allRoles.filter((role) => role.roleCode?.startsWith('IIFC_'));
		}
		// For SYSTEM user, filteredRoles remains allRoles

		return { roles: filteredRoles, currentUser, organizations: allOrganizations };
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
			<UserList roles={roles} allOrganizations={organizations} />
		</div>
	);
}
