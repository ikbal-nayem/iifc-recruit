
import { AdminDashboardCards, AdminDashboardCardsSkeleton } from '@/components/app/admin/dashboard/dashboard-cards';
import { AdminDashboardCharts, AdminDashboardChartsSkeleton } from '@/components/app/admin/dashboard/dashboard-charts';
import { StatisticsService } from '@/services/api/statistics.service';
import { Suspense } from 'react';

async function getDashboardData() {
	try {
		const [jobseekerCountRes, jobRequestStatsRes, jobRequestPostStatsRes] = await Promise.allSettled([
			StatisticsService.getJobseekerStats(),
			StatisticsService.getJobRequestStats(),
			StatisticsService.getJobRequestPostStats(),
		]);

		const getCountFromStats = (res: PromiseSettledResult<any>, key: string) => {
			if (res.status === 'fulfilled' && Array.isArray(res.value.body)) {
				return res.value.body.find((stat) => stat.statusKey === key)?.count || 0;
			}
			return 0;
		};

		const getSingleCount = (res: PromiseSettledResult<any>) => {
			if (res.status === 'fulfilled' && typeof res.value.body === 'number') {
				return res.value.body;
			}
			return 0;
		};

		const jobRequestStats = jobRequestStatsRes.status === 'fulfilled' ? jobRequestStatsRes.value.body : [];

		const totalJobRequests = jobRequestStats.reduce((acc: number, stat: any) => acc + stat.count, 0);
		const completedJobRequests = getCountFromStats(jobRequestStatsRes, 'COMPLETED');
		const processingApplications = getCountFromStats(jobRequestPostStatsRes, 'PROCESSING');
		const totalJobseekers = getSingleCount(jobseekerCountRes);

		const jobRequestStatusChartData =
			jobRequestStatsRes.status === 'fulfilled'
				? jobRequestStatsRes.value.body.map((stat: any) => ({
						name: stat.statusDTO.nameEn,
						value: stat.count,
						fill: `hsl(var(--chart-${
							Object.keys(jobRequestStatsRes.value.body).indexOf(stat.statusKey) + 1
						}))`,
				  }))
				: [];

		const postStatusChartData =
			jobRequestPostStatsRes.status === 'fulfilled'
				? jobRequestPostStatsRes.value.body.map((stat: any) => ({
						name: stat.statusDTO.nameEn,
						value: stat.count,
						fill: `hsl(var(--chart-${
							Object.keys(jobRequestPostStatsRes.value.body).indexOf(stat.statusKey) + 1
						}))`,
				  }))
				: [];

		return {
			cards: {
				totalJobRequests,
				completedJobRequests,
				processingApplications,
				totalJobseekers,
			},
			charts: {
				jobRequestStatusData: jobRequestStatusChartData,
				postStatusData: postStatusChartData,
			},
		};
	} catch (error) {
		console.error('Failed to load dashboard data:', error);
		// Return zeroed-out data on error
		return {
			cards: {
				totalJobRequests: 0,
				completedJobRequests: 0,
				processingApplications: 0,
				totalJobseekers: 0,
			},
			charts: {
				jobRequestStatusData: [],
				postStatusData: [],
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
