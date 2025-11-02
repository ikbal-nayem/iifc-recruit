'use client';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';
import * as React from 'react';
import { Control, FieldPath, FieldValues } from 'react-hook-form';
import { Button } from './button';

interface FormInputProps<TFieldValues extends FieldValues> extends React.ComponentProps<'input'> {
	control: Control<TFieldValues | any>;
	name: FieldPath<TFieldValues>;
	label?: string;
	required?: boolean;
	startIcon?: React.ReactNode;
}

export function FormInput<TFieldValues extends FieldValues>({
	control,
	name,
	label,
	required = false,
	startIcon,
	type,
	children,
	...props
}: FormInputProps<TFieldValues>) {
	const [showPassword, setShowPassword] = React.useState(false);
	const isPassword = type === 'password';

	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem>
					{!!label && <FormLabel required={required}>{label}</FormLabel>}
					<FormControl>
						<div className='relative flex items-center'>
							{startIcon && <div className='absolute left-3'>{startIcon}</div>}
							<Input
								{...props}
								{...field}
								type={isPassword ? (showPassword ? 'text' : 'password') : type}
								className={cn(startIcon && 'pl-10', isPassword && 'pr-10')}
							/>
							{isPassword && (
								<Button
									type='button'
									variant='ghost'
									size='icon'
									className='absolute right-1 h-8 w-8 text-muted-foreground hover:bg-transparent'
									onClick={() => setShowPassword(!showPassword)}
								>
									{showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
								</Button>
							)}
						</div>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
