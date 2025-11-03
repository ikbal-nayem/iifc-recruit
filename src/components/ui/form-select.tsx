
'use client';

import * as React from 'react';
import { Control, FieldPath, FieldValues } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface FormSelectProps<TFieldValues extends FieldValues, TOption> {
	control?: Control<TFieldValues | any>;
	name: FieldPath<TFieldValues>;
	label: string;
	placeholder?: string;
	required?: boolean;
	options: TOption[];
	disabled?: boolean;
	getOptionLabel: (option: TOption) => string;
	getOptionValue: (option: TOption) => string;
	onValueChange?: (value: string | undefined) => void;
	value?: string;
}

export function FormSelect<TFieldValues extends FieldValues, TOption>({
	control,
	name,
	label,
	placeholder,
	required = false,
	options,
	disabled = false,
	getOptionLabel,
	getOptionValue,
	onValueChange,
	value: controlledValue,
	...props
}: FormSelectProps<TFieldValues, TOption>) {
	const renderSelect = (field?: any) => {
		const currentValue = field?.value?.toString() ?? controlledValue;
		const handleValueChange = (value: string) => {
			if (field) {
				field.onChange(value);
			}
			if (onValueChange) {
				onValueChange(value);
			}
		};
		return (
			<Select
				onValueChange={handleValueChange}
				defaultValue={currentValue}
				value={currentValue}
				disabled={disabled}
				{...props}
			>
				<FormControl>
					<SelectTrigger className={cn(!currentValue && 'text-muted-foreground')}>
						<SelectValue placeholder={placeholder} />
					</SelectTrigger>
				</FormControl>
				<SelectContent>
					{options.map((option, index) => (
						<SelectItem key={index} value={getOptionValue(option)}>
							{getOptionLabel(option)}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		);
	};

	if (!control) {
		return (
			<FormItem>
				<FormLabel required={required}>{label}</FormLabel>
				{renderSelect()}
			</FormItem>
		);
	}

	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem>
					<FormLabel required={required}>{label}</FormLabel>
					{renderSelect(field)}
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
