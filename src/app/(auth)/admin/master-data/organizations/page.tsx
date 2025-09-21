
'use client';
import { OrganizationCrud } from '@/components/app/admin/organization-crud';
import { ICommonMasterData } from '@/interfaces/master-data.interface';
import { MasterDataService } from '@/services/api/master-data.service';
import { useEffect, useState } from 'react';

export default function MasterOrganizationsPage() {
	const [countries, setCountries] = useState<ICommonMasterData[]>([]);
	const [industryTypes, setIndustryTypes] = useState<ICommonMasterData[]>([]);
	const [organizationTypes, setOrganizationTypes] = useState<ICommonMasterData[]>([]);

	useEffect(() => {
		const fetchMasterData = async () => {
			const [countriesRes, industryTypesRes, orgTypesRes] = await Promise.all([
				MasterDataService.country.get(),
				MasterDataService.industryType.get(),
				MasterDataService.organizationType.get(),
			]);
			setCountries(countriesRes.body);
			setIndustryTypes(industryTypesRes.body);
			setOrganizationTypes(orgTypesRes.body);
		};

		fetchMasterData();
	}, []);

	return (
		<OrganizationCrud
			title='Organizations'
			description='Manage company and organization profiles.'
			noun='Organization'
			countries={countries}
			industryTypes={industryTypes}
			organizationTypes={organizationTypes}
		/>
	);
}
