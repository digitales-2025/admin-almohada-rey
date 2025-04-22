import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-primary bg-primary text-primary-foreground shadow hover:bg-primary/90",
        secondary: "border-secondary bg-secondary text-secondary-foreground hover:bg-secondary/90",
        destructive: "border-destructive bg-destructive text-destructive-foreground shadow hover:bg-destructive/90",
        outline: "border-border text-foreground hover:bg-muted",
        ghost: "border-transparent bg-muted/50 text-muted-foreground hover:bg-muted",
        subtle: "border-transparent bg-muted/30 text-foreground hover:bg-muted/50",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-[0.65rem]",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

export { Badge, badgeVariants };
