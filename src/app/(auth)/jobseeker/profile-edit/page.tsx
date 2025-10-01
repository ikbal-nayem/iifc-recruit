
import { ProfileFormPersonal } from '@/components/app/jobseeker/profile-forms/personal';
import { candidates } from '@/lib/data';
import { ICommonMasterData } from '@/interfaces/master-data.interface';
import { MasterDataService } from '@/services/api/master-data.service';

export type EnumOption = {
	label: string;
	value: string;
};

export type PersonalInfoMasterData = {
	genders: EnumOption[];
	maritalStatuses: EnumOption[];
	professionalStatuses: EnumOption[];
	religions: EnumOption[];
	divisions: ICommonMasterData[];
};

async function getMasterData(): Promise<PersonalInfoMasterData> {
	const [gendersRes, maritalRes, professionalRes, religionRes, divisionsRes] = await Promise.allSettled([
		MasterDataService.getEnum('gender'),
		MasterDataService.getEnum('marital-status'),
		MasterDataService.getEnum('professional-status'),
		MasterDataService.getEnum('religion'),
		MasterDataService.country.getDivisions(),
	]);

	const getFulfilledValue = <T,>(
		result: PromiseSettledResult<T>,
		defaultValue: any[] = []
	): any[] => {
		if (result.status === 'fulfilled' && 'body' in result.value && Array.isArray(result.value.body)) {
			return result.value.body;
		}
		if (result.status === 'rejected') {
			// console.error('Failed to load master data for personal info:', result.reason);
		}
		return defaultValue;
	};

	return {
		genders: getFulfilledValue(gendersRes),
		maritalStatuses: getFulfilledValue(maritalRes),
		professionalStatuses: getFulfilledValue(professionalRes),
		religions: getFulfilledValue(religionRes),
		divisions: getFulfilledValue(divisionsRes),
	};
}

export default async function JobseekerProfilePersonalPage() {
	const candidate = candidates[0];
	const masterData = await getMasterData();

	return <ProfileFormPersonal candidate={candidate} masterData={masterData} />;
}
