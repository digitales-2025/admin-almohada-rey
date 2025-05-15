"use client";

import { useEffect, useState } from "react";
import { addDays, differenceInDays, format, isBefore, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import {
  AlertCircle,
  BadgeCheck,
  Banknote,
  Bed,
  Calendar,
  CalendarPlus,
  Clock,
  CreditCard,
  CreditCardIcon,
  DollarSign,
  FileText,
  Info,
  Loader2,
  Receipt,
  RefreshCw,
  Smartphone,
  User,
} from "lucide-react";

import { CustomerDocumentType } from "@/app/(admin)/customers/_types/customer";
import { PaymentDetailMethod } from "@/app/(admin)/payments/_types/payment";
import { getRoomTypeKey, RoomTypeLabels } from "@/app/(admin)/rooms/list/_utils/rooms.utils";
import { CalendarBig } from "@/components/form/CalendarBig";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { TimeInput } from "@/components/ui/time-input";
import { cn } from "@/lib/utils";
import { DEFAULT_CHECKOUT_TIME } from "@/utils/peru-datetime";
import { DetailedReservation } from "../../_schemas/reservation.schemas";
import { getDocumentTypeConfig } from "../../_types/document-type.enum.config";

interface ExtensionReservationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservation: DetailedReservation;
}

