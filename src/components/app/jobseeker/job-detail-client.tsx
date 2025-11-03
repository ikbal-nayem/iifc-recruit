
'use client';

import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { ROUTES } from '@/constants/routes.constant';

export function JobDetailClient({ jobTitle, jobId }: { jobTitle: string; jobId: string }) {
	const router = useRouter();
	const { toast } = useToast();

	const handleApply = () => {
		toast({
			title: 'Login Required',
			description: `Please log in to apply for the ${jobTitle} position.`,
			variant: 'danger',
		});
		const redirectUrl = `/jobseeker/jobs/${jobId}`;
		router.push(`${ROUTES.AUTH.LOGIN}?redirectUrl=${encodeURIComponent(redirectUrl)}`);
	};

	return (
		<Button onClick={handleApply}>
			<Send className='mr-2 h-4 w-4' />
			Apply Now
		</Button>
	);
}
