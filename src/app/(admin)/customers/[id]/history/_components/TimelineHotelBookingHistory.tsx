import React from "react";
import { Calendar, CreditCard, Loader, Moon } from "lucide-react";

import { reservationStatusConfig } from "@/app/(admin)/reservation/_types/reservation-enum.config";
import {
  getMethodColor,
  getMethodIcon,
  getPaymentMethodLabel,
} from "@/app/(admin)/reservation/_utils/reservationPayment.utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { calculateStayNights } from "@/utils/peru-datetime";
import { formatDate } from "../_utils/customerHistory.utils";
import { CustomerReservation } from "../../../_types/customer";

interface TimelineHotelBookingHistoryProps {
  setSelectedDetailBooking: React.Dispatch<React.SetStateAction<CustomerReservation | null>>;
  filteredBookings: CustomerReservation[];
  resetFilters: () => void;
}

export default function TimelineHotelBookingHistory({
  setSelectedDetailBooking,
  filteredBookings,
  resetFilters,
}: TimelineHotelBookingHistoryProps) {
  return (
    <Card className="border">
      <CardContent className="p-0">
        {filteredBookings.length > 0 ? (
          <div className="space-y-10 p-6 pt-0">
            {Object.entries(
              filteredBookings.reduce(
                (acc, booking) => {
                  const year = new Date(booking.checkInDate).getFullYear().toString();
                  if (!acc[year]) acc[year] = [];
                  acc[year].push(booking);
                  return acc;
                },
                {} as Record<string, typeof filteredBookings>
              )
            )
              .sort(([yearA], [yearB]) => yearB.localeCompare(yearA))
              .map(([year, bookings]) => (
                <div key={year} className="relative">
                  <div className="sticky top-0 z-10 py-2 mb-6">
                    <div className="flex items-center">
                      <h2 className="text-2xl font-bold">{year}</h2>
                      <Badge variant="outline" className="ml-3">
                        {bookings.length} {bookings.length === 1 ? "reserva" : "reservas"}
                      </Badge>
                    </div>
                    <Separator className="mt-2" />
                  </div>

                  <div className="space-y-6">
                    {/* Eliminar el sort() para mantener el orden del filteredBookings original */}
                    {bookings.map((booking) => (
                      <div key={booking.id} className="relative">
                        <div className="relative border-l-2 border-slate-200 dark:border-slate-700 pl-6 ml-2">
                          <div
                            className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${reservationStatusConfig[booking.status].backgroundColorIntense}`}
                            aria-hidden="true"
                          />

                          <Card className={`border`}>
                            <CardHeader>
                              <div className="flex justify-between items-start">
                                <div>
                                  <CardTitle className="flex items-center gap-2">
                                    <span>Habitación {booking.room.number}</span>
                                    <span className="text-sm font-normal text-muted-foreground capitalize">
                                      ({booking.room.RoomTypes.name})
                                    </span>
                                  </CardTitle>
                                  <CardDescription className="flex items-center gap-1 mt-1">
                                    <Calendar className="h-3.5 w-3.5" />
                                    {formatDate(booking.checkInDate.toString())} -{" "}
                                    {formatDate(booking.checkOutDate.toString())}
                                    <span className="mx-1">•</span>
                                    <Moon className="h-3.5 w-3.5" />
                                    {calculateStayNights(
                                      booking.checkInDate.toString(),
                                      booking.checkOutDate.toString()
                                    )}
                                    {calculateStayNights(
                                      booking.checkInDate.toString(),
                                      booking.checkOutDate.toString()
                                    ) === 1
                                      ? " noche"
                                      : " noches"}
                                  </CardDescription>
                                </div>
                                <Badge
                                  variant="outline"
                                  className={`capitalize flex items-center gap-1 ${reservationStatusConfig[booking.status].borderColor} ${reservationStatusConfig[booking.status].backgroundColor} ${reservationStatusConfig[booking.status].textColor}`}
                                >
                                  {React.createElement(reservationStatusConfig[booking.status].icon, {
                                    className: "h-3.5 w-3.5",
                                  })}
                                  <span>{reservationStatusConfig[booking.status].name}</span>
                                </Badge>
                              </div>
                            </CardHeader>

                            <CardContent>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-muted-foreground">Huéspedes</p>
                                  <p className="font-medium">{booking.numberGuests}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Método de pago</p>
                                  {booking.payment &&
                                  booking.payment.paymentDetail &&
                                  booking.payment.paymentDetail.length > 0 ? (
                                    (() => {
                                      const roomPaymentDetail = booking.payment.paymentDetail.find(
                                        (detail) => detail.type === "ROOM_RESERVATION"
                                      );
                                      const method = roomPaymentDetail
                                        ? roomPaymentDetail.method
                                        : booking.payment.paymentDetail[0].method;

                                      return (
                                        <div
                                          className={`mt-1 w-fit inline-flex px-2 py-1 rounded-full bg-gradient-to-r ${getMethodColor(method)} text-white text-xs items-center gap-1`}
                                        >
                                          {getMethodIcon(method)}
                                          <span className="font-medium">{getPaymentMethodLabel(method)}</span>
                                        </div>
                                      );
                                    })()
                                  ) : (
                                    <div className="mt-1 w-fit inline-flex px-2 py-1 rounded-full bg-gradient-to-r from-gray-500 to-gray-600 text-white text-xs items-center gap-1">
                                      <CreditCard className="h-3.5 w-3.5" />
                                      <span className="font-medium">No disponible</span>
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Total</p>
                                  <p className="font-medium">
                                    {booking.payment && booking.payment.amountPaid !== undefined
                                      ? `S/. ${booking.payment.amountPaid}`
                                      : "Pago pendiente"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Motivo</p>
                                  <p className="font-medium line-clamp-1">{booking.reason || "No especificado"}</p>
                                </div>
                              </div>

                              {booking.observations && (
                                <div className="mt-4 pt-4 border-t dark:border-slate-700">
                                  <p className="text-muted-foreground text-sm">Observaciones</p>
                                  <p className="text-sm">{booking.observations}</p>
                                </div>
                              )}
                            </CardContent>

                            <CardFooter className="flex justify-end ">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedDetailBooking(booking);
                                }}
                              >
                                Ver detalles
                              </Button>
                            </CardFooter>
                          </Card>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center p-10">
            <div className="text-center">
              <div className="bg-slate-100 dark:bg-slate-800 rounded-full p-4 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                <Loader className="h-6 w-6 text-muted-foreground animate-spin" />
              </div>
              <p className="text-muted-foreground">No se encontraron reservas que coincidan con tus criterios</p>
              <Button variant="outline" className="mt-4" onClick={resetFilters}>
                Limpiar filtros
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
