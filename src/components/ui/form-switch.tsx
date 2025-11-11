
'use client';

import * as React from 'react';
import { Control, FieldPath, FieldValues } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';

interface FormSwitchProps<TFieldValues extends FieldValues> {
	control: Control<TFieldValues | any>;
	name: FieldPath<TFieldValues>;
	label: string;
    description?: string;
}

export function FormSwitch<TFieldValues extends FieldValues>({
	control,
	name,
	label,
    description,
}: FormSwitchProps<TFieldValues>) {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
					<div className="space-y-0.5">
                        <FormLabel className="text-base">{label}</FormLabel>
                        {description && <FormDescription>{description}</FormDescription>}
                    </div>
					<FormControl>
						<Switch checked={field.value} onCheckedChange={field.onChange} />
					</FormControl>
				</FormItem>
			)}
		/>
	);
}
