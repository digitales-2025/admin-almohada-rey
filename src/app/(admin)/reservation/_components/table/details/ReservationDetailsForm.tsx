"use client";

import type React from "react";
import { Bed, Calendar, Clock, Info, User } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateStayNights, LIMA_TIME_ZONE } from "@/utils/peru-datetime";
import { DetailedReservation } from "../../../_schemas/reservation.schemas";
import ReservationTabRoomContent from "./ReservationRoomContent";
import ReservationTabCustomerContent from "./ReservationTabCustomerContent";
import ReservationTabDetailsContent from "./ReservationTabDetailsContent";

export const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleDateString("es-PE", {
    timeZone: LIMA_TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Función para formatear la hora usando las utilidades peruanas
export const formatTime = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString("es-PE", {
    timeZone: LIMA_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

interface ReservationDetailsFormProps {
  row: DetailedReservation;
}

export function ReservationDetailsForm({ row }: ReservationDetailsFormProps) {
  const nights = calculateStayNights(row.checkInDate, row.checkOutDate);

  return (
    <div className="overflow-y-auto flex-1 px-6">
      {/* Resumen de la reserva */}
      <div className="px-6 py-4 bg-muted/30 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col space-y-1">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" /> Check-in
            </span>
            <span className="font-medium">{formatDate(row.checkInDate)}</span>
            <span className="text-sm">{formatTime(row.checkInDate)}</span>
          </div>

          <div className="flex flex-col space-y-1">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" /> Check-out
            </span>
            <span className="font-medium">{formatDate(row.checkOutDate)}</span>
            <span className="text-sm">{formatTime(row.checkOutDate)}</span>
          </div>

          <div className="flex flex-col space-y-1">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" /> Duración
            </span>
            <span className="font-medium">
              {nights} {nights === 1 ? "noche" : "noches"}
            </span>
            <span className="text-sm">Reservado el {formatDate(row.reservationDate)}</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="room" className="w-full">
        <div className="pt-4 sticky top-0 z-10 bg-background">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="room" className="flex items-center gap-2">
              <Bed className="h-4 w-4 shrink-0" />
              <span className="truncate text-ellipsis">Habitación</span>
            </TabsTrigger>
            <TabsTrigger value="customer" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="truncate text-ellipsis">Cliente</span>
            </TabsTrigger>
            <TabsTrigger value="details" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              <span className="truncate text-ellipsis">Detalles</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Pestaña de habitación */}
        <TabsContent value="room" className="pt-4 focus-visible:outline-none focus-visible:ring-0">
          <ReservationTabRoomContent row={row} />
        </TabsContent>

        {/* Pestaña de cliente */}
        <TabsContent value="customer" className="pt-4 focus-visible:outline-none focus-visible:ring-0">
          <ReservationTabCustomerContent row={row} />
        </TabsContent>

        {/* Pestaña de detalles */}
        <TabsContent value="details" className="pt-4 focus-visible:outline-none focus-visible:ring-0">
          <ReservationTabDetailsContent row={row} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
