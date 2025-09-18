
'use client';

import * as React from 'react';
import { Control, FieldPath, FieldValues } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from './label';

interface FormRadioGroupProps<TFieldValues extends FieldValues> {
	control: Control<TFieldValues>;
	name: FieldPath<TFieldValues>;
	label: string;
	required?: boolean;
	options: { label: string; value: string }[];
    orientation?: 'horizontal' | 'vertical';
}

export function FormRadioGroup<TFieldValues extends FieldValues>({
	control,
	name,
	label,
	required = false,
	options,
    orientation = 'horizontal',
}: FormRadioGroupProps<TFieldValues>) {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem className="space-y-3">
					<FormLabel required={required}>{label}</FormLabel>
					<FormControl>
						<RadioGroup
							onValueChange={field.onChange}
							defaultValue={field.value}
							className={cn(
                                "flex gap-4",
                                orientation === 'vertical' ? "flex-col" : "flex-row"
                            )}
						>
							{options.map((option) => (
								<FormItem key={option.value} className="flex items-center space-x-3 space-y-0">
									<FormControl>
										<RadioGroupItem value={option.value} />
									</FormControl>
									<FormLabel className="font-normal">{option.label}</FormLabel>
								</FormItem>
							))}
						</RadioGroup>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
