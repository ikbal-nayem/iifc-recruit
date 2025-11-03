'use client';

import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes.constant';
import { toast } from '@/hooks/use-toast';
import { Send } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function JobDetailClient({ jobTitle, jobId }: { jobTitle: string; jobId: string }) {
	const router = useRouter();

	const handleApply = () => {
		toast.info({
			title: 'Login Required',
			description: `Please log in to apply for the ${jobTitle} position.`,
		});
		const redirectUrl = `/jobseeker/jobs/${jobId}`;
		router.push(`${ROUTES.AUTH.LOGIN}?redirectUrl=${encodeURIComponent(redirectUrl)}`);
	};

	return (
		<Button onClick={handleApply} variant='info' className='font-semibold'>
			<Send className='mr-2 h-4 w-4' />
			Apply Now
		</Button>
	);
}
