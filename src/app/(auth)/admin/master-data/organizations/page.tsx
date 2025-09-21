import { OrganizationCrud } from '@/components/app/admin/organization-crud';
import { ICommonMasterData } from '@/interfaces/master-data.interface';
import { MasterDataService } from '@/services/api/master-data.service';

export type FormMasterData = {
	countries: Array<ICommonMasterData>;
	industryTypes: Array<ICommonMasterData>;
	organizationTypes: Array<ICommonMasterData>;
};

export default async function MasterOrganizationsPage() {
	const masterData: FormMasterData = { countries: [], industryTypes: [], organizationTypes: [] };

	const [countriesRes, industryTypesRes, orgTypesRes] = await Promise.all([
		MasterDataService.country.get(),
		MasterDataService.industryType.get(),
		MasterDataService.organizationType.get(),
	]);

	masterData.countries = countriesRes.body;
	masterData.industryTypes = industryTypesRes.body;
	masterData.organizationTypes = orgTypesRes.body;

	return (
		<OrganizationCrud
			title='Organizations'
			description='Manage company and organization profiles.'
			noun='Organization'
			masterData={masterData}
		/>
	);
}
