import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, CheckCircle, Clock, ListCheck, MapPinHouse, UserRoundCheck } from "lucide-react";
import { UseFieldArrayReturn, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { CustomFormDescription } from "@/components/form/CustomFormDescription";
import ErrorMessageForm from "@/components/form/ErrorMessageForm";
import LoadingFormSkeleton from "@/components/form/LoadingFormSkeleton";
import { TextareaWithIcon } from "@/components/form/TextareaWithIcon";
import { InputWithIcon } from "@/components/input-with-icon";
import { AutoComplete } from "@/components/ui/autocomplete";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { processError } from "@/utils/process-error";
import { useReservation } from "../../_hooks/use-reservation";
import { useAllAvailableRoomsInTimeIntervalForUpdate } from "../../_hooks/use-roomAvailability";
import { DetailedReservation, DetailedRoom, UpdateReservationInput } from "../../_schemas/reservation.schemas";
import { FORMSTATICS, UPDATE_FORMSTATICS } from "../../_statics/forms";
import { GenericAvailabilityFormUpdateParams } from "../../_types/room-availability-query-params";
import UpdateBookingCalendarTime from "./UpdateBookingCalendarTime";
import UpdateHeaderReservation from "./UpdateHeaderReservation";
import UpdateReservationGuestTable from "./UpdateReservationGuestTable";

interface UpdateReservationFormProps {
  children: React.ReactNode;
  form: UseFormReturn<UpdateReservationInput>;
  reservation: DetailedReservation;
  controlledFieldArray: UseFieldArrayReturn<UpdateReservationInput>;
  onSubmit: (data: UpdateReservationInput) => void;
}

export default function UpdateReservationForm({
  children,
  form,
  onSubmit,
  reservation,
  controlledFieldArray,
}: UpdateReservationFormProps) {
  // Referencias para optimizar verificaciones y estados
  const initialLoadCompleted = useRef(false);
  const reservationId = reservation.id;
  const availabilityCheckRef = useRef({
    lastCheckInDate: "",
    lastCheckOutDate: "",
    lastRoomId: "",
    isChecking: false,
    timeoutId: null as NodeJS.Timeout | null,
    forceCheck: false,
  });

  // Estados de UI
  const [allowGuests, setAllowGuests] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<DetailedRoom | undefined>(reservation.room);
  const [isRoomAvailable, setIsRoomAvailable] = useState(true);

  // Estado para coordinar verificaciones entre padre e hijo
  const [isParentCheckingAvailability, setIsParentCheckingAvailability] = useState(false);

  // Extraer utilidades del formulario
  const { watch, register } = form;

  // Valores observados del formulario
  const checkInDate = watch("checkInDate");
  const checkOutDate = watch("checkOutDate");
  const roomId = watch("roomId");

  // Configuración para verificar disponibilidad
  const defaultCheckInCheckOutDates: GenericAvailabilityFormUpdateParams = {
    checkInDate,
    checkOutDate,
    reservationId,
  };

  // Hook para verificar disponibilidad
  const { isLoading, isError, error, availableRooms, checkAvailability, refetch } =
    useAllAvailableRoomsInTimeIntervalForUpdate(defaultCheckInCheckOutDates, reservationId);

  // Hook para obtener razones
  const { useAllReasonsQuery } = useReservation();
  const { data: reasons, isLoading: isLoadingReasons } = useAllReasonsQuery();

  // Efecto que ejecuta la verificación cuando cambian los valores importantes
  useEffect(() => {
    // Solo verificar si hay valores válidos
    if (!roomId || !checkInDate || !checkOutDate) {
      return;
    }

    // Copiar referencia para el cleanup
    const currentRef = availabilityCheckRef.current;

    // Limpiar timeout anterior si existe
    if (currentRef.timeoutId) {
      clearTimeout(currentRef.timeoutId);
    }

    // Resetear flag de checking cuando cambian los valores
    if (currentRef.isChecking) {
      currentRef.isChecking = false;
      setIsParentCheckingAvailability(false);
    }

    // Convertir las fechas a strings ISO para la comparación
    const checkInDateStr =
      checkInDate && typeof checkInDate === "object" && "toISOString" in checkInDate
        ? (checkInDate as Date).toISOString()
        : String(checkInDate);
    const checkOutDateStr =
      checkOutDate && typeof checkOutDate === "object" && "toISOString" in checkOutDate
        ? (checkOutDate as Date).toISOString()
        : String(checkOutDate);

    // Verificar si ya hemos procesado esta combinación
    if (
      currentRef.lastCheckInDate === checkInDateStr &&
      currentRef.lastCheckOutDate === checkOutDateStr &&
      currentRef.lastRoomId === roomId &&
      !currentRef.forceCheck
    ) {
      return;
    }

    // Si es un force check, resetear el flag
    if (currentRef.forceCheck) {
      currentRef.forceCheck = false;
    }

    // Si ya está verificando, no hacer nada
    if (currentRef.isChecking) {
      return;
    }

    // Actualizar referencias antes de la verificación
    currentRef.lastCheckInDate = checkInDateStr;
    currentRef.lastCheckOutDate = checkOutDateStr;
    currentRef.lastRoomId = roomId;
    currentRef.isChecking = true;

    // Señalar que estamos verificando
    setIsParentCheckingAvailability(true);

    // Debounce: esperar 500ms antes de verificar
    currentRef.timeoutId = setTimeout(() => {
      // Realizar la verificación
      checkAvailability({
        checkInDate: checkInDateStr,
        checkOutDate: checkOutDateStr,
        reservationId,
      });

      // Marcar como completada la verificación
      currentRef.isChecking = false;
      setIsParentCheckingAvailability(false);
    }, 500);

    // Cleanup
    return () => {
      if (currentRef.timeoutId) {
        clearTimeout(currentRef.timeoutId);
      }
    };
  }, [roomId, checkInDate, checkOutDate, reservationId, checkAvailability]);

  // Manejo de errores en la verificación
  useEffect(() => {
    if (isError && error) {
      const processedError = processError(error);
      toast.error(`Error al verificar disponibilidad: ${processedError}`);
    }
  }, [isError, error]);

  // Efecto para marcar cuando la carga inicial se ha completado
  useEffect(() => {
    if (!isLoading && !initialLoadCompleted.current) {
      initialLoadCompleted.current = true;
    }
  }, [isLoading]);

  // Funciones de manejo de huéspedes optimizadas
  const handleAddGuest = useCallback(() => {
    controlledFieldArray.append({
      name: "",
      age: 0,
      documentType: "DNI",
      documentId: "",
      phone: undefined,
      email: undefined,
      additionalInfo: undefined,
    });
  }, [controlledFieldArray]);

  const handleRemoveGuest = useCallback(
    (index: number) => {
      controlledFieldArray.remove(index);
    },
    [controlledFieldArray]
  );

  // Opciones de habitaciones
  const roomOptions = useMemo(
    () =>
      availableRooms?.map((room) => {
        const roomNumber = room.number ?? "Sin número";
        const roomType = room.RoomTypes?.name.toUpperCase() ?? "Sin tipo";
        const roomPrice = room.RoomTypes?.price ?? 0;
        const roomCapacity = room.RoomTypes?.guests ?? 0;

        return {
          label: `${roomNumber} - ${roomType} ( ${roomCapacity}🧍) - ${roomPrice.toLocaleString("es-PE", {
            style: "currency",
            currency: "PEN",
          })}`,
          value: room.id as string,
        };
      }) ?? [],
    [availableRooms]
  );

  const onRoomSelected = useCallback((room?: DetailedRoom) => {
    if (!room) return;
    setSelectedRoom(room);
  }, []);

  // Componente para mostrar el estado de disponibilidad
  const AvailabilityStatus = () => {
    if (!roomId) return null;

    if (isParentCheckingAvailability) {
      return (
        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <Clock className="h-4 w-4 text-blue-600 animate-spin" />
          <span className="text-sm font-medium text-blue-800">Verificando disponibilidad de la habitación...</span>
        </div>
      );
    }

    if (isRoomAvailable) {
      return (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium text-green-800">
            Habitación disponible para las fechas seleccionadas
          </span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
        <AlertCircle className="h-4 w-4 text-red-600" />
        <div className="flex-1">
          <span className="text-sm font-medium text-red-800 block">Habitación no disponible</span>
          <span className="text-xs text-red-600">
            La habitación seleccionada no está disponible para estas fechas. Por favor, selecciona otras fechas o una
            habitación diferente.
          </span>
        </div>
      </div>
    );
  };

  // Estados de carga y error - Solo mostrar loading skeleton en la carga inicial
  if (isLoading && !initialLoadCompleted.current) {
    return <LoadingFormSkeleton />;
  }

  if (isError) {
    return <ErrorMessageForm error={error} refetch={refetch} />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 grid grid-cols-1 gap-4 px-6">
        <div>
          <UpdateHeaderReservation
            availableRooms={availableRooms}
            form={form}
            onRoomSelected={onRoomSelected}
            reservation={reservation}
            roomOptions={roomOptions}
          />
        </div>

        <Separator />

        {/* Selección de fechas - Solo visible si la reserva no está en el pasado */}
        <div className="space-y-4">
          <UpdateBookingCalendarTime
            form={form}
            roomId={roomId}
            onRoomAvailabilityChange={setIsRoomAvailable}
            reservation={reservation}
            parentIsCheckingAvailability={isParentCheckingAvailability}
          />
          <CustomFormDescription required={UPDATE_FORMSTATICS.observations.required} validateOptionalField={false} />

          {/* Errores de validación de fechas */}
          {form.formState.errors.checkInDate || form.formState.errors.checkOutDate ? (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <div className="flex-1">
                <span className="text-sm font-medium text-red-800 block">Error en las fechas seleccionadas</span>
                <span className="text-xs text-red-600">
                  {form.formState.errors.checkInDate?.message || form.formState.errors.checkOutDate?.message}
                </span>
              </div>
            </div>
          ) : null}

          {/* Estado de disponibilidad mejorado */}
          <AvailabilityStatus />
        </div>

        <Separator />

        <FormField
          control={form.control}
          name="origin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{UPDATE_FORMSTATICS.origin.label}</FormLabel>
              <FormControl>
                <InputWithIcon {...field} Icon={MapPinHouse} placeholder={UPDATE_FORMSTATICS.origin.placeholder} />
              </FormControl>
              <CustomFormDescription required={UPDATE_FORMSTATICS.origin.required} validateOptionalField={true} />
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        {/* Sección de huéspedes - Solo mostrar si la habitación permite más de 1 huésped */}
        {selectedRoom?.RoomTypes?.guests && selectedRoom.RoomTypes.guests > 1 && (
          <div>
            <div className="mb-4">
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>¿Acompañantes?</FormLabel>
                  <FormDescription>
                    Puede agregar mas acompañantes dependiendo de la capacidad del tipo de habitación que escoja.
                    {selectedRoom?.RoomTypes?.guests && (
                      <span>
                        {" "}
                        Puede agregar hasta{" "}
                        <span className="text-base font-bold">{selectedRoom?.RoomTypes?.guests - 1}</span> acompañantes.
                      </span>
                    )}
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch checked={allowGuests} onCheckedChange={setAllowGuests} />
                </FormControl>
              </FormItem>
            </div>

            {allowGuests && (
              <UpdateReservationGuestTable
                controlledFieldArray={controlledFieldArray}
                form={form}
                handleAddGuest={handleAddGuest}
                handleRemoveGuest={handleRemoveGuest}
                register={register}
                selectedRoom={selectedRoom}
                watch={watch}
              />
            )}
          </div>
        )}

        {/* Mensaje informativo para habitaciones de 1 huésped */}
        {selectedRoom?.RoomTypes?.guests && selectedRoom.RoomTypes.guests === 1 && (
          <div>
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Información del Huésped</FormLabel>
                <FormDescription>
                  Esta habitación es para 1 huésped únicamente. La información del huésped principal se encuentra en la
                  sección de datos del cliente.
                </FormDescription>
              </div>
              <FormControl>
                <UserRoundCheck className="text-primary shrink-0" />
              </FormControl>
            </FormItem>
          </div>
        )}

        <Separator />

        {/* Razón y observaciones - Ocupando las 2 columnas */}
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{FORMSTATICS.reason.label}</FormLabel>
              <FormControl>
                <AutoComplete
                  options={
                    reasons?.map((reason) => ({
                      value: reason.reason,
                      label: reason.reason,
                    })) || []
                  }
                  value={field.value ? { value: field.value, label: field.value } : undefined}
                  onValueChange={(option) => field.onChange(option.label)}
                  placeholder={FORMSTATICS.reason.placeholder}
                  emptyMessage="No se encontraron motivos de estancia"
                  isLoading={isLoadingReasons}
                  allowCustomInput={true}
                />
              </FormControl>
              <CustomFormDescription required={FORMSTATICS.reason.required} validateOptionalField={true} />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="observations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{FORMSTATICS.observations.label}</FormLabel>
              <FormControl>
                <TextareaWithIcon {...field} Icon={ListCheck} placeholder={FORMSTATICS.observations.placeholder} />
              </FormControl>
              <CustomFormDescription required={FORMSTATICS.observations.required} validateOptionalField={true} />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Botones u otros elementos pasados como children */}
        <div>{children}</div>
      </form>
    </Form>
  );
}
