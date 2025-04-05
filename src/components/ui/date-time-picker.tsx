"use client";

import * as React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  iconColor?: string;
  isBirthday?: boolean; // Nuevo prop para indicar si es fecha de nacimiento
}

export default function DatePicker({ value, onChange, iconColor, isBirthday = false }: DatePickerProps) {
  const [month, setMonth] = React.useState<number>(value ? value.getMonth() : new Date().getMonth());
  const [year, setYear] = React.useState<number>(value ? value.getFullYear() : new Date().getFullYear());

  // Creamos el array de años basado en si es fecha de nacimiento o no
  const years = React.useMemo(() => {
    const currentYear = new Date().getFullYear();

    if (isBirthday) {
      // Para cumpleaños: desde 100 años atrás hasta el año actual
      return Array.from({ length: 101 }, (_, i) => currentYear - 100 + i);
    } else {
      // Comportamiento normal: 10 años antes y 10 años después del año seleccionado
      return Array.from({ length: 21 }, (_, i) => year - 10 + i);
    }
  }, [year, isBirthday]);

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

  const handleMonthChange = (value: string) => {
    setMonth(parseInt(value));
  };

  const handleYearChange = (value: string) => {
    setYear(parseInt(value));
  };

  return (
    <Popover modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn("w-full justify-start text-left font-normal", !value && "text-muted-foreground")}
          tabIndex={0}
        >
          <CalendarIcon className={`mr-2 h-4 w-4 ${iconColor ? `${iconColor}` : ""}`} />
          {value ? (
            <span className="truncate text-ellipsis">{format(value, "PPP", { locale: es })}</span>
          ) : (
            <span className="truncate">Selecciona una fecha</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="center" side="bottom" onOpenAutoFocus={(e) => e.preventDefault()}>
        <div className="flex items-center justify-between p-3 gap-3">
          <Select value={month.toString()} onValueChange={handleMonthChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Mes" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month, index) => (
                <SelectItem key={month} value={index.toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={year.toString()} onValueChange={handleYearChange}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Año" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="p-2">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            month={new Date(year, month)}
            onMonthChange={(newMonth) => {
              setMonth(newMonth.getMonth());
              setYear(newMonth.getFullYear());
            }}
            initialFocus
            locale={es}
            className="capitalize"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
