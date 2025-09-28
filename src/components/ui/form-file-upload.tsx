'use client';

import { Control, FieldPath, FieldValues } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Upload, FileText, X } from 'lucide-react';
import { Button } from './button';
import * as React from 'react';

interface FilePreviewProps {
	file: File | string;
	onRemove: () => void;
}

const FilePreview = ({ file, onRemove }: FilePreviewProps) => {
	const isFileObject = file instanceof File;
	const name = isFileObject ? file.name : file;
	const size = isFileObject ? `(${(file.size / 1024).toFixed(1)} KB)` : '';

	return (
		<div className='p-2 border rounded-lg flex items-center justify-between bg-muted/50 mt-2'>
			<div className='flex items-center gap-2'>
				<FileText className='h-5 w-5 text-primary' />
				<div className='text-sm'>
					<p className='font-medium truncate max-w-xs'>{name}</p>
					{size && <p className='text-xs text-muted-foreground'>{size}</p>}
				</div>
			</div>
			<Button variant='ghost' size='icon' className='h-6 w-6' onClick={onRemove}>
				<X className='h-4 w-4' />
			</Button>
		</div>
	);
};

interface FormFileUploadProps<TFieldValues extends FieldValues> {
	control: Control<TFieldValues>;
	name: FieldPath<TFieldValues>;
	label: string;
	required?: boolean;
	accept?: string;
	multiple?: boolean;
}

export function FormFileUpload<TFieldValues extends FieldValues>({
	control,
	name,
	label,
	required = false,
	accept,
	multiple = false,
}: FormFileUploadProps<TFieldValues>) {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem>
					<FormLabel required={required}>{label}</FormLabel>
					<FormControl>
						<div className='relative flex items-center justify-center w-full'>
							<label
								htmlFor={name}
								className='flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-background hover:bg-muted'
							>
								<div className='flex flex-col items-center justify-center pt-5 pb-6'>
									<Upload className='w-8 h-8 mb-2 text-muted-foreground' />
									<p className='text-sm text-muted-foreground'>
										<span className='font-semibold'>Click to upload</span> or drag and drop
									</p>
								</div>
								<Input
									id={name}
									type='file'
									multiple={multiple}
									className='hidden'
									accept={accept}
									onChange={(e) => {
										if (e.target.files) {
											const files = Array.from(e.target.files);
											field.onChange(multiple ? files : files[0] || null);
										}
									}}
								/>
							</label>
						</div>
					</FormControl>
					<div className='space-y-2 mt-2'>
						{multiple && Array.isArray(field.value)
							? field.value.map((file, i) => (
									<FilePreview
										key={i}
										file={file}
										onRemove={() => {
											const newFiles = [...field.value];
											newFiles.splice(i, 1);
											field.onChange(newFiles);
										}}
									/>
							  ))
							: field.value && (
									<FilePreview
										file={field.value}
										onRemove={() => {
											field.onChange(null);
										}}
									/>
							  )}
					</div>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
