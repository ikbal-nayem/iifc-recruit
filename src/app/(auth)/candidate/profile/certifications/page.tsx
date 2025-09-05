import { ProfileFormCertifications } from '@/components/app/candidate/profile-forms/certifications';
import { candidates } from '@/lib/data';

export default function CandidateProfileCertificationsPage() {
  const candidate = candidates[0];

  return <ProfileFormCertifications candidate={candidate} />;
}
