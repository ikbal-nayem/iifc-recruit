
import { UserList } from '@/components/app/admin/user-management/user-list';
import { AuthService } from '@/services/api/auth.service';
import { UserService } from '@/services/api/user.service';

export default async function UserManagementPage() {
	const rolesRes = await AuthService.getRoles();
	let allRoles = rolesRes.body || [];

	try {
		const userRes = await UserService.getUserDetails();
		const currentUser = userRes.body;
		const organization = currentUser.organization;

		if (organization) {
			allRoles = allRoles.filter((role) => {
				if (organization.isClient && role.roleCode?.startsWith('CLIENT_')) return true;
				if (organization.isExaminer && role.roleCode?.startsWith('EXAMINER_')) return true;
				if (!organization.isClient && !organization.isExaminer) {
					// For admin's own organization that might not be client/examiner
					return !role.roleCode?.startsWith('CLIENT_') && !role.roleCode?.startsWith('EXAMINER_');
				}
				return false;
			});
		} else {
			// If super admin with no organization, show all roles except client/examiner specific ones
			// or adjust as needed. For now, let's assume they can manage other admins.
			allRoles = allRoles.filter(
				(role) => !role.roleCode?.startsWith('CLIENT_') && !role.roleCode?.startsWith('EXAMINER_')
			);
		}
	} catch (error) {
		console.error('Failed to fetch current user details to filter roles:', error);
		// Fallback to showing no roles or a limited set if user fetch fails
		allRoles = [];
	}

	return (
		<div className='space-y-8'>
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-headline font-bold'>User Management</h1>
					<p className='text-muted-foreground'>Manage users within your organization.</p>
				</div>
			</div>
			<UserList roles={allRoles} />
		</div>
	);
}
