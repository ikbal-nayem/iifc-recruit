
import { MyApplications } from '@/components/app/candidate/my-applications';

export default function JobseekerApplicationsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">My Applications</h1>
        <p className="text-muted-foreground">
          Track the status of all your job applications.
        </p>
      </div>
      <MyApplications />
    </div>
  );
}
