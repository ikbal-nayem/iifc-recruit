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
import { ICommonMasterData } from '@/interfaces/master-data.interface';
import { cn } from '@/lib/utils';
import { MasterDataService } from '@/services/api/master-data.service';
import { Check, Loader2, X } from 'lucide-react';
import * as React from 'react';
import { Control, FieldPath, FieldValues } from 'react-hook-form';

interface FormMultiSelectProps<TFieldValues extends FieldValues> {
	control?: Control<TFieldValues> | any;
	name: FieldPath<TFieldValues>;
	label?: string;
	placeholder?: string;
	required?: boolean;
	options: ICommonMasterData[];
	selected: ICommonMasterData[];
	onAdd: (option: ICommonMasterData) => void;
	onRemove: (option: ICommonMasterData) => void;
	badgeVariant?: BadgeProps['variant'];
	closeOnSelect?: boolean;
}

export function FormMultiSelect<TFieldValues extends FieldValues>({
	control,
	name,
	label,
	placeholder = 'Select...',
	required = false,
	options: initialOptions,
	selected,
	onAdd,
	onRemove,
	badgeVariant = 'secondary',
	closeOnSelect = false,
}: FormMultiSelectProps<TFieldValues>) {
	const [open, setOpen] = React.useState(false);
	const [searchQuery, setSearchQuery] = React.useState('');
	const [suggestions, setSuggestions] = React.useState<ICommonMasterData[]>(initialOptions);
	const [isLoading, setIsLoading] = React.useState(false);

	const debouncedSearch = useDebounce(searchQuery, 300);

	React.useEffect(() => {
		if (debouncedSearch) {
			setIsLoading(true);
			MasterDataService.skill
				.getList({ body: { nameEn: debouncedSearch }, meta: { page: 0, limit: 30 } })
				.then((res) => setSuggestions(res.body))
				.finally(() => setIsLoading(false));
		} else {
			setSuggestions(initialOptions);
		}
	}, [debouncedSearch, initialOptions]);

	const handleSelect = (option: ICommonMasterData) => {
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
		<div
			className={cn(
				'flex flex-wrap gap-1 p-2 mt-2 border rounded-lg min-h-[44px] items-center cursor-text w-full justify-start font-normal h-auto bg-background'
			)}
		>
			{selected.length > 0 ? (
				selected.map((item) => (
					<Badge key={item.id} variant={badgeVariant} className='text-sm py-1 px-2'>
						{item.nameEn}
						<button
							type='button'
							className='ml-1 rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								onRemove(item);
							}}
						>
							<X className='h-3 w-3 text-muted-foreground hover:text-foreground' />
						</button>
					</Badge>
				))
			) : (
				<span className='text-sm text-muted-foreground px-1'>{placeholder}</span>
			)}
		</div>
	);

	const popoverContent = (
		<PopoverContent className='w-[--radix-popover-trigger-width] p-0' align='start'>
			<Command shouldFilter={false} onKeyDown={handleKeyDown}>
				<CommandInput placeholder='Search...' value={searchQuery} onValueChange={setSearchQuery} />
				<CommandList>
					{isLoading && (
						<div className='p-2 flex justify-center'>
							<Loader2 className='h-6 w-6 animate-spin' />
						</div>
					)}
					{!isLoading && debouncedSearch && suggestions.length === 0 && <CommandEmpty>No results found.</CommandEmpty>}
					{!isLoading && !debouncedSearch && <CommandEmpty>Type to search.</CommandEmpty>}
					<CommandGroup>
						{suggestions.map((option) => (
							<CommandItem key={option.id} value={option.nameEn} onSelect={() => handleSelect(option)}>
								<Check
									className={cn('mr-2 h-4 w-4', selected.some((s) => s.id === option.id) ? 'opacity-100' : 'opacity-0')}
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

	if (control) {
		return (
			<FormField
				control={control}
				name={name}
				render={() => (
					<FormItem>
						{label && <FormLabel required={required}>{label}</FormLabel>}
						{component}
						<FormMessage />
					</FormItem>
				)}
			/>
		);
	}

	return (
		<div>
			{label && <label className='text-sm font-medium'>{label}</label>}
			{component}
		</div>
	);
}
