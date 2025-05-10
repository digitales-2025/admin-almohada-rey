"use client";

// Importaciones de React, iconos, componentes UI y hooks personalizados
import { useState } from "react";
import { Download, RefreshCcw } from "lucide-react";

import SelectorFechas from "@/app/(admin)/reports/_components/select-date";
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
import { DownloadReportParams } from "../interfaces/dowloadParams";
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
  // Estados locales para mes, año y loading
  const [mesSeleccionado, setMesSeleccionado] = useState<number | null>(null);
  const [añoSeleccionado, setAñoSeleccionado] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Hooks para notificaciones y media query (responsive)
  const { toast } = useToast();
  const isDesktop = useMediaQuery("(min-width: 640px)");

  // Hook personalizado para descargar reportes
  const { onDownloadReport } = useDownloadReport();

  // Maneja la generación y descarga del reporte
  const handleGenerarReporte = async () => {
    // Validación de selección de mes y año
    if (mesSeleccionado === null || añoSeleccionado === null) {
      toast({
        title: "Error",
        description: "Por favor selecciona un mes y un año",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Construye los parámetros para la descarga
      const params: DownloadReportParams = {
        month: mesSeleccionado + 1, // +1 porque los meses van de 0-11
        year: añoSeleccionado,
      };

      // Llama al hook para descargar el reporte
      await onDownloadReport(tipoReporte, params, tituloReporte);

      toast({
        title: "Éxito",
        description: `Reporte de ${tituloReporte} generado correctamente`,
      });

      // Cierra el diálogo y resetea la selección
      onOpenChange(false);
      setMesSeleccionado(null);
      setAñoSeleccionado(null);
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
    setMesSeleccionado(null);
    setAñoSeleccionado(null);
  };

  // Contenido del formulario: selector de fechas
  const FormContent = () => (
    <div className="flex flex-col space-y-6 py-4">
      <SelectorFechas
        mesSeleccionado={mesSeleccionado}
        añoSeleccionado={añoSeleccionado}
        onMesChange={setMesSeleccionado}
        onAñoChange={setAñoSeleccionado}
      />
    </div>
  );

  // Renderiza el diálogo para escritorio
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Generar Reporte de {tituloReporte}</DialogTitle>
            <DialogDescription>Selecciona el mes y año para generar tu reporte en formato Excel.</DialogDescription>
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
              disabled={isLoading || mesSeleccionado === null || añoSeleccionado === null}
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
          <DrawerDescription>Selecciona el mes y año para generar tu reporte en formato Excel.</DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="flex-1 px-4">
          <FormContent />
        </ScrollArea>
        <DrawerFooter className="pt-2">
          <Button
            onClick={handleGenerarReporte}
            disabled={isLoading || mesSeleccionado === null || añoSeleccionado === null}
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
