import { ProfileCompletion } from '@/components/app/candidate/profile-completion';
import { candidates } from '@/lib/data';

export default function CandidateDashboardPage() {
  const candidate = candidates[0];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">
          Welcome, {candidate.personalInfo.firstName}!
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your profile and applications.
        </p>
      </div>
      <ProfileCompletion candidate={candidate} />
    </div>
  );
}
