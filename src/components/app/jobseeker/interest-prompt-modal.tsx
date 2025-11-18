'use client';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { ROUTES } from '@/constants/routes.constant';
import { toast } from '@/hooks/use-toast';
import { UserService } from '@/services/api/user.service';
import { Hand, Loader2, MoveRight, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface InterestPromptModalProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
}

export function InterestPromptModal({ isOpen, onOpenChange }: InterestPromptModalProps) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const handleSkip = async () => {
		setIsLoading(true);
		try {
			await UserService.skipOutsourcingInterest();
			onOpenChange(false);
		} catch (error: any) {
			toast.error({
				description: error.message || 'Could not update your preference. Please try again.',
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleAddInterest = () => {
		router.push(ROUTES.JOB_SEEKER.PROFILE_EDIT.INTEREST);
		onOpenChange(false);
	};

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className='sm:max-w-md' closeOnOutsideClick={false}>
				<DialogHeader className='items-center text-center'>
					<div className='p-3 bg-primary/10 rounded-full w-fit mb-2'>
						<Sparkles className='h-8 w-8 text-primary' />
					</div>
					<DialogTitle>Interested in Outsourcing Jobs?</DialogTitle>
					<DialogDescription className='pt-2'>
						To help us find the best opportunities for you, please add the outsourcing positions you are
						interested in. You can always update this later in your profile.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className='sm:justify-between gap-2 pt-2'>
					<Button variant='outline' onClick={handleSkip} disabled={isLoading}>
						{isLoading ? (
							<Loader2 className='mr-2 h-4 w-4 animate-spin' />
						) : (
							<Hand className='mr-2 h-4 w-4' />
						)}
						Skip for now
					</Button>
					<Button onClick={handleAddInterest}>Add Interest <MoveRight className='ml-2 h-4 w-4'/> </Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
