'use client';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { FormFileUpload } from '@/components/ui/form-file-upload';
import { FormSelect } from '@/components/ui/form-select';
import { Progress } from '@/components/ui/progress';
import useLoader from '@/hooks/use-loader';
import { toast } from '@/hooks/use-toast';
import { IFile } from '@/interfaces/common.interface';
import { JobRequest, JobRequestStatus } from '@/interfaces/job.interface';
import { EnumDTO } from '@/interfaces/master-data.interface';
import { makeFormData } from '@/lib/utils';
import { JobRequestService } from '@/services/api/job-request.service';
import { MasterDataService } from '@/services/api/master-data.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosProgressEvent } from 'axios';
import { Loader2, UploadCloud } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
	attachmentType: z.string().min(1, 'Attachment type is required.'),
	file: z.any().refine((file) => file, 'File is required.'),
});

type FormValues = z.infer<typeof formSchema>;

interface AttachmentsUploadProps {
	request: JobRequest;
	onSuccess?: (attachmentType: string, file: IFile) => void;
}

export function AttachmentsUpload({ request, onSuccess }: AttachmentsUploadProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useLoader(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [attachmentTypes, setAttachmentTypes] = useState<EnumDTO[]>([]);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			attachmentType: '',
			file: null,
		},
	});

	useEffect(() => {
		MasterDataService.getEnum('job-request-attachment-type')
			.then((res) => setAttachmentTypes(res.body as EnumDTO[]))
			.catch(() => toast.error({ description: 'Failed to load attachment types.' }));
	}, []);

	const onSubmit = async (data: FormValues) => {
		setIsSubmitting(true);
		setUploadProgress(0);
		try {
			const response = await JobRequestService.uploadAttachment(
				request.id!,
				data.attachmentType,
				makeFormData(data),
				(progressEvent: AxiosProgressEvent) => {
					if (progressEvent.total) {
						const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
						setUploadProgress(percentCompleted);
					}
				}
			);

			toast.success({ description: response.message || 'Attachment uploaded successfully.' });
			form.reset();
			setUploadProgress(0);
			setIsOpen(false);
			onSuccess?.(data.attachmentType, response.body);
		} catch (error: any) {
			toast.error({ description: error.message || 'Failed to upload attachment.' });
			setUploadProgress(0);
		} finally {
			setIsSubmitting(false);
		}
	};

	if (request.status !== JobRequestStatus.PROCESSING) {
		return null;
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant='outline-info' size='sm' className='float-end'>
					<UploadCloud className='mr-2 h-4 w-4' />
					Attachments
				</Button>
			</DialogTrigger>
			<DialogContent className='max-w-2xl'>
				<DialogHeader>
					<DialogTitle>Upload Attachment</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 py-4'>
						<FormSelect
							control={form.control}
							name='attachmentType'
							label='Attachment Type'
							placeholder='Select attachment type'
							required
							options={attachmentTypes}
							getOptionLabel={(type: EnumDTO) => type.nameEn}
							getOptionValue={(type: EnumDTO) => type.value}
							allowClear
							disabled={isSubmitting}
						/>
						<FormFileUpload
							control={form.control}
							name='file'
							label='Select File'
							required
							accept='.pdf'
							maxSize={10 * 1024 * 1024} // 10MB
							disabled={isSubmitting}
						/>

						{isSubmitting && uploadProgress > 0 && (
							<div className='space-y-2'>
								<div className='flex justify-between items-center'>
									<p className='text-sm font-medium'>Uploading...</p>
									<span className='text-sm text-muted-foreground'>{Math.round(uploadProgress)}%</span>
								</div>
								<Progress value={uploadProgress} />
							</div>
						)}

						<DialogFooter>
							<Button
								type='button'
								variant='outline'
								onClick={() => {
									setIsOpen(false);
									form.reset();
									setUploadProgress(0);
								}}
								disabled={isSubmitting}
							>
								Cancel
							</Button>
							<Button type='submit' disabled={isSubmitting}>
								{isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
								<UploadCloud className='mr-2 h-4 w-4' />
								Upload Attachment
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
