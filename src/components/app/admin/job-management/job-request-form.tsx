
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Send, PlusCircle, Trash, Save } from 'lucide-react';
import { FormInput } from '@/components/ui/form-input';
import { FormDatePicker } from '@/components/ui/form-datepicker';
import {
	IClientOrganization,
	IOutsourcingZone,
	IPost,
	EnumDTO,
} from '@/interfaces/master-data.interface';
import { FormAutocomplete } from '@/components/ui/form-autocomplete';
import { FormRadioGroup } from '@/components/ui/form-radio-group';
import { JobRequest } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MasterDataService } from '@/services/api/master-data.service';

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
	requestType: z.string().min(1, 'Request type is required.'),
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
		defaultValues: initialData || {
			requestType: 'OUTSOURCING',
			requestedPosts: [{ postId: undefined, vacancy: 1 }],
		},
		values: initialData,
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: 'requestedPosts',
	});

	const watchRequestType = form.watch('requestType');

	useEffect(() => {
		async function fetchPosts() {
			setIsLoadingPosts(true);
			try {
				const response = await MasterDataService.post.getList({
					body: { outsourcing: watchRequestType === 'OUTSOURCING' },
				});
				setFilteredPosts(response.body);
			} catch (error) {
				toast({
					title: 'Error',
					description: 'Could not load posts for the selected request type.',
					variant: 'danger',
				});
				setFilteredPosts([]);
			} finally {
				setIsLoadingPosts(false);
			}
		}
		fetchPosts();
	}, [watchRequestType, toast]);

	function onSubmit(data: JobRequestFormValues) {
		console.log(data);
		toast({
			title: initialData ? 'Job Request Updated!' : 'Job Request Submitted!',
			description: `The request has been successfully ${initialData ? 'updated' : 'submitted'}.`,
			variant: 'success',
		});
		router.push('/admin/job-management/request');
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
				<Card className='glassmorphism'>
					<CardHeader>
						<CardTitle>Request Details</CardTitle>
					</CardHeader>
					<CardContent className='space-y-6'>
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

						<div className='grid grid-cols-1 md:grid-cols-3 gap-6 items-start'>
							<FormDatePicker control={form.control} name='requestDate' label='Request Date' required />
							<FormDatePicker control={form.control} name='deadline' label='Application Deadline' required />
							<FormRadioGroup
								control={form.control}
								name='requestType'
								label='Request Type'
								required
								options={requestTypes.map((rt) => ({ label: rt.nameEn, value: rt.value }))}
							/>
						</div>
						<FormInput
							control={form.control}
							name='description'
							label='Description'
							placeholder='Enter a brief description for the request'
						/>
					</CardContent>
				</Card>

				<Card className='glassmorphism'>
					<CardHeader>
						<CardTitle>Requested Posts</CardTitle>
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
										{watchRequestType === 'OUTSOURCING' && (
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
									postId: undefined,
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
