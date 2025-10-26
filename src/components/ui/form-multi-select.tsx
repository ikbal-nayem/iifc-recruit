
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
	TOption = { id: string; nameEn: string },
> {
	control: Control<TFieldValues> | any;
	name: FieldPath<TFieldValues>;
	label?: string;
	placeholder?: string;
	required?: boolean;
	options?: TOption[];
	loadOptions?: (searchKey: string, callback: (options: TOption[]) => void) => void;
	selected: TOption[];
	onAdd: (option: TOption) => void;
	onRemove: (option: TOption) => void;
	badgeVariant?: BadgeProps['variant'];
	closeOnSelect?: boolean;
}

export function FormMultiSelect<
	TFieldValues extends FieldValues,
	TOption extends { id: string; nameEn: string },
>({
	control,
	name,
	label,
	placeholder = 'Select...',
	required = false,
	options: staticOptions,
	loadOptions,
	selected,
	onAdd,
	onRemove,
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

	const handleSelect = (option: TOption) => {
		if (!selected.some((s) => s.id === option.id)) {
			onAdd(option);
		}
		setSearchQuery('');
		if (closeOnSelect) {
			setOpen(false);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault();
		}
	};

	const triggerContent = (
		<Button
			type='button'
			variant='outline'
			className={cn(
				'flex flex-wrap gap-1 p-2 w-full justify-start font-normal h-10',
				!selected.length && 'text-muted-foreground'
			)}
			onClick={() => setOpen(true)}
		>
			{selected.length > 0 ? (
				selected.map((item) => (
					<Badge key={item.id} variant={badgeVariant} className='text-sm py-1 px-2'>
						{item.nameEn}
						<div
							role='button'
							className='ml-1 rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								onRemove(item);
							}}
						>
							<X className='h-3 w-3 text-muted-foreground hover:text-foreground' />
						</div>
					</Badge>
				))
			) : (
				<span className='px-1'>{placeholder}</span>
			)}
			{selected.length > 0 && <span className='text-muted-foreground text-sm px-1'>Add more...</span>}
		</Button>
	);

	const popoverContent = (
		<PopoverContent className='w-[--radix-popover-trigger-width] p-0' align='start'>
			<Command shouldFilter={!loadOptions} onKeyDown={handleKeyDown}>
				<CommandInput placeholder='Search...' value={searchQuery} onValueChange={setSearchQuery} />
				<CommandList>
					{isLoading && (
						<div className='p-2 flex justify-center'>
							<Loader2 className='h-6 w-6 animate-spin' />
						</div>
					)}
					{!isLoading && searchQuery && options.length === 0 && <CommandEmpty>No results found.</CommandEmpty>}
					{!isLoading && !searchQuery && !loadOptions && <CommandEmpty>No results found.</CommandEmpty>}
					{!isLoading && !searchQuery && loadOptions && <CommandEmpty>Type to search.</CommandEmpty>}
					<CommandGroup>
						{options.map((option) => (
							<CommandItem
								key={option.id}
								value={option.nameEn}
								onSelect={() => handleSelect(option)}
							>
								<Check
									className={cn(
										'mr-2 h-4 w-4',
										selected.some((s) => s.id === option.id) ? 'opacity-100' : 'opacity-0'
									)}
								/>
								{option.nameEn}
							</CommandItem>
						))}
					</CommandGroup>
				</CommandList>
			</Command>
		</PopoverContent>
	);

	const component = (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>{triggerContent}</PopoverTrigger>
			{popoverContent}
		</Popover>
	);

	return (
		<FormField
			control={control}
			name={name}
			render={() => (
				<FormItem>
					{label && <FormLabel required={required}>{label}</FormLabel>}
					<div className='space-y-2'>{component}</div>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
