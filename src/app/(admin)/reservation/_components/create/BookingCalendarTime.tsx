"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { addDays, format, isBefore, isSameDay, startOfDay } from "date-fns";
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
  peruDateTimeToUTC,
} from "@/utils/peru-datetime";
import { processError } from "@/utils/process-error";
import { useRoomAvailability } from "../../_hooks/use-roomAvailability";
import { CreateReservationInput } from "../../_schemas/reservation.schemas";

// Función para obtener la fecha y hora actuales en Perú (UTC-5)
const getPeruCurrentDatetime = () => {
  const now = new Date();
  const utcHours = now.getUTCHours();
  const utcMinutes = now.getUTCMinutes();
  const utcSeconds = now.getUTCSeconds();

  // Calculamos la hora de Perú (UTC-5)
  let peruHours = utcHours - 5;
  if (peruHours < 0) {
    peruHours += 24;
  }

  // Creamos una fecha en hora peruana
  const peruDate = new Date(now);
  peruDate.setHours(peruHours, utcMinutes, utcSeconds);

  return {
    date: peruDate,
    hour: peruHours,
    minute: utcMinutes,
  };
};

// Función para obtener la fecha de check-in adecuada
const getAppropriateCheckInDate = (): Date => {
  const peru = getPeruCurrentDatetime();
  const currentHour = peru.hour;

  // Si es después de las 21:00, sugerir el día siguiente
  if (currentHour >= 21) {
    const tomorrow = new Date(peru.date);
    tomorrow.setDate(peru.date.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
  }

  const today = new Date(peru.date);
  today.setHours(0, 0, 0, 0);
  return today;
};

// Función para obtener la hora de check-in adecuada
const getAppropriateCheckInTime = (): string => {
  const peru = getPeruCurrentDatetime();
  const currentHour = peru.hour;
  const currentMinute = peru.minute;

  // Si es antes de las 15:00, usar el DEFAULT_CHECKIN_TIME
  if (currentHour < 15) {
    return DEFAULT_CHECKIN_TIME;
  }

  // Si es después de las 3:00 PM, encontrar la próxima hora disponible
  let nextHour = currentHour;
  if (currentMinute > 0) {
    nextHour += 1;
  }

  // Formatear la hora (formato 12 horas con AM/PM)
  const hourForFormat = nextHour > 12 ? nextHour - 12 : nextHour;
  const amPm = nextHour >= 12 ? "PM" : "AM";
  return `${String(hourForFormat === 0 ? 12 : hourForFormat).padStart(2, "0")}:00 ${amPm}`;
};

// Variable para almacenar valores persistentes (fuera de React)
const persistentData = {
  initialized: false,
  initialValues: {
    checkInDate: new Date(),
    checkOutDate: new Date(),
    checkInTime: DEFAULT_CHECKIN_TIME,
    checkOutTime: DEFAULT_CHECKOUT_TIME,
  },
  currentValues: {
    activeTab: "checkin" as "checkin" | "checkout",
    checkInDate: new Date(),
    checkOutDate: new Date(),
    checkInTime: DEFAULT_CHECKIN_TIME,
    checkOutTime: DEFAULT_CHECKOUT_TIME,
  },
  renderCount: 0,
};

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

  // ====== INICIALIZACIÓN DE DATOS PERSISTENTES ======
  if (!persistentData.initialized) {
    // Solo calculamos estos valores una vez, no importa cuántas veces se renderice el componente
    console.log("🔄 Inicializando datos persistentes");

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

  // ====== ESTADOS DE REACT (SINCRONIZADOS CON DATOS PERSISTENTES) ======
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

  // ====== HOOKS Y MEMORIZACIÓN ======
  // Hook para verificar disponibilidad
  const { isAvailable, isLoading, checkAvailability, isError, error } = useRoomAvailability();

  // Horarios disponibles (memoizados)
  const checkInTimes = useMemo(() => getTimeOptionsForDay("checkin"), []);
  const checkOutTimes = useMemo(() => getTimeOptionsForDay("checkout"), []);

  // ====== INICIALIZACIÓN DEL FORMULARIO ======
  useEffect(() => {
    if (!calendarState.formInitialized) {
      console.log("📋 Inicializando formulario - SOLO UNA VEZ");

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

  // ====== VERIFICAR DISPONIBILIDAD ======
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

  // ====== NOTIFICAR DISPONIBILIDAD ======
  useEffect(() => {
    if (onRoomAvailabilityChange) {
      onRoomAvailabilityChange(isAvailable);
    }
  }, [isAvailable, onRoomAvailabilityChange]);

  // ====== MOSTRAR ERRORES ======
  useEffect(() => {
    if (isError && error) {
      const errorMessage = processError(error);
      toast.error(`Error al verificar disponibilidad: ${errorMessage}`);
    }
  }, [isError, error]);

  // ====== HANDLERS PARA CAMBIOS ======

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
      console.log("⭐ Seleccionando check-in:", format(date, "yyyy-MM-dd"));

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
      console.log("⭐ Seleccionando check-out:", format(date, "yyyy-MM-dd"));

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
      console.log("⏰ Seleccionando hora check-in:", timeStr);

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
      console.log("⏰ Seleccionando hora check-out:", timeStr);

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

  // ====== RENDER DEL COMPONENTE ======
  return (
    <div className="w-full space-y-4">
      <Tabs defaultValue="checkin" value={calendarState.activeTab} onValueChange={handleTabChange} className="w-full">
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
              <ScrollArea className="h-[22rem] w-[250px]">
                <div className="grid gap-2 pr-4">
                  {checkInTimes.map((timeStr) => (
                    <Button
                      key={`${timeStr}-${calendarState.renderCount}`}
                      type="button"
                      variant={timeStr === calendarState.checkInTime ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => handleCheckInTimeChange(timeStr)}
                    >
                      {timeStr}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
          <div className="flex justify-center pt-4">
            <Button variant="outline" onClick={() => handleTabChange("checkout")} className="w-fit text-wrap">
              Siguiente: Seleccionar Check-out
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="checkout" className="space-y-4">
          <div className="w-auto space-x-10 flex-wrap flex items-start h-fit">
            <div className="space-y-4">
              <h3 className="font-semibold">Fecha de Check-out</h3>
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
              <ScrollArea className="h-[22rem] w-[250px]">
                <div className="grid gap-2 pr-4">
                  {checkOutTimes.map((timeStr) => (
                    <Button
                      key={`${timeStr}-${calendarState.renderCount}`}
                      variant={timeStr === calendarState.checkOutTime ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => handleCheckOutTimeChange(timeStr)}
                    >
                      {timeStr}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
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
