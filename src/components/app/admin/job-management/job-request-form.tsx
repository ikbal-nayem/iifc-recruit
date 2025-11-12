'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { FormAutocomplete } from '@/components/ui/form-autocomplete';
import { FormCheckbox } from '@/components/ui/form-checkbox';
import { FormDatePicker } from '@/components/ui/form-datepicker';
import { FormInput } from '@/components/ui/form-input';
import { FormTextarea } from '@/components/ui/form-textarea';
import { ROUTES } from '@/constants/routes.constant';
import { useAuth } from '@/contexts/auth-context';
import { useDebounce } from '@/hooks/use-debounce';
import { toast } from '@/hooks/use-toast';
import { JobRequest, JobRequestType } from '@/interfaces/job.interface';
import { EnumDTO, IClientOrganization, IOutsourcingZone, IPost } from '@/interfaces/master-data.interface';
import { JobRequestService } from '@/services/api/job-request.service';
import { MasterDataService } from '@/services/api/master-data.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { PlusCircle, Save, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';

const requestedPostSchema = z.object({
	id: z.string().optional(),
	postId: z.coerce.string().min(1, 'Post is required.'),
	vacancy: z.coerce.number().min(1, 'Vacancy must be at least 1.'),
	experienceRequired: z.coerce.number().optional(),
	negotiable: z.boolean().default(false),
	outsourcingZoneId: z.coerce.string().optional(),
	salaryFrom: z.coerce.number().optional(),
	salaryTo: z.coerce.number().optional(),
	yearsOfContract: z.coerce.number().optional().nullable(),
});

const jobRequestSchema = z.object({
	type: z.nativeEnum(JobRequestType),
	memoNo: z.string().min(1, 'Memo No. is required.').max(50, 'Memo No. cannot exceed 50 characters.'),
	clientOrganizationId: z.string().min(1, 'Client Organization is required.'),
	subject: z.string().min(1, 'Subject is required.').max(255, 'Subject cannot exceed 255 characters.'),
	description: z.string().max(1000, 'Description cannot exceed 1000 characters.').optional(),
	requestDate: z.string().min(1, 'Request date is required.'),
	deadline: z.string().min(1, 'Deadline is required.'),
	requestedPosts: z.array(requestedPostSchema).min(1, 'At least one post is required.'),
});

const defaultRequestedPost = {
	postId: undefined as any,
	vacancy: 1,
	experienceRequired: undefined,
	salaryFrom: undefined,
	salaryTo: undefined,
	yearsOfContract: undefined,
	negotiable: false,
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

	const [filteredPosts, setFilteredPosts] = useState<IPost[]>(initialPosts);
	const [isLoadingPosts, setIsLoadingPosts] = useState(false);
	const [postSearchQuery, setPostSearchQuery] = useState('');
	const debouncedPostSearch = useDebounce(postSearchQuery, 500);

	const form = useForm<JobRequestFormValues>({
		resolver: zodResolver(jobRequestSchema),
		defaultValues: initialData
			? {
					...initialData,
					requestDate: format(new Date(initialData.requestDate), 'yyyy-MM-dd'),
					deadline: format(new Date(initialData.deadline), 'yyyy-MM-dd'),
			  }
			: {
					memoNo: '',
					clientOrganizationId: undefined as any,
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

	useEffect(() => {
		async function fetchPosts() {
			setIsLoadingPosts(true);
			try {
				const response = await MasterDataService.post.getList({
					body: {
						searchKey: debouncedPostSearch,
						outsourcing: type === JobRequestType.OUTSOURCING,
					},
					meta: { page: 0, limit: 25 },
				});
				setFilteredPosts(response.body);
			} catch (error) {
				toast.error({
					description: 'Could not load posts for the selected request type.',
				});
				setFilteredPosts([]);
			} finally {
				setIsLoadingPosts(false);
			}
		}
		if (type) {
			fetchPosts();
		}
	}, [type, debouncedPostSearch]);

	async function onSubmit(data: JobRequestFormValues) {
		const cleanedData = { ...data };

		// Clean up requestedPosts based on type
		cleanedData.requestedPosts = cleanedData.requestedPosts.map((post) => {
			const newPost: any = { ...post };

			if (cleanedData.type !== JobRequestType.OUTSOURCING) {
				delete newPost.outsourcingZoneId;
				delete newPost.yearsOfContract;
			} else {
				delete newPost.salaryFrom;
				delete newPost.salaryTo;
				delete newPost.negotiable;
			}
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
				currectUser?.userType !== 'ORG_ADMIN' ? ROUTES.JOB_REQUEST.PROCESSING : ROUTES.JOB_REQUEST.PENDING
			);
		} catch (error: any) {
			toast.error({
				title: 'Submission Failed',
				description: error.message || 'There was a problem with your request.',
			});
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
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
								options={clientOrganizations}
								getOptionValue={(option) => option?.id!}
								getOptionLabel={(option) => option?.nameEn}
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
						{fields.map((field, index) => (
							<Card key={field.id} className='p-4 relative bg-muted/50'>
								<CardContent className='p-0 space-y-4'>
									<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
										<FormAutocomplete
											control={form.control}
											name={`requestedPosts.${index}.postId`}
											label='Post'
											required
											placeholder={isLoadingPosts ? 'Loading posts...' : 'Select Post'}
											options={filteredPosts}
											getOptionValue={(opt) => opt?.id!}
											getOptionLabel={(opt) => opt?.nameEn}
											disabled={isLoadingPosts}
											onInputChange={setPostSearchQuery}
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
									</div>

									{type === JobRequestType.OUTSOURCING ? (
										<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
											<FormAutocomplete
												control={form.control}
												name={`requestedPosts.${index}.outsourcingZoneId`}
												label='Zone'
												required
												placeholder='Select Zone'
												options={outsourcingZones}
												getOptionValue={(opt) => opt.id}
												getOptionLabel={(opt) => opt?.nameEn}
											/>
											<FormInput
												control={form.control}
												name={`requestedPosts.${index}.yearsOfContract`}
												label='Years of Contract'
												type='number'
												placeholder='e.g., 3'
											/>
										</div>
									) : (
										<div className='grid grid-cols-1 md:grid-cols-3 gap-4 items-center'>
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
										</div>
									)}
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
						))}
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
	);
}
