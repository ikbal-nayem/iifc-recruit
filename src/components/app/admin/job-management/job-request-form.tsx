
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { FormAutocomplete } from '@/components/ui/form-autocomplete';
import { FormDatePicker } from '@/components/ui/form-datepicker';
import { FormInput } from '@/components/ui/form-input';
import { FormRadioGroup } from '@/components/ui/form-radio-group';
import { useToast } from '@/hooks/use-toast';
import { EnumDTO, IClientOrganization, IOutsourcingZone, IPost } from '@/interfaces/master-data.interface';
import { JobRequestService } from '@/services/api/job-request.service';
import { MasterDataService } from '@/services/api/master-data.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircle, Save, Send, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';
import { JobRequest } from '@/interfaces/job.interface';

const requestedPostSchema = z.object({
	id: z.number().optional(),
	postId: z.coerce.number().min(1, 'Post is required.'),
	vacancy: z.coerce.number().min(1, 'Vacancy must be at least 1.'),
	outsourcingZoneId: z.coerce.number().optional(),
	fromDate: z.string().optional(),
	toDate: z.string().optional(),
	salaryFrom: z.coerce.number().optional(),
	salaryTo: z.coerce.number().optional(),
});

const jobRequestSchema = z.object({
	memoNo: z.string().min(1, 'Memo No. is required.'),
	clientOrganizationId: z.coerce.number().min(1, 'Client Organization is required.'),
	subject: z.string().min(1, 'Subject is required.'),
	description: z.string().optional(),
	requestDate: z.string().min(1, 'Request date is required.'),
	deadline: z.string().min(1, 'Deadline is required.'),
	type: z.string().min(1, 'Request type is required.'),
	requestedPosts: z.array(requestedPostSchema).min(1, 'At least one post is required.'),
});

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
	const { toast } = useToast();
	const router = useRouter();
	const [filteredPosts, setFilteredPosts] = useState<IPost[]>(initialPosts);
	const [isLoadingPosts, setIsLoadingPosts] = useState(false);

	const form = useForm<JobRequestFormValues>({
		resolver: zodResolver(jobRequestSchema),
		values: initialData,
		defaultValues: initialData
			? undefined
			: {
					requestDate: format(new Date(), 'yyyy-MM-dd'),
					type: 'OUTSOURCING',
					requestedPosts: [{ postId: undefined, vacancy: 1 }],
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
					body: { outsourcing: type === 'OUTSOURCING' },
				});
				setFilteredPosts(response.body);
			} catch (error) {
				toast({
					description: 'Could not load posts for the selected request type.',
					variant: 'danger',
				});
				setFilteredPosts([]);
			} finally {
				setIsLoadingPosts(false);
			}
		}
		if (type) {
			fetchPosts();
		}
	}, [type, toast]);

	async function onSubmit(data: JobRequestFormValues) {
		const cleanedData = { ...data };

		// Clean up requestedPosts based on type
		cleanedData.requestedPosts = cleanedData.requestedPosts.map((post) => {
			const newPost = { ...post };
			if (cleanedData.type === 'OUTSOURCING') {
				delete newPost.salaryFrom;
				delete newPost.salaryTo;
			} else {
				delete newPost.outsourcingZoneId;
			}
			return newPost;
		});

		try {
			if (initialData) {
				await JobRequestService.update({ ...cleanedData, id: initialData.id });
			} else {
				await JobRequestService.create(cleanedData);
			}
			toast({
				title: initialData ? 'Job Request Updated!' : 'Job Request Submitted!',
				description: `The request has been successfully ${initialData ? 'updated' : 'submitted'}.`,
				variant: 'success',
			});
			router.push('/admin/job-management/request');
		} catch (error: any) {
			toast({
				title: 'Submission Failed',
				description: error.message || 'There was a problem with your request.',
				variant: 'danger',
			});
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
				<Card className='glassmorphism'>
					<CardHeader>
						<CardTitle>Request Details</CardTitle>
					</CardHeader>
					<CardContent className='space-y-6'>
						<FormRadioGroup
							control={form.control}
							name='type'
							label='Request Type'
							required
							options={requestTypes.map((rt) => ({ label: rt.nameEn, value: rt.value }))}
						/>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-6 items-start'>
							<FormAutocomplete
								control={form.control}
								name='clientOrganizationId'
								label='Client Organization'
								placeholder='Select a client'
								required
								options={clientOrganizations}
								getOptionValue={(option) => option.id!.toString()}
								getOptionLabel={(option) => option.nameEn}
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

						<FormInput
							control={form.control}
							name='description'
							label='Description'
							placeholder='Enter a brief description for the request'
						/>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-6 items-start'>
							<FormDatePicker control={form.control} name='requestDate' label='Request Date' required />
							<FormDatePicker control={form.control} name='deadline' label='Application Deadline' required />
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
											getOptionValue={(opt) => opt.id!.toString()}
											getOptionLabel={(opt) => opt.nameEn}
											disabled={isLoadingPosts}
										/>
										<FormInput
											control={form.control}
											name={`requestedPosts.${index}.vacancy`}
											label='Vacancies'
											required
											type='number'
											placeholder='e.g., 10'
										/>
										{type === 'OUTSOURCING' && (
											<FormAutocomplete
												control={form.control}
												name={`requestedPosts.${index}.outsourcingZoneId`}
												label='Zone'
												required
												placeholder='Select Zone'
												options={outsourcingZones}
												getOptionValue={(opt) => opt.id!.toString()}
												getOptionLabel={(opt) => opt.nameEn}
											/>
										)}
									</div>
									{type === 'OUTSOURCING' && (
										<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
											<FormDatePicker
												control={form.control}
												name={`requestedPosts.${index}.fromDate`}
												label='From Date'
											/>
											<FormDatePicker
												control={form.control}
												name={`requestedPosts.${index}.toDate`}
												label='To Date'
											/>
										</div>
									)}
									{type !== 'OUTSOURCING' && (
										<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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
						<Button
							type='button'
							variant='outline'
							onClick={() =>
								append({
									postId: -1,
									vacancy: 1,
								})
							}
						>
							<PlusCircle className='mr-2 h-4 w-4' /> Add Another Post
						</Button>
					</CardContent>
					<CardFooter>
						<Button type='submit'>
							{initialData ? <Save className='mr-2 h-4 w-4' /> : <Send className='mr-2 h-4 w-4' />}
							{initialData ? 'Save Changes' : 'Submit Request'}
						</Button>
					</CardFooter>
				</Card>
			</form>
		</Form>
	);
}
