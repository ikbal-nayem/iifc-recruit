import { Suspense } from 'react';
import { AdminDashboardCards, AdminDashboardCardsSkeleton } from '@/components/app/admin/dashboard-cards';
import { AdminDashboardCharts, AdminDashboardChartsSkeleton } from '@/components/app/admin/dashboard-charts';
import { AdminDashboardRecentActivity, AdminDashboardRecentActivitySkeleton } from '@/components/app/admin/dashboard-recent-activity';

export default function AdminDashboard() {

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          An overview of your recruitment activities.
        </p>
      </div>

      <Suspense fallback={<AdminDashboardCardsSkeleton />}>
        <AdminDashboardCards />
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
