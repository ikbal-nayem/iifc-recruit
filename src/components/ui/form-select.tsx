
'use client';

import * as React from 'react';
import { Control, FieldPath, FieldValues } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface FormSelectProps<TFieldValues extends FieldValues> {
	control: Control<TFieldValues>;
	name: FieldPath<TFieldValues>;
	label: string;
	placeholder?: string;
	required?: boolean;
	options: any[];
	disabled?: boolean;
	labelKey?: string;
	valueKey?: string;
}

export function FormSelect<TFieldValues extends FieldValues>({
	control,
	name,
	label,
	placeholder,
	required = false,
	options,
	disabled = false,
	labelKey = 'label',
	valueKey = 'value',
	...props
}: FormSelectProps<TFieldValues>) {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem>
					<FormLabel required={required}>{label}</FormLabel>
					<Select
						onValueChange={field.onChange}
						defaultValue={field.value?.toString()}
						disabled={disabled}
						{...props}
					>
						<FormControl>
							<SelectTrigger className={cn('h-11', !field.value && 'text-muted-foreground')}>
								<SelectValue placeholder={placeholder} />
							</SelectTrigger>
						</FormControl>
						<SelectContent>
							{options.map((option) => (
								<SelectItem key={option[valueKey]} value={option[valueKey]?.toString()}>
									{option[labelKey]}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
