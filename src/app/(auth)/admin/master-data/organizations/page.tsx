
'use client';

import { OrganizationCrud } from '@/components/app/admin/organization-crud';

export default function MasterOrganizationsPage() {
	return (
		<OrganizationCrud
			title='Organizations'
			description='Manage company and organization profiles.'
			noun='Organization'
		/>
	);
}
