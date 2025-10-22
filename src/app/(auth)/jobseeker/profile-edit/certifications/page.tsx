import ProfileFormCertifications from '@/components/app/jobseeker/profile-forms/certifications';
import { MasterDataService } from '@/services/api/master-data.service';
import { ICommonMasterData } from '@/interfaces/master-data.interface';

export default async function JobseekerProfileCertificationsPage() {
	let certifications: ICommonMasterData[] = [];

	try {
		const res = await MasterDataService.certification.get();
		certifications = res.body || [];
	} catch (error) {
		console.error('Failed to load certifications:', error);
	}

	return <ProfileFormCertifications certification={certifications} />;
}
