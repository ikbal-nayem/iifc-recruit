import { ProfileFormAwards } from '@/components/app/candidate/profile-forms/awards';
import { candidates } from '@/lib/data';

export default function CandidateProfileAwardsPage() {
  const candidate = candidates[0];

  return <ProfileFormAwards candidate={candidate} />;
}
