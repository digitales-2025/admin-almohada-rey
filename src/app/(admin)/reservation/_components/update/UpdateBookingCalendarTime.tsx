"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { addDays, format, isBefore, isSameDay, startOfDay } from "date-fns";
import { es } from "date-fns/locale";
import { UseFormReturn } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

import { CalendarBig } from "@/components/form/CalendarBig";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimeInput } from "@/components/ui/time-input";
import { cn } from "@/lib/utils";
import { socketService } from "@/services/socketService";
import {
  DEFAULT_CHECKIN_TIME,
  DEFAULT_CHECKOUT_TIME,
  formDateToPeruISO,
  getFormattedCheckInTimeValue,
  getFormattedCheckOutTimeValue,
  getPeruStartOfToday,
  isoToPeruTimeString,
} from "@/utils/peru-datetime";
import { processError } from "@/utils/process-error";
import { useRoomAvailabilityForUpdate } from "../../_hooks/use-roomAvailability";
import { DetailedReservation, UpdateReservationInput } from "../../_schemas/reservation.schemas";
import { reservationApi } from "../../_services/reservationApi";

// Sistema de caché optimizado para verificaciones de disponibilidad
const roomAvailabilityCache = new Map<
  string,
  {
    params: string;
    timestamp: number;
  }
>();

// Control de verificaciones iniciales por reserva/instancia
const initialVerificationRegistry = new Map<string, boolean>();

interface UpdateBookingCalendarTimeProps {
  form: UseFormReturn<UpdateReservationInput>;
  roomId?: string;
  onRoomAvailabilityChange?: (available: boolean) => void;
  reservation: DetailedReservation;
  parentIsCheckingAvailability?: boolean;
}

// Cache simplificado para el estado del calendario
const calendarStateCache = new Map<
  string,
  {
    checkInDate: Date;
    checkOutDate: Date;
    checkInTime: string;
    checkOutTime: string;
    lastUpdate: number;
  }
>();

