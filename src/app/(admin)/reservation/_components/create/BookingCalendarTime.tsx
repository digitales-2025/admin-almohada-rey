"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { addDays, format, isBefore, isSameDay, startOfDay } from "date-fns";
import { es } from "date-fns/locale";
import { UseFormReturn } from "react-hook-form";

import { CalendarBig } from "@/components/form/CalendarBig";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimeInput } from "@/components/ui/time-input";
import { cn } from "@/lib/utils";
import {
  DEFAULT_CHECKIN_TIME,
  DEFAULT_CHECKOUT_TIME,
  formDateToPeruISO,
  getAppropriateCheckInDate,
  getAppropriateCheckInTime,
  getFormattedCheckInTimeValue,
  getFormattedCheckOutTimeValue,
  getPeruStartOfToday,
  persistentData,
  peruDateTimeToUTC,
} from "@/utils/peru-datetime";
import { useRoomAvailability } from "../../_hooks/use-roomAvailability";
import { CreateReservationInput } from "../../_schemas/reservation.schemas";

export type BookingFormData = {
  checkInDate: string;
  checkOutDate: string;
  roomId?: string;
};

interface BookingCalendarTimeProps {
  form: UseFormReturn<CreateReservationInput>;
  roomId?: string;
  onRoomAvailabilityChange?: (available: boolean) => void;
}

