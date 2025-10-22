'use client';
import { OrganizationCrud } from '@/components/app/admin/master-data/organization-crud';
import { ICommonMasterData } from '@/interfaces/master-data.interface';
import { MasterDataService } from '@/services/api/master-data.service';
import { useEffect, useState } from 'react';

export type FormMasterData = {
	countries: Array<ICommonMasterData>;
	industryTypes: Array<ICommonMasterData>;
	organizationTypes: Array<ICommonMasterData>;
};

export default function MasterOrganizationsPage() {
	const [masterData, setMasterData] = useState<FormMasterData>({
		countries: [],
		industryTypes: [],
		organizationTypes: [],
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchMasterData() {
			try {
				const [countriesRes, industryTypesRes, orgTypesRes] = await Promise.allSettled([
					MasterDataService.country.get(),
					MasterDataService.industryType.get(),
					MasterDataService.organizationType.get(),
				]);

				setMasterData({
					countries: countriesRes.status === 'fulfilled' ? countriesRes.value.body : [],
					industryTypes: industryTypesRes.status === 'fulfilled' ? industryTypesRes.value.body : [],
					organizationTypes: orgTypesRes.status === 'fulfilled' ? orgTypesRes.value.body : [],
				});

				if (countriesRes.status === 'rejected') console.error('Failed to load countries:', countriesRes.reason);
				if (industryTypesRes.status === 'rejected')
					console.error('Failed to load industry types:', industryTypesRes.reason);
				if (orgTypesRes.status === 'rejected')
					console.error('Failed to load organization types:', orgTypesRes.reason);
			} catch (error) {
				console.error('Failed to load master data for organizations', error);
			} finally {
				setLoading(false);
			}
		}

		fetchMasterData();
	}, []);

	if (loading) {
		return <div>Loading...</div>; // Or a proper skeleton loader
	}

	return (
		<OrganizationCrud
			title='Organizations'
			description='Manage company and organization profiles.'
			noun='Organization'
			masterData={masterData}
		/>
	);
}
