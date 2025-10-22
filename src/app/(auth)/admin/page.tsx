
import { Suspense } from 'react';
import { AdminDashboardCards, AdminDashboardCardsSkeleton } from '@/components/app/admin/dashboard/dashboard-cards';
import { AdminDashboardCharts, AdminDashboardChartsSkeleton } from '@/components/app/admin/dashboard/dashboard-charts';
import { AdminDashboardRecentActivity, AdminDashboardRecentActivitySkeleton } from '@/components/app/admin/dashboard/dashboard-recent-activity';
import { jobs, jobseekers, applications } from '@/lib/data';

async function getDashboardData() {
  const openJobs = jobs.filter(j => j.status === 'Open').length;
  const totalJobseekers = jobseekers.length;
  const newApplications = applications.filter(a => a.status === 'Applied' || a.status === 'Screening').length;

  return { openJobs, totalJobseekers, newApplications };
}


export default async function AdminDashboard() {

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          An overview of your recruitment activities.
        </p>
      </div>

      <Suspense fallback={<AdminDashboardCardsSkeleton />}>
        <AdminDashboardCards data={await getDashboardData()} />
      </Suspense>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Suspense fallback={<AdminDashboardChartsSkeleton />}>
          <AdminDashboardCharts />
        </Suspense>
        <Suspense fallback={<AdminDashboardRecentActivitySkeleton />}>
            <AdminDashboardRecentActivity />
        </Suspense>
      </div>
    </div>
  );
}
