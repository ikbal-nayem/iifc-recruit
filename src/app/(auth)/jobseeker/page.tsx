
'use client';

import { ProfileCompletion } from '@/components/app/jobseeker/profile-completion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/constants/routes.constant';
import { useAuth } from '@/contexts/auth-context';
import { Application, APPLICATION_STATUS } from '@/interfaces/application.interface';
import { IProfileCompletionStatus } from '@/interfaces/jobseeker.interface';
import { getStatusVariant } from '@/lib/color-mapping';
import { ApplicationService } from '@/services/api/application.service';
import { JobseekerProfileService } from '@/services/api/jobseeker-profile.service';
import { ArrowRight, Briefcase, FileText, Star } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type Stats = {
	total: number;
	applied: number;
	interviews: number;
};

export default function JobseekerDashboardPage() {
	const { currectUser } = useAuth();
	const [recentApplications, setRecentApplications] = useState<Application[]>([]);
	const [profileCompletion, setProfileCompletion] = useState<IProfileCompletionStatus | null>(null);
	const [stats, setStats] = useState<Stats>({ total: 0, applied: 0, interviews: 0 });
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (!currectUser?.id) return;
		async function loadDashboardData() {
			setIsLoading(true);
			try {
				const [completionRes, applicationsRes, statsRes] = await Promise.allSettled([
					JobseekerProfileService.getProfileCompletion(),
					ApplicationService.getByApplicant({ meta: { limit: 2 } }),
					ApplicationService.getStatistics(currectUser.id!),
				]);

				if (completionRes.status === 'fulfilled') {
					setProfileCompletion(completionRes.value.body);
				} else {
					console.error('Failed to load profile completion:', completionRes.reason);
				}

				if (applicationsRes.status === 'fulfilled') {
					setRecentApplications(applicationsRes.value.body);
				} else {
					console.error('Failed to load recent applications:', applicationsRes.reason);
				}

				if (statsRes.status === 'fulfilled') {
					const s = statsRes.value.body;
					setStats({
						total: s.total,
						applied: s.applied,
						interviews: s.interview,
					});
				} else {
					console.error('Failed to load application stats:', statsRes.reason);
				}
			} catch (error) {
				console.error('An unexpected error occurred:', error);
			} finally {
				setIsLoading(false);
			}
		}

		loadDashboardData();
	}, [currectUser?.id]);

	return (
		<div className='space-y-8'>
			<div className='lg:col-span-2 space-y-2'>
				<h1 className='text-3xl font-headline font-bold'>Welcome, {currectUser?.fullName}!</h1>
				<p className='text-muted-foreground'>Here's an overview of your job search journey.</p>
			</div>

			{isLoading || !profileCompletion ? (
				<Skeleton className='h-48 w-full' />
			) : (
				<ProfileCompletion profileCompletion={profileCompletion} />
			)}

			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
				<Link href={ROUTES.JOB_SEEKER.APPLICATIONS}>
					<Card className='glassmorphism card-hover h-full'>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium'>Total Applications</CardTitle>
							<FileText className='h-4 w-4 text-muted-foreground' />
						</CardHeader>
						<CardContent>
							{isLoading ? (
								<Skeleton className='h-8 w-12' />
							) : (
								<div className='text-2xl font-bold'>{stats.total}</div>
							)}
							<p className='text-xs text-muted-foreground'>Across all jobs</p>
						</CardContent>
					</Card>
				</Link>

				<Link href={`${ROUTES.JOB_SEEKER.APPLICATIONS}?status=${APPLICATION_STATUS.APPLIED}`}>
					<Card className='glassmorphism card-hover h-full'>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium'>Applied</CardTitle>
							<Briefcase className='h-4 w-4 text-muted-foreground' />
						</CardHeader>
						<CardContent>
							{isLoading ? (
								<Skeleton className='h-8 w-12' />
							) : (
								<div className='text-2xl font-bold'>{stats.applied}</div>
							)}
							<p className='text-xs text-muted-foreground'>Currently in consideration</p>
						</CardContent>
					</Card>
				</Link>

				<Link href={`${ROUTES.JOB_SEEKER.APPLICATIONS}?status=${APPLICATION_STATUS.INTERVIEW}`}>
					<Card className='glassmorphism card-hover h-full'>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium'>Interviews</CardTitle>
							<Star className='h-4 w-4 text-muted-foreground' />
						</CardHeader>
						<CardContent>
							{isLoading ? (
								<Skeleton className='h-8 w-12' />
							) : (
								<div className='text-2xl font-bold'>{stats.interviews}</div>
							)}
							<p className='text-xs text-muted-foreground'>Scheduled or completed</p>
						</CardContent>
					</Card>
				</Link>
			</div>

			<Card className='glassmorphism'>
				<CardHeader>
					<CardTitle>Recent Applications</CardTitle>
					<CardDescription>Track the status of your latest job applications.</CardDescription>
				</CardHeader>
				<CardContent className='space-y-4'>
					{isLoading ? (
						[...Array(2)].map((_, i) => <Skeleton key={i} className='h-16 w-full' />)
					) : recentApplications.length > 0 ? (
						recentApplications.map((app) => (
							<div
								key={app.id}
								className='flex items-center justify-between p-3 rounded-lg border bg-background/50'
							>
								<div>
									<Link
										href={`/jobseeker/jobs/${app.requestedPostId}`}
										className='font-semibold hover:underline'
									>
										{app.requestedPost?.post?.nameEn}
									</Link>
									<p className='text-sm text-muted-foreground'>
										{app.requestedPost?.jobRequest?.clientOrganization?.nameEn}
									</p>
								</div>
								<Badge variant={getStatusVariant(app.status)}>{app.statusDTO.nameEn}</Badge>
							</div>
						))
					) : (
						<div className='text-center py-8 text-muted-foreground'>
							<p>You haven't applied to any jobs recently.</p>
						</div>
					)}
				</CardContent>
				<CardFooter>
					<Button asChild variant='link' className='group'>
						<Link href={ROUTES.JOB_SEEKER.APPLICATIONS}>
							View All Applications{' '}
							<ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
						</Link>
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
