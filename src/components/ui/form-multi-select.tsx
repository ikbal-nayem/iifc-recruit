
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
import { Check, Loader2, X } from 'lucide-react';
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
	getOptionLabel: (option: TOption) => string;
	badgeVariant?: BadgeProps['variant'];
	closeOnSelect?: boolean;
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
}: FormMultiSelectProps<TFieldValues, TOption>) {
	const [open, setOpen] = React.useState(false);
	const [searchQuery, setSearchQuery] = React.useState('');
	const [asyncOptions, setAsyncOptions] = React.useState<TOption[]>([]);
	const [isLoading, setIsLoading] = React.useState(false);

	const debouncedSearchQuery = useDebounce(searchQuery, 300);
	const options = staticOptions || asyncOptions;

	React.useEffect(() => {
		if (loadOptions && open) {
			setIsLoading(true);
			loadOptions(debouncedSearchQuery, (newOptions) => {
				setAsyncOptions(newOptions);
				setIsLoading(false);
			});
		}
	}, [debouncedSearchQuery, loadOptions, open]);

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault();
		}
	};

	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => {
				const selectedValues = new Set(field.value || []);

				const handleSelect = (option: TOption) => {
					const value = getOptionValue(option);
					const newSelectedValues = new Set(selectedValues);
					if (newSelectedValues.has(value)) {
						newSelectedValues.delete(value);
					} else {
						newSelectedValues.add(value);
					}
					field.onChange(Array.from(newSelectedValues));
					setSearchQuery('');
					if (closeOnSelect && newSelectedValues.size > selectedValues.size) {
						setOpen(false);
					}
				};

				const handleRemove = (valueToRemove: string) => {
					const newSelectedValues = new Set(selectedValues);
					newSelectedValues.delete(valueToRemove);
					field.onChange(Array.from(newSelectedValues));
				};

				const selectedOptions = options.filter(option => selectedValues.has(getOptionValue(option)));
				// Add selected options that might not be in the current `options` list (e.g., from initial form values)
				const displayedSelected = React.useMemo(() => {
					const displayed = [...selectedOptions];
					const displayedIds = new Set(displayed.map(getOptionValue));
					(field.value || []).forEach((val: string) => {
						if (!displayedIds.has(val)) {
							// This is a bit of a hack. If we have a value but not the full option object,
							// we create a placeholder. This is common if initial values are set without
							// pre-loading the full option objects.
							const placeholderOption = { id: val, nameEn: 'Loading...' } as TOption;
							if (staticOptions?.some(opt => getOptionValue(opt) === val)) {
								displayed.push(staticOptions.find(opt => getOptionValue(opt) === val)!);
							} else {
								displayed.push(placeholderOption);
							}
						}
					});
					return displayed;
				// eslint-disable-next-line react-hooks/exhaustive-deps
				}, [field.value, options]);

				return (
					<FormItem>
						{label && <FormLabel required={required}>{label}</FormLabel>}
						<Popover open={open} onOpenChange={setOpen}>
							<PopoverTrigger asChild>
								<Button
									type='button'
									variant='outline'
									className={cn(
										'flex flex-wrap gap-1 p-2 w-full justify-start font-normal h-auto min-h-10',
										displayedSelected.length === 0 && 'text-muted-foreground'
									)}
									onClick={() => setOpen(true)}
								>
									{displayedSelected.length > 0 ? (
										displayedSelected.map((item) => (
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
										<span className='px-1'>{placeholder}</span>
									)}
									{displayedSelected.length > 0 && <span className='text-muted-foreground text-sm px-1'>Add more...</span>}
								</Button>
							</PopoverTrigger>
							<PopoverContent className='w-[--radix-popover-trigger-width] p-0' align='start'>
								<Command shouldFilter={!loadOptions} onKeyDown={handleKeyDown}>
									<CommandInput placeholder='Search...' value={searchQuery} onValueChange={setSearchQuery} />
									<CommandList>
										{isLoading && (
											<div className='p-2 flex justify-center'>
												<Loader2 className='h-6 w-6 animate-spin' />
											</div>
										)}
										{!isLoading && searchQuery && options.length === 0 && (
											<CommandEmpty>No results found.</CommandEmpty>
										)}
										{!isLoading && !searchQuery && !loadOptions && <CommandEmpty>No results found.</CommandEmpty>}
										{!isLoading && !searchQuery && loadOptions && <CommandEmpty>Type to search.</CommandEmpty>}
										<CommandGroup>
											{options.map((option) => (
												<CommandItem
													key={getOptionValue(option)}
													value={getOptionLabel(option)} // Use label for filtering in cmdk
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
