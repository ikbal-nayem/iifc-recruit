'use client';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { toast } from '@/hooks/use-toast';
import { ApplicationService } from '@/services/api/application.service';
import { Check, CheckCheck, Loader2, Send } from 'lucide-react';
import * as React from 'react';

export function JobApplicationClient({
	jobTitle,
	jobOrganizationName,
	jobId,
}: {
	jobTitle: string;
	jobOrganizationName: string;
	jobId: string;
}) {
	const { currectUser } = useAuth();
	const [isApplying, setIsApplying] = React.useState(false);
	const [isApplied, setIsApplied] = React.useState(false);

	const handleApply = async () => {
		if (!currectUser?.id) {
			toast.error({
				description: 'Could not identify the user. Please log in again.',
			});
			return;
		}

		setIsApplying(true);
		try {
			await ApplicationService.apply({
				applicantId: currectUser.id,
				requestedPostId: jobId,
			});
			toast.success({
				title: 'Application Submitted!',
				description: `Your application for the ${jobTitle} position has been sent.`,
			});
			setIsApplied(true);
		} catch (error: any) {
			toast.error({
				title: 'Application Failed',
				description: error.message || 'There was a problem submitting your application.',
			});
		} finally {
			setIsApplying(false);
		}
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant={isApplied ? 'lite-success' : 'info'} className='font-semibold' disabled={isApplied}>
					{isApplied ? (
						<>
							<CheckCheck className='mr-2 h-4 w-4' />
							Applied
						</>
					) : (
						<>
							<Send className='mr-2 h-4 w-4' />
							Apply Now
						</>
					)}
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Confirm Application</AlertDialogTitle>
					<AlertDialogDescription>
						You are about to apply for the following position. Your primary resume and profile will be
						submitted.
						<div className='my-3 text-info font-normal'>
							<strong>Position:</strong> {jobTitle}
							<br />
							<strong>Organization:</strong> {jobOrganizationName}
						</div>
						Are you sure you want to proceed?
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isApplying}>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={handleApply} disabled={isApplying}>
						{isApplying && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
						Confirm & Apply
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
