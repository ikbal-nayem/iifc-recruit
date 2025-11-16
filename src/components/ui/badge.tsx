import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
	'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 whitespace-nowrap',
	{
		variants: {
			variant: {
				default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
				secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',

				danger: 'border-transparent bg-danger text-danger-foreground',
				success: 'border-transparent bg-success text-success-foreground',
				warning: 'border-transparent bg-warning text-warning-foreground',
				info: 'border-transparent bg-info text-info-foreground',
				purple: 'border-transparent bg-purple-600 text-purple-50',

				outline: 'text-foreground',
				'outline-danger': 'text-danger border-danger',
				'outline-success': 'text-success border-success',
				'outline-warning': 'text-warning border-warning',
				'outline-info': 'text-info border-info',
				'outline-purple': 'text-purple-600 border-purple-600',

				'lite-danger': 'bg-danger/10 text-danger border-transparent',
				'lite-success': 'bg-success/10 text-success border-transparent',
				'lite-warning': 'bg-warning/10 text-warning border-transparent',
				'lite-info': 'bg-info/10 text-info border-transparent',
				'lite-purple': 'bg-purple-600/10 text-purple-600 border-transparent',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	}
);

export interface BadgeProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
	return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
