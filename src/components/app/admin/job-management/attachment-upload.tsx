'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RequestedPost } from '@/interfaces/job.interface';
import { UploadCloud } from 'lucide-react';
import { useState } from 'react';
import * as z from 'zod';

const formSchema = z.object({
	circularPublishDate: z.string().min(1, 'Publish date is required.'),
	circularEndDate: z.string().min(1, 'End date is required.'),
});

type FormValues = z.infer<typeof formSchema>;

interface AttachmentsUploadProps {
	onSuccess: (updatedPost: RequestedPost) => void;
}

export function AttachmentsUpload({ onSuccess }: AttachmentsUploadProps) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant='outline-info' size='sm' className='float-end'>
					<UploadCloud className='mr-2 h-4 w-4' />
					Attachments
				</Button>
			</DialogTrigger>
			<DialogContent className='max-w-xl flex flex-col p-0'>
				<DialogHeader className='p-6 pb-0'>
					<DialogTitle>Add Applicants to Primary List</DialogTitle>
				</DialogHeader>
				<div className='flex-1 overflow-y-auto px-6'>Attachments will go here</div>
			</DialogContent>
		</Dialog>
	);
}
