
'use client';

import { Button } from '@/components/ui/button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';
import { Control, FieldPath, FieldValues } from 'react-hook-form';

interface FormAutocompleteProps<TFieldValues extends FieldValues> {
	control: Control<TFieldValues> | any;
	name: FieldPath<TFieldValues>;
	label: string;
	placeholder?: string;
	required?: boolean;
	options: { value: string | number; label: string }[];
	disabled?: boolean;
	onValueChange?: (value: string | number) => void;
	value?: string;
}

export function FormAutocomplete<TFieldValues extends FieldValues>({
	control,
	name,
	label,
	placeholder,
	required = false,
	options,
	disabled = false,
	onValueChange,
	value,
}: FormAutocompleteProps<TFieldValues>) {
	const [open, setOpen] = React.useState(false);

	if (!control) {
		return (
			<FormItem>
				<div className='space-y-2'>
					{label && <FormLabel required={required}>{label}</FormLabel>}
					<Popover open={open} onOpenChange={setOpen}>
						<PopoverTrigger asChild>
							<Button
								variant='outline'
								role='combobox'
								className={cn('w-full justify-between h-11', !value && 'text-muted-foreground')}
								disabled={disabled}
							>
								{value ? options.find((option) => option.value === value)?.label : placeholder || 'Select...'}
								<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
							</Button>
						</PopoverTrigger>
						<PopoverContent className='w-[--radix-popover-trigger-width] p-0'>
							<Command>
								<CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
								<CommandList>
									<CommandEmpty>No options found.</CommandEmpty>
									<CommandGroup>
										{options.map((option) => (
											<CommandItem
												key={option.value}
												value={option.label}
												onSelect={() => {
													if (onValueChange) onValueChange(option.value);
													setOpen(false);
												}}
											>
												<Check
													className={cn('mr-2 h-4 w-4', value === option.value ? 'opacity-100' : 'opacity-0')}
												/>
												{option.label}
											</CommandItem>
										))}
									</CommandGroup>
								</CommandList>
							</Command>
						</PopoverContent>
					</Popover>
				</div>
			</FormItem>
		);
	}

	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem>
					<div className='space-y-2'>
						<FormLabel required={required}>{label}</FormLabel>
						<Popover open={open} onOpenChange={setOpen}>
							<PopoverTrigger asChild>
								<FormControl>
									<Button
										variant='outline'
										role='combobox'
										className={cn('w-full justify-between h-11', !field.value && 'text-muted-foreground')}
										disabled={disabled}
									>
										{field.value
											? options.find((option) => option.value === field.value)?.label
											: placeholder || 'Select...'}
										<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
									</Button>
								</FormControl>
							</PopoverTrigger>
							<PopoverContent className='w-[--radix-popover-trigger-width] p-0'>
								<Command>
									<CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
									<CommandList>
										<CommandEmpty>No options found.</CommandEmpty>
										<CommandGroup>
											{options.map((option) => (
												<CommandItem
													key={option.value}
													value={option.label}
													onSelect={() => {
														field.onChange(option.value);
														setOpen(false);
													}}
												>
													<Check
														className={cn(
															'mr-2 h-4 w-4',
															field.value === option.value ? 'opacity-100' : 'opacity-0'
														)}
													/>
													{option.label}
												</CommandItem>
											))}
										</CommandGroup>
									</CommandList>
								</Command>
							</PopoverContent>
						</Popover>
					</div>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
