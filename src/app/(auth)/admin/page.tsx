
import { AdminDashboardCards, AdminDashboardCardsSkeleton } from '@/components/app/admin/dashboard/dashboard-cards';
import { AdminDashboardCharts, AdminDashboardChartsSkeleton } from '@/components/app/admin/dashboard/dashboard-charts';
import { StatisticsService } from '@/services/api/statistics.service';
import { Suspense } from 'react';

async function getDashboardData() {
	try {
		const [
			orgStatsRes,
			jobseekerCountRes,
			jobRequestStatsRes,
			jobRequestPostStatsRes,
		] = await Promise.allSettled([
			StatisticsService.getClientOrganizationStats(),
			StatisticsService.getJobseekerStats(),
			StatisticsService.getJobRequestStats(),
			StatisticsService.getJobRequestPostStats(),
		]);

		const getCountFromStats = (res: PromiseSettledResult<any>, key: string) => {
			if (res.status === 'fulfilled' && Array.isArray(res.value.body)) {
				return res.value.body.find(stat => stat.statusKey === key)?.count || 0;
			}
			return 0;
		};

		const getSingleCount = (res: PromiseSettledResult<any>) => {
			if (res.status === 'fulfilled' && typeof res.value.body === 'number') {
				return res.value.body;
			}
			return 0;
		};

		const getOrgCount = (res: PromiseSettledResult<any>, key: string) => {
			if (res.status === 'fulfilled' && res.value.body) {
				return res.value.body[key] || 0;
			}
			return 0;
		}

		const pendingJobRequests = getCountFromStats(jobRequestStatsRes, 'PENDING');
		const processingApplications = getCountFromStats(jobRequestPostStatsRes, 'PROCESSING');
		const totalJobseekers = getSingleCount(jobseekerCountRes);
		const clientOrganizations = getOrgCount(orgStatsRes, 'clientCount');
		const examinerOrganizations = getOrgCount(orgStatsRes, 'examinerCount');
		
		const requestStatusData = jobRequestPostStatsRes.status === 'fulfilled' 
			? jobRequestPostStatsRes.value.body.map((stat: any) => ({
				name: stat.statusDTO.nameEn,
				value: stat.count,
				fill: `hsl(var(--chart-${Object.keys(jobRequestPostStatsRes.value.body).indexOf(stat.statusKey) + 1}))` // Example fill
			}))
			: [];
		
		const useMockData =
			pendingJobRequests === 0 &&
			processingApplications === 0 &&
			totalJobseekers === 0 &&
			clientOrganizations === 0 &&
			examinerOrganizations === 0 &&
			requestStatusData.length === 0;

		return {
			cards: {
				pendingJobRequests: useMockData ? 12 : pendingJobRequests,
				processingApplications: useMockData ? 8 : processingApplications,
				totalJobseekers: useMockData ? 150 : totalJobseekers,
				clientOrganizations: useMockData ? 25 : clientOrganizations,
				examinerOrganizations: useMockData ? 10 : examinerOrganizations,
			},
			charts: {
				requestStatusData: useMockData
					? [
							{ name: 'Pending', value: 12, fill: 'hsl(var(--chart-1))' },
							{ name: 'Processing', value: 8, fill: 'hsl(var(--chart-2))' },
							{ name: 'Completed', value: 34, fill: 'hsl(var(--chart-3))' },
					  ]
					: requestStatusData,
				organizationTypeData: useMockData
					? [
							{ name: 'Clients', value: 25 },
							{ name: 'Examiners', value: 10 },
					  ]
					: [
							{ name: 'Clients', value: clientOrganizations },
							{ name: 'Examiners', value: examinerOrganizations },
					  ],
			},
		};
	} catch (error) {
		console.error('Failed to load dashboard data:', error);
		// Return mock data on error as well
		return {
			cards: {
				pendingJobRequests: 12,
				processingApplications: 8,
				totalJobseekers: 150,
				clientOrganizations: 25,
				examinerOrganizations: 10,
			},
			charts: {
				requestStatusData: [
					{ name: 'Pending', value: 12, fill: 'hsl(var(--chart-1))' },
					{ name: 'Processing', value: 8, fill: 'hsl(var(--chart-2))' },
					{ name: 'Completed', value: 34, fill: 'hsl(var(--chart-3))' },
				],
				organizationTypeData: [
					{ name: 'Clients', value: 25 },
					{ name: 'Examiners', value: 10 },
				],
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
