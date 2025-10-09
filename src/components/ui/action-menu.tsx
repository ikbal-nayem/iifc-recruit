'use client';

import * as React from 'react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export type ActionMenuItem = {
	label: string;
	icon?: React.ReactNode;
	onClick?: () => void;
	href?: string;
	isSeparator?: false;
	variant?: 'default' | 'danger';
	className?: string;
};

type ActionMenuSeparator = {
	isSeparator: true;
};

export type ActionItem = ActionMenuItem | ActionMenuSeparator;

interface ActionMenuProps {
	items: ActionItem[];
	trigger?: React.ReactNode;
	label?: string;
}

export function ActionMenu({ items, trigger, label }: ActionMenuProps) {
	const renderItem = (item: ActionItem, index: number) => {
		if (item.isSeparator) {
			return <DropdownMenuSeparator key={`separator-${index}`} />;
		}

		const { label, icon, onClick, href, variant, className } = item;

		const content = (
			<span className='flex items-center gap-2'>
				{icon}
				{label}
			</span>
		);

		const itemClasses = cn(
			variant === 'danger' && 'text-danger focus:text-danger focus:bg-danger/10',
			className
		);

		if (href) {
			return (
				<DropdownMenuItem key={index} asChild className={itemClasses}>
					<Link href={href}>{content}</Link>
				</DropdownMenuItem>
			);
		}

		return (
			<DropdownMenuItem key={index} onSelect={onClick} className={itemClasses}>
				{content}
			</DropdownMenuItem>
		);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				{trigger || (
					<Button variant='ghost' className='h-8 w-8 p-0'>
						<span className='sr-only'>Open menu</span>
						<MoreHorizontal className='h-4 w-4' />
					</Button>
				)}
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				{label && <DropdownMenuLabel>{label}</DropdownMenuLabel>}
				{items.map(renderItem)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
