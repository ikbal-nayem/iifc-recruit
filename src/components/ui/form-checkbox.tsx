'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Control, FieldPath, FieldValues } from 'react-hook-form';

interface FormCheckboxProps<TFieldValues extends FieldValues> {
	control: Control<TFieldValues | any>;
	name: FieldPath<TFieldValues>;
	label: string;
	description?: string;
}

export function FormCheckbox<TFieldValues extends FieldValues>({
	control,
	name,
	label,
	description,
}: FormCheckboxProps<TFieldValues>) {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem className='flex flex-row items-center space-x-3 space-y-0'>
					<FormControl>
						<Checkbox checked={field.value} onCheckedChange={field.onChange} />
					</FormControl>
					<div className='space-y-1 leading-none'>
						<FormLabel>{label}</FormLabel>
						{description && <FormDescription>{description}</FormDescription>}
					</div>
				</FormItem>
			)}
		/>
	);
}
