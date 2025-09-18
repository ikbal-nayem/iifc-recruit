
'use client';

import { OrganizationCrud } from '@/components/app/admin/organization-crud';
import { useToast } from '@/hooks/use-toast';
import { IMeta } from '@/interfaces/common.interface';
import { ICommonMasterData, IOrganization } from '@/interfaces/master-data.interface';
import { MasterDataService } from '@/services/api/master-data.service';
import { useEffect, useState } from 'react';

export default function MasterOrganizationsPage() {
	const { toast } = useToast();
	const [countries, setCountries] = useState<ICommonMasterData[]>([]);
	const [industryTypes, setIndustryTypes] = useState<ICommonMasterData[]>([]);
	const [organizationTypes, setOrganizationTypes] = useState<ICommonMasterData[]>([]);

	useEffect(() => {
		const fetchInitialData = async () => {
			try {
				const [countriesRes, industryTypesRes, orgTypesRes] = await Promise.all([
					MasterDataService.country.get(),
					MasterDataService.industryType.get(),
					MasterDataService.organizationType.get(),
				]);
				setCountries(countriesRes.body);
				setIndustryTypes(industryTypesRes.body);
				setOrganizationTypes(orgTypesRes.body);
			} catch (error) {
				toast({
					title: 'Error',
					description: 'Failed to load initial data for the form.',
					variant: 'destructive',
				});
			}
		};
		fetchInitialData();
	}, [toast]);

	const initialData: IOrganization[] = [
		{
			id: '1',
			name: 'IIFC',
			fkCountry: '1',
			address: 'Ede-II, 6/B, 147, Mohakhali',
			postCode: '1212',
			fkIndustryType: '1',
			fkOrganizationType: '1',
			isActive: true,
		},
		{
			id: '2',
			name: 'Google',
			fkCountry: '2',
			address: '1600 Amphitheatre Parkway',
			postCode: '94043',
			fkIndustryType: '2',
			fkOrganizationType: '2',
			isActive: true,
		},
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
			countries={countries}
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
