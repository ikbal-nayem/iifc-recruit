import { ProfileFormAcademic } from '@/components/app/candidate/profile-forms/academic';
import { candidates } from '@/lib/data';

export default function CandidateProfileAcademicPage() {
  const candidate = candidates[0];

  return <ProfileFormAcademic candidate={candidate} />;
}
