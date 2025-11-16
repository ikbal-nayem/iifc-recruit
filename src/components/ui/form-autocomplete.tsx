
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
import { Check, ChevronsUpDown, Loader2, PlusCircle, X } from 'lucide-react';
import * as React from 'react';
import { Control, FieldPath, FieldValues } from 'react-hook-form';

interface FormAutocompleteProps<
	TFieldValues extends FieldValues,
	TOption = { value: string; label: string },
> {
	control?: Control<TFieldValues> | any;
	name: FieldPath<TFieldValues>;
	label?: string;
	placeholder?: string;
	required?: boolean;
	options?: TOption[];
	loadOptions?: (searchKey: string, callback: (options: TOption[]) => void) => void;
	onCreate?: (value: string) => Promise<TOption | null>;
	getOptionValue: (option: TOption) => string;
	getOptionLabel: (option: TOption) => string | React.ReactNode;
	renderOption?: (option: TOption) => React.ReactNode;
	disabled?: boolean;
	allowClear?: boolean;
	onValueChange?: (value: string | undefined) => void;
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
	onCreate,
	getOptionValue,
	getOptionLabel,
	renderOption,
	disabled = false,
	allowClear = false,
	onValueChange,
	value: controlledValue,
	initialLabel,
	onInputChange,
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

	const handleCreate = async (field?: any) => {
		if (!onCreate || !searchQuery) return;
		setIsLoading(true);
		const newOption = await onCreate(searchQuery);
		if (newOption) {
			setAsyncOptions((prev) => [newOption, ...prev]);
			if (field) {
				field.onChange(getOptionValue(newOption));
			}
			if (onValueChange) {
				onValueChange(getOptionValue(newOption));
			}
			setOpen(false);
		}
		setIsLoading(false);
		setSearchQuery('');
	};

	const renderTrigger = (
		value: any,
		displayLabel?: string | React.ReactNode,
		onClear?: (e: React.MouseEvent) => void
	) => (
		<div className='relative'>
			<Button
				type='button'
				variant='outline'
				role='combobox'
				className={cn(
					'w-full justify-between h-10',
					!value && 'text-muted-foreground',
					allowClear && value && 'pr-8'
				)}
				disabled={disabled}
			>
				<span className='truncate'>{displayLabel || placeholder || 'Select...'}</span>
				<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
			</Button>
			{allowClear && value && onClear && (
				<Button
					type='button'
					variant='ghost'
					size='icon'
					className='absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground'
					onClick={onClear}
					disabled={disabled}
				>
					<X className='h-4 w-4' />
				</Button>
			)}
		</div>
	);

	const renderPopoverContent = (field?: any) => (
		<PopoverContent className='w-[--radix-popover-trigger-width] p-0'>
			<Command shouldFilter={!loadOptions}>
				<CommandInput
					placeholder={`Search ${label?.toLowerCase()}...`}
					onValueChange={(s) => {
						setSearchQuery(s);
						if (onInputChange) {
							onInputChange(s);
						}
					}}
					value={searchQuery}
				/>
				<CommandList>
					{isLoading ? (
						<div className='p-2 flex justify-center'>
							<Loader2 className='h-6 w-6 animate-spin' />
						</div>
					) : (
						<>
							{onCreate && searchQuery && options.length === 0 && (
								<CommandItem
									onSelect={() => handleCreate(field)}
									className='flex items-center gap-2'
								>
									<PlusCircle className='h-4 w-4' />
									Create &quot;{searchQuery}&quot;
								</CommandItem>
							)}
							<CommandEmpty>No options found.</CommandEmpty>
							<CommandGroup>
								{options.map((option) => (
									<CommandItem
										key={getOptionValue(option)}
										value={getOptionValue(option)}
										onSelect={() => {
											if (field) {
												field.onChange(getOptionValue(option));
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
												(field?.value?.toString() === getOptionValue(option) ||
													controlledValue === getOptionValue(option))
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
					<Popover open={open && !disabled} onOpenChange={setOpen}>
						<PopoverTrigger asChild disabled={disabled}>
							{renderTrigger(
								controlledValue,
								selectedOption ? getOptionLabel(selectedOption) : initialLabel,
								(e) => {
									e.stopPropagation();
									onValueChange?.(undefined);
								}
							)}
						</PopoverTrigger>
						{renderPopoverContent()}
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
				const selectedOption = options.find((option) => getOptionValue(option) === field.value?.toString());
				return (
					<FormItem>
						<div className='space-y-2'>
							{label && <FormLabel required={required}>{label}</FormLabel>}
							<Popover open={open && !disabled} onOpenChange={setOpen}>
								<PopoverTrigger asChild disabled={disabled}>
									<FormControl>
										{renderTrigger(
											field.value,
											selectedOption ? getOptionLabel(selectedOption) : initialLabel,
											(e) => {
												e.stopPropagation();
												field.onChange(undefined);
											}
										)}
									</FormControl>
								</PopoverTrigger>
								{renderPopoverContent(field)}
							</Popover>
						</div>
						<FormMessage />
					</FormItem>
				);
			}}
		/>
	);
}
