"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface InputWithIconProps extends React.InputHTMLAttributes<HTMLInputElement> {
  Icon: LucideIcon;
  iconClassName?: string;
  wrapperClassName?: string;
}

const InputWithIcon = React.forwardRef<HTMLInputElement, InputWithIconProps>(
  ({ className, Icon, iconClassName, wrapperClassName, ...props }, ref) => {
    return (
      <div className={cn("relative", wrapperClassName)}>
        <Icon className={cn("absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 shrink-0 opacity-50", iconClassName)} />
        <Input ref={ref} className={cn("pl-9", className)} {...props} />
      </div>
    );
  }
);

InputWithIcon.displayName = "InputWithIcon";

export { InputWithIcon };
