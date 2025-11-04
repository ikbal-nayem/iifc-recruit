'use client';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Fragment } from 'react';
import { Control, FieldPath, FieldValues } from 'react-hook-form';
import { Label } from './label';

interface FormSelectProps<TFieldValues extends FieldValues, TOption> {
	control?: Control<TFieldValues | any>;
	name: FieldPath<TFieldValues>;
	label?: string;
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
		// Use optional chaining and nullish coalescing to safely get the value.
		// Ensure it's a string for the Select component, as it expects string values.
		const currentValue = field?.value?.toString() ?? controlledValue;

		const handleValueChange = (value: string) => {
			// When updating, we convert back to the original type if necessary
			const selectedOption = options.find((opt) => getOptionValue(opt) === value);
			const originalValue = selectedOption ? getOptionValue(selectedOption) : value;

			if (field) {
				// Check if original field value was a number and convert back
				const isNumberField = typeof field.value === 'number';
				field.onChange(isNumberField ? Number(originalValue) : originalValue);
			}
			if (onValueChange) {
				onValueChange(value);
			}
		};
		const TriggerWrapper = !control ? Fragment : FormControl;
		return (
			<Select
				onValueChange={handleValueChange}
				value={currentValue}
				disabled={disabled}
				{...props}
			>
				<TriggerWrapper>
					<SelectTrigger className={cn(!currentValue && 'text-muted-foreground')}>
						<SelectValue placeholder={placeholder} />
					</SelectTrigger>
				</TriggerWrapper>
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
			<div className='space-y-2'>
				{!!label && (
					<Label>
						{label}
						{required && <span className='text-danger font-semibold'> *</span>}
					</Label>
				)}
				{renderSelect()}
			</div>
		);
	}

	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem>
					{!!label && <FormLabel required={required}>{label}</FormLabel>}
					{renderSelect(field)}
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
