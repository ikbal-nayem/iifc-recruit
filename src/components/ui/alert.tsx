
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Info, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react'

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        danger:
          "border-danger/50 text-danger dark:border-danger [&>svg]:text-danger",
        success:
          "border-green-600/50 text-green-600 dark:border-green-600 [&>svg]:text-green-600",
        warning:
          "border-amber-500/50 text-amber-500 dark:border-amber-500 [&>svg]:text-amber-500",
        info:
          "border-sky-500/50 text-sky-500 dark:border-sky-500 [&>svg]:text-sky-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const variantIcons = {
  default: Info,
  danger: AlertCircle,
  success: CheckCircle,
  warning: AlertTriangle,
  info: Info,
}


interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  icon?: React.ReactNode;
  showIcon?: boolean;
}


const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, children, icon, showIcon = true, ...props }, ref) => {
    const IconComponent = variant ? variantIcons[variant] : Info;
    
    const displayIcon = showIcon ? (icon ?? <IconComponent className="h-4 w-4" />) : null;
    
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), 'flex items-start gap-4', className)}
        {...props}
      >
        {displayIcon}
        <div className="flex-1">
          {children}
        </div>
      </div>
    );
  }
);
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
