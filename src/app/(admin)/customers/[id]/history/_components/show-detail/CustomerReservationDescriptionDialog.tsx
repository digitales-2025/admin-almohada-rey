"use client";

import React from "react";

import type { CustomerReservation } from "@/app/(admin)/customers/_types/customer";
import { reservationStatusConfig } from "@/app/(admin)/reservation/_types/reservation-enum.config";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMediaQuery } from "@/hooks/use-media-query";
import CustomerReservationDescriptionContent from "./CustomerReservationDescriptionContent";

interface CustomerReservationDescriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDetailBooking: CustomerReservation | null;
  setSelectedDetailBooking: React.Dispatch<React.SetStateAction<CustomerReservation | null>>;
}

export default function CustomerReservationDescriptionDialog({
  open,
  onOpenChange,
  selectedDetailBooking,
  setSelectedDetailBooking,
}: CustomerReservationDescriptionDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 800px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-hidden px-0">
          {selectedDetailBooking && (
            <>
              <DialogHeader className="pb-2 px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <DialogTitle className="text-xl flex items-center gap-2">
                      Detalles de la Reserva
                      <Badge
                        variant="outline"
                        className={`capitalize flex items-center gap-1 ${reservationStatusConfig[selectedDetailBooking.status].borderColor} ${reservationStatusConfig[selectedDetailBooking.status].backgroundColor} ${reservationStatusConfig[selectedDetailBooking.status].textColor}`}
                      >
                        {React.createElement(reservationStatusConfig[selectedDetailBooking.status].icon, {
                          className: "h-3.5 w-3.5",
                        })}
                        <span>{reservationStatusConfig[selectedDetailBooking.status].name}</span>
                      </Badge>
                    </DialogTitle>
                    <DialogDescription>Información completa de la estancia del cliente</DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="px-0">
                <ScrollArea className="h-full max-h-[calc(80vh-180px)]">
                  <CustomerReservationDescriptionContent selectedDetailBooking={selectedDetailBooking} />
                </ScrollArea>
              </div>
            </>
          )}

          <DialogFooter className="p-6 pt-4">
            <Button variant="secondary" onClick={() => setSelectedDetailBooking(null)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        {selectedDetailBooking && (
          <>
            <DrawerHeader className="pb-2">
              <div className="gap-2">
                <DrawerTitle className="flex items-center gap-2">
                  <span>Detalles de la Reserva</span>

                  <Badge
                    variant="outline"
                    className={`capitalize flex items-center gap-1 ${reservationStatusConfig[selectedDetailBooking.status].borderColor} ${reservationStatusConfig[selectedDetailBooking.status].backgroundColor} ${reservationStatusConfig[selectedDetailBooking.status].textColor}`}
                  >
                    {React.createElement(reservationStatusConfig[selectedDetailBooking.status].icon, {
                      className: "h-3.5 w-3.5",
                    })}
                    <span>{reservationStatusConfig[selectedDetailBooking.status].name}</span>
                  </Badge>
                </DrawerTitle>
                <DrawerDescription>Información completa de la estancia del cliente</DrawerDescription>
              </div>
            </DrawerHeader>

            <div className="px-0 pb-4 flex-1">
              <ScrollArea className="h-[calc(100dvh-400px)]">
                <CustomerReservationDescriptionContent selectedDetailBooking={selectedDetailBooking} />
              </ScrollArea>
            </div>
          </>
        )}

        <DrawerFooter className="pt-2">
          <Button variant="secondary" onClick={() => setSelectedDetailBooking(null)} className="w-full">
            Cerrar
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
