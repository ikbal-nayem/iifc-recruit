import { ProfileFormAwards } from '@/components/app/candidate/profile-forms/awards';
import { candidates } from '@/lib/data';

export default function JobseekerProfileAwardsPage() {
  const candidate = candidates[0];

  return <ProfileFormAwards candidate={candidate} />;
}
