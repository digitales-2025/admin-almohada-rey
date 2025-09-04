import React, { useEffect, useRef, useState } from "react";
import { ListCheck, MapPinHouse } from "lucide-react";
import { UseFieldArrayReturn, UseFormReturn } from "react-hook-form";

import { Customer } from "@/app/(admin)/customers/_types/customer";
import { CustomFormDescription } from "@/components/form/CustomFormDescription";
import ErrorMessageForm from "@/components/form/ErrorMessageForm";
import LoadingFormSkeleton from "@/components/form/LoadingFormSkeleton";
import { TextareaWithIcon } from "@/components/form/TextareaWithIcon";
import { InputWithIcon } from "@/components/input-with-icon";
import { AutoComplete } from "@/components/ui/autocomplete";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { SelectOption } from "@/types/form/select-option";
import { useReservation } from "../../_hooks/use-reservation";
import { useAllAvailableRoomsInTimeInterval } from "../../_hooks/use-roomAvailability";
import {
  CreateReservationInput,
  DetailedRoom,
  reservationStatusSelectOptions,
} from "../../_schemas/reservation.schemas";
import { FORMSTATICS } from "../../_statics/forms";
import { reservationStatusConfig } from "../../_types/reservation-enum.config";
import { GenericAvailabilityParams } from "../../_types/room-availability-query-params";
import BookingCalendarTime from "./BookingCalendarTime";
import CreateHeaderReservation from "./CreateHeaderReservation";
import CreateReservationGuestTable from "./CreateReservationGuestTable";

interface CreateReservationFormProps extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  form: UseFormReturn<CreateReservationInput>;
  controlledFieldArray: UseFieldArrayReturn<CreateReservationInput>;
  onSubmit: (data: CreateReservationInput) => void;
}

