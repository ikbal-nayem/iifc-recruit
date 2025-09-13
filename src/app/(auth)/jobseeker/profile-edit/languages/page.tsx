import { ProfileFormLanguages } from '@/components/app/jobseeker/profile-forms/languages';
import { candidates } from '@/lib/data';

export default function JobseekerProfileLanguagesPage() {
  const candidate = candidates[0];

  return <ProfileFormLanguages candidate={candidate} />;
}
