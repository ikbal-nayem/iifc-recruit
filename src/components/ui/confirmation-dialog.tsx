
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
} from '@/components/ui/alert-dialog';
import { buttonVariants } from './button';
import { cn } from '@/lib/utils';

interface ConfirmationDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title?: string;
	description?: string;
	onConfirm: () => void;
	variant?: 'danger' | 'warning' | 'default';
	confirmText?: string;
	cancelText?: string;
}

export function ConfirmationDialog({
	open,
	onOpenChange,
	title = 'Are you absolutely sure?',
	description = 'This action cannot be undone.',
	onConfirm,
	variant = 'danger',
	confirmText = 'Confirm',
	cancelText = 'Cancel',
}: ConfirmationDialogProps) {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
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
