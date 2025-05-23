"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, ConciergeBell, CookingPot, Home, Lamp, Wrench } from "lucide-react";

import { RoomStatus } from "@/app/(admin)/rooms/list/_types/room";
import { getRoomTypeKey, RoomTypeLabels } from "@/app/(admin)/rooms/list/_utils/rooms.utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExtendedRoomStatus, RoomOccupancyMap } from "../../../_types/dashboard";
import { getRoomStatusConfig, getStatusText } from "../../../_utils/dashboard.utils";

interface RoomStatusByTypeProps {
  roomOccupancy: RoomOccupancyMap | undefined;
}

// Mapa de iconos para estados de habitación
const StatusIcons = {
  [RoomStatus.AVAILABLE]: ConciergeBell,
  [RoomStatus.OCCUPIED]: Lamp,
  [RoomStatus.CLEANING]: CookingPot,
  ["MAINTENANCE" as ExtendedRoomStatus]: Wrench,
  [RoomStatus.INCOMPLETE]: AlertTriangle,
};

export function RoomStatusByType({ roomOccupancy }: RoomStatusByTypeProps) {
  const router = useRouter();
  const [activeType, setActiveType] = useState<string>("");

  if (!roomOccupancy || Object.keys(roomOccupancy.roomsByType).length === 0) {
    return (
      <Card className="col-span-3 md:col-span-2">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Home className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center">No hay información disponible sobre habitaciones.</p>
        </CardContent>
      </Card>
    );
  }

  const roomTypes = Object.keys(roomOccupancy.roomsByType);
  const currentActiveType = activeType || roomTypes[0];
  const currentRooms = roomOccupancy.roomsByType[currentActiveType] || [];

  const statusStats = [
    { label: "Disponibles", count: roomOccupancy.countAvailable, status: RoomStatus.AVAILABLE },
    { label: "Ocupadas", count: roomOccupancy.countOccupied, status: RoomStatus.OCCUPIED },
    { label: "Limpieza", count: roomOccupancy.countCleaning, status: RoomStatus.CLEANING },
    { label: "Mantenimiento", count: roomOccupancy.countMaintenance, status: "MAINTENANCE" as ExtendedRoomStatus },
    { label: "Incompletas", count: roomOccupancy.countIncomplete, status: RoomStatus.INCOMPLETE },
  ];

  return (
    <div className="col-span-3 md:col-span-2 space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Mapa de Habitaciones</CardTitle>
              <CardDescription>Gestión y estado de todas las habitaciones</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {statusStats.map((stat) => {
              const config = getRoomStatusConfig(stat.status);
              const StatusIcon = StatusIcons[stat.status] || StatusIcons[RoomStatus.AVAILABLE];

              return (
                <div
                  key={stat.status}
                  className={`relative p-3 rounded-xl border ${config.borderColor} ${config.backgroundColor} transition-all hover:shadow-md`}
                >
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className={`p-1 rounded-lg bg-background/50`}>
                      <StatusIcon className={`h-4 w-4 ${config.textColor}`} />
                    </div>
                    <div className="space-y-1">
                      <div className={`text-xl font-bold ${config.textColor}`}>{stat.count}</div>
                      <div className={`text-xs font-medium ${config.textColor}`}>{stat.label}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Room Type Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tipos de Habitación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-row flex-wrap w-full gap-3">
            {roomTypes.map((type) => {
              const typeKey = getRoomTypeKey(type);
              const typeConfig = RoomTypeLabels[typeKey] || RoomTypeLabels.default;
              const Icon = typeConfig.icon;
              const roomCount = roomOccupancy.roomsByType[type]?.length || 0;
              const isActive = currentActiveType === type;

              return (
                <button
                  key={type}
                  onClick={() => setActiveType(type)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/50"
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <Icon className={`h-6 w-6 ${isActive ? "text-primary" : typeConfig.className}`} />
                    <div className="text-center">
                      <div className="text-sm font-medium">{typeConfig.label}</div>
                      <div className="text-xs text-muted-foreground">{roomCount} habitaciones</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Rooms Grid */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">
                {RoomTypeLabels[getRoomTypeKey(currentActiveType)]?.label || currentActiveType}
              </CardTitle>
              <CardDescription>{currentRooms.length} habitaciones</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {currentRooms.map((room) => {
              const config = getRoomStatusConfig(room.status);
              const StatusIcon = StatusIcons[room.status] || StatusIcons[RoomStatus.AVAILABLE];

              return (
                <div
                  key={room.id}
                  className={`relative p-4 rounded-lg border-2 ${config.borderColor} ${config.backgroundColor} transition-all hover:shadow-md`}
                >
                  <div className="flex flex-col items-center space-y-3">
                    {/* Room Number */}
                    <div className="text-xl font-bold">{room.number}</div>

                    {/* Status Icon */}
                    <StatusIcon className={`h-5 w-5 ${config.textColor}`} />

                    {/* Status Badge */}
                    <Badge variant="outline" className={`text-xs ${config.textColor} ${config.borderColor}`}>
                      {getStatusText(room.status)}
                    </Badge>

                    {/* Action Button */}
                    {room.status === RoomStatus.AVAILABLE && (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="w-full text-xs"
                        onClick={() => router.push("/reservation")}
                      >
                        Reservar
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
