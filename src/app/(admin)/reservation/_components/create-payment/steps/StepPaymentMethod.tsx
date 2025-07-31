import React from "react";
import { Check } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { CreatePaymentSchema } from "@/app/(admin)/payments/_schema/createPaymentsSchema";
import { PaymentDetailMethod } from "@/app/(admin)/payments/_types/payment";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { getMethodColor, getMethodIcon } from "../../../_utils/reservationPayment.utils";

interface StepPaymentMethodProps {
  form: UseFormReturn<CreatePaymentSchema>;
}

export default function StepPaymentMethod({ form }: StepPaymentMethodProps) {
  return (
    <FormField
      control={form.control}
      name="method"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-base font-medium mb-4 block">Seleccione el Método de Pago</FormLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            {[
              { value: PaymentDetailMethod.CASH, label: "Efectivo", description: "Moneda física" },
              {
                value: PaymentDetailMethod.CREDIT_CARD,
                label: "Tarjeta de Crédito",
                description: "Visa, Mastercard",
              },
              {
                value: PaymentDetailMethod.DEBIT_CARD,
                label: "Tarjeta de Débito",
                description: "Directo de cuenta bancaria",
              },
              {
                value: PaymentDetailMethod.TRANSFER,
                label: "Transferencia Bancaria",
                description: "Transferencia electrónica",
              },
              { value: PaymentDetailMethod.YAPE, label: "Yape", description: "App de pago móvil" },
              { value: PaymentDetailMethod.PLIN, label: "Plin", description: "App de pago móvil" },
              {
                value: PaymentDetailMethod.PAYPAL,
                label: "PayPal",
                description: "Sistema de pago online",
              },
              {
                value: PaymentDetailMethod.IZI_PAY,
                label: "Izi Pay",
                description: "Solución de pago digital",
              },
              {
                value: PaymentDetailMethod.PENDING_PAYMENT,
                label: "Pago Pendiente",
                description: "Pago no realizado",
              },
            ].map((method) => (
              <div
                key={method.value}
                className={cn(
                  "relative overflow-hidden rounded-xl border-2 transition-all cursor-pointer hover:shadow-md",
                  field.value === method.value
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-muted hover:border-primary/50"
                )}
                onClick={() => field.onChange(method.value)}
              >
                {/* Gradient background for selected method */}
                {field.value === method.value && (
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${getMethodColor(method.value)} opacity-10`}
                  ></div>
                )}

                <div className="relative p-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className={cn(
                        "p-2.5 rounded-full",
                        field.value === method.value
                          ? `bg-gradient-to-br ${getMethodColor(method.value)} text-white`
                          : "bg-muted"
                      )}
                    >
                      {getMethodIcon(method.value)}
                    </div>

                    <div className="flex-1">
                      <p className="font-medium">{method.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{method.description}</p>
                    </div>

                    {field.value === method.value && (
                      <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
