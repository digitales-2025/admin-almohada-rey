import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Separator } from "@radix-ui/react-separator";
import { Switch } from "@radix-ui/react-switch";
import { isBefore, isSameDay } from "date-fns";
import { Check, ChevronsUpDown, ListCheck, MapPinHouse, Trash2, UserRoundCheck } from "lucide-react";
import { Controller, UseFieldArrayReturn, UseFormReturn } from "react-hook-form";

import { CustomFormDescription } from "@/components/form/CustomFormDescription";
import ErrorMessageForm from "@/components/form/ErrorMessageForm";
import LoadingFormSkeleton from "@/components/form/LoadingFormSkeleton";
import { TextareaWithIcon } from "@/components/form/TextareaWithIcon";
import { InputWithIcon } from "@/components/input-with-icon";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { SelectOption } from "@/types/form/select-option";
import { formatPeruBookingDate, getPeruStartOfToday } from "@/utils/peru-datetime";
import { useAllAvailableRoomsInTimeIntervalForUpdate } from "../../_hooks/use-roomAvailability";
import {
  DetailedReservation,
  DetailedRoom,
  DocumentType,
  reservationStatusSelectOptions,
  UpdateReservationInput,
} from "../../_schemas/reservation.schemas";
import { FORMSTATICS, UPDATE_FORMSTATICS } from "../../_statics/forms";
import { documentTypeStatusConfig } from "../../_types/document-type.enum.config";
import { reservationStatusConfig } from "../../_types/reservation-enum.config";
import { GenericAvailabilityFormUpdateParams } from "../../_types/room-availability-query-params";
import UpdateBookingCalendarTime from "./UpdateBookingCalendarTime";

// import { type CreateCustomersSchema } from "../../_schema/createCustomersSchema";
// import { CustomerDocumentType, CustomerMaritalStatus } from "../../_types/customer";
// import { CustomerDocumentTypeLabels, CustomerMaritalStatusLabels } from "../../_utils/customers.utils";

