"use client";

import * as React from "react";
import { Clock } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface TimeInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onTimeChange?: (time: string) => void;
}

const TimeInput = React.forwardRef<HTMLInputElement, TimeInputProps>(
  ({ className, onTimeChange, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (onTimeChange) {
        onTimeChange(value);
      }
      if (onChange) {
        onChange(e);
      }
    };

    return (
      <div className="relative">
        <Input type="time" className={cn("pl-10", className)} ref={ref} onChange={handleChange} {...props} />
        <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
      </div>
    );
  }
);
TimeInput.displayName = "TimeInput";

export { TimeInput };
