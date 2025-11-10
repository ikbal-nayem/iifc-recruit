
'use client';

import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';

const requestChartConfig = {
	value: {
		label: 'Requests',
	},
	Pending: {
		label: 'Pending',
		color: 'hsl(var(--warning))',
	},
	Processing: {
		label: 'Processing',
		color: 'hsl(var(--info))',
	},
	Completed: {
		label: 'Completed',
		color: 'hsl(var(--success))',
	},
} satisfies ChartConfig;

const organizationChartConfig = {
	value: {
		label: 'Organizations',
	},
	Clients: {
		label: 'Clients',
		color: 'hsl(var(--chart-1))',
	},
	Examiners: {
		label: 'Examiners',
		color: 'hsl(var(--chart-2))',
	},
} satisfies ChartConfig;

interface AdminDashboardChartsProps {
	data: {
		requestStatusData: any[];
		organizationTypeData: any[];
	};
}

export function AdminDashboardCharts({ data }: AdminDashboardChartsProps) {
	return (
		<div className='grid grid-cols-1 lg:grid-cols-5 gap-6'>
			<Card className='lg:col-span-2 glassmorphism'>
				<CardHeader>
					<CardTitle>Job Request Ratio</CardTitle>
					<CardDescription>Distribution of job requests by their current status.</CardDescription>
				</CardHeader>
				<CardContent>
					<ChartContainer
						config={requestChartConfig}
						className='mx-auto aspect-square h-[250px]'
					>
						<PieChart>
							<Tooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
							<Pie
								data={data.requestStatusData}
								dataKey='value'
								nameKey='name'
								innerRadius={60}
								strokeWidth={5}
							>
								{data.requestStatusData.map((entry) => (
									<Cell key={entry.name} fill={entry.fill} />
								))}
							</Pie>
						</PieChart>
					</ChartContainer>
				</CardContent>
			</Card>

			<Card className='col-span-full lg:col-span-3 glassmorphism'>
				<CardHeader>
					<CardTitle>Organization Types</CardTitle>
					<CardDescription>Breakdown of client and examiner organizations.</CardDescription>
				</CardHeader>
				<CardContent>
					<ChartContainer config={organizationChartConfig} className='h-[250px] w-full'>
						<BarChart
							accessibilityLayer
							data={data.organizationTypeData}
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
								tickFormatter={(value) => organizationChartConfig[value as keyof typeof organizationChartConfig]?.label || value}
							/>
							<XAxis dataKey='value' type='number' hide />
							<Tooltip cursor={false} content={<ChartTooltipContent indicator='line' />} />
							<Bar dataKey='value' layout='vertical' radius={5} barSize={30}>
								{data.organizationTypeData.map((entry) => (
									<Cell
										key={entry.name}
										fill={organizationChartConfig[entry.name as keyof typeof organizationChartConfig]?.color}
									/>
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
