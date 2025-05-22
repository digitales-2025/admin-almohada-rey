"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { RoomStatus } from "@/app/(admin)/rooms/list/_types/room";
import { getRoomTypeKey, RoomTypeLabels } from "@/app/(admin)/rooms/list/_utils/rooms.utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExtendedRoomStatus, RoomOccupancyMap } from "../../../_types/dashboard";
import { getRoomStatusConfig, getStatusColor, getStatusText } from "../../../_utils/dashboard.utils";

interface RoomStatusByTypeProps {
  roomOccupancy: RoomOccupancyMap | undefined;
}

export function RoomStatusByType({ roomOccupancy }: RoomStatusByTypeProps) {
  const router = useRouter();
  const [activeType, setActiveType] = useState<string>("");

  // Si no hay datos o no hay tipos de habitación disponibles, mostrar mensaje
  if (!roomOccupancy || Object.keys(roomOccupancy.roomsByType).length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">No hay información disponible sobre habitaciones.</p>
      </div>
    );
  }

  // Establecer el tipo activo al primer tipo disponible si no está establecido
  if (!activeType || !roomOccupancy.roomsByType[activeType]) {
    setActiveType(Object.keys(roomOccupancy.roomsByType)[0]);
  }

  // Obtener habitaciones del tipo seleccionado
  const currentRooms = roomOccupancy.roomsByType[activeType] || [];

  // Obtener los tipos de habitación disponibles
  const roomTypes = Object.keys(roomOccupancy.roomsByType);

  return (
    <Card className="col-span-3 md:col-span-2">
      <CardHeader>
        <CardTitle className="text-xl">Mapa de Ocupación</CardTitle>
        <CardDescription>Vista general de todas las habitaciones</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4 justify-end">
              <div className="flex items-center gap-1">
                <div
                  className={`w-3 h-3 rounded-full ${getRoomStatusConfig(RoomStatus.OCCUPIED).borderColor.replace("border", "bg")}`}
                ></div>
                <span className="text-xs">Ocupada ({roomOccupancy.countOccupied})</span>
              </div>
              <div className="flex items-center gap-1">
                <div
                  className={`w-3 h-3 rounded-full ${getRoomStatusConfig(RoomStatus.AVAILABLE).borderColor.replace("border", "bg")}`}
                ></div>
                <span className="text-xs">Disponible ({roomOccupancy.countAvailable})</span>
              </div>
              <div className="flex items-center gap-1">
                <div
                  className={`w-3 h-3 rounded-full ${getRoomStatusConfig(RoomStatus.CLEANING).borderColor.replace("border", "bg")}`}
                ></div>
                <span className="text-xs">Limpieza ({roomOccupancy.countCleaning})</span>
              </div>
              <div className="flex items-center gap-1">
                <div
                  className={`w-3 h-3 rounded-full ${getRoomStatusConfig("MAINTENANCE" as ExtendedRoomStatus).borderColor.replace("border", "bg")}`}
                ></div>
                <span className="text-xs">Mantenimiento ({roomOccupancy.countMaintenance})</span>
              </div>
              <div className="flex items-center gap-1">
                <div
                  className={`w-3 h-3 rounded-full ${getRoomStatusConfig(RoomStatus.INCOMPLETE).borderColor.replace("border", "bg")}`}
                ></div>
                <span className="text-xs">Incompleta ({roomOccupancy.countIncomplete})</span>
              </div>
            </div>
            <Tabs value={activeType} onValueChange={setActiveType}>
              <TabsList>
                {roomTypes.map((type) => {
                  const typeKey = getRoomTypeKey(type);
                  const typeConfig = RoomTypeLabels[typeKey];
                  const Icon = typeConfig.icon;

                  return (
                    <TabsTrigger key={type} value={type} className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 shrink-0 ${typeConfig.className}`} />
                      <span className="truncate text-ellipsis">{typeConfig.label}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {currentRooms.map((room) => (
              <div
                key={room.id}
                className={`relative p-3 rounded-lg border-2 ${getStatusColor(room.status)} transition-all hover:shadow-md cursor-pointer`}
              >
                <div className="flex flex-col items-center">
                  <span className="text-lg font-bold dark:text-white">{room.number}</span>
                  <span className={`text-xs dark:text-white`}>{RoomTypeLabels[getRoomTypeKey(activeType)].label}</span>
                  <Badge
                    variant="outline"
                    className={`mt-2 ${getRoomStatusConfig(room.status).backgroundColor} 
                  ${getRoomStatusConfig(room.status).textColor}
                  ${getRoomStatusConfig(room.status).borderColor} 
                  ${getRoomStatusConfig(room.status).hoverBgColor} transition-colors`}
                  >
                    {getStatusText(room.status)}
                  </Badge>
                  {room.status === RoomStatus.AVAILABLE && (
                    <Button
                      size="sm"
                      className="w-fit mt-2"
                      variant={"secondary"}
                      onClick={() => router.push("/reservation")}
                    >
                      Reservar
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
