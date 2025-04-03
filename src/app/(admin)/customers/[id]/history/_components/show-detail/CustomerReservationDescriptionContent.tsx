import { Calendar, CreditCard, Moon, User } from "lucide-react";

import { CustomerReservation } from "@/app/(admin)/customers/_types/customer";
import { reservationStatusConfig } from "@/app/(admin)/reservation/_types/reservation-enum.config";
import {
  getMethodColor,
  getMethodIcon,
  getPaymentMethodLabel,
} from "@/app/(admin)/reservation/_utils/reservationPayment.utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { calculateStayNights } from "@/utils/peru-datetime";
import { formatDate, getAmenitiesFromReservation, getAmenityIcon } from "../../_utils/customerHistory.utils";

interface CustomerReservationDescriptionContentProps {
  selectedDetailBooking: CustomerReservation;
}

export default function CustomerReservationDescriptionContent({
  selectedDetailBooking,
}: CustomerReservationDescriptionContentProps) {
  return (
    <div className="pt-2 px-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <Card className="border">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Información de la Habitación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                    <div
                      className={`rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm ${reservationStatusConfig[selectedDetailBooking.status].backgroundColor} ${reservationStatusConfig[selectedDetailBooking.status].textColor}`}
                    >
                      {selectedDetailBooking.room.number}
                    </div>
                    Habitación {selectedDetailBooking.room.number}
                  </h3>
                  <p className="text-muted-foreground capitalize">{selectedDetailBooking.room.RoomTypes.name}</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Check-in</p>
                  <p className="font-normal flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-emerald-500" />
                    {formatDate(selectedDetailBooking.checkInDate.toString())}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Check-out</p>
                  <p className="font-normal flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    {formatDate(selectedDetailBooking.checkOutDate.toString())}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Duración</p>
                  <p className="font-normal flex items-center gap-1">
                    <Moon className="h-4 w-4 text-violet-500" />
                    {calculateStayNights(
                      selectedDetailBooking.checkInDate.toString(),
                      selectedDetailBooking.checkOutDate.toString()
                    )}
                    {calculateStayNights(
                      selectedDetailBooking.checkInDate.toString(),
                      selectedDetailBooking.checkOutDate.toString()
                    ) === 1
                      ? " noche"
                      : " noches"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Huéspedes</p>
                  <p className="font-normal flex items-center gap-1">
                    <User className="h-4 w-4 text-amber-500" />
                    {selectedDetailBooking.numberGuests}{" "}
                    {selectedDetailBooking.numberGuests === 1 ? "huésped" : "huéspedes"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader>
              <CardTitle className="text-lg">Detalles Adicionales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Motivo de la estancia</p>
                <p className="bg-slate-50 dark:bg-slate-800 p-3 rounded-md font-normal">
                  {selectedDetailBooking.reason || "No especificado"}
                </p>
              </div>

              {selectedDetailBooking.observations && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Observaciones</p>
                  <p className="bg-slate-50 dark:bg-slate-800 p-3 rounded-md font-normal">
                    {selectedDetailBooking.observations}
                  </p>
                </div>
              )}

              <Separator />

              <div>
                <p className="text-sm text-muted-foreground mb-2">Servicios adicionales</p>
                <div className="flex flex-wrap gap-2">
                  {getAmenitiesFromReservation(selectedDetailBooking).length > 0 ? (
                    getAmenitiesFromReservation(selectedDetailBooking).map((amenity, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-md"
                      >
                        {getAmenityIcon(amenity)}
                        <span className="capitalize">{amenity}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No hay servicios adicionales registrados</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="border sticky top-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Resumen de pago</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>S/. {selectedDetailBooking.payment?.amount || 0}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>S/. {selectedDetailBooking.payment?.amountPaid || 0}</span>
              </div>
              <div className="pt-2">
                <p className="text-sm text-muted-foreground mb-1">Método de pago</p>
                {selectedDetailBooking.payment &&
                selectedDetailBooking.payment.paymentDetail &&
                selectedDetailBooking.payment.paymentDetail.length > 0 ? (
                  (() => {
                    const roomPaymentDetail = selectedDetailBooking.payment.paymentDetail.find(
                      (detail) => detail.type === "ROOM_RESERVATION"
                    );
                    const method = roomPaymentDetail
                      ? roomPaymentDetail.method
                      : selectedDetailBooking.payment.paymentDetail[0].method;

                    return (
                      <div
                        className={`w-fit px-3 py-2 rounded-full bg-gradient-to-r ${getMethodColor(method)} text-white flex items-center gap-2`}
                      >
                        {getMethodIcon(method)}
                        <span className="font-medium">{getPaymentMethodLabel(method)}</span>
                      </div>
                    );
                  })()
                ) : (
                  <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-md">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span>No disponible</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
