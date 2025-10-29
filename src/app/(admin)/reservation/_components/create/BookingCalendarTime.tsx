"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { addDays, format, isBefore, isSameDay, startOfDay } from "date-fns";
import { es } from "date-fns/locale";
import { DateRange } from "react-day-picker";
import { UseFormReturn } from "react-hook-form";

import { CalendarBig } from "@/components/form/CalendarBig";
import { TimeInput } from "@/components/ui/time-input";
import {
  createPersistentData,
  DEFAULT_CHECKIN_TIME,
  DEFAULT_CHECKOUT_TIME,
  formDateToPeruISO,
  getAppropriateCheckInDate,
  getAppropriateCheckInTime,
  getFormattedCheckInTimeValue,
  getFormattedCheckOutTimeValue,
  getPeruStartOfToday,
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

  if (!createPersistentData.initialized) {
    const initialCheckInDate = getAppropriateCheckInDate();
    const initialCheckOutDate = addDays(initialCheckInDate, 1);
    const initialCheckInTime = getAppropriateCheckInTime();

    createPersistentData.initialValues = {
      checkInDate: initialCheckInDate,
      checkOutDate: initialCheckOutDate,
      checkInTime: initialCheckInTime,
      checkOutTime: DEFAULT_CHECKOUT_TIME,
    };

    createPersistentData.currentValues = {
      activeTab: "checkin",
      checkInDate: initialCheckInDate,
      checkOutDate: initialCheckOutDate,
      checkInTime: initialCheckInTime,
      checkOutTime: DEFAULT_CHECKOUT_TIME,
    };
    createPersistentData.initialized = true;
  }

  // Usamos la función de inicialización de useState para evitar recálculos
  const [calendarState, setCalendarState] = useState(() => ({
    checkInDate: createPersistentData.currentValues.checkInDate,
    checkOutDate: createPersistentData.currentValues.checkOutDate,
    checkInTime: createPersistentData.currentValues.checkInTime,
    checkOutTime: createPersistentData.currentValues.checkOutTime,
    formInitialized: false,
    renderCount: createPersistentData.renderCount,
  }));

  // Estado para el rango de fechas seleccionado
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>(() => ({
    from: createPersistentData.currentValues.checkInDate,
    to: createPersistentData.currentValues.checkOutDate,
  }));

  // Hook para verificar disponibilidad
  const { isAvailable, checkAvailability: checkAvailabilityOriginal } = useRoomAvailability();

  // Estabilizar la función checkAvailability para evitar bucles infinitos
  const checkAvailability = useCallback(checkAvailabilityOriginal, [checkAvailabilityOriginal]);

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

  useEffect(() => {
    // Resetear flag de updating cuando cambian las fechas
    if (isUpdating.current) {
      isUpdating.current = false;
    }

    if (!calendarState.formInitialized || !roomId || isUpdating.current) {
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
        createPersistentData.currentValues.checkInDate = checkInDate;
        createPersistentData.currentValues.checkOutDate = checkOutDate;

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
        createPersistentData.renderCount += 1;

        // Actualizar estados
        setSelectedRange({ from: checkInDate, to: checkOutDate });
        setCalendarState((prev) => ({
          ...prev,
          checkInDate,
          checkOutDate,
          renderCount: createPersistentData.renderCount,
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
        // Primero actualizamos los datos persistentes
        createPersistentData.currentValues.checkInTime = timeStr;

        // Actualizar formulario
        const checkInISO = formDateToPeruISO(
          format(calendarState.checkInDate, "yyyy-MM-dd"),
          true,
          timeStr,
          DEFAULT_CHECKOUT_TIME
        );

        form.setValue("checkInDate", checkInISO, { shouldValidate: false });

        // Incrementar contador de renderizado
        createPersistentData.renderCount += 1;

        // Actualizar estado central
        setCalendarState((prev) => ({
          ...prev,
          checkInTime: timeStr,
          renderCount: createPersistentData.renderCount,
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
        // Primero actualizamos los datos persistentes
        createPersistentData.currentValues.checkOutTime = timeStr;

        // Actualizar formulario
        const checkOutISO = formDateToPeruISO(
          format(calendarState.checkOutDate, "yyyy-MM-dd"),
          false,
          DEFAULT_CHECKIN_TIME,
          timeStr
        );

        form.setValue("checkOutDate", checkOutISO, { shouldValidate: false });

        // Incrementar contador de renderizado
        createPersistentData.renderCount += 1;

        // Actualizar estado central
        setCalendarState((prev) => ({
          ...prev,
          checkOutTime: timeStr,
          renderCount: createPersistentData.renderCount,
        }));
      } finally {
        // Resetear inmediatamente después de completar
        isUpdating.current = false;
      }
    },
    [calendarState, form]
  );

  // Función para deshabilitar fechas incorrectas (para modo rango)
  const isDateDisabled = useCallback((date: Date) => {
    const today = getPeruStartOfToday();
    return isBefore(startOfDay(date), today);
  }, []);

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col md:flex-row gap-8 items-center">
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
