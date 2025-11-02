
'use client';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea, TextareaProps } from '@/components/ui/textarea';
import * as React from 'react';
import { Control, FieldPath, FieldValues } from 'react-hook-form';

interface FormTextareaProps<TFieldValues extends FieldValues> extends TextareaProps {
	control: Control<TFieldValues | any>;
	name: FieldPath<TFieldValues>;
	label?: string;
	required?: boolean;
}

export function FormTextarea<TFieldValues extends FieldValues>({
	control,
	name,
	label,
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
						<Textarea {...props} {...field} />
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
