import { format } from "date-fns";
import { es } from "date-fns/locale";

import { ReservationStatus } from "@/app/(admin)/reservation/_schemas/reservation.schemas";
import { reservationStatusConfig } from "@/app/(admin)/reservation/_types/reservation-enum.config";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Top5TodayCheckIn } from "../../../_types/dashboard";

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
        <div className="py-6 text-center">
          <p className="text-muted-foreground">No hay check-ins programados para hoy</p>
        </div>
      ) : (
        top5TodayCheckIn.map((checkIn) => (
          <div key={checkIn.id} className="flex items-center justify-between border-b pb-4">
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
