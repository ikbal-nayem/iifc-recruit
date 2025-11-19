import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Fragment } from 'react';
import { Control, FieldPath, FieldValues } from 'react-hook-form';
import { Label } from './label';
import { X } from 'lucide-react';

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
	allowClear?: boolean;
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
	allowClear = false,
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

		const handleClear = (e: React.MouseEvent) => {
			e.stopPropagation();
			if (onValueChange) {
				onValueChange(undefined);
			}
			if (field) {
				field.onChange(undefined);
			}
		};

		const TriggerWrapper = !control ? Fragment : FormControl;

		return (
			<div className='relative'>
				<Select onValueChange={handleValueChange} value={currentValue || ''} disabled={disabled} {...props}>
					<TriggerWrapper>
						<SelectTrigger className={cn(!currentValue && 'text-muted-foreground', allowClear && currentValue && 'pr-10')}>
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
				{!disabled && allowClear && currentValue && (
					<Button
						type='button'
						variant='ghost'
						size='icon'
						className='absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground'
						onClick={handleClear}
						disabled={disabled}
					>
						<X className='h-4 w-4' />
					</Button>
				)}
			</div>
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
