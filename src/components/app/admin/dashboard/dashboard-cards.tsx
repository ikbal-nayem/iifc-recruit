
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/constants/routes.constant';
import { Briefcase, Building, FileText, Handshake, Users } from 'lucide-react';
import Link from 'next/link';

interface AdminDashboardCardsProps {
	data: {
		pendingJobRequests: number;
		processingApplications: number;
		totalJobseekers: number;
		clientOrganizations: number;
		examinerOrganizations: number;
	};
}

export function AdminDashboardCards({ data }: AdminDashboardCardsProps) {
	const {
		pendingJobRequests,
		processingApplications,
		totalJobseekers,
		clientOrganizations,
		examinerOrganizations,
	} = data;

	const cardItems = [
		{
			href: ROUTES.JOB_REQUEST_PENDING,
			title: 'Pending Job Requests',
			value: pendingJobRequests,
			description: 'Awaiting your review',
			icon: <FileText className='h-4 w-4 text-muted-foreground' />,
		},
		{
			href: ROUTES.APPLICATION_PROCESSING,
			title: 'Processing Applications',
			value: processingApplications,
			description: 'Active application processes',
			icon: <Briefcase className='h-4 w-4 text-muted-foreground' />,
		},
		{
			href: ROUTES.JOB_SEEKERS,
			title: 'Total Jobseekers',
			value: totalJobseekers,
			description: 'In the talent pool',
			icon: <Users className='h-4 w-4 text-muted-foreground' />,
		},
		{
			href: `${ROUTES.CLIENT_ORGANIZATIONS}?isClient=true`,
			title: 'Client',
			value: clientOrganizations,
			description: 'Partners you are hiring for',
			icon: <Handshake className='h-4 w-4 text-muted-foreground' />,
		},
		{
			href: `${ROUTES.CLIENT_ORGANIZATIONS}?isExaminer=true`,
			title: 'Examiner',
			value: examinerOrganizations,
			description: 'Organizations conducting exams',
			icon: <Building className='h-4 w-4 text-muted-foreground' />,
		},
	];

	return (
		<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'>
			{cardItems.map((item) => (
				<Link key={item.title} href={item.href}>
					<Card className='glassmorphism card-hover'>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium'>{item.title}</CardTitle>
							{item.icon}
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold'>{item.value}</div>
							<p className='text-xs text-muted-foreground'>{item.description}</p>
						</CardContent>
					</Card>
				</Link>
			))}
		</div>
	);
}

export function AdminDashboardCardsSkeleton() {
	return (
		<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'>
			{[...Array(5)].map((_, i) => (
				<Card key={i}>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<Skeleton className='h-4 w-24' />
						<Skeleton className='h-4 w-4' />
					</CardHeader>
					<CardContent>
						<Skeleton className='h-7 w-12 mb-2' />
						<Skeleton className='h-3 w-32' />
					</CardContent>
				</Card>
			))}
		</div>
	);
}
