import { useCallback, useEffect, useRef, useState } from "react";
import { addDays, format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { CalendarBig } from "@/components/form/CalendarBig";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { socketService } from "@/services/socketService";
import { DEFAULT_CHECKOUT_TIME, formDateToPeruISO } from "@/utils/peru-datetime";
import useExtendReservation from "../../_hooks/use-extend-reservation";
import { CreateExtendStay } from "../../_schemas/extension-reservation.schemas";

interface ExtendedBookingCalendarProps {
  extendStayForm: UseFormReturn<CreateExtendStay>;
  renderCount: number;
  isDateDisabled: (date: Date) => boolean;
  originalCheckoutDate: Date;
  idReservation: string;
}

// Cache para evitar verificaciones repetidas
const availabilityCache = new Map<
  string,
  {
    newCheckoutDate: string;
    isAvailable: boolean;
    timestamp: number;
  }
>();

export default function ExtendedBookingCalendar({
  extendStayForm,
  renderCount,
  isDateDisabled,
  originalCheckoutDate,
  idReservation,
}: ExtendedBookingCalendarProps) {
  // Referencias para control de estado
  const lastCheckedDate = useRef<string | null>(null);
  const hasToastShown = useRef<Record<string, boolean>>({});

  // Estado para UI
  const [isExtendAvailable, setIsExtendAvailable] = useState<boolean>(true);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState<boolean>(false);

  // Valor actual del formulario
  const newCheckoutDate = extendStayForm.watch("newCheckoutDate");

  // Formatear fecha para API con hora peruana a las 14:00
  function formatDateForAPI(date: Date): string {
    return formDateToPeruISO(
      format(date, "yyyy-MM-dd"),
      false, // Es checkout
      "12:00 PM", // Hora peruana por defecto para checkout
      DEFAULT_CHECKOUT_TIME // 14:00 hora peruana
    );
  }

  // Formatear fecha para mostrar en mensajes toast (más amigable)
  function formatDateForDisplay(date: Date): string {
    return format(date, "dd 'de' MMMM, yyyy", { locale: es });
  }

  // Hook para verificación y extensión de reserva
  const formattedNewCheckoutDate = newCheckoutDate ? formatDateForAPI(newCheckoutDate) : undefined;

  const { isAvailable, isLoadingAvailability } = useExtendReservation({
    id: idReservation,
    newCheckoutDate: formattedNewCheckoutDate,
  });

  // Mostrar toast según disponibilidad (con control para no mostrar múltiples veces)
  const showAvailabilityToast = useCallback(
    (available: boolean, date: Date) => {
      const formattedDisplayDate = formatDateForDisplay(date);
      const cacheKey = `${idReservation}-${formattedDisplayDate}-${available}`;

      // Evitar mostrar el mismo toast múltiples veces
      if (hasToastShown.current[cacheKey]) return;

      if (available) {
        toast.success(`¡Disponible! Puedes extender la reserva hasta el ${formattedDisplayDate}`, {
          id: `extend-available-${idReservation}`,
          duration: 3000,
        });
      } else {
        toast.error(`No es posible extender la reserva hasta el ${formattedDisplayDate}`, {
          id: `extend-unavailable-${idReservation}`,
          duration: 3000,
        });
      }

      // Marcar como mostrado
      hasToastShown.current[cacheKey] = true;

      // Resetear después de un tiempo para permitir mostrar de nuevo si hay cambios
      setTimeout(() => {
        hasToastShown.current[cacheKey] = false;
      }, 5000);
    },
    [idReservation]
  );

  // Actualizar estado según API y mostrar toast
  useEffect(() => {
    if (!isLoadingAvailability && newCheckoutDate) {
      setIsExtendAvailable(isAvailable);
      setIsCheckingAvailability(false);

      // Mostrar toast sobre el resultado
      showAvailabilityToast(isAvailable, newCheckoutDate);
    } else if (isLoadingAvailability) {
      setIsCheckingAvailability(true);
    }
  }, [isAvailable, isLoadingAvailability, newCheckoutDate, showAvailabilityToast]);

  // Integración con websockets para actualizaciones en tiempo real
  useEffect(() => {
    if (!idReservation) return;

    const unsubscribe = socketService.onCheckoutAvailabilityChecked((data) => {
      // Solo procesar si corresponde a nuestra reserva
      if (data.roomId === idReservation) {
        // Si hay una fecha de checkout seleccionada actualmente
        if (newCheckoutDate) {
          const formattedSelectedDate = formatDateForAPI(newCheckoutDate);

          // Si coinciden las fechas que estamos verificando
          if (data.newCheckoutDate === formattedSelectedDate) {
            setIsExtendAvailable(data.isAvailable);

            // Mostrar toast si el resultado cambió (por ejemplo, otra reserva tomó esas fechas)
            if (isExtendAvailable !== data.isAvailable) {
              showAvailabilityToast(data.isAvailable, newCheckoutDate);
            }

            // Actualizar caché
            availabilityCache.set(`${idReservation}-${formattedSelectedDate}`, {
              newCheckoutDate: formattedSelectedDate,
              isAvailable: data.isAvailable,
              timestamp: Date.now(),
            });
          }
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [idReservation, newCheckoutDate, isExtendAvailable, showAvailabilityToast]);

  // Manejar cambio de fecha seleccionada
  const handleDateChange = useCallback(
    (selectedDate: Date | undefined) => {
      if (!selectedDate) return;

      // Aplicar el cambio al formulario
      extendStayForm.setValue("newCheckoutDate", selectedDate, {
        shouldValidate: true,
        shouldDirty: true,
      });

      // Verificamos si ya tenemos esta fecha en caché
      const formattedDate = formatDateForAPI(selectedDate);
      const cacheKey = `${idReservation}-${formattedDate}`;
      const cached = availabilityCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < 10000) {
        // Usar el valor en caché si es reciente
        setIsExtendAvailable(cached.isAvailable);

        // Mostrar toast con resultado de caché
        setTimeout(() => {
          showAvailabilityToast(cached.isAvailable, selectedDate);
        }, 1000);
      }

      // Guardar la última fecha verificada para evitar duplicados
      lastCheckedDate.current = formattedDate;
    },
    [extendStayForm, idReservation, showAvailabilityToast]
  );

  return (
    <FormField
      control={extendStayForm.control}
      name="newCheckoutDate"
      render={({ field }) => (
        <FormItem className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
          <div className="p-5 border-b border-border bg-muted/20">
            <FormLabel className="font-medium flex items-center m-0">
              <Calendar className="h-5 w-5 text-primary mr-3" />
              Seleccione Nueva Fecha de Salida
            </FormLabel>
          </div>
          <div className="p-6">
            <FormControl>
              <div className="flex justify-center">
                <CalendarBig
                  key={`extend-stay-calendar-${renderCount}`}
                  locale={es}
                  mode="single"
                  selected={field.value}
                  onSelect={(date) => {
                    // Manejar solo Date | undefined (ignorar DateRange)
                    if (date instanceof Date || date === undefined) {
                      handleDateChange(date);
                    }
                  }}
                  disabled={(date) => isDateDisabled(date)}
                  defaultMonth={field.value || addDays(originalCheckoutDate, 1)}
                  className="rounded-md border border-border"
                />
              </div>
            </FormControl>
            <p className="text-sm text-center mt-3 text-muted-foreground">
              {field.value ? format(field.value, "EEEE, d 'de' MMMM, yyyy", { locale: es }) : "Seleccione una fecha"}
            </p>
            <FormMessage className="text-center mt-1" />

            {/* Indicador de disponibilidad */}
            {newCheckoutDate && (
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
                    ? "Extensión disponible para esta fecha"
                    : "No es posible extender hasta esta fecha"}
              </div>
            )}
          </div>
        </FormItem>
      )}
    />
  );
}
