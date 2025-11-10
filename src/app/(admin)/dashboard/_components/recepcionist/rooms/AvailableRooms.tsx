import { Bed } from "lucide-react";

import type { RoomStatus } from "@/app/(admin)/rooms/list/_types/room";
import { getRoomTypeKey, RoomStatusLabels, RoomTypeLabels } from "@/app/(admin)/rooms/list/_utils/rooms.utils";
import { Badge } from "@/components/ui/badge";
import type { TodayAvailableRooms } from "../../../_types/dashboard";

interface AvailableRoomsProps {
  todayAvailableRooms: TodayAvailableRooms[] | undefined;
}

export function AvailableRooms({ todayAvailableRooms = [] }: AvailableRoomsProps) {
  const getRoomTypeInfo = (typeRoom: string) => {
    const typeKey = getRoomTypeKey(typeRoom);
    return RoomTypeLabels[typeKey];
  };

  const getStatusInfo = (status: RoomStatus) => {
    return RoomStatusLabels[status];
  };

  // Función local para formatear precios
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 2,
    }).format(price);
  };

  return (
    <div className="space-y-4">
      {todayAvailableRooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <Bed className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Todas las habitaciones están ocupadas</p>
            <p className="text-xs text-muted-foreground">Las habitaciones disponibles aparecerán aquí</p>
          </div>
        </div>
      ) : (
        todayAvailableRooms.map((room) => {
          const roomTypeInfo = getRoomTypeInfo(room.typeRoom);
          const RoomTypeIcon = roomTypeInfo.icon;
          const statusInfo = getStatusInfo(room.status);
          const StatusIcon = statusInfo.icon;

          return (
            <div key={room.id} className="flex flex-col sm:flex-row items-center justify-between border-b pb-4 gap-2">
              <div className="flex items-center space-x-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <RoomTypeIcon className={`h-5 w-5 ${roomTypeInfo.className}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">Habitación {room.number}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{formatPrice(room.price)} por noche</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center space-x-2 gap-2">
                <Badge variant="outline" className={`text-xs ${roomTypeInfo.className}`}>
                  {roomTypeInfo.label}
                </Badge>
                <Badge variant="outline" className={statusInfo.className}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {statusInfo.label}
                </Badge>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
