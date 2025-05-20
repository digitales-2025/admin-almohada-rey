"use client";

import { format, parse, parseISO } from "date-fns";
import { AlertCircle, BadgeCheck, Clock, CreditCard, DollarSign, FileText, Info, Loader2 } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

import { PaymentDetailMethod } from "@/app/(admin)/payments/_types/payment";
import { Button } from "@/components/ui/button";
import DatePicker from "@/components/ui/date-time-picker";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { CreateLateCheckout } from "../../_schemas/extension-reservation.schemas";
import type { DetailedReservation } from "../../_schemas/reservation.schemas";
import { getMethodIcon, getPaymentMethodLabel } from "../../_utils/reservationPayment.utils";
import LateCheckoutTimeInput from "./LateCheckoutTimeInput";

interface LateCheckoutFormProps {
  lateCheckoutForm: UseFormReturn<CreateLateCheckout>;
  onSubmitLateCheckout: (data: CreateLateCheckout) => void;
  isProcessing: boolean;
  reservation: DetailedReservation;
  lateCheckoutCost: number;
  roomPrice: number;
  onOpenChange: (open: boolean) => void;
}

export default function LateCheckoutForm({
  lateCheckoutForm,
  onSubmitLateCheckout,
  isProcessing,
  reservation,
  lateCheckoutCost,
  roomPrice,
  onOpenChange,
}: LateCheckoutFormProps) {
  const originalCheckoutDate = reservation.checkOutDate ? parseISO(reservation.checkOutDate) : new Date();
  return (
    <TabsContent value="late-checkout" className="p-0 m-0">
      <Form {...lateCheckoutForm}>
        <form onSubmit={lateCheckoutForm.handleSubmit(onSubmitLateCheckout)} className="p-4 space-y-5">
          {/* Info Banner */}
          <div className="bg-muted/30 border border-border rounded-lg p-4 flex items-center">
            <Info className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">
              El late checkout permite al huésped permanecer en la habitación después de la hora estándar de salida
              (12:00) por un cargo adicional del 50% de la tarifa diaria.
            </p>
          </div>

          {/* Late Checkout Time Section */}
          <LateCheckoutTimeInput
            lateCheckoutForm={lateCheckoutForm}
            originalCheckoutDate={originalCheckoutDate}
            idReservation={reservation.id}
          />

          {/* Cost Section */}
          <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="text-foreground p-2 rounded-full mr-3">
                  <DollarSign className="h-5 w-5 text-primary mr-3" />
                </div>
                <div>
                  <span className="font-medium text-foreground">Costo del Late Checkout</span>
                  <p className="text-sm text-muted-foreground">50% de la tarifa diaria (S/{roomPrice.toFixed(2)})</p>
                </div>
              </div>
              <div className="text-xl font-bold text-primary">S/{lateCheckoutCost.toFixed(2)}</div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
            <div className="p-5 border-b border-border bg-muted/20">
              <div className="font-medium text-foreground flex items-center">
                <CreditCard className="h-5 w-5 text-primary mr-3" />

                <h3 className="font-medium"> Detalles de Pago</h3>
              </div>
            </div>

            <div className="p-4 space-y-5">
              <FormField
                control={lateCheckoutForm.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="payment-method-late" className="block mb-2 font-medium text-foreground">
                      Método de Pago
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger
                          id="payment-method-late"
                          className={cn(
                            "w-full transition-all",
                            field.value && "border-l-4",
                            field.value === PaymentDetailMethod.CASH && "border-l-green-500",
                            field.value === PaymentDetailMethod.CREDIT_CARD && "border-l-blue-500",
                            field.value === PaymentDetailMethod.TRANSFER && "border-l-violet-500",
                            field.value === PaymentDetailMethod.YAPE && "border-l-purple-500",
                            field.value === PaymentDetailMethod.PLIN && "border-l-sky-500",
                            field.value === PaymentDetailMethod.PAYPAL && "border-l-blue-700",
                            field.value === PaymentDetailMethod.DEBIT_CARD && "border-l-cyan-500",
                            field.value === PaymentDetailMethod.IZI_PAY && "border-l-red-600",
                            field.value === PaymentDetailMethod.PENDING_PAYMENT && "border-l-amber-500"
                          )}
                        >
                          <SelectValue placeholder="Seleccionar método">
                            {field.value && (
                              <div className="flex items-center gap-2">
                                <div>{getMethodIcon(field.value as PaymentDetailMethod, true)}</div>
                                {getPaymentMethodLabel(field.value)}
                              </div>
                            )}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(PaymentDetailMethod).map((method) => (
                          <SelectItem key={`late-${method}`} value={method} className="cursor-pointer hover:bg-muted">
                            <div className="flex items-center gap-2">
                              <div>{getMethodIcon(method as PaymentDetailMethod, true)}</div>
                              <span>{getPaymentMethodLabel(method as PaymentDetailMethod)}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={lateCheckoutForm.control}
                name="paymentDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="payment-date-late" className="block mb-2 text-foreground">
                      Fecha de Pago
                    </FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value ? parse(field.value, "yyyy-MM-dd", new Date()) : undefined}
                        onChange={(date) => {
                          if (date) {
                            const formattedDate = format(date, "yyyy-MM-dd");
                            field.onChange(formattedDate);
                          } else {
                            field.onChange("");
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {lateCheckoutForm.watch("paymentMethod") === PaymentDetailMethod.PENDING_PAYMENT && (
                <div className="bg-amber-100 dark:bg-slate-800 border-amber-300 dark:border-amber-800 rounded-lg p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="bg-amber-200 dark:bg-amber-800 p-2 rounded-full flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-amber-400 dark:text-amber-500 " />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Pago Pendiente</p>
                      <p className="text-sm text-muted-foreground dark:text-white mt-1">
                        El cargo se registrará como pendiente. El cliente deberá realizar el pago antes de la fecha de
                        check-out.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-primary/5 rounded-lg p-4 border border-border shadow-sm">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span className="font-medium text-foreground">Total a Pagar:</span>
                  </div>
                  <span className="text-xl font-bold text-primary">S/{lateCheckoutCost.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <FormField
            control={lateCheckoutForm.control}
            name="additionalNotes"
            render={({ field }) => (
              <FormItem className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
                <div className="p-5 border-b border-border bg-muted/20">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-primary mr-3" />
                    <FormLabel htmlFor="additional-notes-extend" className="font-medium m-0">
                      Observaciones
                    </FormLabel>
                  </div>
                </div>
                <div className="p-6">
                  <FormControl>
                    <Textarea
                      id="additional-notes-extend"
                      placeholder="Agregue cualquier información adicional o requerimientos especiales"
                      className="min-h-[120px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Action Buttons */}
          <div className="bg-card border-t border-border shadow-md p-4 rounded-b-lg">
            <div className="flex flex-col sm:flex-row items-center gap-3 justify-end">
              <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto" type="button">
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isProcessing}
                className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <BadgeCheck className="mr-2 h-4 w-4" />
                    Confirmar Modificación
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </TabsContent>
  );
}
