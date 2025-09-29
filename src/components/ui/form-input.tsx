'use client';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import * as React from 'react';
import { Control, FieldPath, FieldValues } from 'react-hook-form';

interface FormInputProps<TFieldValues extends FieldValues> extends React.ComponentProps<'input'> {
	control: Control<TFieldValues>;
	name: FieldPath<TFieldValues>;
	label: string;
	required?: boolean;
	startIcon?: React.ReactNode;
}

export function FormInput<TFieldValues extends FieldValues>({
	control,
	name,
	label,
	required = false,
	startIcon,
	children,
	...props
}: FormInputProps<TFieldValues>) {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem>
					<FormLabel required={required}>{label}</FormLabel>
					<FormControl>
						<div className='relative flex items-center'>
							{startIcon && <div className='absolute left-3'>{startIcon}</div>}
							<Input {...props} {...field} className={cn(startIcon && 'pl-10', 'h-11')} />
						</div>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
