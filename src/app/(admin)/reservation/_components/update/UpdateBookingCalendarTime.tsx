"use client";

import { useEffect, useState } from "react";
import {
  addDays,
  format,
  isBefore,
  isSameDay,
  startOfDay,
  // startOfToday,
  //   isToday,
  //   endOfMonth,
  //   startOfMonth,
  //   subDays,
} from "date-fns";
import { es } from "date-fns/locale";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { CalendarBig } from "@/components/form/CalendarBig";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  DEFAULT_CHECKIN_TIME,
  DEFAULT_CHECKOUT_TIME,
  formDateToPeruISO,
  getPeruStartOfToday,
  getTimeOptionsForDay,
  isoToPeruTimeString,
  peruDateTimeToUTC,
} from "@/utils/peru-datetime";
import { processError } from "@/utils/process-error";
import { useRoomAvailabilityForUpdate } from "../../_hooks/use-roomAvailability";
import { DetailedReservation, UpdateReservationInput } from "../../_schemas/reservation.schemas";

export type BookingFormData = {
  checkInDate: string;
  checkOutDate: string;
  roomId?: string;
};

interface UpdateBookingCalendarTimeProps {
  form: UseFormReturn<UpdateReservationInput>;
  roomId?: string;
  onRoomAvailabilityChange?: (available: boolean) => void;
  reservation: DetailedReservation;
  // isOriginalInterval: boolean;
  // originalRoom: DetailedRoom;
}

