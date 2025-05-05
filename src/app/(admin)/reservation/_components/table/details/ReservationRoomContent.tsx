import { Check, X } from "lucide-react";

import { CleaningChecklist, FloorType } from "@/app/(admin)/rooms/list/_types/room";
import {
  FloorTypeLabels,
  getChecklistLabel,
  getRoomTypeKey,
  RoomTypeLabels,
} from "@/app/(admin)/rooms/list/_utils/rooms.utils";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { DetailedReservation } from "../../../_schemas/reservation.schemas";

interface ReservationTabRoomContentProps {
  row: DetailedReservation;
}

export default function ReservationTabRoomContent({ row }: ReservationTabRoomContentProps) {
  // Añade esto con los demás cálculos de configuración
  const roomTypeKey = getRoomTypeKey(row.room.RoomTypes.name);
  const roomTypeConfig = RoomTypeLabels[roomTypeKey];
  const RoomIcon = roomTypeConfig.icon;
  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-1/2 space-y-6">
        <div className="rounded-xl overflow-hidden border">
          <div className="bg-primary/10 p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/20 dark:bg-secondary/80 flex items-center justify-center">
                <RoomIcon className={cn("h-6 w-6", roomTypeConfig.className)} />
              </div>
              <div>
                <h3 className="text-lg font-semibold capitalize">{row.room.RoomTypes.name}</h3>
                <p className="text-sm text-muted-foreground">Habitación {row.room.number}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">S/{row.room.RoomTypes.price}</div>
              <div className="text-xs text-muted-foreground">por noche</div>
            </div>
          </div>

          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Tipo de cama</span>
              <span className="text-sm">{row.room.RoomTypes.bed}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Capacidad</span>
              <span className="text-sm">{row.room.RoomTypes.guests} personas</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Área</span>
              <span className="text-sm">{row.room.area} m²</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Tipo de piso</span>
              <span className="text-sm flex items-center gap-2">
                {FloorTypeLabels[row.room.floorType as FloorType]?.label || row.room.floorType.toLowerCase()}
              </span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">TV</span>
              <span className="text-sm">{row.room.tv}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 space-y-6">
        <div className="rounded-xl overflow-hidden border">
          <div className="bg-primary/5 p-4">
            <h3 className="font-medium">Amenidades</h3>
          </div>

          <div className="p-4 grid grid-cols-2 gap-3">
            {(["towel", "toiletPaper", "showerSoap", "handSoap", "lamp", "trashBin"] as const).map((item) => {
              const amenityKey = item as keyof typeof row.room;
              const hasAmenity = row.room[amenityKey] as boolean;

              return (
                <div
                  key={item}
                  className={cn("flex items-center gap-2", hasAmenity ? "text-green-600" : "text-red-500")}
                >
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    {hasAmenity ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-red-500" />}
                  </div>
                  <span className="text-sm">{getChecklistLabel(item as keyof CleaningChecklist)}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl overflow-hidden border">
          <div className="bg-primary/5 p-4">
            <h3 className="font-medium">Descripción</h3>
          </div>

          <div className="p-4">
            <p className="text-sm">{row.room.RoomTypes.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
