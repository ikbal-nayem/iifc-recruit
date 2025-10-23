
'use client';

import { Bar, BarChart, CartesianGrid, Legend, Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const applicationFunnelData = [
	{ name: 'Applied', value: 125 },
	{ name: 'Accepted', value: 90 },
	{ name: 'Shortlisted', value: 45 },
	{ name: 'Interview', value: 30 },
	{ name: 'Hired', value: 12 },
];

const jobRequestStatusData = [
	{ name: 'Pending', value: 12 },
	{ name: 'Processing', value: 8 },
	{ name: 'Completed', value: 25 },
];

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))'];

export function AdminDashboardCharts() {
	return (
		<Card className='col-span-4 glassmorphism'>
			<CardHeader>
				<CardTitle>Overview</CardTitle>
			</CardHeader>
			<CardContent className='pl-2 space-y-8'>
				<div>
					<h3 className='text-lg font-semibold mb-4 ml-2'>Application Funnel</h3>
					<div className='h-[250px] w-full'>
						<ResponsiveContainer width='100%' height='100%'>
							<BarChart data={applicationFunnelData} layout='vertical'>
								<CartesianGrid strokeDasharray='3 3' horizontal={false} />
								<XAxis type='number' tick={{ fontSize: 12 }} />
								<YAxis type='category' dataKey='name' tick={{ fontSize: 12 }} width={80} />
								<Tooltip
									contentStyle={{
										backgroundColor: 'hsl(var(--background))',
										borderColor: 'hsl(var(--border))',
									}}
								/>
								<Legend wrapperStyle={{ fontSize: '14px' }} />
								<Bar dataKey='value' name='Candidates' fill='hsl(var(--primary))' radius={[0, 4, 4, 0]} />
							</BarChart>
						</ResponsiveContainer>
					</div>
				</div>
				<div>
					<h3 className='text-lg font-semibold mb-4 ml-2'>Job Requests by Status</h3>
					<div className='h-[250px] w-full'>
						<ResponsiveContainer width='100%' height='100%'>
							<PieChart>
								<Pie
									data={jobRequestStatusData}
									cx='50%'
									cy='50%'
									labelLine={false}
									outerRadius={80}
									fill='#8884d8'
									dataKey='value'
									label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
		<Card className='col-span-4'>
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
					<Skeleton className='h-[250px] w-full' />
				</div>
			</CardContent>
		</Card>
	);
}
