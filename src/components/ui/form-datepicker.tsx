
'use client';

import * as React from 'react';
import { Control, FieldPath, FieldValues } from 'react-hook-form';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar, CalendarProps } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Input } from './input';

interface FormDatePickerProps<TFieldValues extends FieldValues>
	extends Omit<CalendarProps, 'onSelect' | 'selected' | 'mode'> {
	control: Control<TFieldValues> | any;
	name: FieldPath<TFieldValues>;
	label: string;
	required?: boolean;
	placeholder?: string;
	showTime?: boolean;
}

export function FormDatePicker<TFieldValues extends FieldValues>({
	control,
	name,
	label,
	required = false,
	placeholder,
	showTime = false,
	captionLayout = 'dropdown-buttons',
	fromYear = 1960,
	toYear = new Date().getFullYear() + 10,
	...props
}: FormDatePickerProps<TFieldValues>) {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem>
					<div className='space-y-2'>
						<FormLabel required={required}>{label}</FormLabel>
						<Popover>
							<PopoverTrigger asChild>
								<FormControl>
									<Button
										variant={'outline'}
										className={cn(
											'w-full pl-3 text-left font-normal h-10',
											!field.value && 'text-muted-foreground'
										)}
									>
										{field.value ? (
											format(new Date(field.value), showTime ? 'PPP p' : 'PPP')
										) : (
											<span>{placeholder || 'Pick a date'}</span>
										)}
										<CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
									</Button>
								</FormControl>
							</PopoverTrigger>
							<PopoverContent className='w-auto p-0' align='start'>
								<Calendar
									mode='single'
									selected={field.value ? new Date(field.value) : undefined}
									onSelect={(date) => {
										if (!date) {
											field.onChange('');
											return;
										}
										const newDate = new Date(date);
										if (field.value) {
											const oldDate = new Date(field.value);
											newDate.setHours(oldDate.getHours());
											newDate.setMinutes(oldDate.getMinutes());
										}
										field.onChange(newDate.toISOString().slice(0, 16));
									}}
									initialFocus
									captionLayout={captionLayout}
									fromYear={fromYear}
									toYear={toYear}
									{...props}
								/>
								{showTime && (
									<div className='p-3 border-t border-border'>
										<Input
											type='time'
											value={field.value ? format(new Date(field.value), 'HH:mm') : ''}
											onChange={(e) => {
												const time = e.target.value;
												const [hours, minutes] = time.split(':');
												const date = field.value ? new Date(field.value) : new Date();
												date.setHours(parseInt(hours, 10));
												date.setMinutes(parseInt(minutes, 10));
												field.onChange(date.toISOString().slice(0, 16));
											}}
										/>
									</div>
								)}
							</PopoverContent>
						</Popover>
					</div>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
