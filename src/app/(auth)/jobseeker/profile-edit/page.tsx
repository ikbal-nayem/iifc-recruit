
import { ProfileFormPersonal } from '@/components/app/jobseeker/profile-forms/personal';
import { IApiResponse, ICommonMasterData } from '@/interfaces/master-data.interface';
import { MasterDataService } from '@/services/api/master-data.service';
import { Candidate, PersonalInfo } from '@/lib/types';
import { JobseekerProfileService } from '@/services/api/jobseeker-profile.service';

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
		result: PromiseSettledResult<IApiResponse<T[]>>,
		defaultValue: T[] = []
	): T[] => {
		if (result.status === 'fulfilled' && Array.isArray(result.value.body)) {
			return result.value.body;
		}
		if (result.status === 'rejected') {
			// Fail silently. The form will show an error state.
		}
		return defaultValue;
	};

	return {
		genders: getFulfilledValue(gendersRes as PromiseSettledResult<IApiResponse<EnumOption[]>>),
		maritalStatuses: getFulfilledValue(maritalRes as PromiseSettledResult<IApiResponse<EnumOption[]>>),
		professionalStatuses: getFulfilledValue(professionalRes as PromiseSettledResult<IApiResponse<EnumOption[]>>),
		religions: getFulfilledValue(religionRes as PromiseSettledResult<IApiResponse<EnumOption[]>>),
		divisions: getFulfilledValue(divisionsRes as PromiseSettledResult<IApiResponse<ICommonMasterData[]>>),
	};
}

const emptyCandidate: Candidate = {
	id: '',
	personalInfo: {
		firstName: '',
		lastName: '',
		name: '',
		fatherName: '',
		motherName: '',
		email: '',
		phone: '',
		dateOfBirth: '',
		gender: 'Male',
		maritalStatus: 'Single',
		nationality: 'Bangladeshi',
		headline: '',
		presentAddress: {} as any,
		permanentAddress: {} as any,
		avatar: '',
	},
	academicInfo: [],
	professionalInfo: [],
	skills: [],
	certifications: [],
	languages: [],
	publications: [],
	awards: [],
	trainings: [],
	resumes: [],
	status: 'Active',
};

async function getCandidateData(): Promise<Candidate> {
	try {
		const response = await JobseekerProfileService.personalInfo.get();
		// The API returns only PersonalInfo, so we construct a partial Candidate object
		return {
			...emptyCandidate,
			personalInfo: response.body as PersonalInfo,
		};
	} catch (error) {
		console.error('Failed to load candidate profile:', error);
		// Return a default empty structure if the profile can't be loaded
		return emptyCandidate;
	}
}

export default async function JobseekerProfilePersonalPage() {
	const [candidate, masterData] = await Promise.all([getCandidateData(), getMasterData()]);

	return <ProfileFormPersonal candidate={candidate} masterData={masterData} />;
}
