import { useCallback, useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Clock } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { TimeInput } from "@/components/ui/time-input";
import { cn } from "@/lib/utils";
import { socketService } from "@/services/socketService";
import { formDateToPeruISO } from "@/utils/peru-datetime";
import useExtendReservation from "../../_hooks/use-extend-reservation";
import { CreateLateCheckout } from "../../_schemas/extension-reservation.schemas";

interface LateCheckoutTimeInputProps {
  lateCheckoutForm: UseFormReturn<CreateLateCheckout>;
  idReservation: string;
  originalCheckoutDate: Date;
}

// Cache para evitar verificaciones repetidas
const availabilityCache = new Map<
  string,
  {
    timeValue: string;
    isAvailable: boolean;
    timestamp: number;
  }
>();

export default function LateCheckoutTimeInput({
  lateCheckoutForm,
  idReservation,
  originalCheckoutDate,
}: LateCheckoutTimeInputProps) {
  // Referencias para control de estado
  const previousLoadingState = useRef(false);
  const lastCheckedTime = useRef<string | null>(null);

  // Estado para UI
  const [isExtendAvailable, setIsExtendAvailable] = useState<boolean>(true);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState<boolean>(false);

  // Valor actual de la hora
  const lateCheckoutTime = lateCheckoutForm.watch("lateCheckoutTime");

  // Formatear fecha+hora para API con hora personalizada
  const formatDateTimeForAPI = useCallback(
    (time: string) => {
      // Si no hay fecha base o tiempo, no podemos formatear
      if (!originalCheckoutDate || !time) return undefined;

      // Formatear la fecha base como YYYY-MM-DD
      const dateString = format(originalCheckoutDate, "yyyy-MM-dd");

      // Convertir hora de formato HH:MM a formato 12h para la función formDateToPeruISO
      const [hours, minutes] = time.split(":").map(Number);
      const is12HourFormat = hours < 12;
      const formattedHour = is12HourFormat ? hours : hours - 12;
      const ampm = is12HourFormat ? "AM" : "PM";
      const timeString = `${formattedHour}:${minutes.toString().padStart(2, "0")} ${ampm}`;

      // Generar ISO string con hora peruana
      return formDateToPeruISO(
        dateString,
        false, // Es checkout
        "12:00 PM", // Valor por defecto (ignorado)
        timeString // Hora personalizada
      );
    },
    [originalCheckoutDate]
  );

  // Hook para verificación y extensión de reserva
  const formattedCheckoutDateTime = formatDateTimeForAPI(lateCheckoutTime);

  const { isAvailable, isLoadingAvailability } = useExtendReservation({
    id: idReservation,
    newCheckoutDate: formattedCheckoutDateTime,
  });

  // Actualizar estado según API y mostrar toast solo cuando se complete la verificación
  useEffect(() => {
    if (!isLoadingAvailability && lateCheckoutTime) {
      // Ya terminó la carga, actualizar UI
      setIsExtendAvailable(isAvailable);
      setIsCheckingAvailability(false);

      // Solo mostrar toast si anteriormente estaba cargando o el tiempo es diferente al último verificado
      if (previousLoadingState.current || lastCheckedTime.current !== lateCheckoutTime) {
        // Actualizar el último tiempo verificado
        lastCheckedTime.current = lateCheckoutTime;
      }
    } else if (isLoadingAvailability) {
      // Está cargando, actualizar UI
      setIsCheckingAvailability(true);
    }

    // Actualizar referencia del estado anterior
    previousLoadingState.current = isLoadingAvailability;
  }, [isAvailable, isLoadingAvailability, lateCheckoutTime]);

  // Integración con websockets para actualizaciones en tiempo real
  useEffect(() => {
    if (!idReservation) return;

    const unsubscribe = socketService.onCheckoutAvailabilityChecked((data) => {
      // Solo procesar si corresponde a nuestra reserva
      if (data.roomId === idReservation && lateCheckoutTime) {
        const formattedTime = formatDateTimeForAPI(lateCheckoutTime);

        // Si coincide con la hora que estamos verificando
        if (data.newCheckoutDate === formattedTime) {
          setIsExtendAvailable(data.isAvailable);

          // Actualizar caché
          availabilityCache.set(`${idReservation}-${lateCheckoutTime}`, {
            timeValue: lateCheckoutTime,
            isAvailable: data.isAvailable,
            timestamp: Date.now(),
          });
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [idReservation, lateCheckoutTime, isExtendAvailable, formatDateTimeForAPI]);

  // Manejar cambio de hora
  const handleTimeChange = useCallback(
    (time: string) => {
      // Aplicar el cambio al formulario
      lateCheckoutForm.setValue("lateCheckoutTime", time, {
        shouldValidate: true,
        shouldDirty: true,
      });

      // Verificamos si ya tenemos esta hora en caché
      const cacheKey = `${idReservation}-${time}`;
      const cached = availabilityCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < 10000) {
        // Usar el valor en caché si es reciente
        setIsExtendAvailable(cached.isAvailable);
      }

      // Marcar como nuevo tiempo para forzar mostrar toast cuando termine la verificación
      lastCheckedTime.current = time;
    },
    [lateCheckoutForm, idReservation]
  );

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
      <div className="p-5 border-b border-border bg-muted/20">
        <div className="font-medium text-foreground flex items-center">
          <Clock className="h-5 w-5 text-primary mr-3" />
          <h3 className="font-medium"> Configuración de Late Checkout</h3>
        </div>
      </div>

      <div className="px-4 py-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg p-3 text-center justify-center flex flex-col">
            <span className="text-xs uppercase tracking-wide text-muted-foreground block mb-1">Fecha de Salida</span>
            <span className="font-medium text-foreground text-sm">
              {originalCheckoutDate ? format(originalCheckoutDate, "dd/MM/yyyy", { locale: es }) : "N/A"}
            </span>
          </div>

          <div className="rounded-lg p-3">
            <span className="text-xs uppercase tracking-wide text-muted-foreground block mb-1 text-center">
              Hora de Salida
            </span>
            <FormField
              control={lateCheckoutForm.control}
              name="lateCheckoutTime"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormControl>
                    <TimeInput
                      id="late-checkout-time"
                      value={field.value}
                      onTimeChange={(value) => {
                        field.onChange(value);
                        handleTimeChange(value);
                      }}
                      min="12:01"
                      className="border-input mx-auto"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3 text-center">Horario de Lima (GMT-5)</p>

        {/* Indicador de disponibilidad */}
        {lateCheckoutTime && (
          <div
            className={cn(
              "mt-4 p-3 rounded-md text-center font-medium",
              isCheckingAvailability
                ? "bg-yellow-100 text-yellow-800"
                : isExtendAvailable
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
            )}
          >
            {isCheckingAvailability
              ? "Verificando disponibilidad..."
              : isExtendAvailable
                ? `Late checkout disponible a las ${lateCheckoutTime}`
                : `No es posible extender a las ${lateCheckoutTime}`}
          </div>
        )}
      </div>
    </div>
  );
}
