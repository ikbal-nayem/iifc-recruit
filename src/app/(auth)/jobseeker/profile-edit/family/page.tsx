import { ProfileFormFamily } from '@/components/app/jobseeker/profile-forms/family';
import { MasterDataService } from '@/services/api/master-data.service';
import { JobseekerProfileService } from '@/services/api/jobseeker-profile.service';

export default async function JobseekerProfileFamilyPage() {
	const [districtsRes, familyInfoRes] = await Promise.allSettled([
		MasterDataService.country.getDistricts(),
		JobseekerProfileService.family.get(),
	]);

	const districts = districtsRes.status === 'fulfilled' ? districtsRes.value.body : [];
	const familyInfo = familyInfoRes.status === 'fulfilled' ? familyInfoRes.value.body : undefined;

	if (districtsRes.status === 'rejected') {
		console.error('Failed to load districts:', districtsRes.reason);
	}
	if (familyInfoRes.status === 'rejected') {
		console.error('Failed to load family info:', familyInfoRes.reason);
	}

	return <ProfileFormFamily districts={districts} initialData={familyInfo} />;
}
