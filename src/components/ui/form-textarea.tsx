
'use client';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import * as React from 'react';
import { Control, FieldPath, FieldValues } from 'react-hook-form';

interface FormTextareaProps<TFieldValues extends FieldValues> {
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
	...props
}: FormTextareaProps<TFieldValues>) {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem>
					{!!label && <FormLabel required={required}>{label}</FormLabel>}
					<FormControl>
						<Textarea placeholder={placeholder} rows={rows} {...props} {...field} />
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
