import { CandidateManagement } from '@/components/app/admin/candidate-management';

export default function AdminCandidatesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Jobseeker Management</h1>
        <p className="text-muted-foreground">
          Browse, filter, and manage all jobseekers in your talent pool.
        </p>
      </div>
      <CandidateManagement />
    </div>
  );
}
