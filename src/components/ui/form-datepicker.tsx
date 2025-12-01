
'use client';

import { Button } from '@/components/ui/button';
import { Calendar, CalendarProps } from '@/components/ui/calendar';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import * as React from 'react';
import { Control, FieldPath, FieldValues } from 'react-hook-form';

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
	const generateTimeOptions = (max: number, step: number = 1) => {
		return Array.from({ length: max / step }, (_, i) => {
			const value = i * step;
			return value.toString().padStart(2, '0');
		});
	};

	const hours = generateTimeOptions(24);
	const minutes = generateTimeOptions(60, 5);

	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => {
				const selectedDate = field.value ? new Date(field.value) : null;

				const handleTimeChange = (type: 'hours' | 'minutes', value: string) => {
					const newDate = selectedDate || new Date();
					if (type === 'hours') {
						newDate.setHours(parseInt(value, 10));
					} else {
						newDate.setMinutes(parseInt(value, 10));
					}
					field.onChange(newDate.toISOString().slice(0, 16));
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
										selected={selectedDate || undefined}
										onSelect={(date) => {
											if (!date) {
												field.onChange('');
												return;
											}
											const newDate = new Date(date);
											if (selectedDate) {
												newDate.setHours(selectedDate.getHours());
												newDate.setMinutes(selectedDate.getMinutes());
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
										<div className='flex gap-2 p-3 border-t border-border'>
											<Select
												value={selectedDate ? selectedDate.getHours().toString().padStart(2, '0') : '00'}
												onValueChange={(value) => handleTimeChange('hours', value)}
											>
												<SelectTrigger className='w-[80px]'>
													<SelectValue placeholder='Hour' />
												</SelectTrigger>
												<SelectContent>
													{hours.map((hour) => (
														<SelectItem key={hour} value={hour}>
															{hour}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<Select
												value={selectedDate ? selectedDate.getMinutes().toString().padStart(2, '0') : '00'}
												onValueChange={(value) => handleTimeChange('minutes', value)}
											>
												<SelectTrigger className='w-[80px]'>
													<SelectValue placeholder='Min' />
												</SelectTrigger>
												<SelectContent>
													{minutes.map((minute) => (
														<SelectItem key={minute} value={minute}>
															{minute}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
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
