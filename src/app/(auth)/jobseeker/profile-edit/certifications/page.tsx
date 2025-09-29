import ProfileFormCertifications from '@/components/app/jobseeker/profile-forms/certifications';
import { MasterDataService } from '@/services/api/master-data.service';

export default async function JobseekerProfileCertificationsPage() {
	let res;

	try {
		res = await MasterDataService.certification.get();
	} catch (error) {
		res = { body: [] };
		console.log(error);
	}

	return <ProfileFormCertifications certification={res?.body} />;
}
