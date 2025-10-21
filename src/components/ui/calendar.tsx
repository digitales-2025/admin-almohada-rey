"use client";

import * as React from "react";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function Calendar({ className, classNames, showOutsideDays = true, ...props }: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      locale={es}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2 items-center justify-center",
        month: "flex flex-col gap-4",
        caption: "flex justify-center pt-1 relative items-center w-full",
        caption_label: "text-sm font-medium",
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem] flex items-center justify-center",
        row: "flex w-full mt-1",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 w-8 h-8 flex items-center justify-center",
          props.mode === "range"
            ? "[&:has(>.day-range-start)]:rounded-l-md [&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-middle)]:rounded-none"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "size-8 p-0 font-normal aria-selected:opacity-100 transition-colors duration-200 hover:bg-accent/50"
        ),
        day_range_start:
          "day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground aria-selected:rounded-l-md hover:bg-primary/80 transition-colors duration-200",
        day_range_end:
          "day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground aria-selected:rounded-r-md hover:bg-primary/80 transition-colors duration-200",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "day-outside text-muted-foreground aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-primary/20 aria-selected:text-primary aria-selected:font-medium hover:bg-primary/30 transition-colors duration-200",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => <ChevronLeft className={cn("size-4", className)} {...props} />,
        IconRight: ({ className, ...props }) => <ChevronRight className={cn("size-4", className)} {...props} />,
      }}
      {...props}
    />
  );
}

export { Calendar };