export default function BookingCalendarTime({ form, roomId, onRoomAvailabilityChange }: BookingCalendarTimeProps) {
  // Referencia para bloquear actualizaciones mientras están en progreso
  const isUpdating = useRef(false);

  if (!persistentData.initialized) {
    const initialCheckInDate = getAppropriateCheckInDate();
    const initialCheckOutDate = addDays(initialCheckInDate, 1);
    const initialCheckInTime = getAppropriateCheckInTime();

    persistentData.initialValues = {
      checkInDate: initialCheckInDate,
      checkOutDate: initialCheckOutDate,
      checkInTime: initialCheckInTime,
      checkOutTime: DEFAULT_CHECKOUT_TIME,
    };

    persistentData.currentValues = {
      activeTab: "checkin",
      checkInDate: initialCheckInDate,
      checkOutDate: initialCheckOutDate,
      checkInTime: initialCheckInTime,
      checkOutTime: DEFAULT_CHECKOUT_TIME,
    };
    persistentData.initialized = true;
  }

  // Usamos la función de inicialización de useState para evitar recálculos
  const [calendarState, setCalendarState] = useState(() => ({
    activeTab: persistentData.currentValues.activeTab,
    checkInDate: persistentData.currentValues.checkInDate,
    checkOutDate: persistentData.currentValues.checkOutDate,
    checkInTime: persistentData.currentValues.checkInTime,
    checkOutTime: persistentData.currentValues.checkOutTime,
    formInitialized: false,
    renderCount: persistentData.renderCount,
  }));

  // Hook para verificar disponibilidad
  const { isAvailable, isLoading, checkAvailability } = useRoomAvailability();

  // ====== INICIALIZACIÓN DEL FORMULARIO ======
  useEffect(() => {
    if (!calendarState.formInitialized) {
      // Preparar valores para el formulario
      const checkInISO = formDateToPeruISO(
        format(calendarState.checkInDate, "yyyy-MM-dd"),
        true,
        calendarState.checkInTime,
        DEFAULT_CHECKOUT_TIME
      );

      const checkOutISO = formDateToPeruISO(
        format(calendarState.checkOutDate, "yyyy-MM-dd"),
        false,
        DEFAULT_CHECKIN_TIME,
        calendarState.checkOutTime
      );

      // Actualizar formulario
      form.setValue("checkInDate", checkInISO, { shouldValidate: false, shouldDirty: false });
      form.setValue("checkOutDate", checkOutISO, { shouldValidate: false, shouldDirty: false });

      // Marcar como inicializado (en el estado local)
      setCalendarState((prev) => ({
        ...prev,
        formInitialized: true,
      }));
    }
  }, []);

  useEffect(() => {
    if (!calendarState.formInitialized || !roomId || isUpdating.current) return;

    // Convertir a formato para API
    const checkInISO = peruDateTimeToUTC(format(calendarState.checkInDate, "yyyy-MM-dd"), calendarState.checkInTime);

    const checkOutISO = peruDateTimeToUTC(format(calendarState.checkOutDate, "yyyy-MM-dd"), calendarState.checkOutTime);

    // Verificar disponibilidad
    checkAvailability({
      roomId,
      checkInDate: checkInISO,
      checkOutDate: checkOutISO,
    });
  }, [
    calendarState.formInitialized,
    calendarState.checkInDate,
    calendarState.checkOutDate,
    calendarState.checkInTime,
    calendarState.checkOutTime,
    roomId,
  ]);

  useEffect(() => {
    if (onRoomAvailabilityChange) {
      onRoomAvailabilityChange(isAvailable);
    }
  }, [isAvailable, onRoomAvailabilityChange]);

  // Cambio de pestaña
  const handleTabChange = (tab: string) => {
    // Actualizar datos persistentes
    persistentData.currentValues.activeTab = tab as "checkin" | "checkout";

    // Actualizar estado de React
    setCalendarState((prev) => ({
      ...prev,
      activeTab: tab as "checkin" | "checkout",
    }));
  };

  // Cambio de fecha de check-in
  const handleCheckInDateChange = useCallback(
    (date: Date | undefined) => {
      if (!date || isUpdating.current) return;

      isUpdating.current = true;

      try {
        // Primero actualizamos los datos persistentes
        persistentData.currentValues.checkInDate = date;

        let newCheckOutDate = calendarState.checkOutDate;

        // Si checkout es antes o igual al nuevo check-in, ajustarlo
        if (calendarState.checkOutDate <= date || isSameDay(calendarState.checkOutDate, date)) {
          newCheckOutDate = addDays(date, 1);
          persistentData.currentValues.checkOutDate = newCheckOutDate;
        }

        // Actualizar formulario
        const checkInISO = formDateToPeruISO(
          format(date, "yyyy-MM-dd"),
          true,
          calendarState.checkInTime,
          DEFAULT_CHECKOUT_TIME
        );

        form.setValue("checkInDate", checkInISO, { shouldValidate: false });

        // Si cambió el checkout, actualizarlo también
        if (newCheckOutDate !== calendarState.checkOutDate) {
          const checkOutISO = formDateToPeruISO(
            format(newCheckOutDate, "yyyy-MM-dd"),
            false,
            DEFAULT_CHECKIN_TIME,
            calendarState.checkOutTime
          );

          form.setValue("checkOutDate", checkOutISO, { shouldValidate: false });
        }

        // Incrementar contador de renderizado
        persistentData.renderCount += 1;

        // Actualizar estado central con todos los valores
        setCalendarState((prev) => ({
          ...prev,
          checkInDate: date,
          checkOutDate: newCheckOutDate,
          renderCount: persistentData.renderCount,
        }));
      } finally {
        setTimeout(() => {
          isUpdating.current = false;
        }, 300);
      }
    },
    [calendarState, form]
  );

  // Cambio de fecha de check-out
  const handleCheckOutDateChange = useCallback(
    (date: Date | undefined) => {
      if (!date || isUpdating.current) return;

      isUpdating.current = true;

      try {
        // Primero actualizamos los datos persistentes
        persistentData.currentValues.checkOutDate = date;

        // Actualizar formulario
        const checkOutISO = formDateToPeruISO(
          format(date, "yyyy-MM-dd"),
          false,
          DEFAULT_CHECKIN_TIME,
          calendarState.checkOutTime
        );

        form.setValue("checkOutDate", checkOutISO, { shouldValidate: false });

        // Incrementar contador de renderizado
        persistentData.renderCount += 1;

        // Actualizar estado central
        setCalendarState((prev) => ({
          ...prev,
          checkOutDate: date,
          renderCount: persistentData.renderCount,
        }));
      } finally {
        setTimeout(() => {
          isUpdating.current = false;
        }, 300);
      }
    },
    [calendarState, form]
  );

  // Cambio de hora de check-in
  const handleCheckInTimeChange = useCallback(
    (timeStr: string) => {
      if (timeStr === calendarState.checkInTime || isUpdating.current) return;

      isUpdating.current = true;

      try {
        // Primero actualizamos los datos persistentes
        persistentData.currentValues.checkInTime = timeStr;

        // Actualizar formulario
        const checkInISO = formDateToPeruISO(
          format(calendarState.checkInDate, "yyyy-MM-dd"),
          true,
          timeStr,
          DEFAULT_CHECKOUT_TIME
        );

        form.setValue("checkInDate", checkInISO, { shouldValidate: false });

        // Incrementar contador de renderizado
        persistentData.renderCount += 1;

        // Actualizar estado central
        setCalendarState((prev) => ({
          ...prev,
          checkInTime: timeStr,
          renderCount: persistentData.renderCount,
        }));
      } finally {
        setTimeout(() => {
          isUpdating.current = false;
        }, 300);
      }
    },
    [calendarState, form]
  );

  // Cambio de hora de check-out
  const handleCheckOutTimeChange = useCallback(
    (timeStr: string) => {
      if (timeStr === calendarState.checkOutTime || isUpdating.current) return;

      isUpdating.current = true;

      try {
        // Primero actualizamos los datos persistentes
        persistentData.currentValues.checkOutTime = timeStr;

        // Actualizar formulario
        const checkOutISO = formDateToPeruISO(
          format(calendarState.checkOutDate, "yyyy-MM-dd"),
          false,
          DEFAULT_CHECKIN_TIME,
          timeStr
        );

        form.setValue("checkOutDate", checkOutISO, { shouldValidate: false });

        // Incrementar contador de renderizado
        persistentData.renderCount += 1;

        // Actualizar estado central
        setCalendarState((prev) => ({
          ...prev,
          checkOutTime: timeStr,
          renderCount: persistentData.renderCount,
        }));
      } finally {
        setTimeout(() => {
          isUpdating.current = false;
        }, 300);
      }
    },
    [calendarState, form]
  );

  // Función para deshabilitar fechas incorrectas
  const isDateDisabled = useCallback(
    (date: Date, isCheckIn: boolean) => {
      const today = getPeruStartOfToday();

      if (isCheckIn) {
        return isBefore(startOfDay(date), today);
      }

      return (
        isBefore(startOfDay(date), startOfDay(calendarState.checkInDate)) || isSameDay(date, calendarState.checkInDate)
      );
    },
    [calendarState.checkInDate]
  );

  return (
    <div className="w-full space-y-4">
      <Tabs defaultValue="checkin" value={calendarState.activeTab} onValueChange={handleTabChange} className="w-full">
        <div className="w-full flex justify-center">
          <TabsList className="grid grid-cols-2 !mb-4">
            <TabsTrigger value="checkin">Check-in</TabsTrigger>
            <TabsTrigger value="checkout">Check-out</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="checkin" className="space-y-4 w-full items-center">
          <div className="items-center flex flex-col sm:flex-row justify-center">
            <div className="gap-8 flex flex-col sm:flex-row items-center h-fit">
              <div className="space-y-4">
                <h3 className="font-semibold text-sm">Fecha de Check-in</h3>
                <CalendarBig
                  key={`checkin-calendar-${calendarState.renderCount}`}
                  locale={es}
                  selected={calendarState.checkInDate}
                  mode="single"
                  disabled={(date) => isDateDisabled(date, true)}
                  defaultMonth={calendarState.checkInDate}
                  onSelect={handleCheckInDateChange}
                />
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold">Hora de Check-in</h3>
                <p className="text-sm text-muted-foreground">
                  {format(calendarState.checkInDate, "EEEE, d 'de' MMMM, yyyy", {
                    locale: es,
                  })}
                </p>
                <p className="text-xs text-muted-foreground font-semibold">Horario de Lima (GMT-5)</p>

                <TimeInput
                  value={getFormattedCheckInTimeValue(calendarState.checkInTime)}
                  onTimeChange={(timeStr) => {
                    // Convertir el formato 24h del input al formato 12h con AM/PM
                    const [hours, minutes] = timeStr.split(":");
                    const hoursInt = parseInt(hours, 10);
                    const minutesInt = parseInt(minutes, 10);

                    // Formato de 12 horas para AM/PM
                    const is12HourFormat = hoursInt >= 12;
                    const hours12 = hoursInt % 12 || 12;
                    const amPm = is12HourFormat ? "PM" : "AM";

                    // Formato final: "HH:MM AM/PM" (formato 12h)
                    const formattedTime = `${String(hours12).padStart(2, "0")}:${String(minutesInt).padStart(2, "0")} ${amPm}`;

                    // Enviar al handler
                    handleCheckInTimeChange(formattedTime);
                  }}
                  className="w-full"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-center pt-4">
            <Button variant="outline" onClick={() => handleTabChange("checkout")} className="w-fit text-wrap">
              Siguiente: Seleccionar Check-out
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="checkout" className="space-y-4 w-full items-center">
          <div className="items-center flex flex-col sm:flex-row justify-center">
            <div className="gap-8 flex flex-col sm:flex-row items-center h-fit">
              <div className="space-y-4">
                <h3 className="font-semibold text-sm">Fecha de Check-out</h3>
                <CalendarBig
                  key={`checkout-calendar-${calendarState.renderCount}`}
                  locale={es}
                  selected={calendarState.checkOutDate}
                  mode="single"
                  disabled={(date) => isDateDisabled(date, false)}
                  defaultMonth={calendarState.checkOutDate}
                  onSelect={handleCheckOutDateChange}
                />
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold">Hora de Check-out</h3>
                <p className="text-sm text-muted-foreground">
                  {format(calendarState.checkOutDate, "EEEE, d 'de' MMMM, yyyy", {
                    locale: es,
                  })}
                </p>
                <p className="text-xs text-muted-foreground font-semibold">Horario de Lima (GMT-5)</p>

                <TimeInput
                  value={getFormattedCheckOutTimeValue(calendarState.checkOutTime)}
                  onTimeChange={(timeStr) => {
                    // Convertir el formato 24h del input al formato 12h con AM/PM
                    // Usamos la hora local del navegador pero ajustamos la lógica para representar hora peruana
                    const [hours, minutes] = timeStr.split(":");
                    const hoursInt = parseInt(hours, 10);
                    const minutesInt = parseInt(minutes, 10);

                    // Formato de 12 horas para AM/PM
                    const is12HourFormat = hoursInt >= 12;
                    const hours12 = hoursInt % 12 || 12;
                    const amPm = is12HourFormat ? "PM" : "AM";

                    // Formato final: "HH:MM AM/PM" (formato 12h)
                    const formattedTime = `${String(hours12).padStart(2, "0")}:${String(minutesInt).padStart(2, "0")} ${amPm}`;

                    // Enviar al handler
                    handleCheckOutTimeChange(formattedTime);
                  }}
                  disabled
                  className="w-full"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-center pt-4">
            <Button variant="outline" onClick={() => handleTabChange("checkin")} className="w-fit text-wrap">
              Volver a Check-in
            </Button>
          </div>

          {roomId && (
            <div
              className={cn(
                "mt-2 p-3 rounded-md text-center font-medium",
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
                  ? "✓ Habitación disponible para estas fechas"
                  : "✗ Habitación no disponible para estas fechas"}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
