import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function TodayCheckIns() {
  const checkIns = [
    {
      id: "RES-001",
      customer: {
        name: "Juan Pérez",
        initials: "JP",
      },
      room: "101",
      time: "10:00",
      status: "CHECKED_IN",
    },
    {
      id: "RES-002",
      customer: {
        name: "María García",
        initials: "MG",
      },
      room: "205",
      time: "12:00",
      status: "PENDING",
    },
    {
      id: "RES-003",
      customer: {
        name: "Roberto Jiménez",
        initials: "RJ",
      },
      room: "302",
      time: "14:00",
      status: "PENDING",
    },
    {
      id: "RES-004",
      customer: {
        name: "Ana Martínez",
        initials: "AM",
      },
      room: "110",
      time: "15:30",
      status: "CHECKED_IN",
    },
    {
      id: "RES-005",
      customer: {
        name: "Carlos López",
        initials: "CL",
      },
      room: "215",
      time: "17:00",
      status: "CHECKED_IN",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CHECKED_IN":
        return <Badge className="bg-green-500">Registrado</Badge>;
      case "PENDING":
        return <Badge variant="secondary">Pendiente</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {checkIns.map((checkIn) => (
        <div key={checkIn.id} className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarFallback>{checkIn.customer.initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{checkIn.customer.name}</p>
              <p className="text-xs text-muted-foreground">
                Hab. {checkIn.room} • Esperado a las {checkIn.time}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">{getStatusBadge(checkIn.status)}</div>
        </div>
      ))}
    </div>
  );
}
