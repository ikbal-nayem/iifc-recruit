import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
	'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
	{
		variants: {
			variant: {
				default: 'bg-primary text-primary-foreground hover:bg-primary/90',
				danger: 'bg-danger text-danger-foreground hover:bg-danger/90',
				warning: 'bg-warning text-warning-foreground hover:bg-warning/90',
				success: 'bg-success text-success-foreground hover:bg-success/90',
				info: 'bg-info text-info-foreground hover:bg-info/90',

				outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
				'outline-danger': 'border border-danger text-danger bg-transparent hover:bg-danger/10',
				'outline-warning': 'border border-warning text-warning bg-transparent hover:bg-warning/10',
				'outline-success': 'border border-success text-success bg-transparent hover:bg-success/10',
				'outline-info': 'border border-info text-info bg-transparent hover:bg-info/10',

				secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',

				ghost: 'hover:bg-accent hover:text-accent-foreground',
				'lite-danger': 'bg-danger/10 text-danger hover:bg-danger/20',
				'lite-warning': 'bg-warning/10 text-warning hover:bg-warning/20',
				'lite-success': 'bg-success/10 text-success hover:bg-success/20',
				'lite-info': 'bg-info/10 text-info hover:bg-info/20',

				link: 'text-primary underline-offset-4 hover:underline',
			},
			size: {
				default: 'h-10 px-4 py-2',
				sm: 'h-9 rounded-md px-3',
				lg: 'h-11 rounded-md px-8',
				icon: 'h-10 w-10',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	}
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : 'button';
		return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
	}
);
Button.displayName = 'Button';

export { Button, buttonVariants };
