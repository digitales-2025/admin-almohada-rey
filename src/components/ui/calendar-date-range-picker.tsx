"use client";

import * as React from "react";
import { cva, VariantProps } from "class-variance-authority";
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
} from "date-fns";
import { formatInTimeZone, toDate } from "date-fns-tz";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const months = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

// Función para verificar si una fecha coincide con algún rango predefinido
const getMatchingRange = (from: Date, to: Date): string | null => {
  const today = new Date();
  const ranges = [
    { label: "Hoy", start: today, end: today },
    {
      label: "Ayer",
      start: subDays(today, 1),
      end: subDays(today, 1),
    },
    {
      label: "Esta Semana",
      start: startOfWeek(today, { weekStartsOn: 1 }),
      end: endOfWeek(today, { weekStartsOn: 1 }),
    },
    {
      label: "Semana Pasada",
      start: subDays(startOfWeek(today, { weekStartsOn: 1 }), 7),
      end: subDays(endOfWeek(today, { weekStartsOn: 1 }), 7),
    },
    { label: "Últimos 7 Días", start: subDays(today, 6), end: today },
    {
      label: "Este Mes",
      start: startOfMonth(today),
      end: endOfMonth(today),
    },
    {
      label: "Mes Pasado",
      start: startOfMonth(subDays(today, today.getDate())),
      end: endOfMonth(subDays(today, today.getDate())),
    },
    {
      label: "Este Año",
      start: startOfYear(today),
      end: endOfYear(today),
    },
    {
      label: "Año Pasado",
      start: startOfYear(subDays(today, 365)),
      end: endOfYear(subDays(today, 365)),
    },
  ];

  for (const range of ranges) {
    if (from.getTime() === range.start.getTime() && to.getTime() === range.end.getTime()) {
      return range.label;
    }
  }
  return null;
};

