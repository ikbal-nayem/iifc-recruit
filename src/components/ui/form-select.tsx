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
		const currentValue = field?.value ?? controlledValue;

		const handleValueChange = (value: string) => {
			if (onValueChange) {
				onValueChange(value);
			}

			if (field) {
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
				<Label>
					{label}
					{required && <span className='text-danger font-semibold'> *</span>}
				</Label>
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
