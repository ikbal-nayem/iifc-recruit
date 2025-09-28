'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { FilePreviewer } from '@/components/ui/file-previewer';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Resume } from '@/lib/types';
import { JobseekerProfileService } from '@/services/api/jobseeker-profile.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CheckCircle, Eye, FileText, History, Loader2, Trash, Upload, X } from 'lucide-react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const resumeSchema = z.object({
	resumeFile: z
		.any()
		.refine((file) => file, 'Resume is required.')
		.refine((file) => file?.size <= 5 * 1024 * 1024, `Max file size is 5MB.`)
		.refine((file) => file?.type === 'application/pdf', 'Only .pdf files are accepted.'),
});

type ResumeFormValues = z.infer<typeof resumeSchema>;

const FilePreview = ({ file, onRemove }: { file: File; onRemove: () => void }) => (
	<div className='mt-2 p-4 border rounded-lg relative bg-muted/30'>
		<div className='flex items-center gap-4'>
			<FileText className='h-10 w-10 text-primary' />
			<div className='flex-1'>
				<p className='font-medium text-sm truncate'>{file.name}</p>
				<p className='text-xs text-muted-foreground'>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
			</div>
			<Button variant='ghost' size='icon' onClick={onRemove}>
				<X className='h-4 w-4' />
			</Button>
		</div>
	</div>
);

