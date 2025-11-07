"use client";

import { differenceInDays, format, parse, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import {
  AlertCircle,
  BadgeCheck,
  Banknote,
  Calendar,
  CreditCard,
  DollarSign,
  FileText,
  Info,
  Loader2,
} from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

import { PaymentDetailMethod } from "@/app/(admin)/payments/_types/payment";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DatePicker from "@/components/ui/date-time-picker";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { CreateExtendStay } from "../../_schemas/extension-reservation.schemas";
import type { DetailedReservation } from "../../_schemas/reservation.schemas";
import { getMethodIcon, getPaymentMethodLabel } from "../../_utils/reservationPayment.utils";
import ExtendedBookingCalendar from "./ExtendedBookingCalendar";

interface ExtendedStayFormProps {
  extendStayForm: UseFormReturn<CreateExtendStay>;
  onSubmitExtendStay: (data: CreateExtendStay) => void;
  isProcessing: boolean;
  reservation: DetailedReservation;
  extendedStayCost: number;
  roomPrice: number;
  onOpenChange: (open: boolean) => void;
  originalCheckoutDate: Date;
  renderCount: number;
  isDateDisabled: (date: Date) => boolean;
}

export default function ExtendedStayForm({
  extendStayForm,
  onSubmitExtendStay,
  isProcessing,
  reservation,
  extendedStayCost,
  roomPrice,
  onOpenChange,
  originalCheckoutDate,
  renderCount,
  isDateDisabled,
}: ExtendedStayFormProps) {
  return (
    <TabsContent value="extend-stay" className="p-0 m-0">
      <Form {...extendStayForm}>
        <form onSubmit={extendStayForm.handleSubmit(onSubmitExtendStay)}>
          <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
            {/* Banner informativo */}
            <div className="bg-muted/30 border border-border rounded-lg p-3 sm:p-4 flex items-center">
              <Info className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2 sm:mr-3 flex-shrink-0" />
              <p className="text-xs sm:text-sm text-muted-foreground">
                La extensión de estadía permite al huésped prolongar su reserva por noches adicionales, manteniendo la
                misma habitación y tarifa.
              </p>
            </div>

            {/* Sección de fechas */}
            <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
              <div className="p-3 sm:p-4 md:p-5 border-b border-border bg-muted/20">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2 sm:mr-3" />
                  <h3 className="text-sm sm:text-base font-medium">Fechas de Estadía</h3>
                </div>
              </div>

              <div className="p-4 sm:p-5 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Fechas actuales */}
                  <div>
                    <h4 className="text-xs sm:text-sm font-medium mb-3 sm:mb-4">Fechas Actuales</h4>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm text-muted-foreground">Check-in:</span>
                        <span className="text-xs sm:text-sm font-medium">
                          {reservation.checkInDate
                            ? format(parseISO(reservation.checkInDate), "dd/MM/yyyy", { locale: es })
                            : "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm text-muted-foreground">Check-out:</span>
                        <span className="text-xs sm:text-sm font-medium">
                          {reservation.checkOutDate
                            ? format(parseISO(reservation.checkOutDate), "dd/MM/yyyy", { locale: es })
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Nueva fecha de salida */}
                  <div>
                    <h4 className="text-xs sm:text-sm font-medium mb-3 sm:mb-4">Nueva Fecha de Salida</h4>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm text-muted-foreground">Nuevo check-out:</span>
                        <span className="text-xs sm:text-sm font-medium">
                          {extendStayForm.watch("newCheckoutDate")
                            ? format(extendStayForm.watch("newCheckoutDate"), "dd/MM/yyyy", { locale: es })
                            : "Seleccione fecha"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm text-muted-foreground">Noches adicionales:</span>
                        <Badge
                          variant="outline"
                          className="bg-primary/10 text-primary border-primary/20 text-xs sm:text-sm"
                        >
                          {extendStayForm.watch("newCheckoutDate") &&
                          differenceInDays(extendStayForm.watch("newCheckoutDate"), originalCheckoutDate) > 0
                            ? differenceInDays(extendStayForm.watch("newCheckoutDate"), originalCheckoutDate)
                            : 0}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <ExtendedBookingCalendar
              extendStayForm={extendStayForm}
              isDateDisabled={isDateDisabled}
              originalCheckoutDate={originalCheckoutDate}
              renderCount={renderCount}
              idReservation={reservation.id}
            />

            {/* Sección de costo */}
            <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
              <div className="p-3 sm:p-4 md:p-5 border-b border-border bg-muted/20">
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2 sm:mr-3" />
                  <h3 className="text-sm sm:text-base font-medium">Costo de la Extensión</h3>
                </div>
              </div>

              <div className="p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-xs sm:text-sm text-muted-foreground">
                        {extendStayForm.watch("newCheckoutDate") &&
                        differenceInDays(extendStayForm.watch("newCheckoutDate"), originalCheckoutDate) > 0
                          ? `${differenceInDays(extendStayForm.watch("newCheckoutDate"), originalCheckoutDate)} noches x S/${roomPrice.toFixed(2)}`
                          : "Seleccione una fecha para calcular el costo"}
                      </div>
                    </div>
                    {extendStayForm.watch("newCheckoutDate") &&
                      differenceInDays(extendStayForm.watch("newCheckoutDate"), originalCheckoutDate) > 0 && (
                        <div className="text-lg sm:text-xl md:text-2xl font-bold text-primary">
                          S/
                          {(
                            roomPrice * differenceInDays(extendStayForm.watch("newCheckoutDate"), originalCheckoutDate)
                          ).toFixed(2)}
                        </div>
                      )}
                  </div>

                  <FormField
                    control={extendStayForm.control}
                    name="discount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs sm:text-sm">Descuento (S/.)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-2 sm:pl-3 pointer-events-none">
                              <Banknote className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                            </div>
                            <Input
                              type="number"
                              min={0}
                              step={0.01}
                              className="pl-7 sm:pl-9 text-sm sm:text-base"
                              placeholder="0.00"
                              {...field}
                              value={field.value ?? 0}
                              onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {(extendStayForm.watch("discount") ?? 0) > 0 && (
                  <div className="flex justify-between items-center text-green-600 pt-2 sm:pt-3 border-t">
                    <span className="text-xs sm:text-sm font-medium">Descuento aplicado:</span>
                    <span className="text-sm sm:text-base font-semibold">
                      -S/ {(extendStayForm.watch("discount") ?? 0).toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2 sm:pt-3 border-t">
                  <span className="text-sm sm:text-base font-medium">Total a Pagar:</span>
                  <span className="text-lg sm:text-xl md:text-2xl font-bold text-primary">
                    S/{extendedStayCost.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Sección de método de pago */}
            <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
              <div className="p-3 sm:p-4 md:p-5 border-b border-border bg-muted/20">
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2 sm:mr-3" />
                  <h3 className="text-sm sm:text-base font-medium">Método de Pago</h3>
                </div>
              </div>

              <div className="p-4 sm:p-5 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                  <FormField
                    control={extendStayForm.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs sm:text-sm text-muted-foreground mb-2 block">
                          Seleccionar método
                        </FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger
                              id="payment-method-extend"
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
                              <SelectItem
                                key={`extend-${method}`}
                                value={method}
                                className="cursor-pointer hover:bg-muted"
                              >
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
                    control={extendStayForm.control}
                    name="paymentDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs sm:text-sm text-muted-foreground mb-2 block">
                          Fecha de pago
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
                  {extendStayForm.watch("paymentMethod") === PaymentDetailMethod.PENDING_PAYMENT && (
                    <div className="bg-amber-100 dark:bg-slate-800 border-amber-300 dark:border-amber-800 rounded-lg p-3 sm:p-4 shadow-sm sm:col-span-2">
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div className="bg-amber-200 dark:bg-amber-800 p-1.5 sm:p-2 rounded-full flex-shrink-0">
                          <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400 dark:text-amber-500" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-foreground">Pago Pendiente</p>
                          <p className="text-xs sm:text-sm text-muted-foreground dark:text-white mt-1">
                            El cargo se registrará como pendiente. El cliente deberá realizar el pago antes de la fecha
                            de check-out.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sección de observaciones */}
            <FormField
              control={extendStayForm.control}
              name="additionalNotes"
              render={({ field }) => (
                <FormItem className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
                  <div className="p-3 sm:p-4 md:p-5 border-b border-border bg-muted/20">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2 sm:mr-3" />
                      <FormLabel htmlFor="additional-notes-extend" className="text-sm sm:text-base font-medium m-0">
                        Observaciones
                      </FormLabel>
                    </div>
                  </div>
                  <div className="p-4 sm:p-5 md:p-6">
                    <FormControl>
                      <Textarea
                        id="additional-notes-extend"
                        placeholder="Agregue cualquier información adicional o requerimientos especiales"
                        className="min-h-[100px] sm:min-h-[120px] text-sm sm:text-base resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>

          {/* Botones de acción */}
          <div className="bg-card border-t border-border shadow-md p-3 sm:p-4 rounded-b-lg flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto text-sm sm:text-base"
              type="button"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isProcessing}
              className="w-full sm:w-auto text-sm sm:text-base bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                  <span className="text-xs sm:text-sm">Procesando...</span>
                </>
              ) : (
                <>
                  <BadgeCheck className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:text-sm">Confirmar Modificación</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </TabsContent>
  );
}
