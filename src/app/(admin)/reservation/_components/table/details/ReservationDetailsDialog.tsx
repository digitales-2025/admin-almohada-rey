"use client";

import { Calendar } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import type { DetailedReservation } from "../../../_schemas/reservation.schemas";
import { reservationStatusConfig } from "../../../_types/reservation-enum.config";
import { ReservationDetailsForm } from "./ReservationDetailsForm";

interface ReservationDetailsDialogProps {
  row: DetailedReservation;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function ReservationDetailsDialog({ row, open, setOpen }: ReservationDetailsDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 910px)");
  const statusConfig = reservationStatusConfig[row?.status];
  const Icon = statusConfig.icon;

  // Contenido compartido para el badge de estado
  const StatusBadge = () => (
    <Badge
      className={cn(
        statusConfig.backgroundColor,
        statusConfig.textColor,
        statusConfig.hoverBgColor,
        statusConfig.borderColor,
        "flex gap-2 items-center text-sm"
      )}
    >
      <Icon className="size-4" />
      <span>{statusConfig.name}</span>
    </Badge>
  );

  // Si es versión desktop, mostrar Dialog
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden max-h-[90vh] flex flex-col">
          <DialogHeader className="px-6 pt-6 pb-2 sticky top-0 z-10 bg-background">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <DialogTitle className="text-xl">Detalles de la Reserva</DialogTitle>
              </div>
              <StatusBadge />
            </div>
          </DialogHeader>

          <ScrollArea className="flex-1 overflow-auto">
            <div className="py-4">
              <ReservationDetailsForm row={row} />
            </div>
          </ScrollArea>

          <div className="p-4 border-t sticky bottom-0 bg-background">
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
                Cerrar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Si es versión móvil, mostrar Drawer
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="border-b">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-full bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <DrawerTitle>Detalles de la Reserva</DrawerTitle>
            </div>
            <StatusBadge />
          </div>
        </DrawerHeader>

        {/* Contenedor con altura fija para el ScrollArea */}
        <div className="flex-1 overflow-hidden ">
          <ScrollArea className="h-[calc(90vh-350px)]">
            <div className="py-4">
              <ReservationDetailsForm row={row} />
            </div>
          </ScrollArea>
        </div>

        <DrawerFooter className="border-t pt-2">
          <DrawerClose asChild>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cerrar
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
