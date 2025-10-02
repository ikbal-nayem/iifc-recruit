
import { ProfileFormFamily } from '@/components/app/jobseeker/profile-forms/family';
import { MasterDataService } from '@/services/api/master-data.service';
import { JobseekerProfileService } from '@/services/api/jobseeker-profile.service';
import { EnumOption } from '../page';
import { FamilyInfo } from '@/interfaces/jobseeker.interface';

export default async function JobseekerProfileFamilyPage() {
	const [districtsRes, spouseInfoRes, childrenInfoRes, spouseStatusRes] = await Promise.allSettled([
		MasterDataService.country.getDistricts(),
		JobseekerProfileService.spouse.get(),
		JobseekerProfileService.children.get(),
		MasterDataService.getEnum('spouse-status'),
	]);

	const districts = districtsRes.status === 'fulfilled' ? districtsRes.value.body : [];
	const spouseInfo = spouseInfoRes.status === 'fulfilled' ? spouseInfoRes.value.body : undefined;
	const childrenInfo = childrenInfoRes.status === 'fulfilled' ? childrenInfoRes.value.body : [];
	const spouseStatuses =
		spouseStatusRes.status === 'fulfilled' ? (spouseStatusRes.value.body as EnumOption[]) : [];

	const familyInfo: FamilyInfo | undefined = spouseInfo
		? { ...spouseInfo, children: childrenInfo }
		: undefined;

	if (districtsRes.status === 'rejected') {
		console.error('Failed to load districts:', districtsRes.reason);
	}
	if (spouseInfoRes.status === 'rejected') {
		console.error('Failed to load spouse info:', spouseInfoRes.reason);
	}
	if (childrenInfoRes.status === 'rejected') {
		console.error('Failed to load children info:', childrenInfoRes.reason);
	}
	if (spouseStatusRes.status === 'rejected') {
		console.error('Failed to load spouse statuses:', spouseStatusRes.reason);
	}

	return <ProfileFormFamily districts={districts} initialData={familyInfo} spouseStatuses={spouseStatuses} />;
}
