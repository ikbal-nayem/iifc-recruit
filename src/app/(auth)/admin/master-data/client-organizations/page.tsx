
'use client';

import { ClientOrganizationCrud } from '@/components/app/admin/master-data/client-organization-crud';
import { ICommonMasterData } from '@/interfaces/master-data.interface';
import { MasterDataService } from '@/services/api/master-data.service';
import { useEffect, useState } from 'react';

export type FormMasterData = {
	organizationTypes: Array<ICommonMasterData>;
};

export default function MasterClientOrganizationsPage() {
	const [masterData, setMasterData] = useState<FormMasterData>({
		organizationTypes: [],
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchMasterData() {
			try {
				const [orgTypesRes] = await Promise.allSettled([
					MasterDataService.organizationType.get(),
				]);

				setMasterData({
					organizationTypes: orgTypesRes.status === 'fulfilled' ? orgTypesRes.value.body : [],
				});

				if (orgTypesRes.status === 'rejected')
					console.error('Failed to load organization types:', orgTypesRes.reason);
			} catch (error) {
				console.error('Failed to load master data for client organizations', error);
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
		<ClientOrganizationCrud
			title='Client Organizations'
			description='Manage client organization profiles.'
			noun='Client Organization'
			masterData={masterData}
		/>
	);
}
