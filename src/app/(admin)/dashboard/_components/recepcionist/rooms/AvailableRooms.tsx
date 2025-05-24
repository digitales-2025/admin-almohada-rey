import { BedDouble, Coffee, Tv, Wifi } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function AvailableRooms() {
  const rooms = [
    {
      number: "101",
      type: "Estándar",
      price: "S/ 120/noche",
      amenities: ["WiFi", "TV", "Cafetera"],
      status: "AVAILABLE",
    },
    {
      number: "203",
      type: "Deluxe",
      price: "S/ 180/noche",
      amenities: ["WiFi", "TV", "Cafetera", "Minibar"],
      status: "AVAILABLE",
    },
    {
      number: "305",
      type: "Suite",
      price: "S/ 250/noche",
      amenities: ["WiFi", "TV", "Cafetera", "Minibar", "Jacuzzi"],
      status: "AVAILABLE",
    },
    {
      number: "108",
      type: "Estándar",
      price: "S/ 120/noche",
      amenities: ["WiFi", "TV", "Cafetera"],
      status: "AVAILABLE",
    },
    {
      number: "210",
      type: "Deluxe",
      price: "S/ 180/noche",
      amenities: ["WiFi", "TV", "Cafetera", "Minibar"],
      status: "AVAILABLE",
    },
  ];

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case "WiFi":
        return <Wifi className="h-4 w-4" />;
      case "TV":
        return <Tv className="h-4 w-4" />;
      case "Cafetera":
        return <Coffee className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {rooms.map((room) => (
        <div key={room.number} className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center space-x-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <BedDouble className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">
                Habitación {room.number} - {room.type}
              </p>
              <p className="text-xs text-muted-foreground">{room.price}</p>
              <div className="mt-1 flex space-x-1">
                {room.amenities.slice(0, 3).map((amenity) => (
                  <div key={amenity} className="text-muted-foreground">
                    {getAmenityIcon(amenity)}
                  </div>
                ))}
                {room.amenities.length > 3 && (
                  <span className="text-xs text-muted-foreground">+{room.amenities.length - 3} más</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-blue-500">Disponible</Badge>
            <Button size="sm">Reservar</Button>
          </div>
        </div>
      ))}
    </div>
  );
}
