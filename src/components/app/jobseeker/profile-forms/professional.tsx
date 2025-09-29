
'use client';

import { ProfessionalExperienceMasterData } from '@/app/(auth)/jobseeker/profile-edit/professional/page';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ProfessionalInfo } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, parseISO } from 'date-fns';
import { Edit, PlusCircle, Trash, FileText } from 'lucide-react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FormAutocomplete } from '@/components/ui/form-autocomplete';
import { FormDatePicker } from '@/components/ui/form-datepicker';
import { FormInput } from '@/components/ui/form-input';
import { FormSwitch } from '@/components/ui/form-switch';
import { FormFileUpload } from '@/components/ui/form-file-upload';
import { FilePreviewer } from '@/components/ui/file-previewer';

const professionalInfoSchema = z
	.object({
		positionTitle: z.string().min(1, 'Position Title is required.'),
		positionLevelId: z.coerce.number().min(1, 'Position Level is required.'),
		organizationId: z.coerce.number().min(1, 'Organization is required.'),
		responsibilities: z.string().min(1, 'Please list at least one responsibility.'),
		joinDate: z.string().min(1, 'Join date is required.'),
		resignDate: z.string().optional(),
		isCurrent: z.boolean().default(false),
		salary: z.coerce.number().optional(),
		salaryCurrency: z.string().optional(),
		referenceName: z.string().optional(),
		referenceEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
		referencePhone: z.string().optional(),
		referencePostDept: z.string().optional(),
		certificateFile: z.any().optional(),
	})
	.refine((data) => !data.isCurrent ? !!data.resignDate : true, {
		message: 'Resign date is required unless you are currently working here.',
		path: ['resignDate'],
	});

type ProfessionalFormValues = z.infer<typeof professionalInfoSchema>;

interface ProfileFormProps {
	masterData: ProfessionalExperienceMasterData;
}

