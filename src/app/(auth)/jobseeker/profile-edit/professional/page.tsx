import { ProfileFormProfessional } from '@/components/app/jobseeker/profile-forms/professional';
import { IBilingualMasterData, IOrganization } from '@/interfaces/master-data.interface';
import { MasterDataService } from '@/services/api/master-data.service';

export type ProfessionalExperienceMasterData = {
	positionLevels: IBilingualMasterData[];
	organizations: IOrganization[];
};

async function getMasterData(): Promise<ProfessionalExperienceMasterData> {
	const [positionLevelsRes, organizationsRes] = await Promise.allSettled([
		MasterDataService.positionLevel.get(),
		MasterDataService.organization.get(),
	]);

	const positionLevels =
		positionLevelsRes.status === 'fulfilled' ? positionLevelsRes.value.body || [] : [];
	const organizations = organizationsRes.status === 'fulfilled' ? organizationsRes.value.body || [] : [];

	if (positionLevelsRes.status === 'rejected') {
		console.error('Failed to load position levels:', positionLevelsRes.reason);
	}
	if (organizationsRes.status === 'rejected') {
		console.error('Failed to load organizations:', organizationsRes.reason);
	}

	return {
		positionLevels,
		organizations,
	};
}

export default async function JobseekerProfileProfessionalPage() {
	const masterData = await getMasterData();

	return <ProfileFormProfessional masterData={masterData} />;
}
