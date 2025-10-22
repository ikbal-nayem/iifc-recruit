
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
import { buttonVariants } from './button';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface ConfirmationDialogProps {
	trigger?: React.ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	title?: string;
	description?: string;
	onConfirm: () => void;
	variant?: 'danger' | 'warning' | 'default';
	confirmText?: string;
	cancelText?: string;
}

export function ConfirmationDialog({
	trigger,
	open,
	onOpenChange,
	title = 'Are you absolutely sure?',
	description = 'This action cannot be undone.',
	onConfirm,
	variant = 'danger',
	confirmText = 'Confirm',
	cancelText = 'Cancel',
}: ConfirmationDialogProps) {
	const content = (
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
	);

	if (trigger) {
		return (
			<AlertDialog open={open} onOpenChange={onOpenChange}>
				<AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
				{content}
			</AlertDialog>
		);
	}

	return <AlertDialog open={open} onOpenChange={onOpenChange}>{content}</AlertDialog>;
}
