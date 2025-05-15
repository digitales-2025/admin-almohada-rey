import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { isBefore, isSameDay } from "date-fns";
import { ListCheck, MapPinHouse, UserRoundCheck } from "lucide-react";
import { UseFieldArrayReturn, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { CustomFormDescription } from "@/components/form/CustomFormDescription";
import ErrorMessageForm from "@/components/form/ErrorMessageForm";
import LoadingFormSkeleton from "@/components/form/LoadingFormSkeleton";
import { TextareaWithIcon } from "@/components/form/TextareaWithIcon";
import { InputWithIcon } from "@/components/input-with-icon";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { formatPeruBookingDate, getPeruStartOfToday } from "@/utils/peru-datetime";
import { processError } from "@/utils/process-error";
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

// Singleton para controlar las verificaciones de disponibilidad entre todos los componentes
const availabilityControlSingleton = {
  lastCheckedValues: new Map<
    string,
    {
      roomId: string;
      checkInDate: string;
      checkOutDate: string;
    }
  >(),
  isChecking: new Set<string>(),
};

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

  // Estados de UI
  const [allowGuests, setAllowGuests] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<DetailedRoom | undefined>(reservation.room);
  const [isRoomAvailable, setIsRoomAvailable] = useState(true);

  // Estado para coordinar verificaciones entre padre e hijo
  const [isParentCheckingAvailability, setIsParentCheckingAvailability] = useState(false);

  // Determinación de reservación en el pasado (memoizada)
  const reservationCheckInIsInThePast = useMemo(() => {
    const today = getPeruStartOfToday();
    const reservationDate = new Date(reservation.checkInDate);
    return isBefore(reservationDate, today) || isSameDay(reservationDate, today);
  }, [reservation.checkInDate]);

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

  // Función optimizada para verificar disponibilidad (reutilizable)
  const verifyAvailability = useCallback(() => {
    // Solo verificar si hay valores válidos y no estamos en el pasado
    if (!roomId || !checkInDate || !checkOutDate || reservationCheckInIsInThePast) {
      return;
    }

    // Crear ID único para esta verificación
    const verificationId = `${reservationId}-${roomId}`;

    // Evitar verificaciones simultáneas
    if (availabilityControlSingleton.isChecking.has(verificationId)) {
      return;
    }

    // Verificar si esta combinación ya se procesó
    const lastCheckedValue = availabilityControlSingleton.lastCheckedValues.get(verificationId);
    if (
      lastCheckedValue &&
      lastCheckedValue.roomId === roomId &&
      lastCheckedValue.checkInDate === checkInDate &&
      lastCheckedValue.checkOutDate === checkOutDate
    ) {
      return;
    }

    // Marcar como verificando
    availabilityControlSingleton.isChecking.add(verificationId);
    // Señalar que estamos verificando (para coordinar con el componente hijo)
    setIsParentCheckingAvailability(true);

    try {
      // Actualizar registro de valores verificados
      availabilityControlSingleton.lastCheckedValues.set(verificationId, {
        roomId,
        checkInDate,
        checkOutDate,
      });

      // Realizar la verificación
      checkAvailability({
        checkInDate,
        checkOutDate,
        reservationId,
      });
    } finally {
      // Quitar marca de verificación después de un tiempo
      setTimeout(() => {
        availabilityControlSingleton.isChecking.delete(verificationId);
        setIsParentCheckingAvailability(false);
      }, 300);
    }
  }, [roomId, checkInDate, checkOutDate, reservationId, reservationCheckInIsInThePast, checkAvailability]);

  // Efecto que ejecuta la verificación cuando cambian los valores importantes
  useEffect(() => {
    verifyAvailability();
  }, [verifyAvailability]);

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

  // Funciones de manejo de huéspedes
  const handleAddGuest = () => {
    controlledFieldArray.append({
      name: "",
      age: 0,
      documentType: "DNI",
      documentId: "",
      phone: undefined,
      email: undefined,
      additionalInfo: undefined,
    });
  };

  const handleRemoveGuest = (index: number) => {
    controlledFieldArray.remove(index);
  };

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

  // Estados de carga y error - Solo mostrar loading skeleton en la carga inicial
  if (isLoading && !initialLoadCompleted.current) {
    return <LoadingFormSkeleton />;
  }

  if (isError) {
    return <ErrorMessageForm error={error} refetch={refetch} />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 grid grid-cols-1 sm:grid-cols-2 gap-4 px-6">
        {/* Header - Siempre ocupa 2 columnas */}
        <div className="col-span-2">
          <UpdateHeaderReservation
            availableRooms={availableRooms}
            form={form}
            onRoomSelected={onRoomSelected}
            reservation={reservation}
            roomOptions={roomOptions}
          />
        </div>

        <Separator className="col-span-2" />

        {/* Selección de fechas - Solo visible si la reserva no está en el pasado */}
        <div className="col-span-2">
          {!reservationCheckInIsInThePast ? (
            <div className="space-y-2">
              <UpdateBookingCalendarTime
                form={form}
                roomId={roomId}
                onRoomAvailabilityChange={setIsRoomAvailable}
                reservation={reservation}
                parentIsCheckingAvailability={isParentCheckingAvailability}
              />
              <CustomFormDescription
                required={UPDATE_FORMSTATICS.observations.required}
                validateOptionalField={false}
              />
              {form.formState.errors.checkInDate || form.formState.errors.checkOutDate ? (
                <FormMessage className="text-destructive">
                  {form.formState.errors.checkInDate?.message || form.formState.errors.checkOutDate?.message}
                </FormMessage>
              ) : null}

              {!isRoomAvailable && roomId && (
                <FormMessage className="text-destructive">
                  La habitación seleccionada no está disponible para estas fechas. Por favor, selecciona otras fechas o
                  una habitación diferente.
                </FormMessage>
              )}
            </div>
          ) : (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Reserva en el pasado</FormLabel>
                <FormDescription>
                  La reserva no puede ser editada o reprogramada porque la fecha de check-in es anterior a la fecha
                  actual.
                </FormDescription>
                <FormDescription>
                  <span className="block">
                    Fecha de check-in: {formatPeruBookingDate(reservation.checkInDate).localeDateString}
                  </span>
                  <span className="block">
                    Fecha de check-out: {formatPeruBookingDate(reservation.checkOutDate).localeDateString}
                  </span>
                </FormDescription>
              </div>
              <FormControl>
                <UserRoundCheck className="text-primary shrink-0" />
              </FormControl>
            </FormItem>
          )}
        </div>

        <Separator className="col-span-2" />

        <FormField
          control={form.control}
          name="origin"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>{UPDATE_FORMSTATICS.origin.label}</FormLabel>
              <FormControl>
                <InputWithIcon {...field} Icon={MapPinHouse} placeholder={UPDATE_FORMSTATICS.origin.placeholder} />
              </FormControl>
              <CustomFormDescription required={UPDATE_FORMSTATICS.origin.required} validateOptionalField={true} />
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator className="col-span-2" />

        {/* Sección de huéspedes - Siempre ocupa 2 columnas */}
        <div className="col-span-2">
          {selectedRoom?.RoomTypes?.guests && (
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
          )}

          {allowGuests && selectedRoom?.RoomTypes?.guests && (
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

        <Separator className="col-span-2" />

        {/* Razón y observaciones - Ocupando las 2 columnas */}
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>{FORMSTATICS.reason.label}</FormLabel>
              <FormControl>
                <TextareaWithIcon {...field} Icon={UserRoundCheck} placeholder={FORMSTATICS.reason.placeholder} />
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
            <FormItem className="col-span-2">
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
        <div className="col-span-2">{children}</div>
      </form>
    </Form>
  );
}
