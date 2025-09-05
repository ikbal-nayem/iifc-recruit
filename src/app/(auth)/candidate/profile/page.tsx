import { ProfileFormPersonal } from '@/components/app/candidate/profile-forms/personal';
import { candidates } from '@/lib/data';

export default function CandidateProfilePersonalPage() {
  const candidate = candidates[0];

  return <ProfileFormPersonal candidate={candidate} />;
}