const multiSelectVariants = cva(
  "flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium text-foreground ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-secondary",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground text-background",
        link: "text-primary underline-offset-4 hover:underline text-background",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface CalendarDatePickerProps
  extends React.HTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof multiSelectVariants> {
  id?: string;
  className?: string;
  date: DateRange;
  closeOnSelect?: boolean;
  numberOfMonths?: 1 | 2;
  yearsRange?: number;
  onDateSelect: (range: { from: Date; to: Date }) => void;
}

export const CalendarDatePicker = React.forwardRef<HTMLButtonElement, CalendarDatePickerProps>(
  (
    {
      id: _id = "calendar-date-picker",
      className,
      date,
      closeOnSelect = false,
      numberOfMonths = 2,
      yearsRange = 10,
      onDateSelect,
      variant,
      ...props
    },
    ref
  ) => {
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
    const [selectedRange, setSelectedRange] = React.useState<string | null>(null);
    const [monthFrom, setMonthFrom] = React.useState<Date | undefined>(date?.from);
    const [yearFrom, setYearFrom] = React.useState<number | undefined>(date?.from?.getFullYear());
    const [monthTo, setMonthTo] = React.useState<Date | undefined>(numberOfMonths === 2 ? date?.to : date?.from);
    const [yearTo, setYearTo] = React.useState<number | undefined>(
      numberOfMonths === 2 ? date?.to?.getFullYear() : date?.from?.getFullYear()
    );
    const [highlightedPart, setHighlightedPart] = React.useState<string | null>(null);
    const [tempDateRange, setTempDateRange] = React.useState<DateRange | undefined>(date);

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const handleClose = () => {
      setTempDateRange(date); // Reset to original date when closing
      setIsPopoverOpen(false);
    };

    const handleTogglePopover = () => setIsPopoverOpen((prev) => !prev);

    const handleConfirm = () => {
      if (tempDateRange?.from) {
        const from = startOfDay(toDate(tempDateRange.from as Date, { timeZone }));
        let to = tempDateRange.to ? endOfDay(toDate(tempDateRange.to, { timeZone })) : from;

        // Si solo se selecciona un día (sin rango), tanto from como to deben ser el mismo día
        if (!tempDateRange.to) {
          to = from;
        }

        if (numberOfMonths === 1) {
          to = from;
        }

        onDateSelect({ from, to });
        setMonthFrom(from);
        setYearFrom(from.getFullYear());
        setMonthTo(to);
        setYearTo(to.getFullYear());
      }
      setIsPopoverOpen(false);
    };

    const selectDateRange = (from: Date, to: Date, range: string) => {
      const startDate = startOfDay(toDate(from, { timeZone }));
      const endDate = numberOfMonths === 2 ? endOfDay(toDate(to, { timeZone })) : startDate;
      setTempDateRange({ from: startDate, to: endDate });
      setSelectedRange(range);
      setMonthFrom(from);
      setYearFrom(from.getFullYear());
      setMonthTo(to);
      setYearTo(to.getFullYear());
      if (closeOnSelect) {
        onDateSelect({ from: startDate, to: endDate });
        setIsPopoverOpen(false);
      }
    };

    const handleDateSelect = (range: DateRange | undefined) => {
      if (range) {
        let from = startOfDay(toDate(range.from as Date, { timeZone }));
        let to = range.to ? endOfDay(toDate(range.to, { timeZone })) : from;

        // Si solo se selecciona un día (sin rango), tanto from como to deben ser el mismo día
        if (!range.to) {
          to = from;
        }

        if (numberOfMonths === 1) {
          if (range.from !== tempDateRange?.from) {
            to = from;
          } else {
            from = startOfDay(toDate(range.to as Date, { timeZone }));
          }
        }
        setTempDateRange({ from, to });

        // Solo actualizar los meses si es necesario para mantener la vista actual
        if (numberOfMonths === 2) {
          // Para calendarios de 2 meses, mantener la vista actual
          // Solo actualizar si la fecha seleccionada está fuera del rango visible
          const currentMonthStart = monthFrom ? new Date(monthFrom.getFullYear(), monthFrom.getMonth(), 1) : null;
          const currentMonthEnd = monthTo ? new Date(monthTo.getFullYear(), monthTo.getMonth() + 1, 0) : null;

          if (currentMonthStart && currentMonthEnd) {
            // Si la fecha de fin está fuera del rango visible, ajustar la vista
            if (to && (to < currentMonthStart || to > currentMonthEnd)) {
              setMonthFrom(new Date(to.getFullYear(), to.getMonth(), 1));
              setMonthTo(new Date(to.getFullYear(), to.getMonth() + 1, 1));
            }
          }
        } else {
          // Para calendarios de 1 mes, centrar en la fecha seleccionada
          setMonthFrom(new Date(from.getFullYear(), from.getMonth(), 1));
        }

        setYearFrom(from.getFullYear());
        setYearTo(to.getFullYear());
        setMonthFrom(new Date(from.getFullYear(), from.getMonth(), 1));
        setMonthTo(new Date(to.getFullYear(), to.getMonth(), 1));
      }
      setSelectedRange(null);
    };

    const handleMonthChange = React.useCallback(
      (newMonthIndex: number, part: string) => {
        setSelectedRange(null);
        if (part === "from") {
          if (yearFrom !== undefined) {
            if (newMonthIndex < 0 || newMonthIndex > yearsRange + 1) return;
            const newMonth = new Date(yearFrom, newMonthIndex, 1);
            const from =
              numberOfMonths === 2
                ? startOfMonth(toDate(newMonth, { timeZone }))
                : tempDateRange?.from
                  ? new Date(tempDateRange.from.getFullYear(), newMonth.getMonth(), tempDateRange.from.getDate())
                  : newMonth;
            const to =
              numberOfMonths === 2
                ? tempDateRange?.to
                  ? endOfDay(toDate(tempDateRange.to, { timeZone }))
                  : endOfMonth(toDate(newMonth, { timeZone }))
                : from;
            if (from <= to) {
              setTempDateRange({ from, to });
              setMonthFrom(newMonth);
              setMonthTo(tempDateRange?.to);
            }
          }
        } else {
          if (yearTo !== undefined) {
            if (newMonthIndex < 0 || newMonthIndex > yearsRange + 1) return;
            const newMonth = new Date(yearTo, newMonthIndex, 1);
            const from = tempDateRange?.from
              ? startOfDay(toDate(tempDateRange.from, { timeZone }))
              : startOfMonth(toDate(newMonth, { timeZone }));
            const to = numberOfMonths === 2 ? endOfMonth(toDate(newMonth, { timeZone })) : from;
            if (from <= to) {
              setTempDateRange({ from, to });
              setMonthTo(newMonth);
              setMonthFrom(tempDateRange?.from);
            }
          }
        }
      },
      [yearFrom, yearTo, numberOfMonths, tempDateRange, yearsRange, timeZone]
    );

    const handleYearChange = React.useCallback(
      (newYear: number, part: string) => {
        setSelectedRange(null);
        const today = new Date();
        const years = Array.from({ length: yearsRange + 1 }, (_, i) => today.getFullYear() - yearsRange / 2 + i);
        if (part === "from") {
          if (years.includes(newYear)) {
            const newMonth = monthFrom
              ? new Date(newYear, monthFrom ? monthFrom.getMonth() : 0, 1)
              : new Date(newYear, 0, 1);
            const from =
              numberOfMonths === 2
                ? startOfMonth(toDate(newMonth, { timeZone }))
                : tempDateRange?.from
                  ? new Date(newYear, newMonth.getMonth(), tempDateRange.from.getDate())
                  : newMonth;
            const to =
              numberOfMonths === 2
                ? tempDateRange?.to
                  ? endOfDay(toDate(tempDateRange.to, { timeZone }))
                  : endOfMonth(toDate(newMonth, { timeZone }))
                : from;
            if (from <= to) {
              setTempDateRange({ from, to });
              setYearFrom(newYear);
              setMonthFrom(newMonth);
              setYearTo(tempDateRange?.to?.getFullYear());
              setMonthTo(tempDateRange?.to);
            }
          }
        } else {
          if (years.includes(newYear)) {
            const newMonth = monthTo ? new Date(newYear, monthTo.getMonth(), 1) : new Date(newYear, 0, 1);
            const from = tempDateRange?.from
              ? startOfDay(toDate(tempDateRange.from, { timeZone }))
              : startOfMonth(toDate(newMonth, { timeZone }));
            const to = numberOfMonths === 2 ? endOfMonth(toDate(newMonth, { timeZone })) : from;
            if (from <= to) {
              setTempDateRange({ from, to });
              setYearTo(newYear);
              setMonthTo(newMonth);
              setYearFrom(tempDateRange?.from?.getFullYear());
              setMonthFrom(tempDateRange?.from);
            }
          }
        }
      },
      [yearsRange, numberOfMonths, tempDateRange, timeZone, monthFrom, monthTo]
    );

    const today = new Date();

    const years = Array.from({ length: yearsRange + 1 }, (_, i) => today.getFullYear() - yearsRange / 2 + i);

    const dateRanges = [
      { label: "Hoy", start: today, end: today },
      {
        label: "Ayer",
        start: subDays(today, 1),
        end: subDays(today, 1),
      },
      {
        label: "Esta Semana",
        start: startOfWeek(today, { weekStartsOn: 1 }),
        end: endOfWeek(today, { weekStartsOn: 1 }),
      },
      {
        label: "Semana Pasada",
        start: subDays(startOfWeek(today, { weekStartsOn: 1 }), 7),
        end: subDays(endOfWeek(today, { weekStartsOn: 1 }), 7),
      },
      { label: "Últimos 7 Días", start: subDays(today, 6), end: today },
      {
        label: "Este Mes",
        start: startOfMonth(today),
        end: endOfMonth(today),
      },
      {
        label: "Mes Pasado",
        start: startOfMonth(subDays(today, today.getDate())),
        end: endOfMonth(subDays(today, today.getDate())),
      },
      {
        label: "Este Año",
        start: startOfYear(today),
        end: endOfYear(today),
      },
      {
        label: "Año Pasado",
        start: startOfYear(subDays(today, 365)),
        end: endOfYear(subDays(today, 365)),
      },
    ];

    const handleMouseOver = (part: string) => {
      setHighlightedPart(part);
    };

    const handleMouseLeave = () => {
      setHighlightedPart(null);
    };

    const handleWheel = React.useCallback(
      (event: React.WheelEvent) => {
        event.preventDefault();
        setSelectedRange(null);
        if (highlightedPart === "firstDay") {
          const newDate = new Date(tempDateRange?.from as Date);
          const increment = event.deltaY > 0 ? -1 : 1;
          newDate.setDate(newDate.getDate() + increment);
          if (newDate <= (tempDateRange?.to as Date)) {
            if (numberOfMonths === 2) {
              setTempDateRange({
                from: newDate,
                to: new Date(tempDateRange?.to as Date),
              });
            } else {
              setTempDateRange({ from: newDate, to: newDate });
            }
            setMonthFrom(newDate);
          } else if (newDate > (tempDateRange?.to as Date) && numberOfMonths === 1) {
            setTempDateRange({ from: newDate, to: newDate });
            setMonthFrom(newDate);
          }
        } else if (highlightedPart === "firstMonth") {
          const currentMonth = monthFrom ? monthFrom.getMonth() : 0;
          const newMonthIndex = currentMonth + (event.deltaY > 0 ? -1 : 1);
          handleMonthChange(newMonthIndex, "from");
        } else if (highlightedPart === "firstYear" && yearFrom !== undefined) {
          const newYear = yearFrom + (event.deltaY > 0 ? -1 : 1);
          handleYearChange(newYear, "from");
        } else if (highlightedPart === "secondDay") {
          const newDate = new Date(tempDateRange?.to as Date);
          const increment = event.deltaY > 0 ? -1 : 1;
          newDate.setDate(newDate.getDate() + increment);
          if (newDate >= (tempDateRange?.from as Date)) {
            setTempDateRange({
              from: new Date(tempDateRange?.from as Date),
              to: newDate,
            });
            setMonthTo(newDate);
          }
        } else if (highlightedPart === "secondMonth") {
          const currentMonth = monthTo ? monthTo.getMonth() : 0;
          const newMonthIndex = currentMonth + (event.deltaY > 0 ? -1 : 1);
          handleMonthChange(newMonthIndex, "to");
        } else if (highlightedPart === "secondYear" && yearTo !== undefined) {
          const newYear = yearTo + (event.deltaY > 0 ? -1 : 1);
          handleYearChange(newYear, "to");
        }
      },
      [
        highlightedPart,
        tempDateRange,
        numberOfMonths,
        monthFrom,
        yearFrom,
        monthTo,
        yearTo,
        handleMonthChange,
        handleYearChange,
      ]
    );

    // Sync tempDateRange with date when popover opens
    React.useEffect(() => {
      if (isPopoverOpen) {
        setTempDateRange(date);
        // También sincronizar los meses y años para los selects
        if (date?.from) {
          setMonthFrom(new Date(date.from.getFullYear(), date.from.getMonth(), 1));
          setYearFrom(date.from.getFullYear());
        }
        if (date?.to) {
          setMonthTo(new Date(date.to.getFullYear(), date.to.getMonth(), 1));
          setYearTo(date.to.getFullYear());
        }
        // Determinar si la fecha actual coincide con algún rango predefinido
        if (date?.from && date?.to) {
          const matchingRange = getMatchingRange(date.from, date.to);
          setSelectedRange(matchingRange);
        } else {
          setSelectedRange(null);
        }
      }
    }, [isPopoverOpen, date]);

    React.useEffect(() => {
      const firstDayElement = document.getElementById(`firstDay-${_id}`);
      const firstMonthElement = document.getElementById(`firstMonth-${_id}`);
      const firstYearElement = document.getElementById(`firstYear-${_id}`);
      const secondDayElement = document.getElementById(`secondDay-${_id}`);
      const secondMonthElement = document.getElementById(`secondMonth-${_id}`);
      const secondYearElement = document.getElementById(`secondYear-${_id}`);

      const elements = [
        firstDayElement,
        firstMonthElement,
        firstYearElement,
        secondDayElement,
        secondMonthElement,
        secondYearElement,
      ];

      const addPassiveEventListener = (element: HTMLElement | null) => {
        if (element) {
          element.addEventListener("wheel", handleWheel as unknown as EventListener, {
            passive: false,
          });
        }
      };

      elements.forEach(addPassiveEventListener);

      return () => {
        elements.forEach((element) => {
          if (element) {
            element.removeEventListener("wheel", handleWheel as unknown as EventListener);
          }
        });
      };
    }, [highlightedPart, tempDateRange, handleWheel, _id]);

    const formatWithTz = (date: Date, fmt: string) => formatInTimeZone(date, timeZone, fmt, { locale: es });

    return (
      <>
        <style>
          {`
            .date-part {
              touch-action: none;
            }
          `}
        </style>
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant="outline"
              ref={ref}
              {...props}
              className={cn("w-auto", multiSelectVariants({ variant, className }))}
              onClick={handleTogglePopover}
              suppressHydrationWarning
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span>
                {date?.from ? (
                  date.to ? (
                    <>
                      <span
                        id={`firstDay-${_id}`}
                        className={cn("date-part", highlightedPart === "firstDay" && "underline font-bold")}
                        onMouseOver={() => handleMouseOver("firstDay")}
                        onMouseLeave={handleMouseLeave}
                      >
                        {formatWithTz(date.from, "d")}
                      </span>{" "}
                      de{" "}
                      <span
                        id={`firstMonth-${_id}`}
                        className={cn("date-part", highlightedPart === "firstMonth" && "underline font-bold")}
                        onMouseOver={() => handleMouseOver("firstMonth")}
                        onMouseLeave={handleMouseLeave}
                      >
                        {formatWithTz(date.from, "LLLL")}
                      </span>{" "}
                      <span
                        id={`firstYear-${_id}`}
                        className={cn("date-part", highlightedPart === "firstYear" && "underline font-bold")}
                        onMouseOver={() => handleMouseOver("firstYear")}
                        onMouseLeave={handleMouseLeave}
                      >
                        {formatWithTz(date.from, "y")}
                      </span>
                      {numberOfMonths === 2 && (
                        <>
                          {" - "}
                          <span
                            id={`secondDay-${_id}`}
                            className={cn("date-part", highlightedPart === "secondDay" && "underline font-bold")}
                            onMouseOver={() => handleMouseOver("secondDay")}
                            onMouseLeave={handleMouseLeave}
                          >
                            {formatWithTz(date.to, "d")}
                          </span>{" "}
                          de{" "}
                          <span
                            id={`secondMonth-${_id}`}
                            className={cn("date-part", highlightedPart === "secondMonth" && "underline font-bold")}
                            onMouseOver={() => handleMouseOver("secondMonth")}
                            onMouseLeave={handleMouseLeave}
                          >
                            {formatWithTz(date.to, "LLLL")}
                          </span>{" "}
                          <span
                            id={`secondYear-${_id}`}
                            className={cn("date-part", highlightedPart === "secondYear" && "underline font-bold")}
                            onMouseOver={() => handleMouseOver("secondYear")}
                            onMouseLeave={handleMouseLeave}
                          >
                            {formatWithTz(date.to, "y")}
                          </span>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <span
                        id={`day-${_id}`}
                        className={cn("date-part", highlightedPart === "day" && "underline font-bold")}
                        onMouseOver={() => handleMouseOver("day")}
                        onMouseLeave={handleMouseLeave}
                      >
                        {formatWithTz(date.from, "d")}
                      </span>{" "}
                      de{" "}
                      <span
                        id={`month-${_id}`}
                        className={cn("date-part", highlightedPart === "month" && "underline font-bold")}
                        onMouseOver={() => handleMouseOver("month")}
                        onMouseLeave={handleMouseLeave}
                      >
                        {formatWithTz(date.from, "LLLL")}
                      </span>{" "}
                      <span
                        id={`year-${_id}`}
                        className={cn("date-part", highlightedPart === "year" && "underline font-bold")}
                        onMouseOver={() => handleMouseOver("year")}
                        onMouseLeave={handleMouseLeave}
                      >
                        {formatWithTz(date.from, "y")}
                      </span>
                    </>
                  )
                ) : (
                  <span>Seleccionar fecha</span>
                )}
              </span>
            </Button>
          </PopoverTrigger>
          {isPopoverOpen && (
            <PopoverContent
              className="w-auto pb-0"
              align="center"
              avoidCollisions={false}
              onInteractOutside={handleClose}
              onEscapeKeyDown={handleClose}
              style={{
                maxHeight: "var(--radix-popover-content-available-height)",
                overflowY: "auto",
              }}
            >
              <div className="flex">
                {numberOfMonths === 2 && (
                  <div className="hidden md:flex flex-col gap-1 pr-4 text-left border-r border-foreground/10">
                    {dateRanges.map(({ label, start, end }) => (
                      <Button
                        key={label}
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "justify-start hover:bg-secondary/90 hover:text-secondary-foreground",
                          selectedRange === label &&
                            "bg-secondary text-secondary-foreground hover:bg-secondary/90 hover:text-secondary-foreground"
                        )}
                        onClick={() => {
                          selectDateRange(start, end, label);
                          setMonthFrom(start);
                          setYearFrom(start.getFullYear());
                          setMonthTo(end);
                          setYearTo(end.getFullYear());
                        }}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                )}
                <div className="flex flex-col">
                  <div className="flex items-center gap-4">
                    <div className="flex gap-2 ml-3">
                      <Select
                        onValueChange={(value) => {
                          handleMonthChange(months.indexOf(value), "from");
                          setSelectedRange(null);
                        }}
                        value={monthFrom ? months[monthFrom.getMonth()] : undefined}
                      >
                        <SelectTrigger className="hidden sm:flex w-[122px] focus:ring-0 focus:ring-offset-0 font-medium hover:bg-accent">
                          <SelectValue placeholder="Mes" />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map((month, idx) => (
                            <SelectItem key={idx} value={month}>
                              {month}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        onValueChange={(value) => {
                          handleYearChange(Number(value), "from");
                          setSelectedRange(null);
                        }}
                        value={yearFrom ? yearFrom.toString() : undefined}
                      >
                        <SelectTrigger className="hidden sm:flex w-[122px] focus:ring-0 focus:ring-offset-0 font-medium hover:bg-accent">
                          <SelectValue placeholder="Año" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map((year, idx) => (
                            <SelectItem key={idx} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {numberOfMonths === 2 && (
                      <div className="flex gap-2">
                        <Select
                          onValueChange={(value) => {
                            handleMonthChange(months.indexOf(value), "to");
                            setSelectedRange(null);
                          }}
                          value={monthTo ? months[monthTo.getMonth()] : undefined}
                        >
                          <SelectTrigger className="hidden sm:flex w-[122px] focus:ring-0 focus:ring-offset-0 font-medium hover:bg-accent">
                            <SelectValue placeholder="Mes" />
                          </SelectTrigger>
                          <SelectContent>
                            {months.map((month, idx) => (
                              <SelectItem key={idx} value={month}>
                                {month}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select
                          onValueChange={(value) => {
                            handleYearChange(Number(value), "to");
                            setSelectedRange(null);
                          }}
                          value={yearTo ? yearTo.toString() : undefined}
                        >
                          <SelectTrigger className="hidden sm:flex w-[122px] focus:ring-0 focus:ring-offset-0 font-medium hover:bg-accent">
                            <SelectValue placeholder="Año" />
                          </SelectTrigger>
                          <SelectContent>
                            {years.map((year, idx) => (
                              <SelectItem key={idx} value={year.toString()}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                  <div className="flex">
                    <Calendar
                      mode="range"
                      defaultMonth={monthFrom}
                      month={monthFrom}
                      onMonthChange={(newMonth) => {
                        setMonthFrom(newMonth);
                        if (numberOfMonths === 2) {
                          // Para calendarios de 2 meses, mantener el segundo mes relativo al primero
                          const nextMonth = new Date(newMonth);
                          nextMonth.setMonth(nextMonth.getMonth() + 1);
                          setMonthTo(nextMonth);
                        }
                      }}
                      selected={tempDateRange}
                      onSelect={handleDateSelect}
                      numberOfMonths={numberOfMonths}
                      showOutsideDays={false}
                      className={className}
                    />
                  </div>
                  <div className="flex justify-end gap-2 p-3 border-t border-foreground/10">
                    <Button variant="outline" size="sm" onClick={handleClose}>
                      Cerrar
                    </Button>
                    <Button variant="default" size="sm" onClick={handleConfirm} disabled={!tempDateRange?.from}>
                      Confirmar
                    </Button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          )}
        </Popover>
      </>
    );
  }
);

CalendarDatePicker.displayName = "CalendarDatePicker";
