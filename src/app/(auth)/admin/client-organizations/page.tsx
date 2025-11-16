'use client';

import { ClientOrganizationCrud } from '@/components/app/admin/client-organizations/client-organization-crud';
import { ICommonMasterData } from '@/interfaces/master-data.interface';
import { MasterDataService } from '@/services/api/master-data.service';
import { useEffect, useState } from 'react';

export type FormMasterData = {
	organizationTypes: Array<ICommonMasterData>;
};

export default function MasterClientOrganizationsPage() {
	const [masterData, setMasterData] = useState<FormMasterData>({ organizationTypes: [] });
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function loadData() {
			try {
				const orgTypesRes = await MasterDataService.organizationType.get();
				setMasterData({
					organizationTypes: orgTypesRes.body || [],
				});
			} catch (error) {
				console.error('Failed to load master data for client organizations', error);
			} finally {
				setIsLoading(false);
			}
		}
		loadData();
	}, []);

	if (isLoading) {
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