export function ExtensionReservationDialog({ open, onOpenChange, reservation }: ExtensionReservationDialogProps) {
  const [selectedTab, setSelectedTab] = useState<"late-checkout" | "extend-stay">("late-checkout");
  const [lateCheckoutTime, setLateCheckoutTime] = useState(DEFAULT_CHECKOUT_TIME.split(" ")[0]);
  const [newCheckoutDate, setNewCheckoutDate] = useState<Date | undefined>(
    reservation.checkOutDate ? addDays(parseISO(reservation.checkOutDate), 1) : undefined
  );
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [renderCount, setRenderCount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentDetailMethod>(PaymentDetailMethod.CASH);
  const [paymentDate, setPaymentDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [isProcessing, setIsProcessing] = useState(false);

  const originalCheckoutDate = reservation.checkOutDate ? parseISO(reservation.checkOutDate) : new Date();

  const roomPrice = reservation.room.RoomTypes.price;

  // Calculate costs
  const lateCheckoutCost = roomPrice / 2;
  const extendedStayCost = newCheckoutDate ? roomPrice * differenceInDays(newCheckoutDate, originalCheckoutDate) : 0;

  // Increment render count when tab changes to force calendar re-render
  useEffect(() => {
    setRenderCount((prev) => prev + 1);
  }, [selectedTab]);

  // Function to handle time change from TimeInput
  const handleLateCheckoutTimeChange = (timeStr: string) => {
    setLateCheckoutTime(timeStr);
  };

  // Function to disable dates before checkout date
  const isDateDisabled = (date: Date) => {
    return isBefore(date, originalCheckoutDate) || isBefore(date, new Date());
  };

  const getPaymentMethodIcon = (method: PaymentDetailMethod) => {
    switch (method) {
      case PaymentDetailMethod.CASH:
        return <Banknote className="h-4 w-4" />;
      case PaymentDetailMethod.CREDIT_CARD:
        return <CreditCardIcon className="h-4 w-4" />;
      case PaymentDetailMethod.DEBIT_CARD:
        return <CreditCardIcon className="h-4 w-4" />;
      case PaymentDetailMethod.TRANSFER:
        return <RefreshCw className="h-4 w-4" />;
      case PaymentDetailMethod.YAPE:
      case PaymentDetailMethod.PLIN:
        return <Smartphone className="h-4 w-4" />;
      case PaymentDetailMethod.PAYPAL:
      case PaymentDetailMethod.IZI_PAY:
        return <DollarSign className="h-4 w-4" />;
      case PaymentDetailMethod.PENDING_PAYMENT:
        return <Clock className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const getPaymentMethodLabel = (method: PaymentDetailMethod) => {
    switch (method) {
      case PaymentDetailMethod.CASH:
        return "Efectivo";
      case PaymentDetailMethod.CREDIT_CARD:
        return "Tarjeta de Crédito";
      case PaymentDetailMethod.DEBIT_CARD:
        return "Tarjeta de Débito";
      case PaymentDetailMethod.TRANSFER:
        return "Transferencia";
      case PaymentDetailMethod.YAPE:
        return "Yape";
      case PaymentDetailMethod.PLIN:
        return "Plin";
      case PaymentDetailMethod.PAYPAL:
        return "PayPal";
      case PaymentDetailMethod.IZI_PAY:
        return "iziPay";
      case PaymentDetailMethod.PENDING_PAYMENT:
        return "Pago Pendiente";
      default:
        return method;
    }
  };

  const handleSubmit = () => {
    setIsProcessing(true);

    // Simulación de procesamiento
    setTimeout(() => {
      setIsProcessing(false);
      onOpenChange(false);
    }, 800);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[950px] p-0 overflow-hidden rounded-md max-h-[90vh] overflow-y-auto">
        <div className="flex flex-col md:flex-row h-full">
          {/* Panel lateral con información de la reserva */}
          <div className="md:w-[280px] bg-primary/30 p-5">
            <div className="mb-6">
              <h2 className="text-lg font-bold flex items-center">
                <Receipt className="mr-2 h-5 w-5" />
                Modificar Reserva
              </h2>
            </div>

            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <User className="mr-2 h-4 w-4" /> Cliente
                </h3>
                <div className="bg-primary/25 rounded-md p-3">
                  <p className="font-medium capitalize text-sm mb-1">{reservation.customer.name}</p>
                  {reservation.customer.documentType && (
                    <div className="flex items-center gap-1 text-sm">
                      {(() => {
                        const docConfig = getDocumentTypeConfig(
                          reservation.customer.documentType as CustomerDocumentType
                        );
                        const DocIcon = docConfig.icon;
                        return (
                          <Badge
                            className={cn(
                              docConfig.backgroundColor,
                              docConfig.textColor,
                              docConfig.hoverBgColor,
                              "flex gap-1 items-center border-none"
                            )}
                          >
                            <DocIcon className="size-3" />
                            <span>{docConfig.name}:</span>
                          </Badge>
                        );
                      })()}
                      <span className="text-slate-100">{reservation.customer.documentNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  {(() => {
                    // Obtener el mismo icono que se usa en el contenido
                    const roomTypeName = reservation.room.RoomTypes.name;
                    const typeKey = getRoomTypeKey(roomTypeName);
                    const config = RoomTypeLabels[typeKey];
                    const Icon = config.icon;

                    return <Icon className={`mr-2 h-4 w-4 ${config.className}`} strokeWidth={1.5} aria-hidden="true" />;
                  })()}
                  Habitación
                </h3>
                <div className="bg-primary/25 rounded-md p-3">
                  {(() => {
                    // Obtener el tipo de habitación y configurar el icono/color correspondiente
                    const roomTypeName = reservation.room.RoomTypes.name;
                    const typeKey = getRoomTypeKey(roomTypeName);
                    const config = RoomTypeLabels[typeKey];

                    return (
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col">
                          <p className="font-medium text-sm capitalize">
                            {config.label} Habitación #{reservation.room.number}
                          </p>
                          <div className="flex justify-between items-center gap-1 text-sm">
                            <span className="text-sm">Capacidad:</span>
                            <span className="text-sm text-slate-100">
                              {reservation.room.RoomTypes.guests || 2} personas
                            </span>
                          </div>
                          <div className="flex justify-between items-center gap-1 text-sm">
                            <span className="text-sm">Tarifa:</span>
                            <span className="text-sm text-slate-100">
                              S/{reservation.room.RoomTypes.price.toFixed(2)}/noche
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <Calendar className="mr-2 h-4 w-4" /> Fechas Actuales
                </h3>
                <div className="bg-primary/25 rounded-md p-3">
                  <div className="flex flex-row justify-between items-center gap-2">
                    <span className="text-sm">Check-in:</span>
                    <span className="text-sm text-slate-100">
                      {reservation.checkInDate
                        ? format(parseISO(reservation.checkInDate), "dd/MM/yyyy", { locale: es })
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Check-out:</span>
                    <span className="text-sm text-slate-100">
                      {reservation.checkOutDate
                        ? format(parseISO(reservation.checkOutDate), "dd/MM/yyyy", { locale: es })
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="flex-1">
            <div className="bg-card border-b sticky top-0 z-10">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-bold flex items-center">
                  <span className="p-1.5 rounded-md mr-2">
                    {selectedTab === "late-checkout" ? (
                      <Clock className="h-5 w-5" />
                    ) : (
                      <CalendarPlus className="h-5 w-5" />
                    )}
                  </span>
                  {selectedTab === "late-checkout" ? "Late Checkout" : "Extender Estadía"}
                </h2>
                <div className="flex items-center space-x-2">
                  <Badge className="border-0">
                    {selectedTab === "late-checkout" ? "50% tarifa" : "Tarifa completa"}
                  </Badge>
                </div>
              </div>

              <Tabs
                value={selectedTab}
                onValueChange={(v) => setSelectedTab(v as "late-checkout" | "extend-stay")}
                className="w-full"
              >
                <TabsList className="grid grid-cols-2 w-full rounded-none h-auto p-0">
                  <TabsTrigger
                    value="late-checkout"
                    className="py-3 rounded-none data-[state=active]:bg-white data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                  >
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      <span>Late Checkout</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="extend-stay"
                    className="py-3 rounded-none data-[state=active]:bg-white data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                  >
                    <div className="flex items-center">
                      <Bed className="mr-2 h-4 w-4" />
                      <span>Extender Estadía</span>
                    </div>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="late-checkout" className="p-0 m-0">
                  <div className="p-4 space-y-4">
                    <div className="border border-input bg-input rounded-md p-3 flex items-center">
                      <Info className="h-5 w-5 mr-2 flex-shrink-0" />
                      <p className="text-sm">
                        El late checkout permite al huésped permanecer en la habitación después de la hora estándar de
                        salida (12:00) por un cargo adicional del 50% de la tarifa diaria.
                      </p>
                    </div>

                    <div className="grid md:grid-cols-1 gap-4">
                      <div className="bg-white border rounded-md p-4">
                        <h3 className="font-medium mb-3 flex items-center">
                          <Clock className="mr-2 h-4 w-4" />
                          Late Checkout
                        </h3>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Fecha:</span>
                            <span className="font-medium">
                              {reservation.checkOutDate
                                ? format(parseISO(reservation.checkOutDate), "dd/MM/yyyy", { locale: es })
                                : "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Hora:</span>
                            <div>
                              <TimeInput
                                id="late-checkout-time"
                                value={lateCheckoutTime}
                                onTimeChange={handleLateCheckoutTimeChange}
                                min="12:00"
                                max="18:00"
                              />
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Horario de Lima (GMT-5)</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 border rounded-md p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <DollarSign className="h-5 w-5 text-gray-500 mr-2" />
                          <span className="font-medium">Costo del Late Checkout</span>
                        </div>
                        <div className="text-lg font-bold">S/{lateCheckoutCost.toFixed(2)}</div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">50% de la tarifa diaria (S/{roomPrice.toFixed(2)})</p>
                    </div>

                    {/* Sección de pago para Late Checkout */}
                    <div className="bg-white border rounded-md shadow-sm mt-6">
                      <div className="p-4 border-b bg-gray-50">
                        <h3 className="font-medium flex items-center text-gray-800">
                          <CreditCard className="mr-2 h-5 w-5 text-blue-500" />
                          Detalles de Pago - Late Checkout
                        </h3>
                      </div>

                      <div className="p-4">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="payment-method-late" className="block mb-2 font-medium">
                              Método de Pago
                            </Label>
                            <Select
                              value={paymentMethod}
                              onValueChange={(value) => setPaymentMethod(value as PaymentDetailMethod)}
                            >
                              <SelectTrigger id="payment-method-late" className="w-full bg-white">
                                <SelectValue>
                                  <div className="flex items-center">
                                    {getPaymentMethodIcon(paymentMethod)}
                                    <span className="ml-2">{getPaymentMethodLabel(paymentMethod)}</span>
                                  </div>
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {Object.values(PaymentDetailMethod).map((method) => (
                                  <SelectItem
                                    key={`late-${method}`}
                                    value={method}
                                    className="cursor-pointer hover:bg-gray-100"
                                  >
                                    <div className="flex items-center">
                                      {getPaymentMethodIcon(method as PaymentDetailMethod)}
                                      <span className="ml-2">
                                        {getPaymentMethodLabel(method as PaymentDetailMethod)}
                                      </span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {paymentMethod !== PaymentDetailMethod.PENDING_PAYMENT && (
                            <div>
                              <Label htmlFor="payment-date-late" className="block mb-2">
                                Fecha de Pago
                              </Label>
                              <input
                                id="payment-date-late"
                                type="date"
                                value={paymentDate}
                                onChange={(e) => setPaymentDate(e.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          )}

                          {paymentMethod === PaymentDetailMethod.PENDING_PAYMENT && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                              <div className="flex items-start">
                                <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-sm text-yellow-700 font-medium">Pago Pendiente</p>
                                  <p className="text-sm text-yellow-600 mt-1">
                                    El cargo se registrará como pendiente. El cliente deberá realizar el pago antes de
                                    la fecha de check-out.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="bg-blue-50 rounded-md p-4 border border-blue-100">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-blue-800">Total a Pagar:</span>
                              <span className="text-xl font-bold text-blue-800">S/{lateCheckoutCost.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border rounded-md p-4">
                      <Label htmlFor="additional-notes-late" className="mb-2 font-medium flex items-center">
                        <FileText className="mr-2 h-4 w-4 text-gray-500" />
                        Observaciones Adicionales
                      </Label>
                      <Textarea
                        id="additional-notes-late"
                        placeholder="Agregue cualquier información adicional o requerimientos especiales"
                        value={additionalNotes}
                        onChange={(e) => setAdditionalNotes(e.target.value)}
                        className="min-h-[80px] border-gray-300"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="extend-stay" className="p-0 m-0">
                  <div className="p-4 space-y-4">
                    <div className="bg-blue-50 border border-blue-100 rounded-md p-3 flex items-center">
                      <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                      <p className="text-sm text-blue-700">
                        La extensión de estadía permite al huésped prolongar su reserva por noches adicionales,
                        manteniendo la misma habitación y tarifa.
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-white border rounded-md p-4">
                        <h3 className="font-medium mb-3 flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                          Fechas Actuales
                        </h3>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Check-in:</span>
                            <span className="font-medium">
                              {reservation.checkInDate
                                ? format(parseISO(reservation.checkInDate), "dd/MM/yyyy", { locale: es })
                                : "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Check-out:</span>
                            <span className="font-medium">
                              {reservation.checkOutDate
                                ? format(parseISO(reservation.checkOutDate), "dd/MM/yyyy", { locale: es })
                                : "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white border rounded-md p-4">
                        <h3 className="font-medium mb-3 flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-blue-500" />
                          Nueva Fecha de Salida
                        </h3>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Nuevo check-out:</span>
                            <span className="font-medium">
                              {newCheckoutDate
                                ? format(newCheckoutDate, "dd/MM/yyyy", { locale: es })
                                : "Seleccione fecha"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Noches adicionales:</span>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {newCheckoutDate && differenceInDays(newCheckoutDate, originalCheckoutDate) > 0
                                ? differenceInDays(newCheckoutDate, originalCheckoutDate)
                                : 0}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border rounded-md p-4">
                      <h3 className="font-medium mb-3 text-center">Seleccione Nueva Fecha de Salida</h3>
                      <div className="flex justify-center">
                        <CalendarBig
                          key={`extend-stay-calendar-${renderCount}`}
                          locale={es}
                          mode="single"
                          selected={newCheckoutDate}
                          onSelect={setNewCheckoutDate}
                          disabled={(date) => isDateDisabled(date)}
                          defaultMonth={newCheckoutDate || addDays(originalCheckoutDate, 1)}
                          className="rounded-md border"
                        />
                      </div>
                      <p className="text-sm text-center mt-2">
                        {newCheckoutDate
                          ? format(newCheckoutDate, "EEEE, d 'de' MMMM, yyyy", { locale: es })
                          : "Seleccione una fecha"}
                      </p>
                      <p className="text-xs text-gray-500 text-center mt-1">Horario de Lima (GMT-5)</p>
                    </div>

                    <div className="bg-gray-50 border rounded-md p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <DollarSign className="h-5 w-5 text-gray-500 mr-2" />
                          <span className="font-medium">Costo de la Extensión</span>
                        </div>
                        <div className="text-lg font-bold">S/{extendedStayCost.toFixed(2)}</div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {newCheckoutDate && differenceInDays(newCheckoutDate, originalCheckoutDate) > 0
                          ? `${differenceInDays(newCheckoutDate, originalCheckoutDate)} noches x S/${roomPrice.toFixed(2)}`
                          : "Seleccione una fecha para calcular el costo"}
                      </p>
                    </div>

                    {/* Sección de pago para Extender Estadía */}
                    <div className="bg-white border rounded-md shadow-sm mt-6">
                      <div className="p-4 border-b bg-gray-50">
                        <h3 className="font-medium flex items-center text-gray-800">
                          <CreditCard className="mr-2 h-5 w-5 text-blue-500" />
                          Detalles de Pago - Extensión de Estadía
                        </h3>
                      </div>

                      <div className="p-4">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="payment-method-extend" className="block mb-2 font-medium">
                              Método de Pago
                            </Label>
                            <Select
                              value={paymentMethod}
                              onValueChange={(value) => setPaymentMethod(value as PaymentDetailMethod)}
                            >
                              <SelectTrigger id="payment-method-extend" className="w-full bg-white">
                                <SelectValue>
                                  <div className="flex items-center">
                                    {getPaymentMethodIcon(paymentMethod)}
                                    <span className="ml-2">{getPaymentMethodLabel(paymentMethod)}</span>
                                  </div>
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {Object.values(PaymentDetailMethod).map((method) => (
                                  <SelectItem
                                    key={`extend-${method}`}
                                    value={method}
                                    className="cursor-pointer hover:bg-gray-100"
                                  >
                                    <div className="flex items-center">
                                      {getPaymentMethodIcon(method as PaymentDetailMethod)}
                                      <span className="ml-2">
                                        {getPaymentMethodLabel(method as PaymentDetailMethod)}
                                      </span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {paymentMethod !== PaymentDetailMethod.PENDING_PAYMENT && (
                            <div>
                              <Label htmlFor="payment-date-extend" className="block mb-2">
                                Fecha de Pago
                              </Label>
                              <input
                                id="payment-date-extend"
                                type="date"
                                value={paymentDate}
                                onChange={(e) => setPaymentDate(e.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          )}

                          {paymentMethod === PaymentDetailMethod.PENDING_PAYMENT && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                              <div className="flex items-start">
                                <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-sm text-yellow-700 font-medium">Pago Pendiente</p>
                                  <p className="text-sm text-yellow-600 mt-1">
                                    El cargo se registrará como pendiente. El cliente deberá realizar el pago antes de
                                    la fecha de check-out.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="bg-blue-50 rounded-md p-4 border border-blue-100">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-blue-800">Total a Pagar:</span>
                              <span className="text-xl font-bold text-blue-800">S/{extendedStayCost.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border rounded-md p-4">
                      <Label htmlFor="additional-notes-extend" className="mb-2 font-medium flex items-center">
                        <FileText className="mr-2 h-4 w-4 text-gray-500" />
                        Observaciones Adicionales
                      </Label>
                      <Textarea
                        id="additional-notes-extend"
                        placeholder="Agregue cualquier información adicional o requerimientos especiales"
                        value={additionalNotes}
                        onChange={(e) => setAdditionalNotes(e.target.value)}
                        className="min-h-[80px] border-gray-300"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="p-4 border-t bg-gray-50 sticky bottom-0 z-10">
              <div className="flex flex-col sm:flex-row items-center gap-3 justify-end">
                <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
                  Cancelar
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isProcessing}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
