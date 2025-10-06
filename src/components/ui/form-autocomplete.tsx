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

interface FormAutocompleteProps<
	TFieldValues extends FieldValues,
	TOption = { value: string | number; label: string },
> {
	control: Control<TFieldValues> | any;
	name: FieldPath<TFieldValues>;
	label: string;
	placeholder?: string;
	required?: boolean;
	options: TOption[];
	getOptionValue: (option: TOption) => string | number;
	getOptionLabel: (option: TOption) => string;
	renderOption?: (option: TOption) => React.ReactNode;
	disabled?: boolean;
	onValueChange?: (value: string | number) => void;
	value?: string;
}

export function FormAutocomplete<
	TFieldValues extends FieldValues,
	TOption extends { [key: string]: any },
>({
	control,
	name,
	label,
	placeholder,
	required = false,
	options,
	getOptionValue,
	getOptionLabel,
	renderOption,
	disabled = false,
	onValueChange,
	value,
}: FormAutocompleteProps<TFieldValues, TOption>) {
	const [open, setOpen] = React.useState(false);

	if (!control) {
		const selectedOption = options.find((option) => getOptionValue(option) === value);
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
								{value && selectedOption ? getOptionLabel(selectedOption) : placeholder || 'Select...'}
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
												key={getOptionValue(option)}
												value={getOptionLabel(option)}
												onSelect={() => {
													if (onValueChange) onValueChange(getOptionValue(option));
													setOpen(false);
												}}
											>
												<Check
													className={cn(
														'mr-2 h-4 w-4',
														value === getOptionValue(option) ? 'opacity-100' : 'opacity-0'
													)}
												/>
												{renderOption ? renderOption(option) : getOptionLabel(option)}
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
											? getOptionLabel(options.find((option) => getOptionValue(option) === field.value)!)
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
													key={getOptionValue(option)}
													value={getOptionLabel(option)}
													onSelect={() => {
														field.onChange(getOptionValue(option));
														setOpen(false);
													}}
												>
													<Check
														className={cn(
															'mr-2 h-4 w-4',
															field.value === getOptionValue(option) ? 'opacity-100' : 'opacity-0'
														)}
													/>
													{renderOption ? renderOption(option) : getOptionLabel(option)}
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
