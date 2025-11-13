
import { AdminDashboardCards, AdminDashboardCardsSkeleton } from '@/components/app/admin/dashboard/dashboard-cards';
import { AdminDashboardCharts, AdminDashboardChartsSkeleton } from '@/components/app/admin/dashboard/dashboard-charts';
import { ROLES } from '@/constants/auth.constant';
import { IUser } from '@/interfaces/auth.interface';
import { JobRequestStatus } from '@/interfaces/job.interface';
import { StatisticsService } from '@/services/api/statistics.service';
import { UserService } from '@/services/api/user.service';
import { Suspense } from 'react';

async function getDashboardData(user: IUser) {
	const isAdmin = user.roles.includes(ROLES.SUPER_ADMIN) || user.roles.includes(ROLES.IIFC_ADMIN);
	if (!isAdmin) return null;

	try {
		const [jobseekerCountRes, jobRequestStatsRes, jobRequestPostStatsRes, clientOrgStatsRes] =
			await Promise.allSettled([
				StatisticsService.getJobseekerStats(),
				StatisticsService.getJobRequestStats(),
				StatisticsService.getJobRequestPostStats(),
				StatisticsService.getClientOrganizationStats(),
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

		const processingJobRequests = getCountFromStats(jobRequestStatsRes, JobRequestStatus.PROCESSING);
		const totalJobseekers = getSingleCount(jobseekerCountRes);

		const clientOrgStats = clientOrgStatsRes.status === 'fulfilled' ? clientOrgStatsRes.value.body : null;

		const jobRequestStatusChartData =
			jobRequestStatsRes.status === 'fulfilled'
				? jobRequestStatsRes.value.body.map((stat: any, index: number) => ({
						name: stat.statusDTO.nameEn,
						value: stat.count,
						fill: `hsl(var(--chart-${(index % 5) + 1}))`,
				  }))
				: [];

		const postStatusChartData =
			jobRequestPostStatsRes.status === 'fulfilled'
				? jobRequestPostStatsRes.value.body.map((stat: any, index: number) => ({
						name: stat.statusDTO.nameEn,
						value: stat.count,
						fill: `hsl(var(--chart-${(index % 5) + 1}))`,
				  }))
				: [];

		return {
			cards: {
				processingJobRequests,
				totalJobseekers,
				clientCount: clientOrgStats?.clientCount || 0,
				examinerCount: clientOrgStats?.examinerCount || 0,
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
				processingJobRequests: 0,
				totalJobseekers: 0,
				clientCount: 0,
				examinerCount: 0,
			},
			charts: {
				jobRequestStatusData: [],
				postStatusData: [],
			},
		};
	}
}

async function getUser() {
	try {
		const res = await UserService.getUserDetails();
		return res.body;
	} catch (error) {
		return null;
	}
}

export default async function AdminDashboard() {
	const user = await getUser();
	if (!user) return null; // Or some error component

	const dashboardData = await getDashboardData(user);

	return (
		<div className='space-y-8'>
			<div>
				<h1 className='text-3xl font-headline font-bold'>Dashboard</h1>
				<p className='text-muted-foreground'>Welcome, {user.fullName}! Here's an overview of your activities.</p>
			</div>
			{dashboardData ? (
				<>
					<Suspense fallback={<AdminDashboardCardsSkeleton />}>
						<AdminDashboardCards data={dashboardData.cards} />
					</Suspense>

					<div className='grid gap-6 md:grid-cols-1'>
						<Suspense fallback={<AdminDashboardChartsSkeleton />}>
							<AdminDashboardCharts data={dashboardData.charts} />
						</Suspense>
					</div>
				</>
			) : (
				<div className='pt-8 text-center'>
					<p className='text-lg text-muted-foreground'>There are no dashboard widgets for your role yet.</p>
				</div>
			)}
		</div>
	);
}
