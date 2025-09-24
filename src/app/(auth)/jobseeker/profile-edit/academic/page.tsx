import { ProfileFormAcademic } from '@/components/app/jobseeker/profile-forms/academic';
import { candidates } from '@/lib/data';

export default function JobseekerProfileAcademicPage() {
  const candidate = candidates[0];

  return <ProfileFormAcademic candidate={candidate} />;
}
