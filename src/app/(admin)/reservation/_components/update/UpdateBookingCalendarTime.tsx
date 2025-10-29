"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { addDays, format, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { DateRange } from "react-day-picker";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { CalendarBig } from "@/components/form/CalendarBig";
import { TimeInput } from "@/components/ui/time-input";
import {
  DEFAULT_CHECKIN_TIME,
  DEFAULT_CHECKOUT_TIME,
  formDateToPeruISO,
  getFormattedCheckInTimeValue,
  getFormattedCheckOutTimeValue,
  isoToPeruTimeString,
  peruDateTimeToUTC,
  updatePersistentData,
} from "@/utils/peru-datetime";
import { processError } from "@/utils/process-error";
import { useRoomAvailabilityForUpdate } from "../../_hooks/use-roomAvailability";
import { DetailedReservation, UpdateReservationInput } from "../../_schemas/reservation.schemas";

interface UpdateBookingCalendarTimeProps {
  form: UseFormReturn<UpdateReservationInput>;
  roomId?: string;
  onRoomAvailabilityChange?: (available: boolean) => void;
  reservation: DetailedReservation;
  parentIsCheckingAvailability?: boolean;
}

export default function UpdateBookingCalendarTime({
  form,
  roomId,
  onRoomAvailabilityChange,
  reservation,
  parentIsCheckingAvailability = false,
}: UpdateBookingCalendarTimeProps) {
  // Referencia para bloquear actualizaciones mientras están en progreso
  const isUpdating = useRef(false);
  const reservationId = reservation.id;

  // Inicializar datos persistentes para esta reserva específica
  // Solo inicializar si no está inicializado o si cambió la reserva
  if (!updatePersistentData.initialized || updatePersistentData.currentReservationId !== reservationId) {
    const initialCheckInDate = new Date(reservation.checkInDate);
    const initialCheckOutDate = new Date(reservation.checkOutDate);
    const initialCheckInTime = reservation.checkInDate
      ? isoToPeruTimeString(reservation.checkInDate)
      : DEFAULT_CHECKIN_TIME;
    const initialCheckOutTime = reservation.checkOutDate
      ? isoToPeruTimeString(reservation.checkOutDate)
      : DEFAULT_CHECKOUT_TIME;

    updatePersistentData.initialValues = {
      checkInDate: initialCheckInDate,
      checkOutDate: initialCheckOutDate,
      checkInTime: initialCheckInTime,
      checkOutTime: initialCheckOutTime,
    };

    updatePersistentData.currentValues = {
      activeTab: "checkin",
      checkInDate: initialCheckInDate,
      checkOutDate: initialCheckOutDate,
      checkInTime: initialCheckInTime,
      checkOutTime: initialCheckOutTime,
    };
    updatePersistentData.initialized = true;
    updatePersistentData.currentReservationId = reservationId;
  }

  // Usamos la función de inicialización de useState para evitar recálculos
  const [calendarState, setCalendarState] = useState(() => ({
    checkInDate: updatePersistentData.currentValues.checkInDate,
    checkOutDate: updatePersistentData.currentValues.checkOutDate,
    checkInTime: updatePersistentData.currentValues.checkInTime,
    checkOutTime: updatePersistentData.currentValues.checkOutTime,
    formInitialized: false,
    renderCount: updatePersistentData.renderCount,
  }));

  // Estado para el rango de fechas seleccionado
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>(() => ({
    from: updatePersistentData.currentValues.checkInDate,
    to: updatePersistentData.currentValues.checkOutDate,
  }));

  // Valores actuales del formulario
  const formCheckInDate = form.watch("checkInDate");
  const formCheckOutDate = form.watch("checkOutDate");

  // Hook para verificar disponibilidad específica de una habitación
  const {
    isAvailable,
    isError,
    error,
    checkAvailability: checkAvailabilityOriginal,
  } = useRoomAvailabilityForUpdate({
    roomId: roomId || "",
    checkInDate: formCheckInDate || reservation.checkInDate,
    checkOutDate: formCheckOutDate || reservation.checkOutDate,
    reservationId,
  });

  // Estabilizar la función checkAvailability para evitar bucles infinitos
  const checkAvailability = useCallback(checkAvailabilityOriginal, [checkAvailabilityOriginal]);

  // Ref para el último check de disponibilidad
  const lastAvailabilityCheckRef = useRef({
    roomId: "",
    checkInDate: "",
    checkOutDate: "",
    checkInTime: "",
    checkOutTime: "",
    timeoutId: null as NodeJS.Timeout | null,
    lastWebSocketEvent: "",
    forceCheck: false, // Flag para forzar verificación por WebSocket
  });

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
  }, [
    calendarState.formInitialized,
    calendarState.checkInDate,
    calendarState.checkInTime,
    calendarState.checkOutDate,
    calendarState.checkOutTime,
    form,
  ]);

  // Verificación de disponibilidad optimizada
  useEffect(() => {
    // Resetear flag de updating cuando cambian las fechas
    if (isUpdating.current) {
      isUpdating.current = false;
    }

    if (!calendarState.formInitialized || !roomId || isUpdating.current || parentIsCheckingAvailability) {
      return;
    }

    // Copiar referencia para el cleanup
    const currentRef = lastAvailabilityCheckRef.current;

    // Convertir a formato para API
    const checkInDateStr = format(calendarState.checkInDate, "yyyy-MM-dd");
    const checkOutDateStr = format(calendarState.checkOutDate, "yyyy-MM-dd");

    // Verificar si ya hicimos este check
    if (
      currentRef.roomId === roomId &&
      currentRef.checkInDate === checkInDateStr &&
      currentRef.checkOutDate === checkOutDateStr &&
      currentRef.checkInTime === calendarState.checkInTime &&
      currentRef.checkOutTime === calendarState.checkOutTime &&
      !currentRef.forceCheck
    ) {
      return;
    }

    // Si es un force check, resetear el flag
    if (currentRef.forceCheck) {
      currentRef.forceCheck = false;
    }

    // Limpiar timeout anterior
    if (currentRef.timeoutId) {
      clearTimeout(currentRef.timeoutId);
    }

    // Actualizar ref
    lastAvailabilityCheckRef.current = {
      roomId,
      checkInDate: checkInDateStr,
      checkOutDate: checkOutDateStr,
      checkInTime: calendarState.checkInTime,
      checkOutTime: calendarState.checkOutTime,
      timeoutId: null,
      lastWebSocketEvent: lastAvailabilityCheckRef.current.lastWebSocketEvent,
      forceCheck: lastAvailabilityCheckRef.current.forceCheck,
    };

    // Debounce: esperar 300ms antes de verificar
    lastAvailabilityCheckRef.current.timeoutId = setTimeout(() => {
      const checkInISO = peruDateTimeToUTC(checkInDateStr, calendarState.checkInTime);
      const checkOutISO = peruDateTimeToUTC(checkOutDateStr, calendarState.checkOutTime);

      // Verificar disponibilidad
      checkAvailability({
        roomId,
        checkInDate: checkInISO,
        checkOutDate: checkOutISO,
        reservationId,
      });
    }, 300);

    // Cleanup
    return () => {
      if (currentRef.timeoutId) {
        clearTimeout(currentRef.timeoutId);
      }
    };
  }, [
    calendarState.formInitialized,
    calendarState.checkInDate,
    calendarState.checkOutDate,
    calendarState.checkInTime,
    calendarState.checkOutTime,
    roomId,
    checkAvailability,
    parentIsCheckingAvailability,
    reservationId,
  ]);

  const handleRoomAvailabilityChange = useCallback(
    (available: boolean) => {
      if (onRoomAvailabilityChange) {
        onRoomAvailabilityChange(available);
      }
    },
    [onRoomAvailabilityChange]
  );

  useEffect(() => {
    handleRoomAvailabilityChange(isAvailable);
  }, [isAvailable, handleRoomAvailabilityChange, onRoomAvailabilityChange]);

  // Mostrar errores si hay problemas al verificar disponibilidad
  useEffect(() => {
    if (isError && error) {
      const processedError = processError(error);
      toast.error(`Error al verificar disponibilidad: ${processedError}`);
    }
  }, [isError, error]);

  // --- Escuchar eventos WebSocket de disponibilidad ---
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    const handleAvailabilityChange = (data: { checkInDate: string; checkOutDate: string }) => {
      // Crear un identificador único para este evento
      const eventId = `${data.checkInDate}_${data.checkOutDate}`;
      const lastEventId = lastAvailabilityCheckRef.current.lastWebSocketEvent;

      // Evitar procesar el mismo evento múltiples veces
      if (lastEventId === eventId) {
        return;
      }

      // Verificar si hay conflicto de rangos de fechas
      if (calendarState.checkInDate && calendarState.checkOutDate) {
        const myCheckIn = new Date(calendarState.checkInDate);
        const myCheckOut = new Date(calendarState.checkOutDate);
        const eventCheckIn = new Date(data.checkInDate);
        const eventCheckOut = new Date(data.checkOutDate);

        // Verificar si los rangos se solapan
        const hasConflict = myCheckIn < eventCheckOut && myCheckOut > eventCheckIn;

        if (!hasConflict) {
          return;
        }
      }

      // Activar flag para forzar verificación
      lastAvailabilityCheckRef.current.forceCheck = true;

      // Debounce: esperar 1 segundo antes de procesar
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        // Forzar una nueva verificación si tenemos habitación y fechas
        if (roomId && calendarState.formInitialized) {
          // Resetear flags para permitir nueva verificación
          lastAvailabilityCheckRef.current.roomId = "";
          lastAvailabilityCheckRef.current.checkInDate = "";
          lastAvailabilityCheckRef.current.checkOutDate = "";
          lastAvailabilityCheckRef.current.checkInTime = "";
          lastAvailabilityCheckRef.current.checkOutTime = "";

          // Ejecutar verificación inmediatamente
          const checkInDateStr = format(calendarState.checkInDate, "yyyy-MM-dd");
          const checkOutDateStr = format(calendarState.checkOutDate, "yyyy-MM-dd");

          const checkInISO = peruDateTimeToUTC(checkInDateStr, calendarState.checkInTime);
          const checkOutISO = peruDateTimeToUTC(checkOutDateStr, calendarState.checkOutTime);

          checkAvailability({
            roomId,
            checkInDate: checkInISO,
            checkOutDate: checkOutISO,
            reservationId,
          });

          // Actualizar la referencia del último evento WebSocket DESPUÉS de procesar
          lastAvailabilityCheckRef.current.lastWebSocketEvent = eventId;
        }
      }, 1000);
    };

    // Importar socketService dinámicamente para evitar problemas de SSR
    import("@/services/socketService").then(({ socketService }) => {
      const unsubscribe = socketService.onAvailabilityChanged(handleAvailabilityChange);

      return () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        unsubscribe();
      };
    });
  }, [
    roomId,
    calendarState.formInitialized,
    calendarState.checkInDate,
    calendarState.checkOutDate,
    calendarState.checkInTime,
    calendarState.checkOutTime,
    checkAvailability,
    reservationId,
  ]);

  // --- Escuchar eventos de habitación liberada por cancelación ---
  useEffect(() => {
    const handleRoomFreed = (event: CustomEvent) => {
      const { roomId: freedRoomId, action } = event.detail;

      // Solo procesar si es la habitación actual y la acción es 'freed'
      if (freedRoomId === roomId && action === "freed") {
        // Forzar nueva verificación de disponibilidad
        lastAvailabilityCheckRef.current.forceCheck = true;

        // Ejecutar verificación inmediatamente si tenemos fechas
        if (calendarState.checkInDate && calendarState.checkOutDate) {
          const checkInDateStr = format(calendarState.checkInDate, "yyyy-MM-dd");
          const checkOutDateStr = format(calendarState.checkOutDate, "yyyy-MM-dd");

          const checkInISO = peruDateTimeToUTC(checkInDateStr, calendarState.checkInTime);
          const checkOutISO = peruDateTimeToUTC(checkOutDateStr, calendarState.checkOutTime);

          checkAvailability({
            roomId: roomId!,
            checkInDate: checkInISO,
            checkOutDate: checkOutISO,
            reservationId,
          });
        }
      }
    };

    // Escuchar el evento personalizado
    window.addEventListener("roomAvailabilityChanged", handleRoomFreed as EventListener);

    return () => {
      window.removeEventListener("roomAvailabilityChanged", handleRoomFreed as EventListener);
    };
  }, [
    roomId,
    calendarState.checkInDate,
    calendarState.checkOutDate,
    calendarState.checkInTime,
    calendarState.checkOutTime,
    checkAvailability,
    reservationId,
  ]);

  // Manejo de selección de rango de fechas
  const handleDateRangeSelect = useCallback(
    (date: Date | DateRange | undefined) => {
      const range = date as DateRange | undefined;
      if (!range || isUpdating.current) return;

      isUpdating.current = true;

      try {
        // Validar que el rango sea válido
        if (!range.from) return;

        // Si solo se selecciona una fecha, establecer checkout como +1 día
        const checkInDate = range.from;
        let checkOutDate = range.to || addDays(range.from, 1);

        // Asegurar que checkout sea al menos un día después de checkin
        if (isSameDay(checkInDate, checkOutDate) || checkOutDate <= checkInDate) {
          checkOutDate = addDays(checkInDate, 1);
        }

        // Actualizar datos persistentes
        updatePersistentData.currentValues.checkInDate = checkInDate;
        updatePersistentData.currentValues.checkOutDate = checkOutDate;

        // Actualizar formulario
        const checkInISO = formDateToPeruISO(
          format(checkInDate, "yyyy-MM-dd"),
          true,
          calendarState.checkInTime,
          DEFAULT_CHECKOUT_TIME
        );

        const checkOutISO = formDateToPeruISO(
          format(checkOutDate, "yyyy-MM-dd"),
          false,
          DEFAULT_CHECKIN_TIME,
          calendarState.checkOutTime
        );

        form.setValue("checkInDate", checkInISO, { shouldValidate: false });
        form.setValue("checkOutDate", checkOutISO, { shouldValidate: false });

        // Incrementar contador de renderizado
        updatePersistentData.renderCount += 1;

        // Actualizar estados
        setSelectedRange({ from: checkInDate, to: checkOutDate });
        setCalendarState((prev) => ({
          ...prev,
          checkInDate,
          checkOutDate,
          renderCount: updatePersistentData.renderCount,
        }));
      } finally {
        // Resetear inmediatamente después de completar
        isUpdating.current = false;
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
        // Actualizar datos persistentes
        updatePersistentData.currentValues.checkInTime = timeStr;

        // Actualizar formulario
        const checkInISO = formDateToPeruISO(
          format(calendarState.checkInDate, "yyyy-MM-dd"),
          true,
          timeStr,
          DEFAULT_CHECKOUT_TIME
        );

        form.setValue("checkInDate", checkInISO, { shouldValidate: false });

        // Incrementar contador de renderizado
        updatePersistentData.renderCount += 1;

        // Actualizar estado
        setCalendarState((prev) => ({
          ...prev,
          checkInTime: timeStr,
          renderCount: updatePersistentData.renderCount,
        }));
      } finally {
        // Resetear inmediatamente después de completar
        isUpdating.current = false;
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
        // Actualizar datos persistentes
        updatePersistentData.currentValues.checkOutTime = timeStr;

        // Actualizar formulario
        const checkOutISO = formDateToPeruISO(
          format(calendarState.checkOutDate, "yyyy-MM-dd"),
          false,
          DEFAULT_CHECKIN_TIME,
          timeStr
        );

        form.setValue("checkOutDate", checkOutISO, { shouldValidate: false });

        // Incrementar contador de renderizado
        updatePersistentData.renderCount += 1;

        // Actualizar estado
        setCalendarState((prev) => ({
          ...prev,
          checkOutTime: timeStr,
          renderCount: updatePersistentData.renderCount,
        }));
      } finally {
        // Resetear inmediatamente después de completar
        isUpdating.current = false;
      }
    },
    [calendarState, form]
  );

  // Función para deshabilitar fechas incorrectas (para modo rango)
  const isDateDisabled = useCallback(
    (date: Date) => {
      // Para actualizaciones, solo bloquear fechas anteriores a la fecha original de check-in
      // Esto permite editar reservas que están en el pasado, pero no cambiar a fechas anteriores

      // Usar la utilidad de Perú para manejar correctamente la zona horaria
      const originalCheckInDate = new Date(reservation.checkInDate);

      // Extraer solo la fecha (yyyy-MM-dd) de ambas fechas para comparación pura
      const originalDateStr = format(originalCheckInDate, "yyyy-MM-dd");
      const currentDateStr = format(date, "yyyy-MM-dd");

      // Comparar las cadenas de fecha directamente
      return currentDateStr < originalDateStr;
    },
    [reservation.checkInDate]
  );

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-4 items-center">
        {/* Calendario a la izquierda */}
        <div className="flex-1 space-y-4">
          <h3 className="font-semibold text-sm text-center">Seleccionar Fechas de Estancia</h3>
          <CalendarBig
            key={`booking-calendar-${calendarState.renderCount}`}
            locale={es}
            selected={selectedRange}
            mode="range"
            disabled={isDateDisabled}
            defaultMonth={selectedRange?.from || calendarState.checkInDate}
            onSelect={handleDateRangeSelect}
          />
        </div>

        {/* Inputs de tiempo a la derecha */}
        <div className="flex-1 space-y-6">
          {/* Check-in */}
          <div className="space-y-4">
            <h3 className="font-semibold">Check-in</h3>
            <div className="space-y-2">
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

          {/* Check-out */}
          <div className="space-y-4">
            <h3 className="font-semibold">Check-out</h3>
            <div className="space-y-2">
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
      </div>
    </div>
  );
}
