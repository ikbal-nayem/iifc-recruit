
'use client';

import { Button } from '@/components/ui/button';
import { Calendar, CalendarProps } from '@/components/ui/calendar';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format, parse } from 'date-fns';
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
				const [time, setTime] = React.useState(() => {
					if (field.value && showTime) {
						try {
							return format(new Date(field.value), 'HH:mm');
						} catch (e) {
							return '';
						}
					}
					return '';
				});

				const handleDateSelect = (date: Date | undefined) => {
					if (!date) {
						field.onChange('');
						return;
					}

					let newDate = new Date(date);
					if (showTime && time) {
						const [hours, minutes] = time.split(':').map(Number);
						newDate.setHours(hours, minutes);
					}
					field.onChange(newDate.toISOString());
				};

				const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
					const newTime = e.target.value;
					setTime(newTime);

					if (field.value) {
						const currentDate = new Date(field.value);
						if (!isNaN(currentDate.getTime())) {
							const [hours, minutes] = newTime.split(':').map(Number);
							currentDate.setHours(hours, minutes);
							field.onChange(currentDate.toISOString());
						}
					}
				};

				const displayFormat = showTime ? 'PPP p' : 'PPP';
				const displayValue = field.value ? format(new Date(field.value), displayFormat) : '';

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
											{displayValue ? displayValue : <span>{placeholder || 'Pick a date'}</span>}
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
											<Input type='time' value={time} onChange={handleTimeChange} className='mt-1' />
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
