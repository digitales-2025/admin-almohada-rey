import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function RecentPayments() {
  const payments = [
    {
      id: "PAG-001",
      customer: {
        name: "Juan Pérez",
        initials: "JP",
      },
      amount: "S/ 1,450.00",
      date: "15/05/2023",
      status: "PAID",
    },
    {
      id: "PAG-002",
      customer: {
        name: "María García",
        initials: "MG",
      },
      amount: "S/ 2,680.00",
      date: "16/05/2023",
      status: "PAID",
    },
    {
      id: "PAG-003",
      customer: {
        name: "Roberto Jiménez",
        initials: "RJ",
      },
      amount: "S/ 1,320.00",
      date: "17/05/2023",
      status: "PENDING",
    },
    {
      id: "PAG-004",
      customer: {
        name: "Ana Martínez",
        initials: "AM",
      },
      amount: "S/ 2,550.00",
      date: "18/05/2023",
      status: "PAID",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return <Badge className="bg-green-500">Pagado</Badge>;
      case "PENDING":
        return <Badge variant="secondary">Pendiente</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {payments.map((payment) => (
        <div key={payment.id} className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarFallback>{payment.customer.initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{payment.customer.name}</p>
              <p className="text-xs text-muted-foreground">
                {payment.date} • {payment.id}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">{payment.amount}</p>
            {getStatusBadge(payment.status)}
          </div>
        </div>
      ))}
    </div>
  );
}
