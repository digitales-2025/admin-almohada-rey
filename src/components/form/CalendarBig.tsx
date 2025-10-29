"use client";

import type * as React from "react";
import { isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DateRange, DayPicker } from "react-day-picker";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type CalendarProps = Omit<React.ComponentProps<typeof DayPicker>, "mode" | "selected" | "onSelect"> & {
  showAvailableDays?: boolean;
  availableDays?: Date[];
  mode?: "single" | "range";
  selected?: Date | DateRange | undefined;
  onSelect?: (date: Date | DateRange | undefined) => void;
};

function CalendarBig({
  className,
  classNames,
  showOutsideDays = true,
  showAvailableDays,
  availableDays,
  onMonthChange,
  disabled,
  mode = "single",
  selected,
  onSelect,
  ...props
}: CalendarProps & { onMonthChange?: (date: Date) => void }) {
  const isDayAvailable = (date: Date) => {
    const isAvailable = showAvailableDays
      ? (availableDays || []).some((availableDate) => isSameDay(availableDate, date))
      : true;

    // Check if the parent disabled function makes this day disabled
    if (typeof disabled === "function") {
      return isAvailable && !disabled(date);
    } else if (disabled === true) {
      return false;
    }

    return isAvailable;
  };

  return (
    <DayPicker
      {...(mode === "range"
        ? {
            mode: "range" as const,
            selected: selected as DateRange | undefined,
            onSelect: onSelect as ((range: DateRange | undefined) => void) | undefined,
          }
        : {
            mode: "single" as const,
            selected: selected as Date | undefined,
            onSelect: onSelect as ((date: Date | undefined) => void) | undefined,
          })}
      showOutsideDays={showOutsideDays}
      className={cn("sm:p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-9 sm:w-14 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(buttonVariants({ variant: "ghost" }), "sm:size-14 size-9 p-0 font-normal aria-selected:opacity-100"),
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
      disabled={(date) => !isDayAvailable(date)}
      onMonthChange={(date) => {
        if (onMonthChange) {
          onMonthChange(date); // Llama a la función con la fecha original
        }
      }}
    />
  );
}
CalendarBig.displayName = "CalendarBig";

export { CalendarBig };
