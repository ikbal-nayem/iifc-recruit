
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
		// The Radix Select component works with string values.
		// We ensure the value passed to it is always a string.
		const currentValue = field?.value?.toString() ?? controlledValue;

		const handleValueChange = (value: string) => {
			if (onValueChange) {
				onValueChange(value);
			}

			if (field) {
				// When updating the form state, we check the original value's type.
				// If it was a number, we convert the selected string back to a number.
				const isNumberField = typeof field.value === 'number';
				field.onChange(isNumberField ? Number(value) : value);
			}
		};

		const TriggerWrapper = !control ? Fragment : FormControl;

		return (
			<Select onValueChange={handleValueChange} value={currentValue} disabled={disabled} {...props}>
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
				{!!label && <Label required={required}>{label}</Label>}
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