interface UpdateReservationSheetFormProps
  extends Omit<React.ComponentPropsWithRef<typeof Sheet>, "open" | "onOpenChange"> {
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
}: UpdateReservationSheetFormProps) {
  const [allowGuests, setAllowGuests] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<DetailedRoom | undefined>(reservation.room);
  const [guestNumber, setGuestNumber] = useState<number>(0);
  const [isRoomAvailable, setIsRoomAvailable] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const reservationCheckInIsInThePast = useMemo(() => {
    const today = getPeruStartOfToday();
    const reservationDate = new Date(reservation.checkInDate);
    return isBefore(reservationDate, today) || isSameDay(reservationDate, today);
  }, [reservation]);

  const { watch, register } = form;
  const { fields, append, remove } = controlledFieldArray;
  const watchFieldArray = watch("guests");
  const controlledFields = fields.map((field, index) => {
    const watchItem = watchFieldArray?.[index];
    return {
      ...field,
      ...(watchItem ?? {}),
    };
  });

  const originalRoom = useRef(reservation.room);
  const defaultOriginalCheckInDate = useRef(form.getValues("checkInDate"));
  const defaultOriginalCheckOutDate = useRef(form.getValues("checkOutDate"));

  const checkInDate = watch("checkInDate");
  const checkOutDate = watch("checkOutDate");
  const roomId = watch("roomId");

  const defaultCheckInCheckOutDates: GenericAvailabilityFormUpdateParams = {
    checkInDate: checkInDate,
    checkOutDate: checkOutDate,
    reservationId: reservation.id,
  };

  // 1. Referencia para almacenar el último valor verificado
  const lastCheckedRef = useRef({
    roomId: originalRoom.current.id,
    checkInDate: defaultOriginalCheckInDate.current,
    checkOutDate: defaultOriginalCheckOutDate.current,
  });

  const { isLoading, isError, error, availableRooms, checkAvailability, refetch } =
    useAllAvailableRoomsInTimeIntervalForUpdate(defaultCheckInCheckOutDates, reservation.id);
  // const [isOriginalInterval, setIsOriginalInterval] = useState(true);

  const memoizedCheckAvailability = useCallback(() => {
    // Si ya está verificando, no iniciar otra verificación
    if (isChecking) return;

    // Comparar con valores anteriores para evitar verificaciones redundantes
    if (
      lastCheckedRef.current.roomId === roomId &&
      lastCheckedRef.current.checkInDate === checkInDate &&
      lastCheckedRef.current.checkOutDate === checkOutDate
    ) {
      return;
    }

    // Marcar como verificando
    setIsChecking(true);

    // Actualizar referencia
    lastCheckedRef.current = {
      roomId,
      checkInDate,
      checkOutDate,
    };

    // Usar un timeout más largo para reducir peticiones durante cambios rápidos
    const timeoutId = setTimeout(() => {
      checkAvailability({
        checkInDate,
        checkOutDate,
        reservationId: reservation.id,
      });

      // Establecer un timeout adicional para finalizar el estado de carga
      setTimeout(() => {
        setIsChecking(false);
      }, 300);
    }, 500); // Debounce de 500ms

    // Limpieza del timeout si cambian las dependencias antes de que se ejecute
    return () => clearTimeout(timeoutId);
  }, [roomId, checkInDate, checkOutDate, isChecking, checkAvailability, reservation.id]);

  // Efecto que ejecuta la verificación cuando cambian los valores importantes
  useEffect(() => {
    // Solo verificar si hay valores válidos para todos los campos necesarios
    if (roomId && checkInDate && checkOutDate) {
      const cleanup = memoizedCheckAvailability();
      return cleanup;
    }
  }, [memoizedCheckAvailability, roomId, checkInDate, checkOutDate]);

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

  const onRoomSelected = (room?: DetailedRoom) => {
    if (!room) return;
    // if (isOriginalInterval && room.id === originalRoom.current.id) {
    //   setSelectedRoom(originalRoom.current);
    // }
    setSelectedRoom(room);
  };

  // if (isOriginalInterval) {
  //   const originalRoomCapacity = originalRoom.current.RoomTypes?.guests ?? 0;
  //   const originalRoomPrice = originalRoom.current.RoomTypes?.price ?? 0;
  //   const originalRoomType = originalRoom.current.RoomTypes?.name.toUpperCase() ?? "Sin tipo";
  //   const originalRoomNumber = originalRoom.current.number ?? "Sin número";
  //   roomOptions.unshift({
  //     label: `${originalRoomNumber} - ${originalRoomType} ( ${originalRoomCapacity}🧍) - ${originalRoomPrice.toLocaleString(
  //       "es-PE",
  //       {
  //         style: "currency",
  //         currency: "PEN",
  //       }
  //     )}`,
  //     value: originalRoom.current.id,
  //   });
  // }

  const customerOptions: SelectOption<string>[] = [
    {
      label:
        reservation.customer.name +
        " " +
        documentTypeStatusConfig[reservation.customer.documentType].name +
        `(${reservation.customer.documentNumber})`,
      value: reservation.customerId,
    },
  ];

  if (isLoading) {
    return <LoadingFormSkeleton></LoadingFormSkeleton>;
  }
  if (isError) {
    return <ErrorMessageForm error={error} refetch={refetch}></ErrorMessageForm>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 px-6 ">
        <FormField
          control={form.control}
          name="customerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{UPDATE_FORMSTATICS.customerId.label}</FormLabel>
              <Select disabled onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full text-ellipsis capitalize">
                    <SelectValue placeholder="Seleccione un cliente" className="capitalize" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    {customerOptions.map((customer) => {
                      return (
                        <SelectItem className="capitalize" key={customer.value} value={customer.value}>
                          <span>{customer.label}</span>
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <CustomFormDescription
                required={UPDATE_FORMSTATICS.customerId.required}
                validateOptionalField={true}
              ></CustomFormDescription>
              <FormMessage>
                {form.formState.errors.customerId && (
                  <span className="text-destructive">{form.formState.errors.customerId.message}</span>
                )}
              </FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="roomId"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>{UPDATE_FORMSTATICS.roomId.label}</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn("w-full justify-between capitalize", !field.value && "text-muted-foreground")}
                        disabled={roomOptions.length === 0}
                      >
                        {field.value
                          ? roomOptions.find((room) => room.value === field.value)?.label
                          : UPDATE_FORMSTATICS.roomId.placeholder}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder={UPDATE_FORMSTATICS.roomId.placeholder} className="h-9" />
                      <CommandList>
                        <CommandEmpty>No hay habitaciones disponibles</CommandEmpty>
                        <CommandGroup>
                          {roomOptions.map((room) => (
                            <CommandItem
                              value={room.value}
                              key={room.value}
                              onSelect={() => {
                                form.setValue("roomId", room.value);
                                // const detailedRoom = isOriginalInterval
                                //   ? reservation.room
                                //   : availableRooms?.find((r) => r.id === room.value);
                                const detailedRoom = availableRooms?.find((r) => r.id === room.value);
                                onRoomSelected(detailedRoom);
                              }}
                            >
                              {room.label}
                              <Check
                                className={cn("ml-auto", room.value === field.value ? "opacity-100" : "opacity-0")}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator className="w-full" />

        {!reservationCheckInIsInThePast && (
          <div className="space-y-2">
            <UpdateBookingCalendarTime
              form={form}
              roomId={roomId}
              onRoomAvailabilityChange={setIsRoomAvailable}
              reservation={reservation}
              // isOriginalInterval={isOriginalInterval}
              // originalRoom={originalRoom.current}
            />
            <CustomFormDescription
              required={UPDATE_FORMSTATICS.observations.required}
              validateOptionalField={false}
            ></CustomFormDescription>
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
        )}

        {reservationCheckInIsInThePast && (
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
              <UserRoundCheck className="text-primary" />
            </FormControl>
          </FormItem>
        )}

        <Separator orientation="horizontal" />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="city">{UPDATE_FORMSTATICS.status.label}</FormLabel>
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
              {
                <CustomFormDescription
                  required={UPDATE_FORMSTATICS.status.required}
                  validateOptionalField={true}
                ></CustomFormDescription>
              }
              <FormDescription>
                Solo se puede actualizar el estado de la reserva por medio de eventos externos.
              </FormDescription>
              {form.formState.errors.status && (
                <FormMessage className="text-destructive">{form.formState.errors.status.message}</FormMessage>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={"origin"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{UPDATE_FORMSTATICS.origin.label}</FormLabel>
              <FormControl>
                <InputWithIcon {...field} Icon={MapPinHouse} placeholder={UPDATE_FORMSTATICS.origin.placeholder} />
              </FormControl>
              <CustomFormDescription
                required={UPDATE_FORMSTATICS.origin.required}
                validateOptionalField={true}
              ></CustomFormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator orientation="horizontal" />

        {selectedRoom?.RoomTypes?.guests && (
          <div className="space-y-4">
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
          <div className="flex flex-col gap-4 animate-ease-in">
            <FormLabel>{UPDATE_FORMSTATICS.guests.label}</FormLabel>
            <Table className="w-full overflow-auto">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Nombre y Apell.</TableHead>
                  <TableHead>Edad</TableHead>
                  <TableHead>Tipo de Identidad</TableHead>
                  <TableHead>Nro. de Identidad</TableHead>
                  <TableHead>Telefono</TableHead>
                  <TableHead className="text-center">Email</TableHead>
                  <TableHead className="text-center">Adicional</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {controlledFields.map((field, index) => {
                  const isDocumentTypeSelected = field.documentType !== undefined;
                  return (
                    <TableRow key={field.id} className="animate-fade-down duration-500">
                      <TableCell>
                        <FormItem>
                          <Input {...register(`guests.${index}.name` as const)} className="min-w-[100px] w-full" />
                          <CustomFormDescription
                            required={UPDATE_FORMSTATICS.guests.subFields?.name?.required ?? false}
                            validateOptionalField={true}
                          ></CustomFormDescription>
                          <FormMessage>
                            {form.formState.errors.guests?.[index]?.name &&
                              form.formState.errors.guests[index]?.name?.message}
                          </FormMessage>
                        </FormItem>
                      </TableCell>
                      <TableCell>
                        <FormItem className="min-w-[50px] w-full">
                          <Input {...register(`guests.${index}.age` as const)} type="number" min={0} placeholder="0" />
                          <CustomFormDescription
                            required={UPDATE_FORMSTATICS.guests.subFields?.age.required ?? false}
                            validateOptionalField={true}
                          ></CustomFormDescription>
                          <FormMessage>
                            {form.formState.errors.guests?.[index]?.age &&
                              form.formState.errors.guests[index]?.age?.message}
                          </FormMessage>
                        </FormItem>
                      </TableCell>
                      <TableCell>
                        <FormItem>
                          <Select
                            {...register(`guests.${index}.documentType` as const)}
                            defaultValue={field.documentType}
                            onValueChange={(val) => {
                              form.setValue(`guests.${index}.documentType`, val as DocumentType);
                            }}
                          >
                            <FormControl>
                              <SelectTrigger className="min-w-[100px] w-full">
                                <SelectValue
                                  placeholder={UPDATE_FORMSTATICS.guests.subFields?.documentType.placeholder}
                                  className="text-ellipsis"
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.values(documentTypeStatusConfig).map((documentType, idx) => (
                                <SelectItem key={`${documentType.value}-${idx}`} value={documentType.value}>
                                  {documentType.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <CustomFormDescription
                            required={UPDATE_FORMSTATICS.guests.subFields?.documentType.required ?? false}
                            validateOptionalField={true}
                          ></CustomFormDescription>
                          <FormMessage>
                            {form.formState.errors.guests?.[index]?.documentType &&
                              form.formState.errors.guests[index]?.documentType?.message}
                          </FormMessage>
                        </FormItem>
                      </TableCell>
                      <TableCell>
                        <FormItem>
                          <Input
                            disabled={!isDocumentTypeSelected}
                            {...register(`guests.${index}.documentId` as const)}
                          />
                          <CustomFormDescription
                            required={UPDATE_FORMSTATICS.guests.subFields?.documentId.required ?? false}
                            validateOptionalField={true}
                          ></CustomFormDescription>
                          <FormMessage>
                            {form.formState.errors.guests?.[index]?.documentId &&
                              form.formState.errors.guests[index]?.documentId?.message}
                          </FormMessage>
                        </FormItem>
                      </TableCell>
                      <TableCell>
                        {/* <FormItem>
                          <FormItem>
                            <FormControl>
                              <PhoneInput
                                className="min-w-[170px] w-full"
                                {...register(`guests.${index}.phone` as const)}
                                defaultCountry={"PE"}
                                placeholder="999 888 777"
                                value={field.phone}
                                onChange={(value) => form.setValue(`guests.${index}.phone`, value)}
                              />
                            </FormControl>
                          </FormItem>
                          <CustomFormDescription
                            required={UPDATE_FORMSTATICS.guests.subFields?.phone.required ?? false}
                            validateOptionalField={true}
                          ></CustomFormDescription>
                          <FormMessage>
                            {form.formState.errors.guests?.[index]?.phone &&
                              form.formState.errors.guests[index]?.phone?.message}
                          </FormMessage>
                        </FormItem> */}
                        <Controller
                          control={form.control}
                          name={`guests.${index}.phone`}
                          render={({ field: { onChange, value } }) => (
                            <FormItem>
                              <FormControl>
                                <PhoneInput
                                  className="min-w-[170px] w-full"
                                  defaultCountry="PE"
                                  placeholder="999 888 777"
                                  value={value}
                                  onChange={onChange}
                                />
                              </FormControl>
                              <CustomFormDescription
                                required={FORMSTATICS.guests.subFields?.phone.required ?? false}
                                validateOptionalField={true}
                              ></CustomFormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <FormItem>
                          <Input className="min-w-[100px] w-full" {...register(`guests.${index}.email` as const)} />
                          <CustomFormDescription
                            required={UPDATE_FORMSTATICS.guests.subFields?.email.required ?? false}
                            validateOptionalField={true}
                          ></CustomFormDescription>
                          <FormMessage>
                            {form.formState.errors.guests?.[index]?.email &&
                              form.formState.errors.guests[index]?.email?.message}
                          </FormMessage>
                        </FormItem>
                      </TableCell>
                      <TableCell>
                        <FormItem>
                          <Textarea
                            className="min-w-[100px] w-full"
                            {...register(`guests.${index}.additionalInfo` as const, {
                              setValueAs: (v) => (v === "" ? undefined : String(v)),
                            })}
                          />
                          <CustomFormDescription
                            required={FORMSTATICS.guests.subFields?.additionalInfo.required ?? false}
                            validateOptionalField={true}
                          ></CustomFormDescription>
                          <FormMessage>
                            {form.formState.errors.guests?.[index]?.additionalInfo &&
                              form.formState.errors.guests[index]?.additionalInfo?.message}
                          </FormMessage>
                        </FormItem>
                      </TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="outline"
                          className="hover:bg-destructive hover:text-white"
                          size="sm"
                          onClick={() => handleRemoveGuest(index)}
                        >
                          <Trash2 />
                          {/* Eliminar */}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <div className="w-full flex flex-col gap-2 justify-center items-center py-4">
              <Button
                variant={"outline"}
                disabled={
                  selectedRoom?.RoomTypes?.guests && guestNumber >= selectedRoom?.RoomTypes?.guests - 1 ? true : false
                }
                type="button"
                onClick={handleAddGuest}
                className="flex items-center gap-2"
              >
                <ListCheck className="size-4" />
                Añadir Huésped
                {selectedRoom?.RoomTypes?.guests && (
                  <div>
                    {"("}
                    <span className="text-primary text-base font-bold">
                      {/* -1 beacause of the current guest who is making the reservation */}
                      {selectedRoom?.RoomTypes?.guests - 1 - guestNumber}
                    </span>{" "}
                    lugar{selectedRoom?.RoomTypes?.guests > 1 ? "es" : ""} restante
                    {selectedRoom?.RoomTypes?.guests > 1 ? "s" : ""}
                    {")"}
                  </div>
                )}
              </Button>
              <CustomFormDescription
                required={FORMSTATICS.guests.required}
                validateOptionalField={true}
              ></CustomFormDescription>
              {form.formState.errors.guests && (
                <FormMessage className="text-destructive">{form.formState.errors.guests.message}</FormMessage>
              )}
            </div>
          </div>
        )}

        <Separator orientation="horizontal" />

        <FormField
          control={form.control}
          name={"reason"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{FORMSTATICS.reason.label}</FormLabel>
              <FormControl>
                <TextareaWithIcon {...field} Icon={UserRoundCheck} placeholder={FORMSTATICS.reason.placeholder} />
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
            <FormItem>
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
