import React from "react";
import { Calendar, CreditCard, Loader, Moon, User } from "lucide-react";

import { reservationStatusConfig } from "@/app/(admin)/reservation/_types/reservation-enum.config";
import {
  getMethodColor,
  getMethodIcon,
  getPaymentMethodLabel,
} from "@/app/(admin)/reservation/_utils/reservationPayment.utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { calculateStayNights } from "@/utils/peru-datetime";
import { formatDate, getAmenitiesFromReservation, getAmenityIcon } from "../_utils/customerHistory.utils";
import { CustomerReservation } from "../../../_types/customer";

interface CardsViewHotelBookingHistoryProps {
  setSelectedDetailBooking: React.Dispatch<React.SetStateAction<CustomerReservation | null>>;
  filteredBookings: CustomerReservation[];
  resetFilters: () => void;
}

export default function CardsViewHotelBookingHistory({
  setSelectedDetailBooking,
  filteredBookings,
  resetFilters,
}: CardsViewHotelBookingHistoryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredBookings.length > 0 ? (
        filteredBookings.map((booking) => (
          <Card key={booking.id} className="group overflow-hidden border p-0">
            {/* Status indicator */}
            <div className={`h-1 w-full ${reservationStatusConfig[booking.status].backgroundColorIntense}`} />

            {/* Card Header */}
            <div className="p-5 pb-0 pt-3">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg ${reservationStatusConfig[booking.status].backgroundColor} ${reservationStatusConfig[booking.status].textColor}`}
                  >
                    {booking.room.number}
                  </div>
                  <div>
                    <h3 className="font-semibold capitalize">{booking.room.RoomTypes.name}</h3>
                    <p className="text-sm text-muted-foreground">Habitación {booking.room.number}</p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={`capitalize flex items-center gap-1 ${reservationStatusConfig[booking.status].borderColor} ${reservationStatusConfig[booking.status].backgroundColor} ${reservationStatusConfig[booking.status].textColor}`}
                >
                  {React.createElement(reservationStatusConfig[booking.status].icon, { className: "h-3.5 w-3.5" })}
                  <span>{reservationStatusConfig[booking.status].name}</span>
                </Badge>
              </div>

              <div className="flex justify-between items-center mt-3">
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <Moon className="h-3.5 w-3.5" />
                  {calculateStayNights(booking.checkInDate.toString(), booking.checkOutDate.toString())}
                  {calculateStayNights(booking.checkInDate.toString(), booking.checkOutDate.toString()) === 1
                    ? " noche"
                    : " noches"}
                </div>
                <div className="font-bold text-lg">S/. {booking.payment.amountPaid}</div>
              </div>
            </div>

            <Separator />

            {/* Fechas */}
            <div className="p-5 pb-0 pt-3">
              <div className="bg-slate-50  dark:bg-slate-800 rounded-lg p-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Check-in</p>
                    <p className="font-medium flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-emerald-500" />
                      {formatDate(booking.checkInDate.toString())}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Check-out</p>
                    <p className="font-medium flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-500" />
                      {formatDate(booking.checkOutDate.toString())}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Información adicional */}
            <div className="px-5">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {booking.numberGuests} {booking.numberGuests === 1 ? "huésped" : "huéspedes"}
                  </span>
                </div>

                <div className="flex gap-1">
                  {getAmenitiesFromReservation(booking)
                    .slice(0, 3)
                    .map((amenity, index) => (
                      <TooltipProvider key={index}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="p-1.5 bg-slate-100 dark:bg-slate-700 rounded-full">
                              {getAmenityIcon(amenity)}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="capitalize">{amenity}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  {getAmenitiesFromReservation(booking).length > 3 && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="p-1 bg-slate-100 rounded-full text-xs flex items-center justify-center w-7 h-7">
                            +{getAmenitiesFromReservation(booking).length - 3}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-xs">
                            {getAmenitiesFromReservation(booking)
                              .slice(3)
                              .map((amenity) => (
                                <p key={amenity} className="capitalize">
                                  {amenity}
                                </p>
                              ))}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </div>

              {booking.observations && (
                <div className="mt-3 text-xs text-muted-foreground line-clamp-2 bg-slate-50 dark:bg-slate-800 p-2 rounded-md">
                  <span className="font-medium">Observaciones:</span> {booking.observations}
                </div>
              )}
            </div>

            <Separator />

            {/* Pie de tarjeta */}
            <div className="p-3 flex justify-between items-center bg-gradient-to-r dark:from-slate-800 dark:to-slate-800">
              <div className="text-sm flex items-center gap-1">
                {booking.payment && booking.payment.paymentDetail && booking.payment.paymentDetail.length > 0 ? (
                  (() => {
                    const roomPaymentDetail = booking.payment.paymentDetail.find(
                      (detail) => detail.type === "ROOM_RESERVATION"
                    );
                    const method = roomPaymentDetail
                      ? roomPaymentDetail.method
                      : booking.payment.paymentDetail[0].method;

                    return (
                      <div
                        className={`px-2 py-1 rounded-full bg-gradient-to-r ${getMethodColor(method)} text-white flex items-center gap-1`}
                      >
                        {getMethodIcon(method)}
                        <span className="text-xs font-medium">{getPaymentMethodLabel(method)}</span>
                      </div>
                    );
                  })()
                ) : (
                  <div className="px-2 py-1 rounded-full bg-gradient-to-r from-gray-500 to-gray-600 text-white flex items-center gap-1">
                    <CreditCard className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium">No disponible</span>
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 group-hover:bg-slate-100 dark:group-hover:bg-slate-700"
                onClick={() => setSelectedDetailBooking(booking)}
              >
                Ver detalles
              </Button>
            </div>
          </Card>
        ))
      ) : (
        <div className="col-span-full flex items-center justify-center h-64">
          <div className="text-center">
            <div className="bg-slate-100 rounded-full p-4 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
              <Loader className="h-8 w-8 text-muted-foreground animate-spin" />
            </div>
            <p className="text-muted-foreground">No se encontraron reservas que coincidan con tus criterios</p>
            <Button variant="outline" className="mt-4" onClick={resetFilters}>
              Limpiar filtros
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
