
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
import { useDebounce } from '@/hooks/use-debounce';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import * as React from 'react';
import { Control, FieldPath, FieldValues } from 'react-hook-form';

interface FormAutocompleteProps<
	TFieldValues extends FieldValues,
	TOption = { value: string; label: string },
> {
	control?: Control<TFieldValues> | any;
	name: FieldPath<TFieldValues>;
	label: string;
	placeholder?: string;
	required?: boolean;
	options?: TOption[];
	loadOptions?: (searchKey: string, callback: (options: TOption[]) => void) => void;
	getOptionValue: (option: TOption) => string;
	getOptionLabel: (option: TOption) => string;
	renderOption?: (option: TOption) => React.ReactNode;
	disabled?: boolean;
	onValueChange?: (value: string) => void;
	value?: string;
	initialLabel?: string;
	onInputChange?: (value: string) => void;
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
	options: staticOptions,
	loadOptions,
	getOptionValue,
	getOptionLabel,
	renderOption,
	disabled = false,
	onValueChange,
	value: controlledValue,
	initialLabel,
}: FormAutocompleteProps<TFieldValues, TOption>) {
	const [open, setOpen] = React.useState(false);
	const [asyncOptions, setAsyncOptions] = React.useState<TOption[]>([]);
	const [isLoading, setIsLoading] = React.useState(false);
	const [searchQuery, setSearchQuery] = React.useState('');
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

	const popoverContent = (
		<PopoverContent className='w-[--radix-popover-trigger-width] p-0'>
			<Command shouldFilter={!loadOptions}>
				<CommandInput
					placeholder={`Search ${label.toLowerCase()}...`}
					onValueChange={setSearchQuery}
					value={searchQuery}
				/>
				<CommandList>
					{isLoading ? (
						<div className='p-2 flex justify-center'>
							<Loader2 className='h-6 w-6 animate-spin' />
						</div>
					) : (
						<>
							<CommandEmpty>No options found.</CommandEmpty>
							<CommandGroup>
								{options.map((option) => (
									<CommandItem
										key={getOptionValue(option)}
										value={getOptionLabel(option)}
										onSelect={() => {
											if (control && control.setValue) {
												control.setValue(name, getOptionValue(option));
											}
											if (onValueChange) {
												onValueChange(getOptionValue(option));
											}
											setOpen(false);
											setSearchQuery('');
										}}
									>
										<Check
											className={cn(
												'mr-2 h-4 w-4',
												(control ? control._getWatch(name) : controlledValue) === getOptionValue(option)
													? 'opacity-100'
													: 'opacity-0'
											)}
										/>
										{renderOption ? renderOption(option) : getOptionLabel(option)}
									</CommandItem>
								))}
							</CommandGroup>
						</>
					)}
				</CommandList>
			</Command>
		</PopoverContent>
	);

	if (!control) {
		const selectedOption = options.find((option) => getOptionValue(option) === controlledValue);
		return (
			<FormItem>
				<div className='space-y-2'>
					{label && <FormLabel required={required}>{label}</FormLabel>}
					<Popover open={open} onOpenChange={setOpen}>
						<PopoverTrigger asChild>
							<Button
								variant='outline'
								role='combobox'
								className={cn('w-full justify-between h-11', !controlledValue && 'text-muted-foreground')}
								disabled={disabled}
							>
								{selectedOption ? getOptionLabel(selectedOption) : initialLabel || placeholder || 'Select...'}
								<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
							</Button>
						</PopoverTrigger>
						{popoverContent}
					</Popover>
				</div>
			</FormItem>
		);
	}

	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => {
				const selectedOption = options.find((option) => getOptionValue(option) === field.value);
				return (
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
											{selectedOption
												? getOptionLabel(selectedOption)
												: initialLabel || placeholder || 'Select...'}
											<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
										</Button>
									</FormControl>
								</PopoverTrigger>
								{popoverContent}
							</Popover>
						</div>
						<FormMessage />
					</FormItem>
				);
			}}
		/>
	);
}
