"use client";

import { Calendar as CalendarIcon, Check, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DateFilterRoomCleaningProps {
  selectedMonth: string | undefined;
  selectedYear: string | undefined;
  onSelectMonth: (month: string | undefined) => void;
  onSelectYear: (year: string | undefined) => void;
}

export function DateFilterRoomCleaning({
  selectedMonth,
  selectedYear,
  onSelectMonth,
  onSelectYear,
}: DateFilterRoomCleaningProps) {
  const months = [
    { value: "01", label: "Enero" },
    { value: "02", label: "Febrero" },
    { value: "03", label: "Marzo" },
    { value: "04", label: "Abril" },
    { value: "05", label: "Mayo" },
    { value: "06", label: "Junio" },
    { value: "07", label: "Julio" },
    { value: "08", label: "Agosto" },
    { value: "09", label: "Septiembre" },
    { value: "10", label: "Octubre" },
    { value: "11", label: "Noviembre" },
    { value: "12", label: "Diciembre" },
  ];

  // Generate years (current year and 5 years back)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => {
    const year = currentYear - i;
    return { value: year.toString(), label: year.toString() };
  });

  const selectedMonthLabel = selectedMonth ? months.find((m) => m.value === selectedMonth)?.label : "Todos";
  const selectedYearLabel = selectedYear ? selectedYear : "Todos";

  return (
    <div className="flex items-center gap-2">
      {/* Filtro de Mes */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            <span className="font-medium text-sm">Mes: </span>
            <span className="font-medium text-sm">{selectedMonthLabel}</span>
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Filtrar por mes</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem className="flex items-center justify-between" onClick={() => onSelectMonth(undefined)}>
            <span>Todos los meses</span>
            {!selectedMonth && <Check className="h-4 w-4" />}
          </DropdownMenuItem>

          {months.map((month) => (
            <DropdownMenuItem
              key={month.value}
              className="flex items-center justify-between"
              onClick={() => onSelectMonth(month.value)}
            >
              <span>{month.label}</span>
              {selectedMonth === month.value && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Filtro de Año */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2 ">
            <CalendarIcon className="h-4 w-4" />
            <span className="font-medium text-sm">Año: </span>
            <span className="font-medium text-sm">{selectedYearLabel}</span>
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Filtrar por año</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem className="flex items-center justify-between" onClick={() => onSelectYear(undefined)}>
            <span>Todos los años</span>
            {!selectedYear && <Check className="h-4 w-4" />}
          </DropdownMenuItem>

          {years.map((year) => (
            <DropdownMenuItem
              key={year.value}
              className="flex items-center justify-between"
              onClick={() => onSelectYear(year.value)}
            >
              <span>{year.label}</span>
              {selectedYear === year.value && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
