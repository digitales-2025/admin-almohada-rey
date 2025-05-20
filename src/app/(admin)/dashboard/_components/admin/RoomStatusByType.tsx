"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function RoomStatusByType() {
  const [activeType, setActiveType] = useState("estandar");

  // Datos de ejemplo para las habitaciones por tipo
  const generateRooms = (type: string) => {
    const rooms = [];
    let total;

    switch (type) {
      case "estandar":
        total = 15;
        break;
      case "deluxe":
        total = 10;
        break;
      case "suite":
        total = 5;
        break;
      default:
        total = 15;
    }

    for (let i = 1; i <= total; i++) {
      // Número de habitación basado en el tipo
      let roomNumber;
      if (type === "estandar") {
        roomNumber = 100 + i;
      } else if (type === "deluxe") {
        roomNumber = 200 + i;
      } else {
        roomNumber = 300 + i;
      }

      // Asignar estados aleatorios pero con distribución realista
      let status;
      const rand = Math.random();
      if (rand < 0.6) {
        status = "occupied"; // 60% ocupadas
      } else if (rand < 0.8) {
        status = "available"; // 20% disponibles
      } else if (rand < 0.95) {
        status = "cleaning"; // 15% en limpieza
      } else {
        status = "maintenance"; // 5% en mantenimiento
      }

      rooms.push({
        number: roomNumber,
        status,
        type,
      });
    }

    return rooms;
  };

  const rooms = generateRooms(activeType);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "occupied":
        return "bg-green-100 border-green-500 text-green-700";
      case "available":
        return "bg-blue-100 border-blue-500 text-blue-700";
      case "cleaning":
        return "bg-amber-100 border-amber-500 text-amber-700";
      case "maintenance":
        return "bg-red-100 border-red-500 text-red-700";
      default:
        return "bg-gray-100 border-gray-500 text-gray-700";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "occupied":
        return "Ocupada";
      case "available":
        return "Disponible";
      case "cleaning":
        return "Limpieza";
      case "maintenance":
        return "Mantenimiento";
      default:
        return status;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case "estandar":
        return "Estándar";
      case "deluxe":
        return "Deluxe";
      case "suite":
        return "Suite";
      default:
        return type;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Tabs value={activeType} onValueChange={setActiveType}>
          <TabsList>
            <TabsTrigger value="estandar">Estándar</TabsTrigger>
            <TabsTrigger value="deluxe">Deluxe</TabsTrigger>
            <TabsTrigger value="suite">Suite</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs">Ocupada</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-xs">Disponible</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-xs">Limpieza</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-xs">Mantenimiento</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {rooms.map((room) => (
          <div
            key={room.number}
            className={`relative p-3 rounded-lg border-2 ${getStatusColor(room.status)} transition-all hover:shadow-md cursor-pointer`}
          >
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold">{room.number}</span>
              <span className="text-xs">{getTypeText(room.type)}</span>
              <Badge
                variant="outline"
                className={`mt-2 ${
                  room.status === "occupied"
                    ? "bg-green-500 text-white border-none"
                    : room.status === "available"
                      ? "bg-blue-500 text-white border-none"
                      : room.status === "cleaning"
                        ? "bg-amber-500 text-white border-none"
                        : "bg-red-500 text-white border-none"
                }`}
              >
                {getStatusText(room.status)}
              </Badge>
            </div>
            {room.status === "available" && (
              <Button size="sm" className="w-full mt-2">
                Reservar
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
