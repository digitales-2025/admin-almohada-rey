"use client";

// Importaciones de React, iconos, componentes UI y hooks personalizados
import { useState } from "react";
import { Download, RefreshCcw } from "lucide-react";
import { DateRange } from "react-day-picker";

import SelectorFechas, { SelectionMode } from "@/app/(admin)/reports/_components/select-date";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useToast } from "@/hooks/use-toast";
import { useDownloadReport } from "../_hooks/use-report-query";
import { useRoomTypes } from "../../rooms/room-types/_hooks/use-room-types";
import {
  DownloadReportCompareParams,
  DownloadReportDateRangeParams,
  DownloadReportParams,
  DownloadReportTypeRoomCompareParams,
  DownloadReportTypeRoomDateRangeParams,
  DownloadReportTypeRoomParams,
} from "../interfaces/dowloadParams";
import { ReportType } from "../interfaces/report-type";

// Props que recibe el componente
interface ReporteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tipoReporte: ReportType;
  tituloReporte: string;
}

// Componente principal para el diálogo de generación de reportes
export default function ReporteDialog({ open, onOpenChange, tipoReporte, tituloReporte }: ReporteDialogProps) {
  // Estados locales para el modo de selección y datos
  const [selectionMode, setSelectionMode] = useState<SelectionMode>("dateRange");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [year1, setYear1] = useState<number | null>(null);
  const [year2, setYear2] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [roomTypeId, setRoomTypeId] = useState<string | null>(null);

  // Hooks para notificaciones y media query (responsive)
  const { toast } = useToast();
  const isDesktop = useMediaQuery("(min-width: 700px)");

  // Hook personalizado para descargar reportes
  const { onDownloadReport } = useDownloadReport();

  const { dataCreatableTypeRooms } = useRoomTypes();
  const typeRoomsOptions =
    dataCreatableTypeRooms?.map((typeRoom) => ({
      value: typeRoom.id,
      label: String(typeRoom.name),
    })) ?? [];

  // Maneja la generación y descarga del reporte
  const handleGenerarReporte = async () => {
    // Validaciones según el modo de selección
    if (selectionMode === "dateRange") {
      if (!dateRange?.from || !dateRange?.to) {
        toast({
          title: "Error",
          description: "Por favor selecciona un rango de fechas válido",
          variant: "destructive",
        });
        return;
      }
    } else {
      if (!year1 || !year2) {
        toast({
          title: "Error",
          description: "Por favor selecciona ambos años para la comparación",
          variant: "destructive",
        });
        return;
      }
    }

    if (tipoReporte === "typeRoom" && !roomTypeId) {
      toast({
        title: "Error",
        description: "Por favor selecciona un tipo de habitación",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Construye los parámetros según el modo y tipo de reporte
      let params: DownloadReportParams | DownloadReportTypeRoomParams;

      if (selectionMode === "dateRange") {
        const startDate = dateRange!.from!.toISOString().split("T")[0];
        const endDate = dateRange!.to!.toISOString().split("T")[0];

        if (tipoReporte === "typeRoom") {
          params = {
            startDate,
            endDate,
            typeRoomId: roomTypeId!,
          } as DownloadReportTypeRoomDateRangeParams;
        } else {
          params = {
            startDate,
            endDate,
          } as DownloadReportDateRangeParams;
        }
      } else {
        if (tipoReporte === "typeRoom") {
          params = {
            year1: year1!,
            year2: year2!,
            typeRoomId: roomTypeId!,
          } as DownloadReportTypeRoomCompareParams;
        } else {
          params = {
            year1: year1!,
            year2: year2!,
          } as DownloadReportCompareParams;
        }
      }

      await onDownloadReport(tipoReporte, params, tituloReporte);

      toast({
        title: "Éxito",
        description: `Reporte de ${tituloReporte} generado correctamente`,
      });

      onOpenChange(false);
      // Limpiar estados
      setDateRange(undefined);
      setYear1(null);
      setYear2(null);
      setRoomTypeId(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al generar el reporte",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Limpia la selección al cerrar el diálogo
  const handleClose = () => {
    setDateRange(undefined);
    setYear1(null);
    setYear2(null);
    setRoomTypeId(null);
  };

  // Contenido del formulario: selector de fechas
  const FormContent = () => (
    <div className="flex flex-col space-y-6">
      <SelectorFechas
        mode={selectionMode}
        onModeChange={setSelectionMode}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        year1={year1}
        year2={year2}
        onYear1Change={setYear1}
        onYear2Change={setYear2}
        showRoomType={tipoReporte === "typeRoom"}
        roomTypeOptions={typeRoomsOptions}
        roomTypeId={roomTypeId}
        onRoomTypeChange={setRoomTypeId}
      />
    </div>
  );

  // Renderiza el diálogo para escritorio
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Generar Reporte de {tituloReporte}</DialogTitle>
            <DialogDescription>
              Selecciona el rango de fechas o años a comparar para generar tu reporte en formato Excel.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="px-1">
              <FormContent />
            </div>
          </ScrollArea>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <DialogClose asChild>
              <Button onClick={handleClose} type="button" variant="outline" className="w-full sm:w-auto">
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="submit"
              onClick={handleGenerarReporte}
              disabled={
                isLoading ||
                (selectionMode === "dateRange" && (!dateRange?.from || !dateRange?.to)) ||
                (selectionMode === "yearCompare" && (!year1 || !year2)) ||
                (tipoReporte === "typeRoom" && !roomTypeId)
              }
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Descargar Reporte
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Renderiza el drawer para móvil/tablet
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Generar Reporte de {tituloReporte}</DrawerTitle>
          <DrawerDescription>
            Selecciona el rango de fechas o años a comparar para generar tu reporte en formato Excel.
          </DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="flex-1 px-4">
          <FormContent />
        </ScrollArea>
        <DrawerFooter className="pt-2">
          <Button
            onClick={handleGenerarReporte}
            disabled={
              isLoading ||
              (selectionMode === "dateRange" && (!dateRange?.from || !dateRange?.to)) ||
              (selectionMode === "yearCompare" && (!year1 || !year2)) ||
              (tipoReporte === "typeRoom" && !roomTypeId)
            }
            className="w-full"
          >
            {isLoading ? (
              <>
                <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Descargar Reporte
              </>
            )}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" onClick={handleClose} className="w-full">
              Cancelar
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
