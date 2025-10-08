import { ClientOrganizationCrud } from '@/components/app/admin/master-data/client-organization-crud';
import { ICommonMasterData } from '@/interfaces/master-data.interface';
import { MasterDataService } from '@/services/api/master-data.service';

export type FormMasterData = {
	organizationTypes: Array<ICommonMasterData>;
};

export default async function MasterClientOrganizationsPage() {
	let masterData:FormMasterData = {organizationTypes: []};

	try {
		const [orgTypesRes] = await Promise.allSettled([MasterDataService.organizationType.get()]);
		masterData = {
			organizationTypes: orgTypesRes.status === 'fulfilled' ? orgTypesRes.value.body : [],
		};
		if (orgTypesRes.status === 'rejected')
			console.error('Failed to load organization types:', orgTypesRes.reason);
	} catch (error) {
		console.error('Failed to load master data for client organizations', error);
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
