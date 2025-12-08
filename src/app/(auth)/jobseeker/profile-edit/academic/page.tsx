import { ProfileFormAcademic } from '@/components/app/jobseeker/profile-forms/academic';
import { MasterDataService } from '@/services/api/master-data.service';

export default async function JobseekerProfileAcademicPage() {
	const [levelsResult, degreesResult, institutionsResult] = await Promise.allSettled([
		MasterDataService.degreeLevel.get(),
		MasterDataService.educationDegree.get(),
		MasterDataService.educationInstitution.get(),
	]);

	const masterData = {
		degreeLevels: levelsResult.status === 'fulfilled' ? levelsResult.value.body || [] : [],
		degrees: degreesResult.status === 'fulfilled' ? degreesResult.value.body || [] : [],
		institutions: institutionsResult.status === 'fulfilled' ? institutionsResult.value.body || [] : [],
	};

	if (levelsResult.status === 'rejected') {
		console.error('Failed to load degree levels:', levelsResult.reason);
	}
	if (degreesResult.status === 'rejected') {
		console.error('Failed to load degrees:', degreesResult.reason);
	}
	if (institutionsResult.status === 'rejected') {
		console.error('Failed to load institutions:', institutionsResult.reason);
	}

	return <ProfileFormAcademic masterData={masterData} />;
}
