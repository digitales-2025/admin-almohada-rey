import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function TodayCheckOuts() {
  const checkOuts = [
    {
      id: "RES-006",
      customer: {
        name: "Miguel Blanco",
        initials: "MB",
      },
      room: "103",
      time: "11:00",
      status: "CHECKED_OUT",
    },
    {
      id: "RES-007",
      customer: {
        name: "Sara Wilson",
        initials: "SW",
      },
      room: "207",
      time: "12:00",
      status: "PENDING",
    },
    {
      id: "RES-008",
      customer: {
        name: "Tomás Andrade",
        initials: "TA",
      },
      room: "305",
      time: "13:00",
      status: "PENDING",
    },
    {
      id: "RES-009",
      customer: {
        name: "Laura Martínez",
        initials: "LM",
      },
      room: "112",
      time: "14:30",
      status: "CHECKED_OUT",
    },
    {
      id: "RES-010",
      customer: {
        name: "Javier Torres",
        initials: "JT",
      },
      room: "218",
      time: "16:00",
      status: "PENDING",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CHECKED_OUT":
        return <Badge variant="outline">Finalizado</Badge>;
      case "PENDING":
        return <Badge variant="secondary">Pendiente</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {checkOuts.map((checkOut) => (
        <div key={checkOut.id} className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarFallback>{checkOut.customer.initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{checkOut.customer.name}</p>
              <p className="text-xs text-muted-foreground">
                Hab. {checkOut.room} • Esperado a las {checkOut.time}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">{getStatusBadge(checkOut.status)}</div>
        </div>
      ))}
    </div>
  );
}
