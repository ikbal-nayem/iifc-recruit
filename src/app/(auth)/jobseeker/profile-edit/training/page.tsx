import { ProfileFormTraining } from '@/components/app/jobseeker/profile-forms/training';
import { MasterDataService } from '@/services/api/master-data.service';

export default async function JobseekerProfileTrainingPage() {
	let res;

	try {
		res = await MasterDataService.trainingType.get();
	} catch (error) {
		res = { body: [] };
		console.log(error);
	}

	return <ProfileFormTraining trainingTypes={res?.body} />;
}
