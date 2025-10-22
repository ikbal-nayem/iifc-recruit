import { ProfileFormTraining } from '@/components/app/jobseeker/profile-forms/training';
import { MasterDataService } from '@/services/api/master-data.service';
import { ICommonMasterData } from '@/interfaces/master-data.interface';

export default async function JobseekerProfileTrainingPage() {
	let trainingTypes: ICommonMasterData[] = [];

	try {
		const res = await MasterDataService.trainingType.get();
		trainingTypes = res.body || [];
	} catch (error) {
		console.error('Failed to load training types:', error);
	}

	return <ProfileFormTraining trainingTypes={trainingTypes} />;
}
