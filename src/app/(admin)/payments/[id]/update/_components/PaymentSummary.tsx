"use client";

import { CheckCircle2, Clock, CreditCard } from "lucide-react";

import {
  getMethodColor,
  getMethodIcon,
  getPaymentMethodLabel,
} from "@/app/(admin)/reservation/_utils/reservationPayment.utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPaymentDetailTypesConfigs } from "../_utils/updatePaymentDetail.utils";
import type { Payment, PaymentDetailMethod } from "../../../_types/payment";

interface PaymentSummaryProps {
  payment: Payment;
}

export default function PaymentSummary({ payment }: PaymentSummaryProps) {
  // Calculate summary data
  const totalAmount = payment.amount;
  const paymentProgress = (payment.amountPaid / totalAmount) * 100;
  const pendingAmount = totalAmount - payment.amountPaid;
  const isFullyPaid = paymentProgress >= 100 || pendingAmount <= 0;

  // Group by type
  const roomPayments = payment.paymentDetail.filter((detail) => detail.type === "ROOM_RESERVATION");
  const servicePayments = payment.paymentDetail.filter((detail) => detail.type === "EXTRA_SERVICE" && detail.service);
  const productPayments = payment.paymentDetail.filter((detail) => detail.type === "EXTRA_SERVICE" && detail.product);

  // Group by method
  const paymentsByMethod = payment.paymentDetail.reduce(
    (acc, detail) => {
      // Calcular el monto real según el tipo de detalle y método
      let amount = detail.subtotal;

      // Si es PENDING_PAYMENT, calcular el monto según el tipo
      if (detail.method === "PENDING_PAYMENT") {
        if (detail.days && detail.unitPrice) {
          // Para reservas de habitación o servicios con días
          amount = detail.days * detail.unitPrice;
        } else if (detail.quantity && detail.unitPrice) {
          // Para productos o servicios con cantidad
          amount = detail.quantity * detail.unitPrice;
        }
      }

      if (!acc[detail.method]) {
        acc[detail.method] = 0;
      }
      acc[detail.method] += amount;
      return acc;
    },
    {} as Record<string, number>
  );

  // Obtener la configuración de tipos de detalle
  const detailTypesConfigs = getPaymentDetailTypesConfigs("h-4 w-4");

  return (
    <div className="space-y-8">
      {/* Payment Status Card */}
      <Card className="relative overflow-hidden border-none bg-gradient-to-br from-primary/5 to-secondary/5 shadow-md">
        <div className="absolute inset-0 bg-grid-primary/5 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.6),transparent)]"></div>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
            <div className="flex flex-col items-center md:items-start">
              <h2 className="text-xl font-semibold text-foreground md:text-2xl">Estado de Pago</h2>
              <p className="text-sm text-muted-foreground">Resumen de la transacción</p>
            </div>

            <div className="flex items-center gap-5">
              <div className="flex flex-col sm:flex-row sm:gap-8">
                <div className="flex flex-col items-end gap-1">
                  <div className="text-sm text-muted-foreground">Total</div>
                  <div className="text-2xl font-bold">S/ {totalAmount.toFixed(2)}</div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <div className="text-sm text-muted-foreground">Pagado</div>
                  <div className="text-2xl font-bold text-primary">S/ {payment.amountPaid.toFixed(2)}</div>
                </div>
              </div>

              <div
                className={`flex h-16 w-16 items-center justify-center rounded-full ${isFullyPaid ? "bg-primary/10" : "bg-secondary/10"}`}
              >
                {isFullyPaid ? (
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                ) : (
                  <Clock className="h-8 w-8 text-secondary" />
                )}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">
                {isFullyPaid ? "Pago Completado" : `Progreso de Pago (${Math.round(paymentProgress)}%)`}
              </span>
              {!isFullyPaid && <span className="text-sm font-medium">Pendiente: S/ {pendingAmount.toFixed(2)}</span>}
            </div>

            <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full ${isFullyPaid ? "bg-green-400" : "bg-orange-400"}`}
                style={{ width: `${Math.min(paymentProgress, 100)}%` }}
              ></div>
            </div>

            {isFullyPaid && (
              <div className="mt-4 rounded-lg bg-primary/10 p-3 text-center text-sm font-medium text-primary">
                ¡Pago completado con éxito! No hay saldo pendiente.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment Details */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Breakdown by Type - Using the provided configuration */}
        <Card className="overflow-hidden border border-border/40 bg-card/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                {detailTypesConfigs[0].icon} {/* Usando el primer icono como representativo */}
              </div>
              Desglose por Tipo
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Visualization using the provided configuration */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-3">
                {[
                  {
                    config: detailTypesConfigs.find((config) => config.value === "ROOM"),
                    title: "Habitaciones",
                    count: roomPayments.length,
                    amount: roomPayments.reduce((sum, detail) => sum + detail.subtotal, 0),
                    description: "Reservas de habitaciones",
                  },
                  {
                    config: detailTypesConfigs.find((config) => config.value === "SERVICE"),
                    title: "Servicios",
                    count: servicePayments.length,
                    amount: servicePayments.reduce((sum, detail) => sum + detail.subtotal, 0),
                    description: "Servicios adicionales",
                  },
                  {
                    config: detailTypesConfigs.find((config) => config.value === "PRODUCT"),
                    title: "Productos",
                    count: productPayments.length,
                    amount: productPayments.reduce((sum, detail) => sum + detail.subtotal, 0),
                    description: "Productos consumidos",
                  },
                ].map((item, i) => {
                  const config = item.config!;

                  return (
                    <div
                      key={i}
                      className="relative overflow-hidden rounded-lg border bg-background p-4"
                      style={{ borderColor: config.borderColor.replace("border-", "") }}
                    >
                      <div
                        className="absolute left-0 top-0 h-full w-1"
                        style={{ backgroundColor: config.color.replace("bg-", "") }}
                      ></div>
                      <div className="ml-3 flex flex-col gap-2 sm:flex-row items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${config.bgColor}`}>
                            <div className={config.textColor}>{config.icon}</div>
                          </div>
                          <div>
                            <h3 className="font-medium">{item.title}</h3>
                            <p className="text-xs text-muted-foreground">{item.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">S/ {item.amount.toFixed(2)}</div>
                          <Badge variant="outline" className={`${config.bgColor} ${config.textColor}`}>
                            {item.count} {item.count > 1 ? "pagos" : "pago"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Breakdown by Payment Method */}
        <Card className="overflow-hidden border border-border/40 bg-card/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/10">
                <CreditCard className="h-4 w-4 text-secondary" />
              </div>
              Métodos de Pago
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {/* Visualization - Payment Method Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(paymentsByMethod).map(([method, amount]) => {
                  const methodType = method as PaymentDetailMethod;
                  const gradientClass = getMethodColor(methodType);
                  const primaryColor = gradientClass.split(" ")[0].replace("from-", "");
                  const percentage = (amount / totalAmount) * 100;

                  return (
                    <div
                      key={method}
                      className="relative flex flex-col justify-between overflow-hidden rounded-lg border border-border/50 bg-background p-4"
                      style={{
                        backgroundImage: `linear-gradient(to right, ${primaryColor}10, transparent)`,
                      }}
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-${primaryColor}/20`}>
                          {getMethodIcon(methodType)}
                        </div>
                        <h3 className="text-sm font-medium">{getPaymentMethodLabel(method)}</h3>
                      </div>

                      <div className="flex items-end justify-between">
                        <div className="text-lg font-bold">S/ {amount.toFixed(2)}</div>
                        <div
                          className="rounded-full px-2 py-0.5 text-xs font-medium"
                          style={{
                            backgroundColor: `var(--${primaryColor}-100, ${primaryColor}20)`,
                            color: `var(--${primaryColor}-700, ${primaryColor})`,
                          }}
                        >
                          {percentage.toFixed(1)}%
                        </div>
                      </div>

                      <div className="absolute bottom-0 left-0 h-1 w-full bg-muted">
                        <div
                          className={`h-full bg-gradient-to-r ${gradientClass}`}
                          style={{
                            width: `${percentage}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total Paid Indicator */}
              <div className={`mt-4 rounded-lg p-4 ${isFullyPaid ? "bg-primary/10" : "bg-secondary/10"}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isFullyPaid ? (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    ) : (
                      <Clock className="h-5 w-5 text-secondary" />
                    )}
                    <span className="text-sm font-medium">Porcentaje de Pago</span>
                  </div>
                  <span className="text-sm font-bold">
                    {isFullyPaid ? (
                      <span className="text-primary">100%</span>
                    ) : (
                      <span className="text-secondary">{Math.round(paymentProgress)}%</span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
