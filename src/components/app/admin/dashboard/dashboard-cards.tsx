
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/constants/routes.constant';
import { Briefcase, FileText, Users } from 'lucide-react';
import Link from 'next/link';

interface AdminDashboardCardsProps {
	data: {
		pendingJobRequests: number;
		processingApplications: number;
		shortlistedCandidates: number;
	};
}

export function AdminDashboardCards({ data }: AdminDashboardCardsProps) {
	const { pendingJobRequests, processingApplications, shortlistedCandidates } = data;

	return (
		<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
			<Link href={ROUTES.JOB_REQUEST_PENDING}>
				<Card className='glassmorphism card-hover'>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Pending Job Requests</CardTitle>
						<FileText className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{pendingJobRequests}</div>
						<p className='text-xs text-muted-foreground'>Awaiting your review</p>
					</CardContent>
				</Card>
			</Link>
			<Link href={ROUTES.APPLICATION_PROCESSING}>
				<Card className='glassmorphism card-hover'>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Processing Applications</CardTitle>
						<Briefcase className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{processingApplications}</div>
						<p className='text-xs text-muted-foreground'>Active application processes</p>
					</CardContent>
				</Card>
			</Link>
			<Link href={ROUTES.APPLICATION_SHORTLISTED}>
				<Card className='glassmorphism card-hover'>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Shortlisted Candidates</CardTitle>
						<Users className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{shortlistedCandidates}</div>
						<p className='text-xs text-muted-foreground'>Ready for interviews</p>
					</CardContent>
				</Card>
			</Link>
		</div>
	);
}

export function AdminDashboardCardsSkeleton() {
	return (
		<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
			<Card>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<Skeleton className='h-4 w-24' />
					<Skeleton className='h-4 w-4' />
				</CardHeader>
				<CardContent>
					<Skeleton className='h-7 w-12 mb-2' />
					<Skeleton className='h-3 w-32' />
				</CardContent>
			</Card>
			<Card>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<Skeleton className='h-4 w-28' />
					<Skeleton className='h-4 w-4' />
				</CardHeader>
				<CardContent>
					<Skeleton className='h-7 w-12 mb-2' />
					<Skeleton className='h-3 w-28' />
				</CardContent>
			</Card>
			<Card>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<Skeleton className='h-4 w-32' />
					<Skeleton className='h-4 w-4' />
				</CardHeader>
				<CardContent>
					<Skeleton className='h-7 w-12 mb-2' />
					<Skeleton className='h-3 w-24' />
				</CardContent>
			</Card>
		</div>
	);
}
