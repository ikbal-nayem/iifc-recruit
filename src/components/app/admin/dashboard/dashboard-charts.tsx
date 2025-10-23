
'use client';

import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Funnel,
	FunnelChart,
	LabelList,
	Legend,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const applicationFunnelData = [
	{ name: 'Applied', value: 125, fill: 'hsl(var(--chart-1))' },
	{ name: 'Accepted', value: 90, fill: 'hsl(var(--chart-2))' },
	{ name: 'Shortlisted', value: 45, fill: 'hsl(var(--chart-3))' },
	{ name: 'Interview', value: 30, fill: 'hsl(var(--chart-4))' },
	{ name: 'Hired', value: 12, fill: 'hsl(var(--chart-5))' },
];

const jobRequestStatusData = [
	{ name: 'Pending', value: 12 },
	{ name: 'Processing', value: 8 },
	{ name: 'Completed', value: 25 },
];

const COLORS = ['hsl(var(--chart-3))', 'hsl(var(--chart-2))', 'hsl(var(--chart-1))'];

export function AdminDashboardCharts() {
	return (
		<Card className='col-span-full lg:col-span-3 glassmorphism'>
			<CardHeader>
				<CardTitle>Overview</CardTitle>
			</CardHeader>
			<CardContent className='grid gap-12'>
				<div>
					<h3 className='text-lg font-semibold mb-4'>Application Funnel</h3>
					<div className='h-[250px] w-full'>
						<ResponsiveContainer width='100%' height='100%'>
							<FunnelChart>
								<Tooltip
									contentStyle={{
										backgroundColor: 'hsl(var(--background))',
										borderColor: 'hsl(var(--border))',
									}}
								/>
								<Funnel dataKey='value' data={applicationFunnelData} isAnimationActive>
									<LabelList
										position='right'
										fill='hsl(var(--foreground))'
										stroke='none'
										dataKey='name'
										className='text-sm font-medium'
									/>
									{applicationFunnelData.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={entry.fill} />
									))}
								</Funnel>
							</FunnelChart>
						</ResponsiveContainer>
					</div>
				</div>
				<div>
					<h3 className='text-lg font-semibold mb-4'>Job Requests by Status</h3>
					<div className='h-[200px] w-full'>
						<ResponsiveContainer width='100%' height='100%'>
							<PieChart>
								<Pie
									data={jobRequestStatusData}
									cx='50%'
									cy='50%'
									labelLine={false}
									innerRadius={60}
									outerRadius={80}
									fill='#8884d8'
									paddingAngle={5}
									dataKey='value'
								>
									{jobRequestStatusData.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
									))}
								</Pie>
								<Tooltip
									contentStyle={{
										backgroundColor: 'hsl(var(--background))',
										borderColor: 'hsl(var(--border))',
									}}
								/>
								<Legend
									iconType='circle'
									layout='vertical'
									verticalAlign='middle'
									align='right'
									formatter={(value, entry) => (
										<span className='text-sm text-foreground'>
											{value} ({entry.payload?.value})
										</span>
									)}
								/>
							</PieChart>
						</ResponsiveContainer>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export function AdminDashboardChartsSkeleton() {
	return (
		<Card className='col-span-full lg:col-span-3'>
			<CardHeader>
				<Skeleton className='h-7 w-32' />
			</CardHeader>
			<CardContent className='space-y-8'>
				<div>
					<Skeleton className='h-6 w-48 mb-4' />
					<Skeleton className='h-[250px] w-full' />
				</div>
				<div>
					<Skeleton className='h-6 w-48 mb-4' />
					<Skeleton className='h-[200px] w-full' />
				</div>
			</CardContent>
		</Card>
	);
}
