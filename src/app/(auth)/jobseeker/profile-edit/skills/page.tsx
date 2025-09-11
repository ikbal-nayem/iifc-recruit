import { ProfileFormSkills } from '@/components/app/candidate/profile-forms/skills';
import { candidates } from '@/lib/data';

export default function JobseekerProfileSkillsPage() {
  const candidate = candidates[0];

  return <ProfileFormSkills candidate={candidate} />;
}
