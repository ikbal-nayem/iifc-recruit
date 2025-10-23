
import { AdminDashboardCards, AdminDashboardCardsSkeleton } from '@/components/app/admin/dashboard/dashboard-cards';
import { AdminDashboardCharts, AdminDashboardChartsSkeleton } from '@/components/app/admin/dashboard/dashboard-charts';
import { AdminDashboardRecentActivity, AdminDashboardRecentActivitySkeleton } from '@/components/app/admin/dashboard/dashboard-recent-activity';
import { JobRequestService } from '@/services/api/job-request.service';
import { Suspense } from 'react';

async function getDashboardData() {
	try {
		const [pendingRequestsRes, processingAppsRes, shortlistedRes] = await Promise.allSettled([
			JobRequestService.getList({ body: { status: 'PENDING' }, meta: { limit: 1 } }),
			JobRequestService.getRequestedPosts({ body: { status: 'PROCESSING' }, meta: { limit: 1 } }),
			JobRequestService.getRequestedPosts({ body: { status: 'SHORTLISTED' }, meta: { limit: 1 } }),
		]);

		return {
			pendingJobRequests: pendingRequestsRes.status === 'fulfilled' ? pendingRequestsRes.value.meta.totalRecords || 0 : 0,
			processingApplications:
				processingAppsRes.status === 'fulfilled' ? processingAppsRes.value.meta.totalRecords || 0 : 0,
			shortlistedCandidates:
				shortlistedRes.status === 'fulfilled' ? shortlistedRes.value.meta.totalRecords || 0 : 0,
		};
	} catch (error) {
		console.error('Failed to load dashboard data:', error);
		return {
			pendingJobRequests: 0,
			processingApplications: 0,
			shortlistedCandidates: 0,
		};
	}
}

export default async function AdminDashboard() {
	return (
		<div className='space-y-8'>
			<div>
				<h1 className='text-3xl font-headline font-bold'>Admin Dashboard</h1>
				<p className='text-muted-foreground'>An overview of your recruitment activities.</p>
			</div>

			<Suspense fallback={<AdminDashboardCardsSkeleton />}>
				<AdminDashboardCards data={await getDashboardData()} />
			</Suspense>

			<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-5'>
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
