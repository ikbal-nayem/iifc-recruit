import { ProfileFormAcademic } from '@/components/app/jobseeker/profile-forms/academic';
import { MasterDataService } from '@/services/api/master-data.service';

export default async function JobseekerProfileAcademicPage() {
	const [levelsResult, domainsResult, institutionsResult] = await Promise.allSettled([
		MasterDataService.degreeLevel.get(),
		MasterDataService.educationDomain.get(),
		MasterDataService.educationInstitution.get(),
	]);

	const masterData = {
		degreeLevels: levelsResult.status === 'fulfilled' ? levelsResult.value.body || [] : [],
		domains: domainsResult.status === 'fulfilled' ? domainsResult.value.body || [] : [],
		institutions: institutionsResult.status === 'fulfilled' ? institutionsResult.value.body || [] : [],
	};

	return <ProfileFormAcademic masterData={masterData} />;
}