export default function CreateReservationForm({
  children,
  form,
  onSubmit,
  controlledFieldArray,
}: CreateReservationFormProps) {
  const [allowGuests, setAllowGuests] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<DetailedRoom | undefined>(undefined);
  const [guestNumber, setGuestNumber] = useState<number>(0);
  const [isRoomAvailable, setIsRoomAvailable] = useState(true);

  const initialLoadCompleted = useRef(false);

  const defaultCheckInCheckOutDates: GenericAvailabilityParams = {
    checkInDate: form.getValues("checkInDate"),
    checkOutDate: form.getValues("checkOutDate"),
  };
  const { isLoading, isError, error, availableRooms, checkAvailability, refetch } =
    useAllAvailableRoomsInTimeInterval(defaultCheckInCheckOutDates);
  const { useAllReasonsQuery } = useReservation();
  const { data: reasons, isLoading: isLoadingReasons } = useAllReasonsQuery();
  const { watch, register } = form;
  const { append, remove } = controlledFieldArray;

  const checkInDate = watch("checkInDate");
  const checkOutDate = watch("checkOutDate");
  const roomId = watch("roomId");

  const onSearchCustomerFound = (_customerIdCardNumber: string, customer: unknown) => {
    const customerFound = customer as Customer;
    form.setValue("customerId", customerFound.id);
  };

  const onRoomSelected = (room?: DetailedRoom) => {
    setSelectedRoom(room);
  };

  // Referencia para controlar las llamadas a verificación de disponibilidad
  const availabilityCheckRef = useRef({
    lastCheckInDate: "",
    lastCheckOutDate: "",
    isChecking: false,
  });

  // Ejecutar solo cuando cambian las fechas relevantes
  useEffect(() => {
    // Solo verificar disponibilidad cuando ambos valores estén presentes
    if (checkInDate && checkOutDate) {
      // Verificar si ya hemos procesado esta combinación de fechas
      if (
        availabilityCheckRef.current.lastCheckInDate === checkInDate &&
        availabilityCheckRef.current.lastCheckOutDate === checkOutDate
      ) {
        // Ya hemos procesado esta combinación, no hacer nada
        return;
      }

      // Actualizar referencias antes de la verificación
      availabilityCheckRef.current.lastCheckInDate = checkInDate;
      availabilityCheckRef.current.lastCheckOutDate = checkOutDate;
      availabilityCheckRef.current.isChecking = true;

      // Realizar la verificación
      checkAvailability({
        checkInDate,
        checkOutDate,
      });

      // Marcar como completada la verificación
      availabilityCheckRef.current.isChecking = false;
    }
  }, [checkInDate, checkOutDate]);

  // --- Efecto para marcar cuando la carga inicial se ha completado ---
  useEffect(() => {
    if (!isLoading && !initialLoadCompleted.current) {
      initialLoadCompleted.current = true;
    }
  }, [isLoading]);

  const handleAddGuest = () => {
    append({
      name: "",
      age: 0,
      documentType: "DNI",
      documentId: "",
      phone: undefined,
      email: undefined,
      additionalInfo: undefined,
    });
    setGuestNumber((prev) => prev + 1);
  };

  const handleRemoveGuest = (index: number) => {
    remove(index);
    setGuestNumber((prev) => prev - 1);
  };

  const roomOptions: SelectOption<string>[] =
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
        value: room.id as string, // Type assertion to ensure TypeScript knows this is always a string
      };
    }) ?? [];

  if (isLoading && !initialLoadCompleted.current) {
    return <LoadingFormSkeleton />;
  }

  if (isError) {
    return <ErrorMessageForm error={error} refetch={refetch}></ErrorMessageForm>;
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CreateHeaderReservation
          availableRooms={availableRooms}
          form={form}
          onRoomSelected={onRoomSelected}
          onSearchCustomerFound={onSearchCustomerFound}
          roomOptions={roomOptions}
        />

        <Separator className="col-span-2" />

        {/* Reemplazar los campos separados de checkIn/checkOut con el nuevo componente */}
        <div className="col-span-2 sm:col-span-2 space-y-2">
          <BookingCalendarTime form={form} roomId={roomId} onRoomAvailabilityChange={setIsRoomAvailable} />
          <CustomFormDescription
            required={FORMSTATICS.observations.required}
            validateOptionalField={false}
          ></CustomFormDescription>
          {form.formState.errors.checkInDate || form.formState.errors.checkOutDate ? (
            <FormMessage className="text-destructive">
              {form.formState.errors.checkInDate?.message || form.formState.errors.checkOutDate?.message}
            </FormMessage>
          ) : null}

          {!isRoomAvailable && roomId && (
            <FormMessage className="text-destructive">
              La habitación seleccionada no está disponible para estas fechas. Por favor, selecciona otras fechas o una
              habitación diferente.
            </FormMessage>
          )}
        </div>

        <Separator className="col-span-2" />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="col-span-2 sm:col-span-1">
              <FormLabel htmlFor="city">{FORMSTATICS.status.label}</FormLabel>
              <Select disabled onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full text-ellipsis">
                    <SelectValue placeholder="Seleccione el estado de reserva" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    {Object.values(reservationStatusSelectOptions).map((status) => {
                      const {
                        icon: Icon,
                        borderColor,
                        textColor,
                        hoverBgColor,
                        hoverTextColor,
                        hoverBorderColor,
                      } = reservationStatusConfig[status.value];

                      return (
                        <SelectItem
                          key={status.value}
                          value={status.value}
                          className={cn(
                            "flex items-center gap-2 mb-1",
                            borderColor,
                            textColor,
                            hoverBgColor,
                            hoverTextColor,
                            hoverBorderColor ?? ""
                          )}
                        >
                          <Icon className={`size-4`} />
                          <span>{status.label}</span>
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={"origin"}
          render={({ field }) => (
            <FormItem className="col-span-2 sm:col-span-1">
              <FormLabel>{FORMSTATICS.origin.label}</FormLabel>
              <FormControl>
                <InputWithIcon {...field} Icon={MapPinHouse} placeholder={FORMSTATICS.origin.placeholder} />
              </FormControl>
              <CustomFormDescription
                required={FORMSTATICS.origin.required}
                validateOptionalField={true}
              ></CustomFormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator className="col-span-2" />

        {selectedRoom?.RoomTypes?.guests && (
          <div className="space-y-4 col-span-2">
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
          <CreateReservationGuestTable
            controlledFieldArray={controlledFieldArray}
            guestNumber={guestNumber}
            handleAddGuest={handleAddGuest}
            handleRemoveGuest={handleRemoveGuest}
            form={form}
            register={register}
            selectedRoom={selectedRoom}
            watch={watch}
          />
        )}

        <Separator className="col-span-2" />

        <FormField
          control={form.control}
          name={"reason"}
          render={({ field }) => (
            <FormItem className="col-span-2 sm:col-span-2">
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
              <CustomFormDescription
                required={FORMSTATICS.reason.required}
                validateOptionalField={true}
              ></CustomFormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={"observations"}
          render={({ field }) => (
            <FormItem className="col-span-2 sm:col-span-2">
              <FormLabel>{FORMSTATICS.observations.label}</FormLabel>
              <FormControl>
                <TextareaWithIcon {...field} Icon={ListCheck} placeholder={FORMSTATICS.observations.placeholder} />
              </FormControl>
              <CustomFormDescription
                required={FORMSTATICS.observations.required}
                validateOptionalField={true}
              ></CustomFormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {children}
      </form>
    </Form>
  );
}
