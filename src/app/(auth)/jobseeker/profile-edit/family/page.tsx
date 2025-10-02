import { ProfileFormFamily } from '@/components/app/jobseeker/profile-forms/family';
import { MasterDataService } from '@/services/api/master-data.service';
import { JobseekerProfileService } from '@/services/api/jobseeker-profile.service';
import { EnumOption } from '../page';

export default async function JobseekerProfileFamilyPage() {
	const [districtsRes, familyInfoRes, spouseStatusRes] = await Promise.allSettled([
		MasterDataService.country.getDistricts(),
		JobseekerProfileService.family.get(),
		MasterDataService.getEnum('spouse-status'),
	]);

	const districts = districtsRes.status === 'fulfilled' ? districtsRes.value.body : [];
	const familyInfo = familyInfoRes.status === 'fulfilled' ? familyInfoRes.value.body : undefined;
	const spouseStatuses =
		spouseStatusRes.status === 'fulfilled'
			? (spouseStatusRes.value.body as EnumOption[])
			: [];

	if (districtsRes.status === 'rejected') {
		console.error('Failed to load districts:', districtsRes.reason);
	}
	if (familyInfoRes.status === 'rejected') {
		console.error('Failed to load family info:', familyInfoRes.reason);
	}
	if (spouseStatusRes.status === 'rejected') {
		console.error('Failed to load spouse statuses:', spouseStatusRes.reason);
	}

	return <ProfileFormFamily districts={districts} initialData={familyInfo} spouseStatuses={spouseStatuses} />;
}
