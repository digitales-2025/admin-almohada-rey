import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarCheck } from "lucide-react";

import type { ReservationStatus } from "@/app/(admin)/reservation/_schemas/reservation.schemas";
import { reservationStatusConfig } from "@/app/(admin)/reservation/_types/reservation-enum.config";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Top5TodayCheckIn } from "../../../_types/dashboard";

interface TodayCheckInsProps {
  top5TodayCheckIn: Top5TodayCheckIn[] | undefined;
}

export function TodayCheckIns({ top5TodayCheckIn = [] }: TodayCheckInsProps) {
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

  const formatTime = (date: Date) => {
    return format(new Date(date), "HH:mm", { locale: es });
  };

  return (
    <div className="space-y-4">
      {top5TodayCheckIn.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <CalendarCheck className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm font-medium text-muted-foreground">No hay check-ins programados</p>
            <p className="text-xs text-muted-foreground">Los check-ins de hoy aparecerán aquí</p>
          </div>
        </div>
      ) : (
        top5TodayCheckIn.map((checkIn) => (
          <div key={checkIn.id} className="flex flex-col sm:flex-row items-center justify-between border-b pb-4 gap-2">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarFallback>{getInitials(checkIn.customerName)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium capitalize">{checkIn.customerName}</p>
                <p className="text-xs text-muted-foreground">
                  Hab. {checkIn.roomNumber} • Esperado a las {formatTime(checkIn.checkInDate)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">{getStatusBadge(checkIn.status)}</div>
          </div>
        ))
      )}
    </div>
  );
}
