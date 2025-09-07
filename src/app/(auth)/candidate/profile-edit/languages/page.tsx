import { ProfileFormLanguages } from '@/components/app/candidate/profile-forms/languages';
import { candidates } from '@/lib/data';

export default function CandidateProfileLanguagesPage() {
  const candidate = candidates[0];

  return <ProfileFormLanguages candidate={candidate} />;
}
