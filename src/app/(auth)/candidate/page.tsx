import { ProfileForm } from '@/components/app/candidate/profile-form';
import { candidates } from '@/lib/data';

export default function CandidateProfilePage() {
  // In a real app, this would come from a session.
  const candidate = candidates[0];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">
          Welcome, {candidate.personalInfo.name}!
        </h1>
        <p className="text-muted-foreground">
          Keep your profile updated to attract the best opportunities.
        </p>
      </div>
      <ProfileForm candidate={candidate} />
    </div>
  );
}
