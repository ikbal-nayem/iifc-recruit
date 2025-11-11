
'use client';

import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	LabelList,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';

const postStatusChartConfig = {
	value: {
		label: 'Posts',
	},
	Pending: {
		label: 'Pending',
		color: 'hsl(var(--chart-1))',
	},
	'Circular Published': {
		label: 'Published',
		color: 'hsl(var(--chart-2))',
	},
	Processing: {
		label: 'Processing',
		color: 'hsl(var(--chart-3))',
	},
	Shortlisted: {
		label: 'Shortlisted',
		color: 'hsl(var(--chart-4))',
	},
	Completed: {
		label: 'Completed',
		color: 'hsl(var(--chart-5))',
	},
} satisfies ChartConfig;

const jobRequestChartConfig = {
	value: {
		label: 'Requests',
	},
	Pending: {
		label: 'Pending',
		color: 'hsl(var(--chart-1))',
	},
	Processing: {
		label: 'Processing',
		color: 'hsl(var(--chart-2))',
	},
	Completed: {
		label: 'Completed',
		color: 'hsl(var(--chart-3))',
	},
} satisfies ChartConfig;

interface AdminDashboardChartsProps {
	data: {
		postStatusData: any[];
		jobRequestStatusData: any[];
	};
}

export function AdminDashboardCharts({ data }: AdminDashboardChartsProps) {
	return (
		<div className='grid grid-cols-1 lg:grid-cols-5 gap-6'>
			<Card className='lg:col-span-2 glassmorphism'>
				<CardHeader>
					<CardTitle>Requested Post Status Ratio</CardTitle>
					<CardDescription>Distribution of requested posts by their current status.</CardDescription>
				</CardHeader>
				<CardContent>
					<ChartContainer config={postStatusChartConfig} className='mx-auto aspect-square h-[250px]'>
						<PieChart>
							<Tooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
							<Pie
								data={data.postStatusData}
								dataKey='value'
								nameKey='name'
								innerRadius={60}
								strokeWidth={5}
								labelLine={false}
								label={({ cx, cy, midAngle, innerRadius, outerRadius, value, index }) => {
									const RADIAN = Math.PI / 180;
									const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
									const x = cx + radius * Math.cos(-midAngle * RADIAN);
									const y = cy + radius * Math.sin(-midAngle * RADIAN);
									return (
										<text
											x={x}
											y={y}
											fill='white'
											textAnchor={x > cx ? 'start' : 'end'}
											dominantBaseline='central'
											className='text-xs font-bold'
										>
											{value}
										</text>
									);
								}}
							>
								{data.postStatusData.map((entry) => (
									<Cell key={`cell-${entry.name}`} fill={entry.fill} />
								))}
							</Pie>
						</PieChart>
					</ChartContainer>
				</CardContent>
			</Card>

			<Card className='col-span-full lg:col-span-3 glassmorphism'>
				<CardHeader>
					<CardTitle>Job Requests by Status</CardTitle>
					<CardDescription>Breakdown of all job requests.</CardDescription>
				</CardHeader>
				<CardContent>
					<ChartContainer config={jobRequestChartConfig} className='h-[250px] w-full'>
						<BarChart
							accessibilityLayer
							data={data.jobRequestStatusData}
							layout='vertical'
							margin={{
								left: 10,
							}}
						>
							<CartesianGrid horizontal={false} />
							<YAxis
								dataKey='name'
								type='category'
								tickLine={false}
								tickMargin={10}
								axisLine={false}
								tickFormatter={(value) =>
									jobRequestChartConfig[value as keyof typeof jobRequestChartConfig]?.label || value
								}
							/>
							<XAxis dataKey='value' type='number' hide />
							<Tooltip cursor={false} content={<ChartTooltipContent indicator='line' />} />
							<Bar dataKey='value' layout='vertical' radius={5} barSize={30}>
								<LabelList dataKey='value' position='right' offset={8} className='fill-foreground' fontSize={12} />
								{data.jobRequestStatusData.map((entry, index) => (
									<Cell key={`cell-${index}`} fill={entry.fill} />
								))}
							</Bar>
						</BarChart>
					</ChartContainer>
				</CardContent>
			</Card>
		</div>
	);
}

export function AdminDashboardChartsSkeleton() {
	return (
		<div className='grid grid-cols-1 lg:grid-cols-5 gap-6'>
			<Card className='lg:col-span-2'>
				<CardHeader>
					<Skeleton className='h-7 w-32' />
					<Skeleton className='h-4 w-48' />
				</CardHeader>
				<CardContent className='flex justify-center'>
					<Skeleton className='h-[250px] w-[250px] rounded-full' />
				</CardContent>
			</Card>
			<Card className='col-span-full lg:col-span-3'>
				<CardHeader>
					<Skeleton className='h-7 w-32' />
					<Skeleton className='h-4 w-56' />
				</CardHeader>
				<CardContent>
					<Skeleton className='h-[250px] w-full' />
				</CardContent>
			</Card>
		</div>
	);
}
