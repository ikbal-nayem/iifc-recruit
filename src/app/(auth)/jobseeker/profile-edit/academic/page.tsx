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

	if (levelsResult.status === 'rejected') {
		console.error('Failed to load degree levels:', levelsResult.reason);
	}
	if (domainsResult.status === 'rejected') {
		console.error('Failed to load domains:', domainsResult.reason);
	}
	if (institutionsResult.status === 'rejected') {
		console.error('Failed to load institutions:', institutionsResult.reason);
	}

	return <ProfileFormAcademic masterData={masterData} />;
}
