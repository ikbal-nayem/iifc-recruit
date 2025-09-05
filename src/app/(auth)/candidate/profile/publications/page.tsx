import { ProfileFormPublications } from '@/components/app/candidate/profile-forms/publications';
import { candidates } from '@/lib/data';

export default function CandidateProfilePublicationsPage() {
  const candidate = candidates[0];

  return <ProfileFormPublications candidate={candidate} />;
}
