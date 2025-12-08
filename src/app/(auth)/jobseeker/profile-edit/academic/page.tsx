import { ProfileFormAcademic } from '@/components/app/jobseeker/profile-forms/academic';
import { IApiResponse } from '@/interfaces/common.interface';
import { EnumDTO } from '@/interfaces/master-data.interface';
import { MasterDataService } from '@/services/api/master-data.service';

export default async function JobseekerProfileAcademicPage() {
	const [levelsResult, degreesResult, institutionsResult, resultSystemsRes] = await Promise.allSettled([
		MasterDataService.degreeLevel.get(),
		MasterDataService.educationDegree.get(),
		MasterDataService.educationInstitution.get(),
		MasterDataService.getEnum('result-system'),
	]);

	const getFulfilledValue = <T,>(
		result: PromiseSettledResult<IApiResponse<T[]>>,
		defaultValue: T[] = []
	): T[] => {
		if (result.status === 'fulfilled' && Array.isArray(result.value.body)) {
			return result.value.body;
		}
		if (result.status === 'rejected') {
			console.error('Failed to load master data:', result.reason);
		}
		return defaultValue;
	};

	const masterData = {
		degreeLevels: getFulfilledValue(levelsResult),
		degrees: getFulfilledValue(degreesResult),
		institutions: getFulfilledValue(institutionsResult),
		resultSystems: getFulfilledValue(resultSystemsRes as PromiseSettledResult<IApiResponse<EnumDTO[]>>),
	};

	return <ProfileFormAcademic masterData={masterData} />;
}
