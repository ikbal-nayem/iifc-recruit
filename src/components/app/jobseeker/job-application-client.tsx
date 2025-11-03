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
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send } from 'lucide-react';
import * as React from 'react';
import { ApplicationService } from '@/services/api/application.service';
import { useAuth } from '@/contexts/auth-context';

export function JobApplicationClient({ jobTitle, jobId }: { jobTitle: string; jobId: string }) {
	const { toast } = useToast();
	const { currectUser } = useAuth();
	const [isApplying, setIsApplying] = React.useState(false);
	const [isApplied, setIsApplied] = React.useState(false);

	const handleApply = async () => {
		if (!currectUser?.id) {
			toast({
				title: 'Error',
				description: 'Could not identify the user. Please log in again.',
				variant: 'danger',
			});
			return;
		}

		setIsApplying(true);
		try {
			await ApplicationService.apply({
				applicantId: currectUser.id,
				requestedPostId: jobId,
			});
			toast({
				title: 'Application Submitted!',
				description: `Your application for the ${jobTitle} position has been sent.`,
				variant: 'success',
			});
			setIsApplied(true);
		} catch (error: any) {
			toast({
				title: 'Application Failed',
				description: error.message || 'There was a problem submitting your application.',
				variant: 'danger',
			});
		} finally {
			setIsApplying(false);
		}
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button disabled={isApplied}>
					{isApplied ? (
						'Applied'
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
						You are about to apply for the position of <strong>{jobTitle}</strong>. Your primary resume and
						profile will be submitted. Are you sure you want to proceed?
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