export function ProfileFormProfessional({ masterData }: ProfileFormProps) {
	const { toast } = useToast();
	// This would come from an API call in a real app
	const [history, setHistory] = React.useState<ProfessionalInfo[]>([]);
	const [editingId, setEditingId] = React.useState<string | null>(null);

	const form = useForm<ProfessionalFormValues>({
		resolver: zodResolver(professionalInfoSchema),
		defaultValues: { isCurrent: false },
	});

	const editForm = useForm<ProfessionalFormValues>({
		resolver: zodResolver(professionalInfoSchema),
	});

	const handleAddNew = (data: ProfessionalFormValues) => {
		const newEntry: ProfessionalInfo = {
			...data,
			id: `temp-${Date.now()}`,
			resignDate: data.isCurrent ? undefined : data.resignDate,
			organization: masterData.organizations.find((o) => o.id === data.organizationId),
			positionLevel: masterData.positionLevels.find((p) => p.id === data.positionLevelId),
		};
		setHistory([...history, newEntry]);
		form.reset({ isCurrent: false, positionTitle: '', responsibilities: '' });
	};

	const handleUpdate = (id: string, data: ProfessionalFormValues) => {
		const updatedHistory = history.map((item) =>
			item.id === id
				? {
						...item,
						...data,
						resignDate: data.isCurrent ? undefined : data.resignDate,
						organization: masterData.organizations.find((o) => o.id === data.organizationId),
						positionLevel: masterData.positionLevels.find((p) => p.id === data.positionLevelId),
				  }
				: item
		);
		setHistory(updatedHistory);
		setEditingId(null);
	};

	const handleRemove = (id: string) => {
		setHistory(history.filter((item) => item.id !== id));
		toast({ title: 'Entry Deleted', description: 'The professional record has been removed.', variant: 'success' });
	};

	const startEditing = (item: ProfessionalInfo) => {
		setEditingId(item.id!);
		editForm.reset({
			...item,
			positionLevelId: item.positionLevelId,
			organizationId: item.organizationId,
		});
	};

	const renderItem = (item: ProfessionalInfo) => {
		const watchIsCurrent = editForm.watch('isCurrent');

		if (editingId === item.id) {
			return (
				<Form {...editForm}>
					<form onSubmit={editForm.handleSubmit((data) => handleUpdate(item.id!, data))}>
						<Card key={item.id} className='p-4 bg-muted/50'>
							<CardContent className='p-0 space-y-4'>
								<FormInput control={editForm.control} name='positionTitle' label='Position Title' required />
								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<FormAutocomplete
										control={editForm.control}
										name='organizationId'
										label='Organization'
										required
										options={masterData.organizations.map((o) => ({
											label: o.name,
											value: o.id!,
										}))}
									/>
									<FormAutocomplete
										control={editForm.control}
										name='positionLevelId'
										label='Position Level'
										required
										options={masterData.positionLevels.map((p) => ({
											label: p.name,
											value: p.id!,
										}))}
									/>
								</div>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-4 items-start'>
									<FormDatePicker control={editForm.control} name='joinDate' label='Join Date' required />
									<FormDatePicker
										control={editForm.control}
										name='resignDate'
										label='Resign Date'
										required={!watchIsCurrent}
										disabled={watchIsCurrent}
									/>
								</div>
								<FormSwitch control={editForm.control} name='isCurrent' label='I currently work here' />
								<FormField
									control={editForm.control}
									name='responsibilities'
									render={({ field }) => (
										<FormItem>
											<FormLabel required>Responsibilities</FormLabel>
											<FormControl>
												<Textarea {...field} rows={4} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormFileUpload
									control={editForm.control}
									name='certificateFile'
									label='Experience Certificate (Optional)'
									accept='.pdf, image/*'
								/>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<FormInput control={editForm.control} name='salary' label='Salary (Optional)' type='number' />
									<FormInput control={editForm.control} name='salaryCurrency' label='Currency (e.g. BDT)' />
								</div>
							</CardContent>
							<CardFooter className='p-0 pt-4 flex justify-end gap-2'>
								<Button type='button' variant='ghost' onClick={() => setEditingId(null)}>
									Cancel
								</Button>
								<Button type='submit'>Save</Button>
							</CardFooter>
						</Card>
					</form>
				</Form>
			);
		}

		const joinDate = format(parseISO(item.joinDate), 'MMM yyyy');
		const resignDate = item.isCurrent ? 'Present' : item.resignDate ? format(parseISO(item.resignDate), 'MMM yyyy') : '';

		return (
			<Card key={item.id} className='p-4 flex justify-between items-start'>
				<div>
					<p className='font-semibold'>{item.positionTitle}</p>
					<p className='text-sm text-muted-foreground'>
						{item.organization?.name} &middot; {item.positionLevel?.name}
					</p>
					<p className='text-xs text-muted-foreground'>
						{joinDate} - {resignDate}
					</p>
					{item.certificateFile && (
						<FilePreviewer file={item.certificateFile}>
							<button className='text-xs text-primary hover:underline flex items-center gap-1 mt-1'>
								<FileText className='h-3 w-3' />
								View Certificate
							</button>
						</FilePreviewer>
					)}
				</div>
				<div className='flex gap-2'>
					<Button variant='ghost' size='icon' onClick={() => startEditing(item)}>
						<Edit className='h-4 w-4' />
					</Button>
					<ConfirmationDialog
						trigger={
							<Button variant='ghost' size='icon'>
								<Trash className='h-4 w-4 text-danger' />
							</Button>
						}
						description='This will permanently delete this professional record.'
						onConfirm={() => handleRemove(item.id!)}
						confirmText='Delete'
					/>
				</div>
			</Card>
		);
	};

	return (
		<div className='space-y-6'>
			<Card className='glassmorphism'>
				<CardHeader>
					<CardTitle>Your Professional History</CardTitle>
					<CardDescription>Listed below is your work experience.</CardDescription>
				</CardHeader>
				<CardContent className='space-y-4'>
					{history.map(renderItem)}
					{history.length === 0 && (
						<p className='text-center text-muted-foreground py-4'>No professional history added yet.</p>
					)}
				</CardContent>
			</Card>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleAddNew)}>
					<Card className='glassmorphism'>
						<CardHeader>
							<CardTitle>Add New Experience</CardTitle>
							<CardDescription>Add a new role to your profile.</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							<FormInput
								control={form.control}
								name='positionTitle'
								label='Position Title'
								placeholder='e.g., Software Engineer'
								required
							/>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<FormAutocomplete
									control={form.control}
									name='organizationId'
									label='Organization'
									placeholder='Select an organization'
									required
									options={masterData.organizations.map((o) => ({
										label: o.name,
										value: o.id!,
									}))}
								/>
								<FormAutocomplete
									control={form.control}
									name='positionLevelId'
									label='Position Level'
									placeholder='Select a level'
									required
									options={masterData.positionLevels.map((p) => ({
										label: p.name,
										value: p.id!,
									}))}
								/>
							</div>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4 items-start'>
								<FormDatePicker control={form.control} name='joinDate' label='Join Date' required />
								<FormDatePicker
									control={form.control}
									name='resignDate'
									label='Resign Date'
									required={!form.watch('isCurrent')}
									disabled={form.watch('isCurrent')}
								/>
							</div>
							<FormSwitch control={form.control} name='isCurrent' label='I currently work here' />
							<FormField
								control={form.control}
								name='responsibilities'
								render={({ field }) => (
									<FormItem>
										<FormLabel required>Responsibilities</FormLabel>
										<FormControl>
											<Textarea
												{...field}
												rows={4}
												placeholder='Describe your key responsibilities...'
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormFileUpload
								control={form.control}
								name='certificateFile'
								label='Experience Certificate (Optional)'
								accept='.pdf, image/*'
							/>
							<CardTitle className='text-lg pt-4'>Additional Information (Optional)</CardTitle>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<FormInput control={form.control} name='salary' label='Salary' type='number' />
								<FormInput control={form.control} name='salaryCurrency' label='Currency (e.g. BDT)' />
							</div>
							<CardTitle className='text-lg pt-4'>Reference (Optional)</CardTitle>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<FormInput control={form.control} name='referenceName' label='Reference Name' />
								<FormInput
									control={form.control}
									name='referencePostDept'
									label='Reference Position & Dept.'
								/>
							</div>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<FormInput
									control={form.control}
									name='referenceEmail'
									label='Reference Email'
									type='email'
								/>
								<FormInput control={form.control} name='referencePhone' label='Reference Phone' />
							</div>
						</CardContent>
						<CardFooter>
							<Button type='submit'>
								<PlusCircle className='mr-2 h-4 w-4' /> Add Entry
							</Button>
						</CardFooter>
					</Card>
				</form>
			</Form>
		</div>
	);
}