export default function UpdateBookingCalendarTime({
  form,
  roomId,
  onRoomAvailabilityChange,
  reservation,
  parentIsCheckingAvailability = false,
}: UpdateBookingCalendarTimeProps) {
  const dispatch = useDispatch();

  // Referencias para optimizar operaciones
  const isUpdating = useRef(false);
  const lastVerifiedParams = useRef("");
  const verificationsBlocked = useRef(false);
  const reservationId = reservation.id;
  const componentInstanceId = useRef(`calendar-${reservationId}-${Math.random().toString(36).substr(2, 9)}`);
  const initialSetupComplete = useRef(false);

  // Inicializar o recuperar datos del caché
  if (!calendarStateCache.has(reservationId)) {
    calendarStateCache.set(reservationId, {
      checkInDate: new Date(reservation.checkInDate),
      checkOutDate: new Date(reservation.checkOutDate),
      checkInTime: reservation.checkInDate ? isoToPeruTimeString(reservation.checkInDate) : DEFAULT_CHECKIN_TIME,
      checkOutTime: reservation.checkOutDate ? isoToPeruTimeString(reservation.checkOutDate) : DEFAULT_CHECKOUT_TIME,
      lastUpdate: Date.now(),
    });
  }

  // Obtener datos del caché
  const cachedData = calendarStateCache.get(reservationId)!;

  // Estado local del calendario
  const [calendarState, setCalendarState] = useState({
    activeTab: "checkin" as "checkin" | "checkout",
    checkInDate: cachedData.checkInDate,
    checkOutDate: cachedData.checkOutDate,
    checkInTime: cachedData.checkInTime,
    checkOutTime: cachedData.checkOutTime,
    formInitialized: false,
    renderCount: 0,
  });

  // Valores actuales del formulario
  const formCheckInDate = form.watch("checkInDate");
  const formCheckOutDate = form.watch("checkOutDate");

  // Hook para verificar disponibilidad específica de una habitación
  const {
    isAvailable,
    isLoading: isCheckingAvailability,
    isError,
    error,
    checkAvailability: verifyRoomAvailability,
  } = useRoomAvailabilityForUpdate({
    roomId: roomId || "",
    checkInDate: formCheckInDate || reservation.checkInDate,
    checkOutDate: formCheckOutDate || reservation.checkOutDate,
    reservationId,
  });

  // Registrar la instancia para control de verificaciones
  useEffect(() => {
    const instanceId = componentInstanceId.current;

    return () => {
      // Limpiar registros cuando el componente se desmonta
      initialVerificationRegistry.delete(instanceId);
    };
  }, []);

  // Notificar al componente padre sobre la disponibilidad
  useEffect(() => {
    if (onRoomAvailabilityChange && roomId) {
      onRoomAvailabilityChange(isAvailable);
    }
  }, [isAvailable, onRoomAvailabilityChange, roomId]);

  // Mostrar errores si hay problemas al verificar disponibilidad
  useEffect(() => {
    if (isError && error) {
      const processedError = processError(error);
      toast.error(`Error al verificar disponibilidad: ${processedError}`);
    }
  }, [isError, error]);

  // Verificar disponibilidad (PUNTO CENTRAL DE VERIFICACIÓN)
  // Este es el ÚNICO lugar donde llamamos a verifyRoomAvailability
  const checkRoomAvailabilityIfNeeded = useCallback(() => {
    // Si las verificaciones están bloqueadas o faltan datos esenciales, salir
    if (verificationsBlocked.current || !roomId || !formCheckInDate || !formCheckOutDate) return;

    // Crear firma para esta verificación
    const paramsSignature = `${roomId}:${formCheckInDate}:${formCheckOutDate}`;

    // Evitar verificaciones duplicadas con exactamente los mismos parámetros
    if (paramsSignature === lastVerifiedParams.current) return;

    // Verificar caché
    const cacheKey = `room-${roomId}-${reservationId}`;
    const cached = roomAvailabilityCache.get(cacheKey);

    if (cached && cached.params === paramsSignature) {
      // Si verificamos hace menos de 3 segundos, no volver a verificar
      if (Date.now() - cached.timestamp < 3000) {
        return;
      }
    }

    // Bloquear verificaciones adicionales durante un breve periodo
    verificationsBlocked.current = true;

    // Actualizar caché y estado de verificación
    roomAvailabilityCache.set(cacheKey, {
      params: paramsSignature,
      timestamp: Date.now(),
    });
    lastVerifiedParams.current = paramsSignature;

    // Realizar la verificación real
    verifyRoomAvailability({
      roomId,
      checkInDate: formCheckInDate,
      checkOutDate: formCheckOutDate,
      reservationId,
    });

    // Desbloquear después de un breve período
    setTimeout(() => {
      verificationsBlocked.current = false;
    }, 500);
  }, [roomId, formCheckInDate, formCheckOutDate, reservationId, verifyRoomAvailability]);

  // ÚNICO efecto que dispara verificaciones de disponibilidad
  // ¡ESTE ES EL CAMBIO CLAVE!
  useEffect(() => {
    // Verificación para el montaje inicial del componente
    const instanceId = componentInstanceId.current;
    const isInitialRender = !initialVerificationRegistry.has(instanceId);

    // Solo verificar cuando tengamos todos los datos necesarios y el padre NO esté verificando
    if (roomId && formCheckInDate && formCheckOutDate && !parentIsCheckingAvailability) {
      // Si es el montaje inicial, aplicamos un breve retraso para evitar triples peticiones
      if (isInitialRender) {
        initialVerificationRegistry.set(instanceId, true);

        // Usar setTimeout para evitar que React dispare múltiples verificaciones
        // en el primer ciclo de renderizado
        const timer = setTimeout(() => {
          checkRoomAvailabilityIfNeeded();
          initialSetupComplete.current = true;
        }, 200);

        return () => {
          clearTimeout(timer);
        };
      }
      // Para actualizaciones posteriores, verificar normalmente si el padre no está verificando
      else if (initialSetupComplete.current) {
        checkRoomAvailabilityIfNeeded();
      }
    }
  }, [roomId, formCheckInDate, formCheckOutDate, checkRoomAvailabilityIfNeeded, parentIsCheckingAvailability]);

  // Conectar con el sistema de WebSockets existente
  // En lugar de duplicar los listeners, usamos el sistema de invalidación de cache de RTK Query
  useEffect(() => {
    if (!roomId || !formCheckInDate || !formCheckOutDate) return;

    // Función para forzar la verificación de disponibilidad
    const forceAvailabilityCheck = () => {
      verificationsBlocked.current = false;
      checkRoomAvailabilityIfNeeded();
    };

    // Suscribirse a los eventos relevantes para nuestro calendario
    const unsubscribeNew = socketService.onNewReservation(() => {
      // Invalidar la cache de disponibilidad para esta habitación
      dispatch(
        reservationApi.util.invalidateTags([
          { type: "RoomAvailability", id: `${roomId}-${formCheckInDate}-${formCheckOutDate}-${reservationId}` },
        ])
      );
      forceAvailabilityCheck();
    });

    const unsubscribeUpdated = socketService.onReservationUpdated(() => {
      dispatch(
        reservationApi.util.invalidateTags([
          { type: "RoomAvailability", id: `${roomId}-${formCheckInDate}-${formCheckOutDate}-${reservationId}` },
        ])
      );
      forceAvailabilityCheck();
    });

    const unsubscribeDeleted = socketService.onReservationDeleted(() => {
      dispatch(
        reservationApi.util.invalidateTags([
          { type: "RoomAvailability", id: `${roomId}-${formCheckInDate}-${formCheckOutDate}-${reservationId}` },
        ])
      );

      // Dar tiempo para que el backend procese la eliminación
      setTimeout(forceAvailabilityCheck, 500);
    });

    const unsubscribeAvailability = socketService.onAvailabilityChanged(() => {
      dispatch(
        reservationApi.util.invalidateTags([
          { type: "RoomAvailability", id: `${roomId}-${formCheckInDate}-${formCheckOutDate}-${reservationId}` },
        ])
      );
      forceAvailabilityCheck();
    });

    return () => {
      unsubscribeNew();
      unsubscribeUpdated();
      unsubscribeDeleted();
      unsubscribeAvailability();
    };
  }, [roomId, formCheckInDate, formCheckOutDate, checkRoomAvailabilityIfNeeded, dispatch, reservationId]);

  // ====== INICIALIZACIÓN DEL FORMULARIO ======
  useEffect(() => {
    if (!calendarState.formInitialized) {
      // Obtener valores actuales del formulario
      const currentCheckInDate = form.getValues("checkInDate");
      const currentCheckOutDate = form.getValues("checkOutDate");

      // Solo actualizar si los valores no están ya establecidos
      if (!currentCheckInDate) {
        form.setValue("checkInDate", reservation.checkInDate, { shouldValidate: false, shouldDirty: false });
      }
      if (!currentCheckOutDate) {
        form.setValue("checkOutDate", reservation.checkOutDate, { shouldValidate: false, shouldDirty: false });
      }

      // Marcar como inicializado
      setCalendarState((prev) => ({
        ...prev,
        formInitialized: true,
      }));
    }
  }, [form, reservation, calendarState.formInitialized]);

  // Cambio de pestaña
  const handleTabChange = (tab: string) => {
    setCalendarState((prev) => ({
      ...prev,
      activeTab: tab as "checkin" | "checkout",
    }));
  };

  // Función unificada para actualizar el estado y el caché
  const updateState = useCallback(
    (updates: Partial<typeof calendarState>) => {
      if (isUpdating.current) return;

      isUpdating.current = true;

      try {
        // Actualizar estado local
        setCalendarState((prev) => ({
          ...prev,
          ...updates,
          renderCount: prev.renderCount + 1,
        }));

        // Actualizar caché
        if (calendarStateCache.has(reservationId)) {
          const cached = calendarStateCache.get(reservationId)!;
          calendarStateCache.set(reservationId, {
            ...cached,
            ...("checkInDate" in updates ? { checkInDate: updates.checkInDate as Date } : {}),
            ...("checkOutDate" in updates ? { checkOutDate: updates.checkOutDate as Date } : {}),
            ...("checkInTime" in updates ? { checkInTime: updates.checkInTime as string } : {}),
            ...("checkOutTime" in updates ? { checkOutTime: updates.checkOutTime as string } : {}),
            lastUpdate: Date.now(),
          });
        }
      } finally {
        // Garantizar que isUpdating se restablezca
        setTimeout(() => {
          isUpdating.current = false;
        }, 300);
      }
    },
    [reservationId]
  );

  // Cambio de fecha de check-in
  const handleCheckInDateChange = useCallback(
    (date: Date | undefined) => {
      if (!date || isUpdating.current) return;

      let newCheckOutDate = calendarState.checkOutDate;

      // Si checkout es antes o igual al nuevo check-in, ajustarlo
      if (calendarState.checkOutDate <= date || isSameDay(calendarState.checkOutDate, date)) {
        newCheckOutDate = addDays(date, 1);
      }

      // Actualizar formulario
      const checkInISO = formDateToPeruISO(
        format(date, "yyyy-MM-dd"),
        true,
        calendarState.checkInTime,
        DEFAULT_CHECKOUT_TIME
      );

      form.setValue("checkInDate", checkInISO, { shouldValidate: true, shouldDirty: true });

      // Si cambió el checkout, actualizarlo también
      if (newCheckOutDate !== calendarState.checkOutDate) {
        const checkOutISO = formDateToPeruISO(
          format(newCheckOutDate, "yyyy-MM-dd"),
          false,
          DEFAULT_CHECKIN_TIME,
          calendarState.checkOutTime
        );

        form.setValue("checkOutDate", checkOutISO, { shouldValidate: true, shouldDirty: true });
      }

      // Actualizar estado
      updateState({
        checkInDate: date,
        checkOutDate: newCheckOutDate,
      });
    },
    [calendarState, form, updateState]
  );

  // Cambio de fecha de check-out
  const handleCheckOutDateChange = useCallback(
    (date: Date | undefined) => {
      if (!date || isUpdating.current) return;

      // Actualizar formulario
      const checkOutISO = formDateToPeruISO(
        format(date, "yyyy-MM-dd"),
        false,
        DEFAULT_CHECKIN_TIME,
        calendarState.checkOutTime
      );

      form.setValue("checkOutDate", checkOutISO, { shouldValidate: true, shouldDirty: true });

      // Actualizar estado
      updateState({
        checkOutDate: date,
      });
    },
    [calendarState, form, updateState]
  );

  // Cambio de hora de check-in
  const handleCheckInTimeChange = useCallback(
    (timeStr: string) => {
      if (timeStr === calendarState.checkInTime || isUpdating.current) return;

      // Actualizar formulario
      const checkInISO = formDateToPeruISO(
        format(calendarState.checkInDate, "yyyy-MM-dd"),
        true,
        timeStr,
        DEFAULT_CHECKOUT_TIME
      );

      form.setValue("checkInDate", checkInISO, { shouldValidate: true, shouldDirty: true });

      // Actualizar estado
      updateState({
        checkInTime: timeStr,
      });
    },
    [calendarState, form, updateState]
  );

  // Cambio de hora de check-out
  const handleCheckOutTimeChange = useCallback(
    (timeStr: string) => {
      if (timeStr === calendarState.checkOutTime || isUpdating.current) return;

      // Actualizar formulario
      const checkOutISO = formDateToPeruISO(
        format(calendarState.checkOutDate, "yyyy-MM-dd"),
        false,
        DEFAULT_CHECKIN_TIME,
        timeStr
      );

      form.setValue("checkOutDate", checkOutISO, { shouldValidate: true, shouldDirty: true });

      // Actualizar estado
      updateState({
        checkOutTime: timeStr,
      });
    },
    [calendarState, form, updateState]
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
    <div className="space-y-4">
      <Tabs defaultValue="checkin" value={calendarState.activeTab} onValueChange={handleTabChange}>
        <div className="w-full flex justify-center">
          <TabsList className="grid grid-cols-2 !mb-4">
            <TabsTrigger value="checkin">Check-in</TabsTrigger>
            <TabsTrigger value="checkout">Check-out</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="checkin" className="space-y-4 items-center">
          <div className="items-center flex flex-col justify-center">
            <div className="gap-8 flex flex-col items-center h-fit">
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
                <h3 className="font-semibold text-center">Hora de Check-in</h3>
                <p className="text-sm text-muted-foreground">
                  {format(calendarState.checkInDate, "EEEE, d 'de' MMMM, yyyy", {
                    locale: es,
                  })}
                </p>
                <p className="text-xs text-muted-foreground font-semibold text-center">Horario de Lima (GMT-5)</p>

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
            <div className="gap-8 flex flex-col items-center h-fit">
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
                <h3 className="font-semibold text-center">Hora de Check-out</h3>
                <p className="text-sm text-muted-foreground">
                  {format(calendarState.checkOutDate, "EEEE, d 'de' MMMM, yyyy", {
                    locale: es,
                  })}
                </p>
                <p className="text-xs text-muted-foreground font-semibold text-center">Horario de Lima (GMT-5)</p>

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
                isCheckingAvailability || parentIsCheckingAvailability
                  ? "bg-yellow-100 text-yellow-800"
                  : isAvailable
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
              )}
            >
              {isCheckingAvailability || parentIsCheckingAvailability
                ? "Verificando disponibilidad..."
                : isAvailable
                  ? "Habitación disponible para estas fechas"
                  : "Habitación no disponible para estas fechas"}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
