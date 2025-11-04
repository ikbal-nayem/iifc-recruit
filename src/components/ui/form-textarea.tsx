
'use client';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import * as React from 'react';
import { Control, FieldPath, FieldValues } from 'react-hook-form';

interface FormTextareaProps<TFieldValues extends FieldValues> extends React.ComponentProps<'textarea'> {
	control: Control<TFieldValues | any>;
	name: FieldPath<TFieldValues>;
	label?: string;
	placeholder?: string;
	rows?: number;
	required?: boolean;
}

export function FormTextarea<TFieldValues extends FieldValues>({
	control,
	name,
	label,
	placeholder,
	rows = 2,
	required = false,
	maxLength,
	...props
}: FormTextareaProps<TFieldValues>) {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => {
				const valueLength = field.value?.length || 0;
				const isOverLimit = maxLength ? valueLength > maxLength : false;

				return (
					<FormItem>
						<div className='flex justify-between items-center'>
							{!!label && <FormLabel required={required}>{label}</FormLabel>}
							{maxLength && (
								<div
									className={cn(
										'text-xs text-muted-foreground',
										isOverLimit && 'text-danger font-medium'
									)}
								>
									{valueLength}/{maxLength}
								</div>
							)}
						</div>
						<FormControl>
							<Textarea placeholder={placeholder} rows={rows} maxLength={maxLength} {...props} {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				);
			}}
		/>
	);
}
