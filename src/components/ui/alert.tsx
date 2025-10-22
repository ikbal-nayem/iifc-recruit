import { cva, type VariantProps } from 'class-variance-authority';
import { AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

const alertVariants = cva('relative w-full rounded-lg border p-3 [&>svg]:text-foreground', {
	variants: {
		variant: {
			default: 'bg-background text-foreground',
			danger: 'border-danger/50 text-danger bg-red-50 dark:border-danger [&>svg]:text-danger',
			success: 'border-green-600/50 text-green-600 bg-green-50 dark:border-green-600 [&>svg]:text-green-600',
			warning: 'border-amber-500/50 text-amber-500 bg-amber-50 dark:border-amber-500 [&>svg]:text-amber-500',
			info: 'border-sky-500/50 text-sky-500 bg-sky-50 dark:border-sky-500 [&>svg]:text-sky-500',
		},
	},
	defaultVariants: {
		variant: 'default',
	},
});

const variantIcons = {
	default: Info,
	danger: AlertCircle,
	success: CheckCircle,
	warning: AlertTriangle,
	info: Info,
};

interface AlertProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
	icon?: React.ReactNode;
	showIcon?: boolean;
	iconClassName?: string;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
	({ className, variant, children, icon, iconClassName, showIcon = true, ...props }, ref) => {
		const IconComponent = variant ? variantIcons[variant] || Info : Info;

		const displayIcon = showIcon ? icon ?? <IconComponent className={cn('h-5 w-5', iconClassName)} /> : null;

		return (
			<div
				ref={ref}
				role='alert'
				className={cn(alertVariants({ variant }), 'flex items-center gap-3', className)}
				{...props}
			>
				{displayIcon}
				<div className='flex-1'>{children}</div>
			</div>
		);
	}
);
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
	({ className, ...props }, ref) => (
		<h5 ref={ref} className={cn('mb-1 font-medium leading-none tracking-tight', className)} {...props} />
	)
);
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
	({ className, ...props }, ref) => (
		<div ref={ref} className={cn('text-sm [&_p]:leading-relaxed', className)} {...props} />
	)
);
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertDescription, AlertTitle };
