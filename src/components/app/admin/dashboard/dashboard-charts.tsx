
'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';

const chartData = [
	{ status: 'Applied', total: 186 },
	{ status: 'Accepted', total: 120 },
	{ status: 'Shortlisted', total: 80 },
	{ status: 'Interview', total: 50 },
	{ status: 'Hired', total: 25 },
];

const chartConfig = {
	total: {
		label: 'Total',
		color: 'hsl(var(--chart-1))',
	},
} satisfies ChartConfig;

export function AdminDashboardCharts() {
	return (
		<Card className='col-span-full lg:col-span-3 glassmorphism'>
			<CardHeader>
				<CardTitle>Application Funnel</CardTitle>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className='h-[300px] w-full'>
					<BarChart
						accessibilityLayer
						data={chartData}
						layout='vertical'
						margin={{
							left: 10,
						}}
					>
						<CartesianGrid horizontal={false} />
						<YAxis
							dataKey='status'
							type='category'
							tickLine={false}
							tickMargin={10}
							axisLine={false}
							tickFormatter={(value) => value.slice(0, 3)}
						/>
						<XAxis dataKey='total' type='number' hide />
						<Tooltip cursor={false} content={<ChartTooltipContent indicator='dot' />} />
						<Bar dataKey='total' layout='vertical' radius={5} />
					</BarChart>
				</ChartContainer>
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
			<CardContent>
				<Skeleton className='h-[300px] w-full' />
			</CardContent>
		</Card>
	);
}
