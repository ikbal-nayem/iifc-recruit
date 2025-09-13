import { ProfileFormPersonal } from '@/components/app/jobseeker/profile-forms/personal';
import { candidates } from '@/lib/data';

export default function JobseekerProfilePersonalPage() {
  const candidate = candidates[0];

  return <ProfileFormPersonal candidate={candidate} />;
}
