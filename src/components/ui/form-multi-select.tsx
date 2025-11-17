
'use client';

import { Badge, BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useDebounce } from '@/hooks/use-debounce';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown, Loader2, X } from 'lucide-react';
import * as React from 'react';
import { Control, FieldPath, FieldValues } from 'react-hook-form';

interface FormMultiSelectProps<
	TFieldValues extends FieldValues,
	TOption = { [key: string]: any },
> {
	control: Control<TFieldValues> | any;
	name: FieldPath<TFieldValues>;
	label?: string;
	placeholder?: string;
	required?: boolean;
	options?: TOption[];
	loadOptions?: (searchKey: string, callback: (options: TOption[]) => void) => void;
	getOptionValue: (option: TOption) => string;
	getOptionLabel: (option: TOption) => React.ReactNode | string;
	badgeVariant?: BadgeProps['variant'];
	closeOnSelect?: boolean;
	onValueChange?: (value: string[]) => void;
}

export function FormMultiSelect<
	TFieldValues extends FieldValues,
	TOption extends { [key: string]: any },
>({
	control,
	name,
	label,
	placeholder = 'Select...',
	required = false,
	options: staticOptions,
	loadOptions,
	getOptionValue,
	getOptionLabel,
	badgeVariant = 'outline',
	closeOnSelect = false,
	onValueChange,
}: FormMultiSelectProps<TFieldValues, TOption>) {
	const [open, setOpen] = React.useState(false);
	const [searchQuery, setSearchQuery] = React.useState('');
	const [asyncOptions, setAsyncOptions] = React.useState<TOption[]>([]);
	const [isLoading, setIsLoading] = React.useState(false);

	const debouncedSearchQuery = useDebounce(searchQuery, 300);
	const allOptions = React.useMemo(() => staticOptions || asyncOptions, [staticOptions, asyncOptions]);

	React.useEffect(() => {
		if (loadOptions && open) {
			setIsLoading(true);
			loadOptions(debouncedSearchQuery, (newOptions) => {
				setAsyncOptions(newOptions);
				setIsLoading(false);
			});
		}
	}, [debouncedSearchQuery, loadOptions, open]);

	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => {
				const selectedValues = new Set<string>(field.value || []);

				const handleSelect = (option: TOption) => {
					const value = getOptionValue(option);
					const newSelectedValues = new Set<string>(selectedValues);
					if (newSelectedValues.has(value)) {
						newSelectedValues.delete(value);
					} else {
						newSelectedValues.add(value);
					}
					const finalValues = Array.from(newSelectedValues);
					field.onChange(finalValues);
					if (onValueChange) {
						onValueChange(finalValues);
					}
					setSearchQuery('');
					if (closeOnSelect && newSelectedValues.size > selectedValues.size) {
						setOpen(false);
					}
				};

				const handleRemove = (valueToRemove: string) => {
					const newSelectedValues = new Set(selectedValues);
					newSelectedValues.delete(valueToRemove);
					const finalValues = Array.from(newSelectedValues);
					field.onChange(finalValues);
					if (onValueChange) {
						onValueChange(finalValues);
					}
				};

				const displayedOptions = React.useMemo(() => {
					const valueMap = new Map<string, TOption>();
					allOptions.forEach((option) => valueMap.set(getOptionValue(option), option));

					return Array.from(selectedValues).map(
						(value) => valueMap.get(value) || ({ id: value, nameEn: 'Loading...' } as any)
					);
				}, [selectedValues, allOptions, getOptionValue]);

				return (
					<FormItem>
						{label && <FormLabel required={required}>{label}</FormLabel>}
						<Popover open={open} onOpenChange={setOpen}>
							<PopoverTrigger asChild>
								<Button
									type='button'
									variant='outline'
									className={cn(
										'flex w-full items-center justify-between px-4 py-2 font-normal h-auto min-h-10',
										displayedOptions.length === 0 && 'text-muted-foreground'
									)}
									onClick={() => setOpen(true)}
								>
									<div className='flex flex-1 flex-wrap gap-1'>
										{displayedOptions.length > 0 ? (
											displayedOptions.map((item) => (
												<Badge key={getOptionValue(item)} variant={badgeVariant} className='text-sm py-1 px-2'>
													{getOptionLabel(item)}
													<div
														role='button'
														className='ml-1 rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
														onClick={(e) => {
															e.preventDefault();
															e.stopPropagation();
															handleRemove(getOptionValue(item));
														}}
													>
														<X className='h-3 w-3 text-muted-foreground hover:text-foreground' />
													</div>
												</Badge>
											))
										) : (
											<span className='truncate'>{placeholder}</span>
										)}
									</div>
									<ChevronsUpDown className='h-4 w-4 shrink-0 opacity-50 ml-2' />
								</Button>
							</PopoverTrigger>
							<PopoverContent className='w-[--radix-popover-trigger-width] p-0' align='start'>
								<Command shouldFilter={!loadOptions}>
									<CommandInput placeholder='Search...' value={searchQuery} onValueChange={setSearchQuery} />
									<CommandList>
										{isLoading && (
											<div className='p-2 flex justify-center'>
												<Loader2 className='h-6 w-6 animate-spin' />
											</div>
										)}
										{!isLoading && searchQuery && allOptions.length === 0 && (
											<CommandEmpty>No results found.</CommandEmpty>
										)}
										<CommandGroup>
											{allOptions.map((option) => (
												<CommandItem
													key={getOptionValue(option)}
													value={getOptionValue(option)}
													onSelect={() => handleSelect(option)}
												>
													<Check
														className={cn(
															'mr-2 h-4 w-4',
															selectedValues.has(getOptionValue(option)) ? 'opacity-100' : 'opacity-0'
														)}
													/>
													{getOptionLabel(option)}
												</CommandItem>
											))}
										</CommandGroup>
									</CommandList>
								</Command>
							</PopoverContent>
						</Popover>
						<FormMessage />
					</FormItem>
				);
			}}
		/>
	);
}
