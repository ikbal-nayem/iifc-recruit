
'use client';

import {
	generateJobDescription,
	GenerateJobDescriptionInput,
} from '@/ai/flows/job-description-generator';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { FormDatePicker } from '@/components/ui/form-datepicker';
import { FormTextarea } from '@/components/ui/form-textarea';
import { useToast } from '@/hooks/use-toast';
import { RequestedPost } from '@/interfaces/job.interface';
import { JobRequestService } from '@/services/api/job-request.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Bot, Loader2 } from 'lucide-react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
	circularPublishDate: z.string().min(1, 'Publish date is required.'),
	circularEndDate: z.string().min(1, 'End date is required.'),
	jobDescription: z.string().min(1, 'Job description is required.'),
	jobResponsibilities: z.string().min(1, 'Job responsibilities are required.'),
	jobRequirements: z.string().min(1, 'Job requirements are required.'),
});

type FormValues = z.infer<typeof formSchema>;

interface CircularPublishFormProps {
	isOpen: boolean;
	onClose: () => void;
	post: RequestedPost;
	onSuccess: (updatedPost: RequestedPost) => void;
}

export function CircularPublishForm({ isOpen, onClose, post, onSuccess }: CircularPublishFormProps) {
	const { toast } = useToast();
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const [isGenerating, setIsGenerating] = React.useState(false);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			circularPublishDate: post.circularPublishDate || format(new Date(), 'yyyy-MM-dd'),
			circularEndDate: post.circularEndDate || '',
			jobDescription: post.jobDescription || '',
			jobResponsibilities: post.jobResponsibilities || '',
			jobRequirements: post.jobRequirements || '',
		},
	});

	const handleGenerateDescription = async () => {
		setIsGenerating(true);
		try {
			const input: GenerateJobDescriptionInput = {
				jobTitle: post.post?.nameEn || '',
				keywords: post.post?.nameEn || '', // Can be enhanced later
			};
			const result = await generateJobDescription(input);
			form.setValue('jobDescription', result.jobDescription);
		} catch (error) {
			console.error('AI generation failed', error);
			toast({
				title: 'AI Generation Failed',
				description: 'Could not generate job description.',
				variant: 'danger',
			});
		} finally {
			setIsGenerating(false);
		}
	};

	const onSubmit = async (data: FormValues) => {
		setIsSubmitting(true);
		try {
			const payload: Partial<RequestedPost> = {
				id: post.id,
				...data,
			};
			const response = await JobRequestService.publishCircular(payload);
			toast({ description: 'Circular published successfully.', variant: 'success' });
			onSuccess(response.body);
			onClose();
		} catch (error: any) {
			toast({
				title: 'Error',
				description: error.message || 'Failed to publish circular.',
				variant: 'danger',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='max-w-3xl'>
				<DialogHeader>
					<DialogTitle>Publish Circular for: {post.post?.nameEn}</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 py-4'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<FormDatePicker
								control={form.control}
								name='circularPublishDate'
								label='Publish Date'
								required
							/>
							<FormDatePicker control={form.control} name='circularEndDate' label='End Date' required />
						</div>

						<div className='space-y-1'>
							<div className='flex justify-between items-center'>
								<label className='text-sm font-medium'>Job Description</label>
								<Button
									type='button'
									variant='ghost'
									size='sm'
									onClick={handleGenerateDescription}
									disabled={isGenerating}
								>
									{isGenerating ? (
										<Loader2 className='mr-2 h-4 w-4 animate-spin' />
									) : (
										<Bot className='mr-2 h-4 w-4' />
									)}
									AI Generate
								</Button>
							</div>
							<FormTextarea
								control={form.control}
								name='jobDescription'
								placeholder='A brief about the job...'
								rows={5}
								required
							/>
						</div>

						<FormTextarea
							control={form.control}
							name='jobResponsibilities'
							label='Job Responsibilities'
							placeholder='List the key responsibilities, one per line.'
							rows={5}
							required
						/>
						<FormTextarea
							control={form.control}
							name='jobRequirements'
							label='Job Requirements'
							placeholder='List the necessary qualifications and skills, one per line.'
							rows={5}
							required
						/>

						<DialogFooter className='pt-4'>
							<Button type='button' variant='ghost' onClick={onClose} disabled={isSubmitting}>
								Cancel
							</Button>
							<Button type='submit' disabled={isSubmitting}>
								{isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
								Publish Circular
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