export default function UpdateBookingCalendarTime({
  form,
  roomId,
  onRoomAvailabilityChange,
  reservation,
  // isOriginalInterval,
  // originalRoom,
}: UpdateBookingCalendarTimeProps) {
  const [activeTab, setActiveTab] = useState<"checkin" | "checkout">("checkin");

  // Estados para manejar selección de fecha y hora
  const [selectedCheckInDate, setSelectedCheckInDate] = useState<Date>(new Date(reservation.checkInDate));
  const [selectedCheckOutDate, setSelectedCheckOutDate] = useState<Date>(new Date(reservation.checkOutDate));
  const [selectedCheckInTime, setSelectedCheckInTime] = useState<string>(
    reservation.checkInDate ? isoToPeruTimeString(reservation.checkInDate) : DEFAULT_CHECKIN_TIME
  );
  const [selectedCheckOutTime, setSelectedCheckOutTime] = useState<string>(
    reservation.checkOutDate ? isoToPeruTimeString(reservation.checkOutDate) : DEFAULT_CHECKOUT_TIME
  );

  // Obtener valores actuales del formulario
  const checkInDate = form.watch("checkInDate");
  const checkOutDate = form.watch("checkOutDate");

  // Hook personalizado para verificar disponibilidad de habitación
  const { isAvailable, isLoading, checkAvailability, isError, error } = useRoomAvailabilityForUpdate({
    reservationId: reservation.id,
    checkInDate: reservation.checkInDate,
    checkOutDate: reservation.checkOutDate,
    roomId: reservation.roomId,
  });
  // if (isAvailable){
  //   toast.success("Habitación disponible para estas fechas");
  // }

  // O ajusta así para que no fuerce los estados si ya están cambiados:
  useEffect(() => {
    if (!checkInDate) {
      form.setValue("checkInDate", reservation.checkInDate);
      setSelectedCheckInDate(new Date(reservation.checkInDate));
    }
    if (!checkOutDate) {
      form.setValue("checkOutDate", reservation.checkOutDate);
      setSelectedCheckOutDate(new Date(reservation.checkOutDate));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reservation]);

  // Efecto para verificar disponibilidad cuando cambia la selección
  useEffect(() => {
    if (roomId && selectedCheckInDate && selectedCheckOutDate) {
      const formattedCheckIn = format(selectedCheckInDate, "yyyy-MM-dd");
      const formattedCheckOut = format(selectedCheckOutDate, "yyyy-MM-dd");

      // Convertir a formato ISO con zona horaria de Perú
      const checkInISO = peruDateTimeToUTC(formattedCheckIn, selectedCheckInTime);
      const checkOutISO = peruDateTimeToUTC(formattedCheckOut, selectedCheckOutTime);

      // Validacion de disponibilidad, no considerando si se escoge la misma fecha y el mismo room Id
      // if (isOriginalInterval && roomId) {
      //   if (roomId !== originalRoom.id) {
      //     // Verificar disponibilidad
      //     checkAvailability({
      //       roomId,
      //       checkInDate: checkInISO,
      //       checkOutDate: checkOutISO,
      //     });
      //   }
      // } else {
      //   // Verificar disponibilidad
      //   checkAvailability({
      //     roomId,
      //     checkInDate: checkInISO,
      //     checkOutDate: checkOutISO,
      //   });
      // }

      checkAvailability({
        roomId,
        checkInDate: checkInISO,
        checkOutDate: checkOutISO,
        reservationId: reservation.id,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, selectedCheckInDate, selectedCheckOutDate, selectedCheckInTime, selectedCheckOutTime]);

  // Notificar al componente padre sobre cambios en la disponibilidad
  useEffect(() => {
    if (onRoomAvailabilityChange) {
      onRoomAvailabilityChange(isAvailable);
    }
  }, [isAvailable, onRoomAvailabilityChange]);

  // Handler para cuando cambia la fecha de check-in
  const handleCheckInDateChange = (date: Date | undefined) => {
    if (!date) return;

    setSelectedCheckInDate(date);

    // Si la fecha de check-out es anterior o el mismo dia a la nueva fecha de check-in, ajustarla
    if (selectedCheckOutDate <= date || isSameDay(selectedCheckOutDate, date)) {
      const newCheckOutDate = addDays(date, 1);
      setSelectedCheckOutDate(newCheckOutDate);

      // Actualizar el formulario con la nueva fecha de check-out
      const checkOutISO = formDateToPeruISO(
        format(newCheckOutDate, "yyyy-MM-dd"),
        false,
        DEFAULT_CHECKIN_TIME,
        selectedCheckOutTime
      );

      form.setValue("checkOutDate", checkOutISO, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }

    // Actualizar el formulario con la nueva fecha de check-in
    const checkInISO = formDateToPeruISO(format(date, "yyyy-MM-dd"), true, selectedCheckInTime, DEFAULT_CHECKOUT_TIME);

    form.setValue("checkInDate", checkInISO, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  // Handler para cuando cambia la fecha de check-out
  const handleCheckOutDateChange = (date: Date | undefined) => {
    if (!date) return;

    setSelectedCheckOutDate(date);

    // Actualizar el formulario con la nueva fecha de check-out
    const checkOutISO = formDateToPeruISO(
      format(date, "yyyy-MM-dd"),
      false,
      DEFAULT_CHECKIN_TIME,
      selectedCheckOutTime
    );

    form.setValue("checkOutDate", checkOutISO, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  // Handler para cuando cambia la hora de check-in
  const handleCheckInTimeChange = (timeStr: string) => {
    setSelectedCheckInTime(timeStr);

    // Actualizar el formulario con la nueva hora de check-in
    const checkInISO = formDateToPeruISO(
      format(selectedCheckInDate, "yyyy-MM-dd"),
      true,
      timeStr,
      DEFAULT_CHECKOUT_TIME
    );

    form.setValue("checkInDate", checkInISO, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  // Handler para cuando cambia la hora de check-out
  const handleCheckOutTimeChange = (timeStr: string) => {
    setSelectedCheckOutTime(timeStr);

    // Actualizar el formulario con la nueva hora de check-out
    const checkOutISO = formDateToPeruISO(
      format(selectedCheckOutDate, "yyyy-MM-dd"),
      false,
      DEFAULT_CHECKIN_TIME,
      timeStr
    );

    form.setValue("checkOutDate", checkOutISO, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  // Función para verificar si una fecha debe estar deshabilitada
  const isDateDisabled = (date: Date, isCheckIn: boolean) => {
    const today = getPeruStartOfToday();

    // Para check-in, solo deshabilitar fechas pasadas y la de hoy
    if (isCheckIn) {
      return isBefore(startOfDay(date), today) || isSameDay(startOfDay(date), today);
    }

    // Para check-out, deshabilitar fechas anteriores o iguales a check-in
    return isBefore(startOfDay(date), startOfDay(selectedCheckInDate)) || isSameDay(date, selectedCheckInDate);
  };

  // Obtener las opciones de hora para check-in y check-out
  const checkInTimes = getTimeOptionsForDay("checkin");
  const checkOutTimes = getTimeOptionsForDay("checkout");

  if (isError) {
    const processedError = processError(error);

    toast.error(`Ocurrió un error al verificar la disponibilidad de la habitación: ${processedError}`);
  }

  return (
    <div className="w-full space-y-4">
      <Tabs
        defaultValue="checkin"
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "checkin" | "checkout")}
        className="w-full"
      >
        <div className="w-full flex justify-center">
          <TabsList className="grid grid-cols-2 !mb-4">
            <TabsTrigger value="checkin">Check-in</TabsTrigger>
            <TabsTrigger value="checkout">Check-out</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="checkin" className="space-y-4">
          <div className="w-auto space-x-10 flex-wrap flex items-start h-fit">
            <div className="space-y-4">
              <h3 className="font-semibold">Fecha de Check-in</h3>
              <CalendarBig
                locale={es}
                selected={selectedCheckInDate}
                mode="single"
                disabled={(date) => isDateDisabled(date, true)}
                defaultMonth={selectedCheckInDate}
                onSelect={handleCheckInDateChange}
              />
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">Hora de Check-in</h3>
              <p className="text-sm text-muted-foreground">
                {format(selectedCheckInDate, "EEEE, d 'de' MMMM, yyyy", {
                  locale: es,
                })}
              </p>
              <p className="text-xs text-muted-foreground font-semibold">Horario de Lima (GMT-5)</p>
              <ScrollArea className="h-[22rem] w-[250px]">
                <div className="grid gap-2 pr-4">
                  {checkInTimes.map((timeStr) => {
                    const isSelected = timeStr === selectedCheckInTime;

                    return (
                      <Button
                        key={timeStr}
                        type="button"
                        variant={isSelected ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => handleCheckInTimeChange(timeStr)}
                      >
                        {timeStr}
                      </Button>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          </div>
          <div className="flex justify-center pt-4">
            <Button variant="outline" onClick={() => setActiveTab("checkout")} className="w-fit">
              Siguiente: Seleccionar Check-out
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="checkout" className="space-y-4">
          <div className="w-auto space-x-10 flex-wrap flex items-start h-fit">
            <div className="space-y-4">
              <h3 className="font-semibold">Fecha de Check-out</h3>
              <CalendarBig
                locale={es}
                selected={selectedCheckOutDate}
                mode="single"
                disabled={(date) => isDateDisabled(date, false)}
                defaultMonth={selectedCheckOutDate}
                onSelect={handleCheckOutDateChange}
              />
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">Hora de Check-out</h3>
              <p className="text-sm text-muted-foreground">
                {format(selectedCheckOutDate, "EEEE, d 'de' MMMM, yyyy", {
                  locale: es,
                })}
              </p>
              <p className="text-xs text-muted-foreground font-semibold">Horario de Lima (GMT-5)</p>
              <ScrollArea className="h-[22rem] w-[250px]">
                <div className="grid gap-2 pr-4">
                  {checkOutTimes.map((timeStr) => {
                    const isSelected = timeStr === selectedCheckOutTime;

                    return (
                      <Button
                        key={timeStr}
                        variant={isSelected ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => handleCheckOutTimeChange(timeStr)}
                      >
                        {timeStr}
                      </Button>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          </div>
          <div className="flex justify-center pt-4">
            <Button variant="outline" onClick={() => setActiveTab("checkin")} className="w-1/2">
              Volver a Check-in
            </Button>
          </div>

          {roomId && (
            <div
              className={cn(
                "mt-2 p-3 rounded-md text-center font-medium w-full",
                isLoading
                  ? "bg-muted text-muted-foreground"
                  : isAvailable
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
              )}
            >
              {isLoading
                ? "Verificando disponibilidad..."
                : isAvailable
                  ? "✓ Habitación disponible para estas fechas o es el rango de la reserva original"
                  : "✗ Habitación no disponible para estas fechas"}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
