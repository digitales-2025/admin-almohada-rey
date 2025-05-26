import { RoomStatus } from "@/app/(admin)/rooms/list/_types/room";
import { getRoomTypeKey, RoomStatusLabels, RoomTypeLabels } from "@/app/(admin)/rooms/list/_utils/rooms.utils";
import { Badge } from "@/components/ui/badge";
import { TodayAvailableRooms } from "../../../_types/dashboard";

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
        <div className="py-6 text-center">
          <p className="text-muted-foreground">No hay habitaciones disponibles</p>
        </div>
      ) : (
        todayAvailableRooms.map((room) => {
          const roomTypeInfo = getRoomTypeInfo(room.typeRoom);
          const RoomTypeIcon = roomTypeInfo.icon;
          const statusInfo = getStatusInfo(room.status);
          const StatusIcon = statusInfo.icon;

          return (
            <div key={room.id} className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center space-x-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <RoomTypeIcon className={`h-5 w-5 ${roomTypeInfo.className}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">Habitación {room.number}</p>
                    <Badge variant="outline" className={`text-xs ${roomTypeInfo.className}`}>
                      {roomTypeInfo.label}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{formatPrice(room.price)} por noche</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
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
