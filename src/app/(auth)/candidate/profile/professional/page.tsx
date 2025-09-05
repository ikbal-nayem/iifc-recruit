import { ProfileFormProfessional } from '@/components/app/candidate/profile-forms/professional';
import { candidates } from '@/lib/data';

export default function CandidateProfileProfessionalPage() {
  const candidate = candidates[0];

  return <ProfileFormProfessional candidate={candidate} />;
}
