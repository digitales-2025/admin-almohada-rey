"use client";

import { useEffect, useState } from "react";
import { Calendar, ChevronDown, ChevronUp, GitCompare } from "lucide-react";
import { DateRange } from "react-day-picker";

import { AutoComplete, Option } from "@/components/ui/autocomplete";
import { Button } from "@/components/ui/button";
import { CalendarDatePicker } from "@/components/ui/calendar-date-range-picker";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoomTypeOption } from "../../rooms/list/_utils/rooms.filter.utils";

// Tipos para los diferentes modos de selección
export type SelectionMode = "dateRange" | "yearCompare";

// Props que recibe el componente para controlar la selección
interface SelectorFechasProps {
  // Modo de selección
  mode: SelectionMode;
  onModeChange: (mode: SelectionMode) => void;

  // Para modo de rango de fechas
  dateRange?: DateRange;
  onDateRangeChange?: (range: DateRange) => void;

  // Para modo de comparación de años
  year1?: number | null;
  year2?: number | null;
  onYear1Change?: (year: number) => void;
  onYear2Change?: (year: number) => void;

  // Para tipo de habitación (opcional)
  showRoomType?: boolean;
  roomTypeOptions?: Option[];
  roomTypeId?: string | null;
  onRoomTypeChange?: (roomTypeId: string | null) => void;
}

// Componente selector de fechas con dos modos: rango de fechas y comparación de años
export default function SelectorFechas({
  mode,
  onModeChange,
  dateRange,
  onDateRangeChange,
  year1,
  year2,
  onYear1Change,
  onYear2Change,
  showRoomType = false,
  roomTypeOptions = [],
  roomTypeId,
  onRoomTypeChange,
}: SelectorFechasProps) {
  const añoActual = new Date().getFullYear();
  const [year1Display, setYear1Display] = useState(year1 || añoActual - 1);
  const [year2Display, setYear2Display] = useState(year2 || añoActual);

  // Notificar al componente padre de los valores iniciales
  useEffect(() => {
    if (!year1 && onYear1Change) {
      onYear1Change(year1Display);
    }
    if (!year2 && onYear2Change) {
      onYear2Change(year2Display);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo se ejecuta una vez al montar el componente

  // Sincronizar con los props del componente padre
  useEffect(() => {
    if (year1 !== null && year1 !== undefined) {
      setYear1Display(year1);
    }
  }, [year1]);

  useEffect(() => {
    if (year2 !== null && year2 !== undefined) {
      setYear2Display(year2);
    }
  }, [year2]);

  // Incrementa el año mostrado
  const incrementarAño = (type: "year1" | "year2") => {
    if (type === "year1") {
      let nuevoAño = year1Display + 1;
      // Si el nuevo año es igual al año2, saltar al siguiente
      if (nuevoAño === year2Display) {
        nuevoAño = year2Display + 1;
      }
      setYear1Display(nuevoAño);
      onYear1Change?.(nuevoAño);
    } else {
      let nuevoAño = year2Display + 1;
      // Si el nuevo año es igual al año1, saltar al siguiente
      if (nuevoAño === year1Display) {
        nuevoAño = year1Display + 1;
      }
      setYear2Display(nuevoAño);
      onYear2Change?.(nuevoAño);
    }
  };

  // Decrementa el año mostrado
  const decrementarAño = (type: "year1" | "year2") => {
    if (type === "year1") {
      let nuevoAño = year1Display - 1;
      // Si el nuevo año es igual al año2, saltar al anterior
      if (nuevoAño === year2Display) {
        nuevoAño = year2Display - 1;
      }
      setYear1Display(nuevoAño);
      onYear1Change?.(nuevoAño);
    } else {
      let nuevoAño = year2Display - 1;
      // Si el nuevo año es igual al año1, saltar al anterior
      if (nuevoAño === year1Display) {
        nuevoAño = year1Display - 1;
      }
      setYear2Display(nuevoAño);
      onYear2Change?.(nuevoAño);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Selector de tipo de habitación (si es necesario) */}
      {showRoomType && (
        <Card>
          <CardContent>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Tipo de Habitación</h4>
              <p className="text-xs text-muted-foreground">Selecciona el tipo de habitación para el reporte</p>
              <AutoComplete
                options={roomTypeOptions}
                emptyMessage="No se encontró el tipo de habitación."
                placeholder="Seleccione un tipo de habitación"
                onValueChange={(selectedOption) => onRoomTypeChange?.(selectedOption?.value || null)}
                value={roomTypeOptions.find((option) => option.value === roomTypeId) || undefined}
                renderOption={(option) => <RoomTypeOption label={option.label} />}
                renderSelectedValue={(option) => <RoomTypeOption label={option.label} />}
              />
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={mode} onValueChange={(value) => onModeChange(value as SelectionMode)} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dateRange" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Rango de Fechas
          </TabsTrigger>
          <TabsTrigger value="yearCompare" className="flex items-center gap-2">
            <GitCompare className="h-4 w-4" />
            Comparar Años
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dateRange" className="mt-4">
          <Card>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Selecciona el rango de fechas</h4>
                  <p className="text-xs text-muted-foreground">Elige el período específico para generar tu reporte</p>
                </div>

                <CalendarDatePicker
                  date={dateRange || { from: undefined, to: undefined }}
                  onDateSelect={(range) => onDateRangeChange?.(range)}
                  numberOfMonths={2}
                  variant="outline"
                  closeOnSelect={false}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="yearCompare" className="mt-4">
          <Card>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Selecciona los años a comparar</h4>
                  <p className="text-xs text-muted-foreground">
                    Elige dos años diferentes para generar un reporte comparativo
                  </p>
                </div>

                {/* Comparación visual de años */}
                <div className="flex items-center justify-center space-x-4 pt-2">
                  {/* Año 1 */}
                  <div className="flex flex-col items-center space-y-2">
                    <div className="text-xs font-medium text-muted-foreground">Año Base</div>
                    <div className="w-24 border rounded-lg overflow-hidden">
                      <div className="flex flex-col items-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full rounded-none hover:bg-muted"
                          onClick={() => incrementarAño("year1")}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <div className="py-2 text-center font-bold text-lg w-full bg-primary/10">{year1Display}</div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full rounded-none hover:bg-muted"
                          onClick={() => decrementarAño("year1")}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Separador visual */}
                  <div className="flex flex-col items-center space-y-1">
                    <div className="text-xs text-muted-foreground">VS</div>
                  </div>

                  {/* Año 2 */}
                  <div className="flex flex-col items-center space-y-2">
                    <div className="text-xs font-medium text-muted-foreground">Año Comparación</div>
                    <div className="w-24 border rounded-lg overflow-hidden">
                      <div className="flex flex-col items-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full rounded-none hover:bg-muted"
                          onClick={() => incrementarAño("year2")}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <div className="py-2 text-center font-bold text-lg w-full bg-primary/10">{year2Display}</div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full rounded-none hover:bg-muted"
                          onClick={() => decrementarAño("year2")}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