export default function JobseekerProfileResumePage() {
	const { toast } = useToast();
	const [resumes, setResumes] = React.useState<Resume[]>([]);
	const [isLoading, setIsLoading] = React.useState(true);
	const [isUploading, setIsUploading] = React.useState(false);
	const [isSubmitting, setIsSubmitting] = React.useState<number | null>(null);

	const form = useForm<ResumeFormValues>({
		resolver: zodResolver(resumeSchema),
	});

	const loadResumes = React.useCallback(async () => {
		setIsLoading(true);
		try {
			const response = await JobseekerProfileService.resume.get();
			setResumes(response.body || []);
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to load resumes.',
				variant: 'danger',
			});
		} finally {
			setIsLoading(false);
		}
	}, [toast]);

	React.useEffect(() => {
		loadResumes();
	}, [loadResumes]);

	const onSubmit = async (data: ResumeFormValues) => {
		setIsUploading(true);
		try {
			const formData = new FormData();
			formData.append('file', data.resumeFile);
			const response = await JobseekerProfileService.resume.add(formData);
			toast({
				title: 'Resume Uploaded',
				description: response.message,
				variant: 'success',
			});
			form.reset();
			loadResumes();
		} catch (error: any) {
			toast({
				title: 'Upload Failed',
				description: error.message || 'There was a problem uploading your resume.',
				variant: 'danger',
			});
		} finally {
			setIsUploading(false);
		}
	};

	const handleSetActive = async (id: number) => {
		setIsSubmitting(id);
		try {
			const response = await JobseekerProfileService.resume.setActive(id);
			toast({
				description: response.message,
				variant: 'success',
			});
			loadResumes();
		} catch (error: any) {
			toast({
				title: 'Update Failed',
				description: error.message || 'Could not set active resume.',
				variant: 'danger',
			});
		} finally {
			setIsSubmitting(null);
		}
	};

	const handleDelete = (id: number) => {
		setIsSubmitting(id);
		JobseekerProfileService.resume
			.delete(id)
			.then(() => {
				toast({
					title: 'Resume Deleted',
					variant: 'success',
				});
				loadResumes();
			})
			.catch((error: any) => {
				toast({
					title: 'Delete Failed',
					description: error.message || 'Could not delete resume.',
					variant: 'danger',
				});
			})
			.finally(() => setIsSubmitting(null));
	};

	const activeResume = resumes.find((r) => r.isActive);
	const historyResumes = resumes.filter((r) => !r.isActive);

	return (
		<div className='space-y-6'>
			<Card className='glassmorphism'>
				<CardHeader>
					<CardTitle>Upload New Resume</CardTitle>
					<CardDescription>
						Upload your CV/Resume in PDF format. The active one will be shared with recruiters.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
							<FormField
								control={form.control}
								name='resumeFile'
								render={({ field }) => (
									<FormItem>
										<Label htmlFor='resume-upload'>Resume/CV (PDF, max 5MB)</Label>
										<FormControl>
											<div className='relative flex items-center justify-center w-full'>
												<label
													htmlFor='resume-upload'
													className='flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted'
												>
													<div className='flex flex-col items-center justify-center pt-5 pb-6'>
														<Upload className='w-8 h-8 mb-4 text-muted-foreground' />
														<p className='mb-2 text-sm text-muted-foreground'>
															<span className='font-semibold'>Click to upload</span> or drag and drop
														</p>
														<p className='text-xs text-muted-foreground'>PDF (MAX. 5MB)</p>
													</div>
													<Input
														id='resume-upload'
														type='file'
														className='hidden'
														accept='.pdf'
														onChange={(e) => field.onChange(e.target.files?.[0] || null)}
														disabled={isUploading}
													/>
												</label>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{form.watch('resumeFile') && (
								<FilePreview
									file={form.watch('resumeFile')}
									onRemove={() => form.reset({ resumeFile: null })}
								/>
							)}
							<Button type='submit' disabled={isUploading || !form.formState.isValid}>
								{isUploading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
								Upload & Save
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>

			{isLoading ? (
				<Skeleton className='h-48 w-full' />
			) : (
				activeResume && (
					<Card className='glassmorphism border-2 border-primary'>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<CheckCircle className='h-6 w-6 text-primary' />
								Active Resume
							</CardTitle>
							<CardDescription>This is the resume that will be sent with your applications.</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='p-4 border rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
								<div className='flex items-center gap-4'>
									<FileText className='h-8 w-8 text-primary' />
									<div>
										<p className='font-medium'>{activeResume.file.originalFileName}</p>
										{activeResume.createdOn && (
											<p className='text-sm text-muted-foreground'>
												Uploaded on {format(new Date(activeResume.createdOn), 'PPP')}
											</p>
										)}
									</div>
								</div>
								<div className='flex gap-2 self-end sm:self-center'>
									<FilePreviewer file={activeResume.file}>
										<Button variant='outline' size='sm'>
											<Eye className='h-4 w-4' />
										</Button>
									</FilePreviewer>
								</div>
							</div>
						</CardContent>
					</Card>
				)
			)}

			{!isLoading && historyResumes.length > 0 && (
				<Collapsible>
					<div className='flex justify-center'>
						<CollapsibleTrigger asChild>
							<Button variant='ghost' className='text-muted-foreground'>
								<History className='mr-2 h-4 w-4' />
								View Resume History ({historyResumes.length})
							</Button>
						</CollapsibleTrigger>
					</div>

					<CollapsibleContent>
						<Card className='glassmorphism mt-4'>
							<CardHeader>
								<CardTitle>Resume History</CardTitle>
								<CardDescription>Manage your previously uploaded resumes.</CardDescription>
							</CardHeader>
							<CardContent className='space-y-2'>
								{historyResumes.map((resume) => (
									<div
										key={resume.id}
										className='p-4 border rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center'
									>
										<div className='flex items-center gap-4'>
											<FileText className='h-8 w-8 text-muted-foreground' />
											<div>
												<p className='font-medium'>{resume.file.originalFileName}</p>
												{resume.createdOn && (
													<p className='text-sm text-muted-foreground'>
														Uploaded on {format(new Date(resume.createdOn), 'PPP')}
													</p>
												)}
											</div>
										</div>
										<div className='flex gap-2 self-end sm:self-center mt-2 sm:mt-0'>
											<FilePreviewer file={resume.file}>
												<Button variant='ghost' size='sm'>
													<Eye className='mr-2 h-4 w-4' />
													Preview
												</Button>
											</FilePreviewer>
											<Button
												variant='outline'
												size='sm'
												onClick={() => handleSetActive(resume.id!)}
												disabled={!!isSubmitting}
											>
												{isSubmitting === resume.id ? (
													<Loader2 className='mr-2 h-4 w-4 animate-spin' />
												) : (
													<CheckCircle className='mr-2 h-4 w-4' />
												)}
												Set Active
											</Button>
											<ConfirmationDialog
												trigger={
													<Button variant='ghost' size='icon' disabled={!!isSubmitting}>
														<Trash className='h-4 w-4 text-danger' />
													</Button>
												}
												title='Are you sure?'
												description={`This will permanently delete the resume "${resume.file.originalFileName}".`}
												onConfirm={() => handleDelete(resume.id!)}
												confirmText='Delete'
											/>
										</div>
									</div>
								))}
							</CardContent>
						</Card>
					</CollapsibleContent>
				</Collapsible>
			)}
		</div>
	);
}
