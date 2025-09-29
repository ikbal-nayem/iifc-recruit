
'use client';

import { Control, FieldPath, FieldValues, useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Upload, FileText, X } from 'lucide-react';
import { Button } from './button';
import * as React from 'react';
import { IFile } from '@/interfaces/common.interface';

interface FilePreviewProps {
	file: File | IFile;
	onRemove: () => void;
}

const FilePreview = ({ file, onRemove }: FilePreviewProps) => {
	const isFileObject = file instanceof File;
	const name = isFileObject ? file.name : file.originalFileName;
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
	maxSize?: number; // Max size in bytes
}

export function FormFileUpload<TFieldValues extends FieldValues>({
	control,
	name,
	label,
	required = false,
	accept,
	multiple = false,
	maxSize,
}: FormFileUploadProps<TFieldValues>) {
	const { setError, clearErrors } = useFormContext();

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
		if (e.target.files) {
			const files = Array.from(e.target.files);

			if (maxSize) {
				const oversizedFiles = files.filter((file) => file.size > maxSize);
				if (oversizedFiles.length > 0) {
					setError(name, {
						type: 'manual',
						message: `File(s) exceed max size of ${maxSize / 1024 / 1024}MB.`,
					});
					return;
				}
			}

			clearErrors(name);
			field.onChange(multiple ? files : files[0] || null);
		}
	};

	const formatAccept = (accept?: string) => {
		if (!accept) return '';
		return accept
			.split(',')
			.map((type) => type.replace('.', '').toUpperCase())
			.join(', ');
	};

	const formatMaxSize = (maxSize?: number) => {
		if (!maxSize) return '';
		if (maxSize < 1024 * 1024) return `(max ${(maxSize / 1024).toFixed(0)}KB)`;
		return `(max ${(maxSize / (1024 * 1024)).toFixed(0)}MB)`;
	};

	const description = [formatAccept(accept), formatMaxSize(maxSize)].filter(Boolean).join(' ');

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
								<div className='flex flex-col items-center justify-center pt-5 pb-6 text-center'>
									<Upload className='w-8 h-8 mb-2 text-muted-foreground' />
									<p className='text-sm text-muted-foreground'>
										<span className='font-semibold'>Click to upload</span> or drag and drop
									</p>
									{description && <p className='text-xs text-muted-foreground mt-1'>{description}</p>}
								</div>
								<Input
									id={name}
									type='file'
									multiple={multiple}
									className='hidden'
									accept={accept}
									onChange={(e) => handleFileChange(e, field)}
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
											field.onChange(newFiles.length > 0 ? newFiles : null);
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
