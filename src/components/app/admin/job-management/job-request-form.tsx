'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { FormAutocomplete } from '@/components/ui/form-autocomplete';
import { FormCheckbox } from '@/components/ui/form-checkbox';
import { FormDatePicker } from '@/components/ui/form-datepicker';
import { FormInput } from '@/components/ui/form-input';
import { FormTextarea } from '@/components/ui/form-textarea';
import { Separator } from '@/components/ui/separator';
import { ROLES } from '@/constants/auth.constant';
import { ROUTES } from '@/constants/routes.constant';
import { useAuth } from '@/contexts/auth-context';
import { toast } from '@/hooks/use-toast';
import { JobRequest, JobRequestType } from '@/interfaces/job.interface';
import { EnumDTO, IClientOrganization, IOutsourcingZone, IPost } from '@/interfaces/master-data.interface';
import { JobRequestService } from '@/services/api/job-request.service';
import {
	getClientAsync,
	getOutsourcingCategoriesAsync,
	getPostNonOutsourcingAsync,
	getPostOutsourcingByCategoryAsync,
} from '@/services/async-api';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Loader2, PlusCircle, Save, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';

const requestedPostSchema = z.object({
	id: z.string().optional(),
	postId: z.string().min(1, 'Post is required.'),
	vacancy: z.coerce.number().min(1, 'Vacancy must be at least 1.'),
	experienceRequired: z.coerce.number().optional(),
	negotiable: z.boolean().default(false),
	outsourcingZoneId: z.string().min(1, 'Zone is required.'),
	salaryFrom: z.coerce.number().optional(),
	salaryTo: z.coerce.number().optional(),
	yearsOfContract: z.coerce.number().optional().nullable(),
	outsourcingCategoryId: z.string().optional(), // Added for filtering
});

const jobRequestSchema = z
	.object({
		type: z.nativeEnum(JobRequestType),
		memoNo: z.string().min(1, 'Memo No. is required.').max(50, 'Memo No. cannot exceed 50 characters.'),
		clientOrganizationId: z.string().min(1, 'Client Organization is required.'),
		subject: z.string().min(1, 'Subject is required.').max(255, 'Subject cannot exceed 255 characters.'),
		description: z.string().max(1000, 'Description cannot exceed 1000 characters.').optional(),
		requestDate: z.string().min(1, 'Request date is required.'),
		deadline: z.string().min(1, 'Deadline is required.'),
		requestedPosts: z.array(requestedPostSchema).min(1, 'At least one post is required.'),
	})
	.refine(
		(data) => {
			if (data.type !== JobRequestType.OUTSOURCING) {
				const postIds = data.requestedPosts.map((p) => p.postId);
				return new Set(postIds).size === postIds.length;
			}

			const uniquePairs = new Set(data.requestedPosts.map((p) => `${p.postId}-${p.outsourcingZoneId}`));
			return uniquePairs.size === data.requestedPosts.length;
		},
		{
			message: 'Duplicate post for the same zone is not allowed.',
			path: ['requestedPosts'],
		}
	);

const defaultRequestedPost = {
	postId: '',
	outsourcingZoneId: '',
	vacancy: 1,
	experienceRequired: undefined,
	salaryFrom: undefined,
	salaryTo: undefined,
	yearsOfContract: undefined,
	negotiable: false,
	outsourcingCategoryId: '',
};

type JobRequestFormValues = z.infer<typeof jobRequestSchema>;

interface JobRequestFormProps {
	clientOrganizations: IClientOrganization[];
	posts: IPost[];
	outsourcingZones: IOutsourcingZone[];
	requestTypes: EnumDTO[];
	initialData?: JobRequest;
}

