
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Form } from '@/components/ui/form';
import { FormAutocomplete } from '@/components/ui/form-autocomplete';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/constants/routes.constant';
import { toast } from '@/hooks/use-toast';
import { IInterestedIn } from '@/interfaces/jobseeker.interface';
import { ICommonMasterData } from '@/interfaces/master-data.interface';
import { JobseekerProfileService } from '@/services/api/jobseeker-profile.service';
import { getPostOutsourcingAsync } from '@/services/async-api';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2, MoveRight, PlusCircle, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const interestSchema = z.object({
	postId: z.string().min(1, 'Post is required.'),
});

type InterestFormValues = z.infer<typeof interestSchema>;

interface ProfileFormInterestProps {
	categories: ICommonMasterData[];
}

export function ProfileFormInterest({ categories }: ProfileFormInterestProps) {
	const router = useRouter();
	const [history, setHistory] = useState<IInterestedIn[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [categoryFilter, setCategoryFilter] = useState('');

	const form = useForm<InterestFormValues>({
		resolver: zodResolver(interestSchema),
		defaultValues: { postId: '' },
	});

	const loadData = useCallback(async () => {
		setIsLoading(true);
		try {
			const res = await JobseekerProfileService.interest.get();
			setHistory(res.body);
		} catch (error) {
			toast.error({ description: 'Failed to load interested positions.' });
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		loadData();
	}, [loadData]);

	const onSubmit = async (data: InterestFormValues) => {
		setIsSubmitting(true);
		try {
			await JobseekerProfileService.interest.add(data);
			toast.success({ description: 'Position added to your interest list.' });
			router.refresh();
			form.reset();
			loadData();
		} catch (error: any) {
			toast({
				description: error.message || 'Failed to add interest.',
				variant: error.status === 409 ? 'warning' : 'danger',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleRemove = async (id: string) => {
		try {
			await JobseekerProfileService.interest.delete(id);
			toast.success({ description: 'Position removed from your interest list.' });
			router.refresh();
			loadData();
		} catch (error: any) {
			toast.error({ description: error.message || 'Failed to remove interest.' });
		}
	};

	return (
		<div className='space-y-6'>
			<Card className='glassmorphism'>
				<CardHeader>
					<CardTitle>Interested Outsourcing Positions</CardTitle>
					<CardDescription>
						Let us know which outsourcing roles you are interested in. This helps us match you with the right
						opportunities.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col md:flex-row gap-4'>
							<div className='w-full md:w-1/3'>
								<FormAutocomplete
									name='categoryFilter'
									placeholder='Filter by Category...'
									options={categories}
									getOptionValue={(option) => option.id!}
									getOptionLabel={(option) => option.nameBn}
									onValueChange={(val) => setCategoryFilter(val!)}
									value={categoryFilter}
								/>
							</div>
							<div className='w-full md:w-1/2'>
								<FormAutocomplete
									control={form.control}
									name='postId'
									placeholder='Select a post'
									loadOptions={(search, callback) => {
										getPostOutsourcingAsync(search, (posts) => {
											const filtered = categoryFilter
												? posts.filter((p) => p.outsourcingCategoryId === categoryFilter)
												: posts;
											callback(filtered);
										});
									}}
									getOptionValue={(option) => option.id!}
									getOptionLabel={(option) => option.nameBn}
									required
								/>
							</div>
							<Button type='submit' disabled={isSubmitting}>
								{isSubmitting ? (
									<Loader2 className='mr-2 h-4 w-4 animate-spin' />
								) : (
									<PlusCircle className='mr-2 h-4 w-4' />
								)}
								Add Interest
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
			<Card className='glassmorphism'>
				<CardHeader>
					<CardTitle>Your Interested List</CardTitle>
				</CardHeader>
				<CardContent className='space-y-4'>
					{isLoading ? (
						[...Array(2)].map((_, i) => <Skeleton key={i} className='h-16 w-full' />)
					) : history.length > 0 ? (
						history.map((item) => (
							<Card key={item.id} className='p-4 flex justify-between items-center'>
								<div>
									<p className='font-semibold'>{item.post?.nameBn}</p>
									<p className='text-sm text-muted-foreground'>{item.post?.outsourcingCategory?.nameBn}</p>
								</div>
								<ConfirmationDialog
									trigger={
										<Button variant='ghost' size='icon'>
											<Trash className='h-4 w-4 text-danger' />
										</Button>
									}
									title='Remove Interest?'
									description={`Are you sure you want to remove "${item.post?.nameEn}" from your interest list?`}
									onConfirm={() => handleRemove(item.id!)}
									confirmText='Remove'
								/>
							</Card>
						))
					) : (
						<p className='text-center text-muted-foreground py-8'>
							You have not added any interested positions yet.
						</p>
					)}
				</CardContent>
			</Card>
			<div className='flex justify-between mt-8'>
				<Button variant='outline' onClick={() => router.push(ROUTES.JOB_SEEKER.PROFILE_EDIT.PROFESSIONAL)}>
					<ArrowLeft className='mr-2 h-4 w-4' /> Previous
				</Button>
				<Button onClick={() => router.push(ROUTES.JOB_SEEKER.PROFILE_EDIT.SKILLS)}>
					Next <MoveRight className='ml-2 h-4 w-4' />
				</Button>
			</div>
		</div>
	);
}
