
'use client';

import * as React from 'react';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button, buttonVariants } from './button';
import { cn } from '@/lib/utils';

interface ConfirmationDialogProps {
	trigger: React.ReactNode;
	title?: string;
	description?: string;
	onConfirm: () => void;
	variant?: 'danger' | 'warning' | 'default';
	confirmText?: string;
	cancelText?: string;
}

export function ConfirmationDialog({
	trigger,
	title = 'Are you absolutely sure?',
	description = 'This action cannot be undone.',
	onConfirm,
	variant = 'danger',
	confirmText = 'Confirm',
	cancelText = 'Cancel',
}: ConfirmationDialogProps) {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{description}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>{cancelText}</AlertDialogCancel>
					<AlertDialogAction
						onClick={onConfirm}
						className={cn(
							variant === 'danger' && buttonVariants({ variant: 'danger' }),
							variant === 'warning' && buttonVariants({ variant: 'warning' })
						)}
					>
						{confirmText}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