export function JobRequestForm({
	clientOrganizations,
	posts: initialPosts,
	outsourcingZones,
	requestTypes,
	initialData,
}: JobRequestFormProps) {
	const router = useRouter();
	const { currectUser } = useAuth();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [confirmationData, setConfirmationData] = useState<JobRequestFormValues | null>(null);

	const form = useForm<JobRequestFormValues>({
		resolver: zodResolver(jobRequestSchema),
		defaultValues: initialData
			? {
					...initialData,
					requestDate: format(new Date(initialData.requestDate), 'yyyy-MM-dd'),
					deadline: format(new Date(initialData.deadline), 'yyyy-MM-dd'),
					requestedPosts:
						initialData.requestedPosts.map((p) => ({
							...p,
							outsourcingCategoryId: p.post?.outsourcingCategoryId,
						})) || [],
			  }
			: {
					memoNo: '',
					clientOrganizationId: currectUser?.roles.includes(ROLES.CLIENT_ADMIN)
						? currectUser.organizationId
						: '',
					subject: '',
					description: '',
					requestDate: format(new Date(), 'yyyy-MM-dd'),
					deadline: '',
					type: JobRequestType.OUTSOURCING,
					requestedPosts: [defaultRequestedPost],
			  },
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: 'requestedPosts',
	});

	const type = form.watch('type');
	const requestedPostsValues = form.watch('requestedPosts');

	function onFormSubmit(data: JobRequestFormValues) {
		setConfirmationData(data);
	}

	async function handleConfirmSubmit() {
		if (!confirmationData) return;
		setIsSubmitting(true);

		const cleanedData = { ...confirmationData };

		cleanedData.requestedPosts = cleanedData.requestedPosts.map((post) => {
			const newPost: any = { ...post };

			if (cleanedData.type !== JobRequestType.OUTSOURCING) {
				delete newPost.outsourcingZoneId;
			} else {
				delete newPost.salaryFrom;
				delete newPost.salaryTo;
				delete newPost.negotiable;
			}
			delete newPost.outsourcingCategoryId; // remove filter field before submitting
			return newPost;
		});

		try {
			if (initialData) {
				await JobRequestService.update({ ...cleanedData, id: initialData.id });
			} else {
				await JobRequestService.create({ ...cleanedData, active: true });
			}
			toast.success({
				title: initialData ? 'Job Request Updated!' : 'Job Request Submitted!',
				description: `The request has been successfully ${initialData ? 'updated' : 'submitted'}.`,
			});
			router.push(
				[ROLES.IIFC_ADMIN, ROLES.IIFC_OPERATOR].some((role) => currectUser?.roles?.includes(role))
					? ROUTES.JOB_REQUEST.PROCESSING
					: ROUTES.JOB_REQUEST.PENDING
			);
		} catch (error: any) {
			toast.error({
				title: 'Submission Failed',
				description: error.message || 'There was a problem with your request.',
			});
		} finally {
			setIsSubmitting(false);
			setConfirmationData(null);
		}
	}

	const getPostLabel = (postId: string) => {
		return initialPosts.find((p) => p.id === postId)?.nameEn || '...';
	};

	return (
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onFormSubmit)} className='space-y-8'>
					<Card className='glassmorphism'>
						<CardHeader>
							<CardTitle>Request Details</CardTitle>
							<CardDescription>Fill in the main details for the job request.</CardDescription>
						</CardHeader>
						<CardContent className='space-y-6'>
							{/* <FormRadioGroup
							control={form.control}
							name='type'
							label='Request Type'
							required
							options={requestTypes.map((rt) => ({ label: rt.nameEn, value: rt.value }))}
						/> */}

							<div className='grid grid-cols-1 md:grid-cols-2 gap-6 items-start'>
								<FormAutocomplete
									control={form.control}
									name='clientOrganizationId'
									label='Client Organization'
									placeholder='Select a client'
									required
									disabled={currectUser?.roles.includes(ROLES.CLIENT_ADMIN)}
									loadOptions={getClientAsync}
									getOptionValue={(option) => option?.id!}
									getOptionLabel={(opt) => opt.nameBn}
								/>
								<FormInput
									control={form.control}
									name='memoNo'
									label='Memo No.'
									placeholder='Enter memo number'
									required
								/>
							</div>

							<FormInput
								control={form.control}
								name='subject'
								label='Subject'
								placeholder='Enter request subject'
								required
							/>

							<FormTextarea
								control={form.control}
								name='description'
								label='Description'
								placeholder='Enter a brief description for the request'
								maxLength={1000}
								rows={4}
							/>

							<div className='grid grid-cols-1 md:grid-cols-2 gap-6 items-start'>
								<FormDatePicker control={form.control} name='requestDate' label='Request Date' required />
								<FormDatePicker control={form.control} name='deadline' label='Deadline' required />
							</div>
						</CardContent>
					</Card>

					<Card className='glassmorphism'>
						<CardHeader>
							<CardTitle>Request Posts</CardTitle>
							<CardDescription>Add the details for each requested post.</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							{fields.map((field, index) => {
								const categoryId = requestedPostsValues?.[index]?.outsourcingCategoryId;
								return (
									<Card key={field.id} className='p-4 relative bg-muted/5'>
										<CardContent className='p-0 space-y-4'>
											<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
												{type === JobRequestType.OUTSOURCING && (
													<>
														<FormAutocomplete
															control={form.control}
															name={`requestedPosts.${index}.outsourcingZoneId`}
															label='Zone'
															required
															placeholder='Select Zone'
															options={outsourcingZones}
															getOptionValue={(opt) => opt.id}
															getOptionLabel={(opt) => opt.nameBn}
														/>
														<FormAutocomplete
															control={form.control}
															name={`requestedPosts.${index}.outsourcingCategoryId`}
															label='Category'
															required
															placeholder='Select category'
															loadOptions={getOutsourcingCategoriesAsync}
															getOptionValue={(opt) => opt?.id!}
															getOptionLabel={(opt) => opt.nameBn}
															onValueChange={() => {
																form.setValue(`requestedPosts.${index}.postId`, '');
															}}
														/>
													</>
												)}
												<FormAutocomplete
													control={form.control}
													name={`requestedPosts.${index}.postId`}
													label='Post'
													required
													disabled={type === JobRequestType.OUTSOURCING && !categoryId}
													loadOptions={(searchKey, callback) => {
														if (type === JobRequestType.OUTSOURCING) {
															getPostOutsourcingByCategoryAsync(searchKey, categoryId, callback);
														} else {
															getPostNonOutsourcingAsync(searchKey, callback);
														}
													}}
													getOptionValue={(opt) => opt?.id!}
													getOptionLabel={(opt) =>
														type === JobRequestType.OUTSOURCING ? (
															opt.nameBn
														) : (
															<div className='flex flex-col items-start'>
																{opt.nameEn}
																<small>{opt.nameBn}</small>
															</div>
														)
													}
												/>
												<FormInput
													control={form.control}
													name={`requestedPosts.${index}.vacancy`}
													label='Vacancies'
													required
													type='number'
													placeholder='e.g., 10'
												/>
												<FormInput
													control={form.control}
													name={`requestedPosts.${index}.experienceRequired`}
													label='Experience Required (Yrs)'
													type='number'
													placeholder='e.g., 5'
												/>
												<FormInput
													control={form.control}
													name={`requestedPosts.${index}.yearsOfContract`}
													label='Years of Contract'
													type='number'
													placeholder='e.g., 3'
												/>
												{type === JobRequestType.OUTSOURCING ? null : (
													<>
														<FormInput
															control={form.control}
															name={`requestedPosts.${index}.salaryFrom`}
															label='Salary From'
															type='number'
														/>
														<FormInput
															control={form.control}
															name={`requestedPosts.${index}.salaryTo`}
															label='Salary To'
															type='number'
														/>
														<div className='pt-8'>
															<FormCheckbox
																control={form.control}
																name={`requestedPosts.${index}.negotiable`}
																label='Negotiable'
															/>
														</div>
													</>
												)}
											</div>
										</CardContent>
										{fields.length > 1 && (
											<Button
												type='button'
												variant='ghost'
												size='icon'
												className='absolute top-1 right-1 h-7 w-7'
												onClick={() => remove(index)}
											>
												<Trash className='h-4 w-4 text-danger' />
											</Button>
										)}
									</Card>
								);
							})}

							{!!form.formState.errors.requestedPosts?.root?.message && (
								<Alert variant='danger'>
									<AlertDescription>{form.formState.errors.requestedPosts?.root?.message}</AlertDescription>
								</Alert>
							)}

							<Button type='button' variant='outline' onClick={() => append(defaultRequestedPost)}>
								<PlusCircle className='mr-2 h-4 w-4' /> Add Another Post
							</Button>
						</CardContent>
					</Card>
					<div className='flex justify-center'>
						<Button type='submit'>
							<Save className='mr-2 h-4 w-4' />
							{initialData ? 'Save Changes' : 'Submit Request'}
						</Button>
					</div>
				</form>
			</Form>

			<Dialog open={!!confirmationData} onOpenChange={(open) => !open && setConfirmationData(null)}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Confirm Job Request</DialogTitle>
						<DialogDescription>Please review the details below before submitting.</DialogDescription>
					</DialogHeader>
					{confirmationData && (
						<div className='space-y-4 max-h-[60vh] overflow-y-auto p-1'>
							<div className='text-sm'>
								<p className='text-muted-foreground'>Client</p>
								<p className='font-semibold'>
									{clientOrganizations.find((c) => c.id === confirmationData.clientOrganizationId)?.nameEn}
								</p>
							</div>
							<div className='text-sm'>
								<p className='text-muted-foreground'>Subject</p>
								<p className='font-semibold'>{confirmationData.subject}</p>
							</div>
							<Separator />
							<h4 className='font-semibold'>Requested Posts</h4>
							<div className='space-y-2'>
								{confirmationData.requestedPosts.map((post, index) => (
									<div key={index} className='text-sm p-2 rounded-md bg-muted/50'>
										<span className='font-semibold'>{getPostLabel(post.postId)}:</span> {post.vacancy}{' '}
										vacancies
									</div>
								))}
							</div>
						</div>
					)}
					<DialogFooter>
						<Button variant='ghost' onClick={() => setConfirmationData(null)} disabled={isSubmitting}>
							Cancel
						</Button>
						<Button onClick={handleConfirmSubmit} disabled={isSubmitting}>
							{isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
							Confirm & Submit
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
