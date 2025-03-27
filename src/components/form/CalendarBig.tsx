"use client";

import type * as React from "react";
import { format, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  showAvailableDays?: boolean;
  availableDays?: Date[];
};

function CalendarBig({
  className,
  classNames,
  showOutsideDays = true,
  showAvailableDays,
  availableDays,
  onMonthChange,
  ...props
}: CalendarProps & { onMonthChange?: (date: Date) => void }) {
  const isDayAvailable = (date: Date) => {
    return showAvailableDays ? (availableDays || []).some((availableDate) => isSameDay(availableDate, date)) : true;
  };

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
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
        head_cell: "text-muted-foreground rounded-md w-10 sm:w-14 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(buttonVariants({ variant: "ghost" }), "sm:size-14 size-10 p-0 font-normal aria-selected:opacity-100"),
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
        // IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        // IconRight: ({ ...props }) => (
        // 	<ChevronRight className="h-4 w-4" />
        // ),
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
      disabled={(date) => !isDayAvailable(date)}
      onMonthChange={(date) => {
        console.log("Mes cambiado en CalendarBig:", date);
        const formattedDate = format(date, "yyyy-MM-dd"); // Formatear la fecha
        console.log("Fecha formateada:", formattedDate); // Log de la fecha formateada
        if (onMonthChange) {
          console.log("Llamando a onMonthChange con la fecha:", date);
          onMonthChange(date); // Llama a la función con la fecha original
        }
      }}
    />
  );
}
CalendarBig.displayName = "CalendarBig";

export { CalendarBig };
