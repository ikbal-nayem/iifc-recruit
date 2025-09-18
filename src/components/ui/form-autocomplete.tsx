
'use client';

import * as React from 'react';
import { Control, FieldPath, FieldValues } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Combobox, ComboboxEmpty, ComboboxInput, ComboboxGroup, ComboboxItem, ComboboxList } from '@/components/ui/combobox';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormAutocompleteProps<TFieldValues extends FieldValues> {
	control: Control<TFieldValues> | any;
	name: FieldPath<TFieldValues>;
	label: string;
	placeholder?: string;
	required?: boolean;
	options: { value: string; label: string }[];
	disabled?: boolean;
    onValueChange?: (value: string) => void;
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
            <div className="space-y-2">
                {label && <FormLabel required={required}>{label}</FormLabel>}
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant='outline'
                            role='combobox'
                            className={cn('w-full justify-between', !value && 'text-muted-foreground')}
                            disabled={disabled}
                        >
                            {value
                                ? options.find((option) => option.value === value)?.label
                                : placeholder || 'Select...'}
                            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-[--radix-popover-trigger-width] p-0'>
                        <Combobox>
                            <ComboboxInput placeholder={`Search ${label.toLowerCase()}...`} />
                            <ComboboxList>
                                <ComboboxEmpty>No options found.</ComboboxEmpty>
                                <ComboboxGroup>
                                    {options.map((option) => (
                                        <ComboboxItem
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
                                        </ComboboxItem>
                                    ))}
                                </ComboboxGroup>
                            </ComboboxList>
                        </Combobox>
                    </PopoverContent>
                </Popover>
            </div>
        );
    }

	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem>
					<FormLabel required={required}>{label}</FormLabel>
					<Popover open={open} onOpenChange={setOpen}>
						<PopoverTrigger asChild>
							<FormControl>
								<Button
									variant='outline'
									role='combobox'
									className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}
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
							<Combobox>
								<ComboboxInput placeholder={`Search ${label.toLowerCase()}...`} />
								<ComboboxList>
									<ComboboxEmpty>No options found.</ComboboxEmpty>
									<ComboboxGroup>
										{options.map((option) => (
											<ComboboxItem
												key={option.value}
												value={option.label}
												onSelect={() => {
													field.onChange(option.value);
													setOpen(false);
												}}
											>
												<Check
													className={cn('mr-2 h-4 w-4', field.value === option.value ? 'opacity-100' : 'opacity-0')}
												/>
												{option.label}
											</ComboboxItem>
										))}
									</ComboboxGroup>
								</ComboboxList>
							</Combobox>
						</PopoverContent>
					</Popover>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
