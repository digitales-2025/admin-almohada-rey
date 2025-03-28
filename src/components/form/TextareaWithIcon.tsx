"use client";

import React from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";

interface TextareaWithIconProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  Icon: LucideIcon;
  iconClassName?: string;
  wrapperClassName?: string;
}

const TextareaWithIcon = React.forwardRef<HTMLTextAreaElement, TextareaWithIconProps>(
  ({ className, Icon, iconClassName, wrapperClassName, ...props }, ref) => {
    return (
      <div className={cn("relative flex items-center", wrapperClassName)}>
        <div className={cn("absolute left-3 z-10 flex items-center pointer-events-none", iconClassName)}>
          <Icon className="h-4 w-4 shrink-0 opacity-50" />
        </div>
        <Textarea ref={ref} className={cn("pl-9", className)} {...props} />
      </div>
    );
  }
);

TextareaWithIcon.displayName = "InputWithIcon";

export { TextareaWithIcon };
