"use client";

import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, CreditCard, Hotel, RefreshCcw, Save, User } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

import type { UpdatePaymentSchema } from "@/app/(admin)/payments/_schema/createPaymentsSchema";
import type { Payment } from "@/app/(admin)/payments/_types/payment";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface GeneralUpdatePaymentProps {
  payment: Payment;
  form: UseFormReturn<UpdatePaymentSchema>;
  onSubmit: (data: UpdatePaymentSchema) => void;
  isLoadingUpdatePayment: boolean;
}

export default function GeneralUpdatePayment({
  payment,
  form,
  onSubmit,
  isLoadingUpdatePayment,
}: GeneralUpdatePaymentProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 mt-2">
      {/* Left sidebar with payment info */}
      <div className="relative lg:border-border px-6 py-3 lg:col-span-4 lg:border-r">
        <div className="sticky space-y-8">
          {/* Payment info section */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <CreditCard className="h-4 w-4 text-primary" />
              Información del Pago
            </h3>

            <div className="space-y-3">
              <div className="overflow-hidden rounded-lg border border-border/50 bg-card">
                <div className="border-b border-border/50 bg-muted/50 px-4 py-2 dark:bg-muted/20">
                  <Label className="text-xs font-medium text-muted-foreground">Código de Pago</Label>
                </div>
                <div className="px-4 py-3">
                  <p className="font-normal text-sm text-foreground">{payment.code}</p>
                </div>
              </div>

              <div className="overflow-hidden rounded-lg border border-border/50 bg-card">
                <div className="border-b border-border/50 bg-muted/50 px-4 py-2 dark:bg-muted/20">
                  <Label className="text-xs font-medium text-muted-foreground">Fecha de Ultimo Pago</Label>
                </div>
                <div className="px-4 py-3">
                  <p className="font-normal text-sm text-foreground">
                    {format(parseISO(payment.date), "d 'de' MMMM 'de' yyyy", { locale: es })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Reservation info section */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Hotel className="h-4 w-4 text-primary" />
              Información de Reserva
            </h3>

            <div className="rounded-lg border border-primary/20 bg-card p-4 dark:border-primary/10 space-y-4">
              <div className="space-y-4">
                {/* Cliente */}
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Cliente</Label>
                    <p className="font-medium text-sm text-foreground capitalize">
                      {payment.reservation.customer.name}
                    </p>
                  </div>
                </div>

                <Separator className="bg-border/50" />
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Check-in</Label>
                    <p className="font-medium  text-sm text-foreground">
                      {format(new Date(payment.reservation.checkInDate), "PPP", { locale: es })}
                    </p>
                  </div>
                </div>

                <Separator className="bg-border/50" />

                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Check-out</Label>
                    <p className="font-normal text-sm text-foreground">
                      {format(new Date(payment.reservation.checkOutDate), "PPP", { locale: es })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right content area with observations */}
      <div className="lg:col-span-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="h-full">
            <div className="flex h-full flex-col p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-foreground">Observaciones</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Agregue notas o comentarios importantes sobre este pago
                </p>
              </div>

              <div className="relative flex-1">
                <div className="h-full">
                  <Textarea
                    id="observations"
                    {...form.register("observations")}
                    className={cn(
                      "min-h-[250px] w-full border-border/50 bg-card focus-visible:ring-primary",
                      "dark:bg-card/50 dark:focus-visible:ring-primary"
                    )}
                    placeholder="Ingrese observaciones adicionales sobre este pago..."
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  type="submit"
                  disabled={isLoadingUpdatePayment}
                  className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
                >
                  {isLoadingUpdatePayment ? (
                    <RefreshCcw className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Guardar Observaciones
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
