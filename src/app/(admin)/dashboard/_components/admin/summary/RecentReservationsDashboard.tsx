"use client";

import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarX } from "lucide-react";

import type { ReservationStatus } from "@/app/(admin)/reservation/_schemas/reservation.schemas";
import { reservationStatusConfig } from "@/app/(admin)/reservation/_types/reservation-enum.config";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { RecentReservations } from "../../../_types/dashboard";

interface RecentReservationsDashboardProps {
  recentReservations: RecentReservations | undefined;
}

export function RecentReservationsDashboard({ recentReservations }: RecentReservationsDashboardProps) {
  const router = useRouter();

  if (!recentReservations || !recentReservations.newReservations || recentReservations.newReservations.length === 0) {
    return (
      <Card className="col-span-3 md:col-span-2">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl">Reservas Recientes</CardTitle>
              <CardDescription>No hay reservas nuevas hoy</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => router.push("/reservation")}>
              Ver todas
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <CalendarX className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-medium text-muted-foreground">No hay reservas recientes</p>
              <p className="text-xs text-muted-foreground">Las nuevas reservas aparecerán aquí</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Función para obtener iniciales del nombre
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Función para formatear fechas
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, "dd/MM/yyyy", { locale: es });
    } catch {
      return "Fecha inválida";
    }
  };

  // Función para mostrar el badge según el status usando la configuración existente
  const getStatusBadge = (status: ReservationStatus) => {
    const config = reservationStatusConfig[status];
    if (!config) return null;

    const IconComponent = config.icon;

    return (
      <div
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${config.backgroundColor} ${config.textColor}`}
      >
        <IconComponent className="h-3.5 w-3.5" />
        <span className="text-xs font-medium">{config.name}</span>
      </div>
    );
  };

  return (
    <Card className="col-span-3 md:col-span-2">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">Reservas Recientes</CardTitle>
            <CardDescription>
              {recentReservations?.todayReservations === 1
                ? "Tienes 1 nueva reserva hoy"
                : `Tienes ${recentReservations?.todayReservations || 0} nuevas reservas hoy`}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => router.push("/reservation")}>
            Ver todas
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentReservations.newReservations.map((reservation) => {
            const status = reservation.status as ReservationStatus;
            const initials = getInitials(reservation.customerName);

            return (
              <div key={reservation.id} className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium capitalize">{reservation.customerName}</p>
                    <p className="text-xs text-muted-foreground">
                      Hab. {reservation.roomNumber} • {formatDate(reservation.checkInDate.toString())} a{" "}
                      {formatDate(reservation.checkOutDate.toString())}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">{getStatusBadge(status)}</div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
