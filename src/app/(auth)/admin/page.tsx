
import { AdminDashboardCards, AdminDashboardCardsSkeleton } from '@/components/app/admin/dashboard/dashboard-cards';
import { AdminDashboardCharts, AdminDashboardChartsSkeleton } from '@/components/app/admin/dashboard/dashboard-charts';
import { JobRequestService } from '@/services/api/job-request.service';
import { Suspense } from 'react';

async function getDashboardData() {
	try {
		const [pendingRequestsRes, processingPostsRes, shortlistedPostsRes, completedRequestsRes] = await Promise.allSettled([
			JobRequestService.getList({ body: { status: 'PENDING' }, meta: { limit: 1 } }),
			JobRequestService.getRequestedPosts({ body: { status: 'PROCESSING' }, meta: { limit: 1 } }),
			JobRequestService.getRequestedPosts({ body: { status: 'SHORTLISTED' }, meta: { limit: 1 } }),
			JobRequestService.getList({ body: { status: 'COMPLETED' }, meta: { limit: 1 } }),
		]);

		const pendingJobRequests =
			pendingRequestsRes.status === 'fulfilled' ? pendingRequestsRes.value.meta?.totalRecords || 0 : 0;
		const processingApplications =
			processingPostsRes.status === 'fulfilled' ? processingPostsRes.value.meta?.totalRecords || 0 : 0;
		const shortlistedCandidates =
			shortlistedPostsRes.status === 'fulfilled' ? shortlistedPostsRes.value.meta?.totalRecords || 0 : 0;
		const completedJobRequests =
			completedRequestsRes.status === 'fulfilled' ? completedRequestsRes.value.meta?.totalRecords || 0 : 0;

		return {
			cards: {
				pendingJobRequests,
				processingApplications,
				shortlistedCandidates,
			},
			charts: {
				requestStatusData: [
					{ name: 'Pending', value: pendingJobRequests, fill: 'hsl(var(--warning))' },
					{ name: 'Processing', value: processingApplications, fill: 'hsl(var(--info))' },
					{ name: 'Completed', value: completedJobRequests, fill: 'hsl(var(--success))' },
				],
				// Mock data for application funnel until a real endpoint is available
				applicationStatusData: [
					{ name: 'Applied', value: 250 },
					{ name: 'Accepted', value: 150 },
					{ name: 'Shortlisted', value: 90 },
					{ name: 'Interview', value: 45 },
					{ name: 'Hired', value: 15 },
				],
			},
		};
	} catch (error) {
		console.error('Failed to load dashboard data:', error);
		return {
			cards: {
				pendingJobRequests: 0,
				processingApplications: 0,
				shortlistedCandidates: 0,
			},
			charts: {
				requestStatusData: [],
				applicationStatusData: [],
			},
		};
	}
}

export default async function AdminDashboard() {
	const dashboardData = await getDashboardData();
	return (
		<div className='space-y-8'>
			<div>
				<h1 className='text-3xl font-headline font-bold'>Admin Dashboard</h1>
				<p className='text-muted-foreground'>An overview of your recruitment activities.</p>
			</div>

			<Suspense fallback={<AdminDashboardCardsSkeleton />}>
				<AdminDashboardCards data={dashboardData.cards} />
			</Suspense>

			<div className='grid gap-6 md:grid-cols-1'>
				<Suspense fallback={<AdminDashboardChartsSkeleton />}>
					<AdminDashboardCharts data={dashboardData.charts} />
				</Suspense>
			</div>
		</div>
	);
}
