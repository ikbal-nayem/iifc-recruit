
'use client';

import { Suspense } from 'react';
import { JobseekerManagement } from '@/components/app/admin/jobseeker-management';
import AdminJobseekersLoading from './loading';

export default function AdminJobseekersPage() {
  return (
    <Suspense fallback={<AdminJobseekersLoading />}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-headline font-bold">Jobseeker Management</h1>
          <p className="text-muted-foreground">
            Browse, filter, and manage all jobseekers in your talent pool.
          </p>
        </div>
        <JobseekerManagement />
      </div>
    </Suspense>
  );
}


