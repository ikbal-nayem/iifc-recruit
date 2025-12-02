
'use client';

import { Button } from '@/components/ui/button';
import { Calendar, CalendarProps } from '@/components/ui/calendar';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Control, FieldPath, FieldValues } from 'react-hook-form';
import { Input } from './input';
import React from 'react';

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
	captionLayout = 'dropdown-buttons',
	fromYear = 1960,
	toYear = new Date().getFullYear() + 10,
	showTime = false,
	...props
}: FormDatePickerProps<TFieldValues>) {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => {
				const handleDateSelect = (date: Date | undefined) => {
					if (!date) {
						field.onChange('');
						return;
					}

					let newDateTime = date;
					if (showTime && field.value) {
						const currentTime = new Date(field.value);
						if (!isNaN(currentTime.getTime())) {
							newDateTime.setHours(currentTime.getHours(), currentTime.getMinutes());
						}
					}
					
					if (showTime) {
						field.onChange(newDateTime.toISOString());
					} else {
						// Set time to midnight in local timezone before formatting to avoid timezone shifts
						newDateTime.setHours(0, 0, 0, 0);
						// format to 'yyyy-MM-dd'
						field.onChange(format(newDateTime, 'yyyy-MM-dd'));
					}
				};

				const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
					const timeValue = e.target.value;
					let baseDate = field.value ? new Date(field.value) : new Date();

					if (isNaN(baseDate.getTime())) {
						baseDate = new Date();
					}

					if (timeValue) {
						const [hours, minutes] = timeValue.split(':').map(Number);
						baseDate.setHours(hours, minutes, 0, 0);
						field.onChange(baseDate.toISOString());
					} else {
						const dateOnly = new Date(baseDate);
						dateOnly.setHours(0, 0, 0, 0);
						field.onChange(dateOnly.toISOString());
					}
				};

				return (
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
										onSelect={handleDateSelect}
										initialFocus
										captionLayout={captionLayout}
										fromYear={fromYear}
										toYear={toYear}
										{...props}
									/>
									{showTime && (
										<div className='p-3 border-t'>
											<label className='text-sm font-medium'>Time</label>
											<Input
												type='time'
												value={field.value ? format(new Date(field.value), 'HH:mm') : ''}
												onChange={handleTimeChange}
												className='mt-1'
											/>
										</div>
									)}
								</PopoverContent>
							</Popover>
						</div>
						<FormMessage />
					</FormItem>
				);
			}}
		/>
	);
}
