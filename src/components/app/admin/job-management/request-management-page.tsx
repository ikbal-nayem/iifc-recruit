'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { JobRequest, JobRequestStatus } from '@/interfaces/job.interface';
import { IClientOrganization } from '@/interfaces/master-data.interface';
import { JobRequestService } from '@/services/api/job-request.service';
import { MasterDataService } from '@/services/api/master-data.service';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { ApplicantListManager } from './applicant-list-manager';
import { ExaminerSetup } from './examiner-setup';

export function RequestManagementPage({ requestId }: { requestId: string }) {
	const { toast } = useToast();
	const router = useRouter();
	const [request, setRequest] = useState<JobRequest | null>(null);
	const [examiners, setExaminers] = useState<IClientOrganization[]>([]);
	const [selectedExaminer, setSelectedExaminer] = useState<string | undefined>(undefined);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);

	const loadData = useCallback(async () => {
		setIsLoading(true);
		try {
			const [reqRes, examinerRes] = await Promise.all([
				JobRequestService.getById(requestId),
				MasterDataService.clientOrganization.getList({ body: { isExaminer: true } }),
			]);
			setRequest(reqRes.body);
			setExaminers(examinerRes.body);
		} catch (error: any) {
			toast({
				title: 'Error loading data',
				description: error.message || 'Could not load request details and examiners.',
				variant: 'danger',
			});
			router.back();
		} finally {
			setIsLoading(false);
		}
	}, [requestId, toast, router]);

	useEffect(() => {
		loadData();
	}, [loadData]);

	const handleProceed = async () => {
		if (!selectedExaminer) {
			toast({ title: 'Examiner Required', description: 'Please select an examiner to proceed.' });
			return;
		}

		setIsSaving(true);
		try {
			// Here you would typically save the examiner and applicant list to the backend
			console.log('Selected Examiner:', selectedExaminer);

			// Then update the status
			await JobRequestService.updateStatus(requestId, JobRequestStatus.PROCESSING);
			toast({
				title: 'Request Processing',
				description: 'The request has been moved to the processing stage.',
				variant: 'success',
			});
			router.push('/admin/job-management/request/processing');
		} catch (error: any) {
			toast({
				title: 'Error',
				description: error.message || 'Failed to update request status.',
				variant: 'danger',
			});
		} finally {
			setIsSaving(false);
		}
	};

	if (isLoading) {
		return <Loader2 className='mx-auto h-10 w-10 animate-spin' />;
	}

	if (!request) {
		return <p>Job request not found.</p>;
	}

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<Button variant='outline' onClick={() => router.back()}>
					<ArrowLeft className='mr-2 h-4 w-4' />
					Back to Request Details
				</Button>
				<Button onClick={handleProceed} disabled={isSaving}>
					{isSaving ? (
						<Loader2 className='mr-2 h-4 w-4 animate-spin' />
					) : (
						<Save className='mr-2 h-4 w-4' />
					)}
					Save & Proceed
				</Button>
			</div>

			<Card className='glassmorphism'>
				<CardHeader>
					<CardTitle>Manage Request: {request.subject}</CardTitle>
					<CardDescription>
						Add applicants to the primary list and assign an examiner to proceed to the next stage.
					</CardDescription>
				</CardHeader>
			</Card>

			<ExaminerSetup
				examiners={examiners}
				selectedExaminer={selectedExaminer}
				onExaminerChange={setSelectedExaminer}
			/>

			<ApplicantListManager />
		</div>
	);
}
