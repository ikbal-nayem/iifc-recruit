import { ProfileFormProfessional } from '@/components/app/jobseeker/profile-forms/professional';
import { ICommonMasterData, IOrganization } from '@/interfaces/master-data.interface';
import { MasterDataService } from '@/services/api/master-data.service';

export type ProfessionalExperienceMasterData = {
	positionLevels: ICommonMasterData[];
	organizations: IOrganization[];
};

async function getMasterData(): Promise<ProfessionalExperienceMasterData> {
	try {
		const [positionLevelsRes, organizationsRes] = await Promise.all([
			MasterDataService.positionLevel.getList({ meta: { limit: 1000 } }),
			MasterDataService.organization.getList({ meta: { limit: 1000 } }),
		]);
		return {
			positionLevels: positionLevelsRes.body || [],
			organizations: organizationsRes.body || [],
		};
	} catch (error) {
		console.error('Failed to load professional experience master data:', error);
		return {
			positionLevels: [],
			organizations: [],
		};
	}
}

export default async function JobseekerProfileProfessionalPage() {
	const masterData = await getMasterData();

	return <ProfileFormProfessional masterData={masterData} />;
}
