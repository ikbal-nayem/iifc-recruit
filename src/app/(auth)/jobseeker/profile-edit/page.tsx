import { ProfileFormPersonal } from '@/components/app/jobseeker/profile-forms/personal';
import { candidates } from '@/lib/data';
import { MasterDataService } from '@/services/api/master-data.service';
import { ICommonMasterData } from '@/interfaces/master-data.interface';

export type PersonalInfoMasterData = {
	genders: ICommonMasterData[];
	maritalStatuses: ICommonMasterData[];
	professionalStatuses: ICommonMasterData[];
	religions: ICommonMasterData[];
};

async function getMasterData(): Promise<PersonalInfoMasterData> {
	try {
		const [gendersRes, maritalRes, professionalRes, religionRes] = await Promise.all([
			MasterDataService.getEnum('gender'),
			MasterDataService.getEnum('marital-status'),
			MasterDataService.getEnum('professional-status'),
			MasterDataService.getEnum('religion'),
		]);

		return {
			genders: gendersRes.body || [],
			maritalStatuses: maritalRes.body || [],
			professionalStatuses: professionalRes.body || [],
			religions: religionRes.body || [],
		};
	} catch (error) {
		console.error('Failed to load master data for personal info:', error);
		return {
			genders: [],
			maritalStatuses: [],
			professionalStatuses: [],
			religions: [],
		};
	}
}

export default async function JobseekerProfilePersonalPage() {
	const candidate = candidates[0];
	const masterData = await getMasterData();

	return <ProfileFormPersonal candidate={candidate} masterData={masterData} />;
}
