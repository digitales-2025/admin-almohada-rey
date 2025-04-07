import React, { useCallback, useEffect, useRef, useState } from "react";
import { Check, ChevronsUpDown, ListCheck, MapPinHouse, Trash2, UserRoundCheck } from "lucide-react";
import { Controller, UseFieldArrayReturn, UseFormReturn } from "react-hook-form";

import { Customer } from "@/app/(admin)/customers/_types/customer";
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
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { SelectOption } from "@/types/form/select-option";
import { useAllAvailableRoomsInTimeInterval } from "../../_hooks/use-roomAvailability";
import {
  CreateReservationInput,
  DetailedRoom,
  DocumentType,
  reservationStatusSelectOptions,
} from "../../_schemas/reservation.schemas";
import { FORMSTATICS } from "../../_statics/forms";
import { documentTypeStatusConfig } from "../../_types/document-type.enum.config";
import { reservationStatusConfig } from "../../_types/reservation-enum.config";
import { GenericAvailabilityParams } from "../../_types/room-availability-query-params";
import { SearchCustomerCombobox } from "../search/SearchCustomerCombobox";
import BookingCalendarTime from "./BookingCalendarTime";

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
  // const { dataRoomsAll } = useRooms();
  const [allowGuests, setAllowGuests] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<DetailedRoom | undefined>(undefined);
  const [guestNumber, setGuestNumber] = useState<number>(0);
  const [isRoomAvailable, setIsRoomAvailable] = useState(true);

  const defaultCheckInCheckOutDates: GenericAvailabilityParams = {
    checkInDate: form.getValues("checkInDate"),
    checkOutDate: form.getValues("checkOutDate"),
  };
  const { isLoading, isError, error, availableRooms, checkAvailability, refetch } =
    useAllAvailableRoomsInTimeInterval(defaultCheckInCheckOutDates);
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

  const defaultOriginalCheckInDate = useRef(form.getValues("checkInDate"));
  const defaultOriginalCheckOutDate = useRef(form.getValues("checkOutDate"));

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

  // 1. Referencia para almacenar el último valor verificado
  const lastCheckedRef = useRef({
    roomId: "",
    checkInDate: defaultOriginalCheckInDate.current,
    checkOutDate: defaultOriginalCheckOutDate.current,
  });

  // 2. Estado para rastrear si está en proceso de verificación
  const [isChecking, setIsChecking] = useState(false);

  // 3. Memoizar la función de verificación de disponibilidad
  const memoizedCheckAvailability = useCallback(() => {
    // // Solo verificar si hay un ID de habitación
    // if (!roomId) return;

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

    // Realizar la verificación después de un pequeño retraso
    setTimeout(() => {
      checkAvailability({
        checkInDate,
        checkOutDate,
      });
      setIsChecking(false);
    }, 300);
  }, [roomId, checkInDate, checkOutDate, isChecking, checkAvailability]);

  // 4. Efecto que ejecuta la verificación cuando cambian los valores importantes
  useEffect(() => {
    memoizedCheckAvailability();
  }, [memoizedCheckAvailability]);

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

  if (isLoading) {
    return <LoadingFormSkeleton></LoadingFormSkeleton>;
  }
  if (isError) {
    return <ErrorMessageForm error={error} refetch={refetch}></ErrorMessageForm>;
  }
  // if (roomOptions.length === 0) {
  //   const error = new Error("No hay habitaciones disponibles para las fechas seleccionadas por defecto");
  //   return <ErrorMessageForm
  //   error={error} refetch={refetch}></ErrorMessageForm>;
  // }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormItem className="sm:col-span-1">
          <FormLabel>{FORMSTATICS.customerId.label}</FormLabel>
          {/* <SearchCustomerCombobox onValueChange={onSearchCustomerFound} /> */}
          <FormControl>
            <SearchCustomerCombobox onValueChange={onSearchCustomerFound} />
          </FormControl>
          <CustomFormDescription
            required={FORMSTATICS.customerId.required}
            validateOptionalField={true}
          ></CustomFormDescription>
          <FormMessage>
            {form.formState.errors.customerId && (
              <span className="text-destructive">{form.formState.errors.customerId.message}</span>
            )}
          </FormMessage>
        </FormItem>

        <FormField
          control={form.control}
          name="roomId"
          render={({ field }) => (
            <FormItem className="sm:col-span-1 w-full">
              <FormLabel>{FORMSTATICS.roomId.label}</FormLabel>
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
                          : FORMSTATICS.roomId.placeholder}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder={FORMSTATICS.roomId.placeholder} className="h-9" />
                      <CommandList>
                        <CommandEmpty>No hay habitaciones disponibles</CommandEmpty>
                        <CommandGroup>
                          {roomOptions.map((room) => (
                            <CommandItem
                              value={room.value}
                              key={room.value}
                              onSelect={() => {
                                form.setValue("roomId", room.value);
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

        <Separator className="col-span-2" />

        {/* Reemplazar los campos separados de checkIn/checkOut con el nuevo componente */}
        <div className="sm:col-span-2 space-y-2">
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

        {/* <FormField
          control={form.control}
          name={"checkInDate"}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2 h-full mt-2">
              <FormLabel>{FORMSTATICS.checkInDate.placeholder}</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                    >
                      {field.value ? (
                        // Verifica si es string
                        typeof field.value === "string" ? (
                          format(new Date(field.value), "PPP", {
                            locale: es,
                          })
                        ) : null
                      ) : (
                        <span>Escoja una fecha</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={typeof field.value === "string" ? new Date(field.value) : undefined}
                    onSelect={(val) => field.onChange(val?.toLocaleDateString('es-PE', {
                      timeZone: "America/Lima",
                    }) ?? "")}
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <CustomFormDescription required={FORMSTATICS.checkInDate.required} />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={"checkOutDate"}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2 h-full mt-2">
              <FormLabel>{FORMSTATICS.checkInDate.placeholder}</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                    >
                      {field.value ? (
                        // Verifica si es string
                        typeof field.value === "string" ? (
                          format(new Date(field.value), "PPP", {
                            locale: es,
                          })
                        ) : null
                      ) : (
                        <span>Escoja una fecha</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={typeof field.value === "string" ? new Date(field.value) : undefined}
                    onSelect={(val) => field.onChange(val?.toISOString() ?? "")}
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <CustomFormDescription required={FORMSTATICS.checkInDate.required} />
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
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
            <FormItem className="sm:col-span-1">
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
          <div className="space-y-4 sm:col-span-2">
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
          <div className="flex flex-col gap-4 sm:col-span-2 animate-ease-in">
            <FormLabel>{FORMSTATICS.guests.label}</FormLabel>
            <Table className="w-full overflow-auto">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Nombre y Apell.</TableHead>
                  {/* <TableHead className="text-center text-balance max-w-10">Almacén</TableHead> */}
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
                  // const data = selectedProducts.find((p) => p.id === field.productId);
                  // const safeData: Partial<OutgoingProducStockForm> = data ?? {};
                  // const safeWatch = watchFieldArray?.[index] ?? {};
                  // //const price = safeData.precio ?? 0;
                  // const safeStorages =
                  //   safeData.Stock?.map((stock) => ({
                  //     label: (
                  //       <div>
                  //         {stock.Storage.name} {"(Stock "} <span className="text-primary font-bold">{stock.stock}</span>
                  //         {")"}
                  //       </div>
                  //     ),
                  //     value: stock.Storage.id,
                  //   })) ?? [];

                  // const stockStorage = safeData.Stock?.find((stock) => stock.Storage.id === safeWatch.storageId) ?? null;

                  // const totalStock = safeData.Stock?.reduce((acc, stock) => acc + stock.stock, 0) ?? 0;
                  // const dynamicStock = isNaN((stockStorage?.stock ?? 0) - (safeWatch.quantity ?? 0))
                  //   ? (stockStorage?.stock ?? 0)
                  //   : (stockStorage?.stock ?? 0) - (safeWatch.quantity ?? 0);

                  // const price = safeData.precio ?? 0;
                  // const total = isNaN(price * (safeWatch.quantity ?? 0)) ? 0 : price * (safeWatch.quantity ?? 0);

                  const isDocumentTypeSelected = field.documentType !== undefined;
                  return (
                    <TableRow key={field.id} className="animate-fade-down duration-500">
                      <TableCell>
                        <FormItem>
                          {/* <div>
                          <span>{safeData.name ?? "Desconocido"}</span>
                        </div> */}
                          <Input {...register(`guests.${index}.name` as const)} className="min-w-[100px] w-full" />
                          <CustomFormDescription
                            required={FORMSTATICS.guests.subFields?.name?.required ?? false}
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
                          {/* <div>
                          <span>{safeData.name ?? "Desconocido"}</span>
                        </div> */}
                          <Input {...register(`guests.${index}.age` as const)} type="number" min={0} placeholder="0" />
                          <CustomFormDescription
                            required={FORMSTATICS.guests.subFields?.age.required ?? false}
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
                              // calculateProductTotals();
                            }}
                          >
                            <FormControl>
                              <SelectTrigger className="min-w-[100px] w-full">
                                <SelectValue
                                  placeholder={FORMSTATICS.guests.subFields?.documentType.placeholder}
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
                            required={FORMSTATICS.guests.subFields?.documentType?.required ?? false}
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
                            required={FORMSTATICS.guests.subFields?.documentId.required ?? false}
                            validateOptionalField={true}
                          ></CustomFormDescription>
                          <FormMessage>
                            {form.formState.errors.guests?.[index]?.documentId &&
                              form.formState.errors.guests[index]?.documentId?.message}
                          </FormMessage>
                        </FormItem>
                      </TableCell>

                      {/* <TableCell>
                      <span className="block text-center">
                        {price.toLocaleString("es-PE", {
                          style: "currency",
                          currency: "PEN",
                        })}
                      </span>
                    </TableCell> */}
                      <TableCell>
                        {/* <FormItem>
                          <FormItem>
                            <FormControl>
                              <PhoneInput
                                className="min-w-[170px] w-full"
                                {...register(`guests.${index}.phone` as const)}
                                defaultCountry="PE"
                                placeholder="999 888 777"
                                value={field.phone}
                                onChange={(value) => form.setValue(`guests.${index}.phone`, value)}
                              />
                            </FormControl>
                          </FormItem>
                          <CustomFormDescription
                            required={FORMSTATICS.guests.subFields?.phone.required ?? false}
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
                            required={FORMSTATICS.guests.subFields?.email.required ?? false}
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
            <div className="col-span-2 w-full flex flex-col gap-2 justify-center items-center py-4">
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

        <Separator className="col-span-2" />

        <FormField
          control={form.control}
          name={"reason"}
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
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
            <FormItem className="sm:col-span-2">
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
