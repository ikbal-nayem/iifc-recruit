
import { ProfileFormTraining } from '@/components/app/jobseeker/profile-forms/training';
import { MasterDataService } from '@/services/api/master-data.service';

export default async function JobseekerProfileTrainingPage() {

  const res = await MasterDataService.trainingType.get()

  return <ProfileFormTraining trainingTypes={res?.body} />;
}
