'use client';

import { JobManagement } from '@/components/app/admin/job-management';

export default function AdminJobsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Job Management</h1>
        <p className="text-muted-foreground">
          Create, edit, and manage all job postings for your organization.
        </p>
      </div>
      <JobManagement />
    </div>
  );
}
