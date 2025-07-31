"use client";

import { useRouter } from "next/navigation";
import { CreditCard } from "lucide-react";

import { PaymentStatus } from "@/app/(admin)/payments/_types/payment";
import { PaymentStatusLabels } from "@/app/(admin)/payments/_utils/payments.utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { NextPendingPayments } from "../../../_types/dashboard";

interface NextPendingPaymentsDashboardProps {
  nextPendingPayments: NextPendingPayments | undefined;
}

export function NextPendingPaymentsDashboard({ nextPendingPayments }: NextPendingPaymentsDashboardProps) {
  const router = useRouter();

  if (!nextPendingPayments || !nextPendingPayments.newPayments.length) {
    return (
      <Card className="col-span-3 md:col-span-1">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl">Pagos Pendientes</CardTitle>
              <CardDescription>No hay pagos pendientes este mes</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => router.push("/payments")}>
              Ver todos
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 space-y-3">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-medium text-muted-foreground">No hay pagos pendientes</p>
              <p className="text-xs text-muted-foreground">Todos los pagos están al día</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const formatAmount = (amount: number) => {
    return `S/ ${amount.toLocaleString("es-PE", { minimumFractionDigits: 2 })}`;
  };

  const statusConfig = PaymentStatusLabels[PaymentStatus.PENDING];

  return (
    <Card className="col-span-3 md:col-span-1">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">Pagos Pendientes</CardTitle>
            <CardDescription>
              {nextPendingPayments?.monthPendingPayments === 1
                ? "Hay 1 pago pendiente este mes"
                : `Hay ${nextPendingPayments?.monthPendingPayments || 0} pagos pendientes este mes`}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => router.push("/payments")}>
            Ver todos
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {nextPendingPayments.newPayments.map((payment) => (
            <div key={payment.id} className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarFallback>{getInitials(payment.customerName)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium capitalize">{payment.customerName}</p>
                  <p className="text-xs text-muted-foreground">
                    Habitación {payment.roomNumber} • {payment.code}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">{formatAmount(payment.amount)}</p>
                <Badge variant="outline" className={statusConfig.className}>
                  <statusConfig.icon className="mr-1 h-3.5 w-3.5" />
                  {statusConfig.label}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
