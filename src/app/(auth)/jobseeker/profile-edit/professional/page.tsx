import { ProfileFormProfessional } from '@/components/app/jobseeker/profile-forms/professional';
import { candidates } from '@/lib/data';

export default function JobseekerProfileProfessionalPage() {
  const candidate = candidates[0];

  return <ProfileFormProfessional candidate={candidate} />;
}
