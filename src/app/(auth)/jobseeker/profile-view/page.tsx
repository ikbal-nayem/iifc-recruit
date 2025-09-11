
import { JobseekerProfileView } from '@/components/app/jobseeker-profile-view';
import { candidates } from '@/lib/data';

export default function JobseekerPublicProfilePage() {
  return (
     <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">My Profile</h1>
        <p className="text-muted-foreground">
          This is how your profile appears to recruiters.
        </p>
      </div>
      <div className="border rounded-lg bg-card text-card-foreground shadow-sm">
        <JobseekerProfileView candidate={candidates[0]} />
      </div>
    </div>
  );
}
