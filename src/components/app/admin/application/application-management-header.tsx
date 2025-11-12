
'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { FormAutocomplete } from '@/components/ui/form-autocomplete';
import { toast } from '@/hooks/use-toast';
import { JobRequestedPostStatus, RequestedPost } from '@/interfaces/job.interface';
import { getStatusVariant } from '@/lib/color-mapping';
import { JobRequestService } from '@/services/api/job-request.service';
import { getExaminerAsync } from '@/services/async-api';
import { format, isFuture, parseISO } from 'date-fns';
import { Building, Calendar, Edit, Info, Loader2, Pencil, Send, Users } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CircularPublishForm } from '../job-management/circular-publish-form';

interface ApplicationManagementHeaderProps {
	requestedPost: RequestedPost;
	setRequestedPost: (post: RequestedPost) => void;
	isProcessing?: boolean;
}

export function ApplicationManagementHeader({
	requestedPost,
	setRequestedPost,
	isProcessing = false,
}: ApplicationManagementHeaderProps) {
	const [isExaminerDialogOpen, setIsExaminerDialogOpen] = useState(false);
	const [isSavingExaminer, setIsSavingExaminer] = useState(false);
	const [selectedExaminerId, setSelectedExaminerId] = useState<string | undefined>(
		requestedPost.examinerId?.toString()
	);
	const [showCircularForm, setShowCircularForm] = useState(false);

	const examinerForm = useForm();

	const handleSaveExaminer = async () => {
		if (!selectedExaminerId) {
			toast.error({ description: 'No examiner selected.' });
			return;
		}
		setIsSavingExaminer(true);
		try {
			const response = await JobRequestService.getRequestedPostUpdate({
				...requestedPost,
				examinerId: selectedExaminerId,
			});
			const updatedPost = response.body;
			setRequestedPost(updatedPost);
			toast.success({
				title: 'Examiner Assigned',
				description: 'The examining organization has been assigned to this post.',
			});
			setIsExaminerDialogOpen(false);
		} catch (error: any) {
			toast.error({
				description: error.message || 'Failed to assign examiner.',
			});
		} finally {
			setIsSavingExaminer(false);
		}
	};

	const handlePublishSuccess = (updatedPost: RequestedPost) => {
		setRequestedPost(updatedPost);
	};

	const isCircularPublished =
		requestedPost.status === JobRequestedPostStatus.CIRCULAR_PUBLISHED ||
		requestedPost.status === JobRequestedPostStatus.PROCESSING ||
		requestedPost.status === JobRequestedPostStatus.SHORTLISTED ||
		requestedPost.status === JobRequestedPostStatus.COMPLETED;

	const isCircularEditable =
		isCircularPublished && requestedPost.circularEndDate && isFuture(parseISO(requestedPost.circularEndDate));

	return (
		<>
			<Card className='glassmorphism'>
				<CardHeader>
					<div className='flex flex-wrap items-center gap-4 justify-between'>
						<div className='flex items-center gap-4'>
							<CardTitle>{requestedPost?.post?.nameEn}</CardTitle>
							{requestedPost.statusDTO?.nameEn && (
								<Badge variant={getStatusVariant(requestedPost.status)}>
									{requestedPost.statusDTO.nameEn}
								</Badge>
							)}
						</div>
						{requestedPost.status === JobRequestedPostStatus.PENDING && !isCircularPublished && (
							<Button size='sm' onClick={() => setShowCircularForm(true)} title='Publish as circular'>
								<Send className='mr-2 h-4 w-4' /> Publish Circular
							</Button>
						)}
					</div>
					<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
						<CardDescription className='flex flex-wrap items-center gap-x-4'>
							<span className='flex items-center gap-1.5'>
								<Building className='h-4 w-4' />
								{requestedPost.jobRequest?.clientOrganization?.nameEn}
							</span>
							<span className='flex items-center gap-1.5'>
								<Users className='h-4 w-4' />
								{requestedPost.vacancy} Vacancies
							</span>
						</CardDescription>
						<div className='flex items-center gap-2 text-sm'>
							<span className='text-muted-foreground'>Examiner:</span>
							<span className='font-semibold'>{requestedPost.examiner?.nameEn || 'Not Assigned'}</span>
							{!isProcessing && (
								<Button
									variant='ghost'
									size='icon'
									className='h-7 w-7'
									onClick={() => setIsExaminerDialogOpen(true)}
								>
									<Edit className='h-4 w-4 text-primary' />
								</Button>
							)}
						</div>
					</div>
				</CardHeader>
			</Card>

			{isCircularPublished && (
				<Alert variant='info' className='' showIcon={false}>
					<AlertTitle className='font-bold flex items-center justify-between'>
						<span className='text-lg'>Circular Information</span>
						{isCircularEditable && (
							<Button variant='outline-info' size='sm' onClick={() => setShowCircularForm(true)}>
								<Pencil className='mr-2 h-3 w-3' /> Edit Circular
							</Button>
						)}
					</AlertTitle>
					<AlertDescription className='mt-2 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1'>
						<div className='flex items-center gap-2'>
							<Calendar className='h-4 w-4' />
							<span>
								Published From:{' '}
								<strong>
									{format(parseISO(requestedPost.circularPublishDate!), 'dd MMM, yyyy')}
								</strong>
							</span>
						</div>
						<div className='flex items-center gap-2'>
							<Calendar className='h-4 w-4' />
							<span>
								Expires On:{' '}
								<strong>
									{format(parseISO(requestedPost.circularEndDate!), 'dd MMM, yyyy')}
								</strong>
							</span>
						</div>
					</AlertDescription>
				</Alert>
			)}

			<Dialog open={isExaminerDialogOpen} onOpenChange={setIsExaminerDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Assign Examiner</DialogTitle>
						<DialogDescription>
							Select an examiner for the post: &quot;{requestedPost.post?.nameEn}&quot;.
						</DialogDescription>
					</DialogHeader>
					<div className='py-4'>
						<Form {...examinerForm}>
							<FormAutocomplete
								control={examinerForm.control}
								name='examinerId'
								label='Examiner'
								placeholder='Search for an examining organization...'
								required
								loadOptions={getExaminerAsync}
								getOptionValue={(option) => option.id!}
								getOptionLabel={(option) => (
									<div className='flex flex-col items-start'>
										{option.nameEn}
										<small>{option.nameBn}</small>
									</div>
								)}
								value={selectedExaminerId}
								initialLabel={requestedPost.examiner?.nameEn}
								onValueChange={setSelectedExaminerId}
							/>
						</Form>
					</div>
					<DialogFooter>
						<Button variant='ghost' onClick={() => setIsExaminerDialogOpen(false)}>
							Cancel
						</Button>
						<Button onClick={handleSaveExaminer} disabled={isSavingExaminer}>
							{isSavingExaminer && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
							Save
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			{showCircularForm && (
				<CircularPublishForm
					isOpen={showCircularForm}
					onClose={() => setShowCircularForm(false)}
					post={requestedPost}
					onSuccess={handlePublishSuccess}
				/>
			)}
		</>
	);
}

