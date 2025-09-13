import { ProfileFormPublications } from '@/components/app/jobseeker/profile-forms/publications';
import { candidates } from '@/lib/data';

export default function JobseekerProfilePublicationsPage() {
  const candidate = candidates[0];

  return <ProfileFormPublications candidate={candidate} />;
}
