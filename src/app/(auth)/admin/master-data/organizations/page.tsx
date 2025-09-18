'use client';

import { OrganizationCrud } from '@/components/app/admin/organization-crud';
import { IMeta } from '@/interfaces/common.interface';

export default function MasterOrganizationsPage() {
	const initialData = [
		{
			id: '1',
			name: 'IIFC',
			fkCountry: 'Bangladesh',
			address: 'Ede-II, 6/B, 147, Mohakhali',
			postCode: '1212',
			fkIndustryType: 'Infrastructure',
			fkOrganizationType: 'Government',
			isActive: true,
		},
		{
			id: '2',
			name: 'Google',
			fkCountry: 'United States',
			address: '1600 Amphitheatre Parkway',
			postCode: '94043',
			fkIndustryType: 'Information Technology',
			fkOrganizationType: 'Multinational',
			isActive: true,
		},
	];

	const industryTypes = [
		{ id: '1', name: 'Information Technology', isActive: true },
		{ id: '2', name: 'Finance & Banking', isActive: true },
		{ id: '3', name: 'Telecommunication', isActive: true },
		{ id: '4', name: 'Infrastructure', isActive: true },
	];
	const organizationTypes = [
		{ id: '1', name: 'Government', isActive: true },
		{ id: '2', name: 'Private', isActive: true },
		{ id: '3', name: 'Non-profit', isActive: true },
		{ id: '4', name: 'Multinational', isActive: true },
	];

	const meta: IMeta = {
		page: 0,
		limit: initialData.length,
		totalRecords: initialData.length,
	};

	const handleNoOp = async () => {
		console.log('This is a mock operation.');
		return true;
	};

	return (
		<OrganizationCrud
			title='Organizations'
			description='Manage company and organization profiles.'
			items={initialData}
			meta={meta}
			isLoading={false}
			noun='Organization'
			industryTypes={industryTypes}
			organizationTypes={organizationTypes}
			onAdd={async () => handleNoOp()}
			onUpdate={async () => handleNoOp()}
			onDelete={async () => handleNoOp()}
			onPageChange={() => {}}
			onSearch={() => {}}
		/>
	);
}
