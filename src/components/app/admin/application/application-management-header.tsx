
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { FormAutocomplete } from '@/components/ui/form-autocomplete';
import { useToast } from '@/hooks/use-toast';
import { RequestedPost } from '@/interfaces/job.interface';
import { getStatusVariant } from '@/lib/color-mapping';
import { JobRequestService } from '@/services/api/job-request.service';
import { getExaminerAsync } from '@/services/async-api';
import { Building, Edit, Loader2, Users } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

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
	const { toast } = useToast();
	const [isExaminerDialogOpen, setIsExaminerDialogOpen] = useState(false);
	const [isSavingExaminer, setIsSavingExaminer] = useState(false);
	const [selectedExaminerId, setSelectedExaminerId] = useState<string | undefined>(
		requestedPost.examinerId?.toString()
	);

	const examinerForm = useForm();

	const handleSaveExaminer = async () => {
		if (!selectedExaminerId) {
			toast({ title: 'Error', description: 'No examiner selected.', variant: 'danger' });
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
			toast({
				title: 'Examiner Assigned',
				description: 'The examining organization has been assigned to this post.',
				variant: 'success',
			});
			setIsExaminerDialogOpen(false);
		} catch (error: any) {
			toast({
				description: error.message || 'Failed to assign examiner.',
				variant: 'danger',
			});
		} finally {
			setIsSavingExaminer(false);
		}
	};

	return (
		<>
			<Card className='glassmorphism'>
				<CardHeader>
					<div className='flex items-center gap-4'>
						<CardTitle>{requestedPost?.post?.nameEn}</CardTitle>
						{requestedPost.statusDTO?.nameEn && (
							<Badge variant={getStatusVariant(requestedPost.status)}>{requestedPost.statusDTO.nameEn}</Badge>
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
								getOptionValue={(option) => option.id!.toString()}
								getOptionLabel={(option) => option.nameEn}
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
		</>
	);
}
