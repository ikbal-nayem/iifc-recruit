import { ProfileFormPersonal } from '@/components/app/jobseeker/profile-forms/personal';
import { IApiResponse } from '@/interfaces/common.interface';
import { PersonalInfo } from '@/interfaces/jobseeker.interface';
import { ICommonMasterData } from '@/interfaces/master-data.interface';
import { JobseekerProfileService } from '@/services/api/jobseeker-profile.service';
import { MasterDataService } from '@/services/api/master-data.service';

export type EnumOption = {
	label: string;
	value: string;
};

export type PersonalInfoMasterData = {
	genders: EnumOption[];
	maritalStatuses: EnumOption[];
	religions: EnumOption[];
	divisions: ICommonMasterData[];
};

async function getMasterData(): Promise<PersonalInfoMasterData> {
	const [gendersRes, maritalRes, religionRes, divisionsRes] = await Promise.allSettled([
		MasterDataService.getEnum('gender'),
		MasterDataService.getEnum('marital-status'),
		MasterDataService.getEnum('religion'),
		MasterDataService.country.getDivisions(),
	]);

	const getFulfilledValue = <T,>(
		result: PromiseSettledResult<IApiResponse<T[]>>,
		defaultValue: T[] = []
	): T[] => {
		if (result.status === 'fulfilled' && Array.isArray(result.value.body)) {
			return result.value.body;
		}
		if (result.status === 'rejected') {
		}
		return defaultValue;
	};

	return {
		genders: getFulfilledValue(gendersRes as PromiseSettledResult<IApiResponse<EnumOption[]>>),
		maritalStatuses: getFulfilledValue(maritalRes as PromiseSettledResult<IApiResponse<EnumOption[]>>),
		religions: getFulfilledValue(religionRes as PromiseSettledResult<IApiResponse<EnumOption[]>>),
		divisions: getFulfilledValue(divisionsRes as PromiseSettledResult<IApiResponse<ICommonMasterData[]>>),
	};
}

const emptyPersonalInfo: PersonalInfo = {
	id: undefined,
	firstName: '',
	middleName: '',
	lastName: '',
	fatherName: '',
	motherName: '',
	email: '',
	phone: '',
	dateOfBirth: '',
	gender: 'MALE',
	maritalStatus: 'SINGLE',
	nationality: 'Bangladeshi',
	careerObjective: '',
	nid: '',
	passportNo: '',
	birthCertificate: '',
	religion: '',
	presentAddress: '',
	permanentAddress: '',
	linkedInProfile: '',
	videoProfile: '',
};

async function getJobseekerData(): Promise<PersonalInfo> {
	try {
		const response = await JobseekerProfileService.personalInfo.get();
		return response.body as PersonalInfo;
	} catch (error) {
		console.error('Failed to load jobseeker profile:', error);
		return emptyPersonalInfo;
	}
}

export default async function JobseekerProfilePersonalPage() {
	const [personalInfo, masterData] = await Promise.all([getJobseekerData(), getMasterData()]);

	return <ProfileFormPersonal personalInfo={personalInfo} masterData={masterData} />;
}
