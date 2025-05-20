import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function RecentReservations() {
  const reservations = [
    {
      id: "RES-001",
      customer: {
        name: "Juan Pérez",
        initials: "JP",
      },
      room: "101",
      checkIn: "15/05/2023",
      checkOut: "18/05/2023",
      status: "CHECKED_IN",
    },
    {
      id: "RES-002",
      customer: {
        name: "María García",
        initials: "MG",
      },
      room: "205",
      checkIn: "16/05/2023",
      checkOut: "20/05/2023",
      status: "CONFIRMED",
    },
    {
      id: "RES-003",
      customer: {
        name: "Roberto Jiménez",
        initials: "RJ",
      },
      room: "302",
      checkIn: "17/05/2023",
      checkOut: "19/05/2023",
      status: "PENDING",
    },
    {
      id: "RES-004",
      customer: {
        name: "Ana Martínez",
        initials: "AM",
      },
      room: "110",
      checkIn: "18/05/2023",
      checkOut: "22/05/2023",
      status: "CONFIRMED",
    },
    {
      id: "RES-005",
      customer: {
        name: "Carlos López",
        initials: "CL",
      },
      room: "215",
      checkIn: "14/05/2023",
      checkOut: "17/05/2023",
      status: "CHECKED_OUT",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CHECKED_IN":
        return <Badge className="bg-green-500">Registrado</Badge>;
      case "CHECKED_OUT":
        return <Badge variant="outline">Finalizado</Badge>;
      case "CONFIRMED":
        return <Badge className="bg-blue-500">Confirmado</Badge>;
      case "PENDING":
        return <Badge variant="secondary">Pendiente</Badge>;
      case "CANCELED":
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {reservations.map((reservation) => (
        <div key={reservation.id} className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarFallback>{reservation.customer.initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{reservation.customer.name}</p>
              <p className="text-xs text-muted-foreground">
                Hab. {reservation.room} • {reservation.checkIn} a {reservation.checkOut}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusBadge(reservation.status)}
            <Button variant="ghost" size="sm">
              Ver
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
