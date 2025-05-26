import { format } from "date-fns";
import { es } from "date-fns/locale";
import { BedDouble, Calendar, Users } from "lucide-react";

import type { ReservationStatus } from "@/app/(admin)/reservation/_schemas/reservation.schemas";
import { reservationStatusConfig } from "@/app/(admin)/reservation/_types/reservation-enum.config";
import { getRoomTypeKey, RoomTypeLabels } from "@/app/(admin)/rooms/list/_utils/rooms.utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { WeekReservations } from "../../../_types/dashboard";

interface UpcomingReservationsProps {
  weekReservations: WeekReservations | undefined;
}

export default function UpcomingReservations({ weekReservations }: UpcomingReservationsProps) {
  const { confirmedReservations = 0, pendingReservations = 0, reservations = [] } = weekReservations || {};

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const getStatusBadge = (status: ReservationStatus) => {
    const config = reservationStatusConfig[status];
    const Icon = config.icon;

    return (
      <Badge className={`${config.backgroundColor} ${config.textColor} font-medium`} variant="outline">
        <Icon className="h-3 w-3 mr-1" />
        {config.name}
      </Badge>
    );
  };

  const getRoomTypeBadge = (typeRoom: string) => {
    const typeKey = getRoomTypeKey(typeRoom);
    const roomInfo = RoomTypeLabels[typeKey];

    return (
      <Badge variant="outline" className={`${roomInfo.className} text-xs`}>
        {roomInfo.label}
      </Badge>
    );
  };

  const formatDateRange = (startDate: Date, endDate: Date) => {
    const start = format(new Date(startDate), "dd/MM", { locale: es });
    const end = format(new Date(endDate), "dd/MM", { locale: es });
    return `${start} - ${end}`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card>
      <CardHeader>
        {/* Header responsivo */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
          <div>
            <CardTitle className="flex items-center gap-2">Próximas Reservas</CardTitle>
            <CardDescription>Reservas para los próximos 7 días</CardDescription>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Badge
              className={`${reservationStatusConfig.CONFIRMED.backgroundColorIntense} hover:${reservationStatusConfig.CONFIRMED.backgroundColorIntense} ${reservationStatusConfig.CONFIRMED.borderColor} text-white text-center`}
            >
              {confirmedReservations} Confirmadas
            </Badge>
            <Badge
              variant="outline"
              className={`${reservationStatusConfig.PENDING.textColor} hover:${reservationStatusConfig.PENDING.backgroundColorIntense} ${reservationStatusConfig.PENDING.borderColor} text-center`}
            >
              {pendingReservations} Pendientes
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reservations.length === 0 ? (
            <div className="py-6 text-center">
              <p className="text-muted-foreground">No hay reservas programadas para los próximos días</p>
            </div>
          ) : (
            reservations.map((reservation) => (
              <div key={reservation.id} className="border-b pb-4 last:border-b-0">
                {/* Layout responsivo para cada reserva */}
                <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                  {/* Información principal */}
                  <div className="flex items-start space-x-4 sm:items-center">
                    <Avatar className="flex-shrink-0">
                      <AvatarFallback>{getInitials(reservation.customerName)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      {/* Nombre y tipo de habitación */}
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2 mb-2">
                        <p className="text-sm font-medium capitalize truncate">{reservation.customerName}</p>
                        <div className="flex-shrink-0">{getRoomTypeBadge(reservation.typeRoom)}</div>
                      </div>

                      {/* Información detallada - stack en móvil, inline en desktop */}
                      <div className="flex flex-col gap-1 text-xs text-muted-foreground sm:flex-row sm:items-center sm:gap-4">
                        <span className="flex items-center gap-1">
                          <BedDouble className="h-3 w-3 flex-shrink-0" />
                          Hab. {reservation.roomNumber}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 flex-shrink-0" />
                          {formatDateRange(reservation.checkInDate, reservation.checkOutDate)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3 flex-shrink-0" />
                          {reservation.numberGuests} {reservation.numberGuests === 1 ? "huésped" : "huéspedes"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Precio y estado - stack en móvil */}
                  <div className="flex items-center justify-between sm:flex-col sm:items-end sm:space-y-2">
                    <div className="text-left sm:text-right">
                      <p className="text-sm font-semibold">{formatPrice(reservation.subtotal)}</p>
                      <p className="text-xs text-muted-foreground">{reservation.nights} noches</p>
                    </div>
                    <div className="flex-shrink-0">{getStatusBadge(reservation.status)}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
