import React, { useState } from "react";
import { ListCheck } from "lucide-react";
import { UseFieldArrayReturn, UseFormReturn } from "react-hook-form";

import { CustomFormDescription } from "@/components/form/CustomFormDescription";
import { TextareaWithIcon } from "@/components/form/TextareaWithIcon";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CreateReservationInput, reservationStatusSelectOptions } from "../../_schemas/reservation.schemas";
import { FORMSTATICS } from "../../_statics/forms";
import { reservationStatusConfig } from "../../_types/reservation-enum.config";
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
  const { watch } = form;
  const {
    //fields,
    // append,
    // remove
  } = controlledFieldArray;
  //const watchFieldArray = watch("guests");
  // const controlledFields = fields.map((field, index) => {
  //   const watchItem = watchFieldArray?.[index];
  //   return {
  //     ...field,
  //     ...(watchItem ?? {}),
  //   };
  // });

  const [isRoomAvailable, setIsRoomAvailable] = useState(true);
  const roomId = watch("roomId");

  const onSearchCustomerFound = (customerId: string) => {
    form.setValue("customerId", customerId);
  };

  // const useRooms = useRooms();

  // const roomOptions: ComoboxOption[]
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormItem>
          <FormLabel>{FORMSTATICS.customerId.label}</FormLabel>
          {/* <SearchCustomerCombobox onValueChange={onSearchCustomerFound} /> */}
          <FormControl>
            <SearchCustomerCombobox onValueChange={onSearchCustomerFound} />
          </FormControl>
          <FormMessage>
            {form.formState.errors.customerId && (
              <span className="text-destructive">{form.formState.errors.customerId.message}</span>
            )}
          </FormMessage>
        </FormItem>

        <FormField
          control={form.control}
          name={"observations"}
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>{FORMSTATICS.observations.label}</FormLabel>
              <FormControl>
                <TextareaWithIcon {...field} Icon={ListCheck} placeholder={FORMSTATICS.observations.placeholder} />
              </FormControl>
              <CustomFormDescription required={FORMSTATICS.observations.required}></CustomFormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <FormField
          control={form.control}
          name="roomId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dirección</FormLabel>
              <FormControl>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[200px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? languages.find(
                            (language) => language.value === field.value
                          )?.label
                        : "Select language"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search framework..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No framework found.</CommandEmpty>
                      <CommandGroup>
                        {languages.map((language) => (
                          <CommandItem
                            value={language.label}
                            key={language.value}
                            onSelect={() => {
                              form.setValue("language", language.value)
                            }}
                          >
                            {language.label}
                            <Check
                              className={cn(
                                "ml-auto",
                                language.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
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
        /> */}

        {/* Reemplazar los campos separados de checkIn/checkOut con el nuevo componente */}
        <div className="col-span-2">
          <BookingCalendarTime form={form} roomId={roomId} onRoomAvailabilityChange={setIsRoomAvailable} />
          <CustomFormDescription required={FORMSTATICS.observations.required}></CustomFormDescription>
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
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione una provincia" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    {Object.values(reservationStatusSelectOptions).map((status) => {
                      const {
                        icon: Icon,
                        backgroundColor,
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
                            backgroundColor,
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

        {/* <Separator className="col-span-4" />

        <div className="flex flex-col gap-4 col-span-4">
          <FormLabel>{FORMSTATICS.products.label}</FormLabel>
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Nombre</TableHead>
                <TableHead className="text-center text-balance max-w-10">Almacén</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="text-center">Stock restante</TableHead>
                <TableHead className="text-center">Stock General</TableHead>
                <TableHead className="text-center">Opciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {controlledFields.map((field, index) => {
                const data = selectedProducts.find((p) => p.id === field.productId);
                const safeData: Partial<OutgoingProducStockForm> = data ?? {};
                const safeWatch = watchFieldArray?.[index] ?? {};
                //const price = safeData.precio ?? 0;
                const safeStorages =
                  safeData.Stock?.map((stock) => ({
                    label: (
                      <div>
                        {stock.Storage.name} {"(Stock "} <span className="text-primary font-bold">{stock.stock}</span>
                        {")"}
                      </div>
                    ),
                    value: stock.Storage.id,
                  })) ?? [];

                const stockStorage = safeData.Stock?.find((stock) => stock.Storage.id === safeWatch.storageId) ?? null;

                const totalStock = safeData.Stock?.reduce((acc, stock) => acc + stock.stock, 0) ?? 0;
                const dynamicStock = isNaN((stockStorage?.stock ?? 0) - (safeWatch.quantity ?? 0))
                  ? (stockStorage?.stock ?? 0)
                  : (stockStorage?.stock ?? 0) - (safeWatch.quantity ?? 0);

                const price = safeData.precio ?? 0;
                const total = isNaN(price * (safeWatch.quantity ?? 0)) ? 0 : price * (safeWatch.quantity ?? 0);
                return (
                  <TableRow key={field.id} className="animate-fade-down duration-500">
                    <TableCell>
                      <FormItem>
                        <div>
                          <span>{safeData.name ?? "Desconocido"}</span>
                        </div>
                        <Input disabled {...register(`products.${index}.productId` as const)} type="hidden" />
                        <FormMessage />
                      </FormItem>
                    </TableCell>
                    <TableCell>
                      <FormItem>
                        <Select
                          {...register(`products.${index}.storageId` as const)}
                          defaultValue={field.storageId}
                          onValueChange={(val) => {
                            form.setValue(`products.${index}.storageId`, val);
                            calculateProductTotals();
                          }}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Seleccionar almacén" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {safeStorages.map((storage) => (
                              <SelectItem key={storage.value} value={storage.value}>
                                {storage.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    </TableCell>

                    <TableCell>
                      <span className="block text-center">
                        {price.toLocaleString("es-PE", {
                          style: "currency",
                          currency: "PEN",
                        })}
                      </span>
                    </TableCell>
                    <TableCell>
                      <FormItem>
                        <Input
                          className="font-bold"
                          {...register(`products.${index}.quantity` as const, {
                            valueAsNumber: true,
                            validate: (value) =>
                              value > (stockStorage?.stock ?? 0) ? "La cantidad supera el stock disponible" : true,
                          })}
                          type="number"
                          min={1}
                          placeholder="0"
                          onInput={(e) => {
                            const target = e.target as HTMLInputElement;
                            if (target.value === "") {
                              return;
                            }
                            if (target.valueAsNumber < 0) {
                              target.value = "0";
                            }
                            if (target.valueAsNumber > (stockStorage?.stock ?? 0)) {
                              target.value = (stockStorage?.stock ?? 0).toString();
                            }
                            setTimeout(() => calculateProductTotals(), 0);
                          }}
                        />
                        <FormMessage />
                      </FormItem>
                    </TableCell>
                    <TableCell>
                      <span className="block text-center font-semibold">
                        {total.toLocaleString("es-PE", {
                          style: "currency",
                          currency: "PEN",
                        })}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="block text-center text-primary font-bold">{dynamicStock}</span>
                    </TableCell>
                    <TableCell>
                      <span className="block text-center">{totalStock}</span>
                    </TableCell>
                    <TableCell className="flex justify-center items-center">
                      <Button
                        type="button"
                        variant="outline"
                        className="hover:bg-destructive hover:text-white"
                        size="sm"
                        onClick={() => handleRemoveProduct(index)}
                      >
                        <Trash2 />
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {showProductTotals && selectedProducts.length > 0 && (
                <TableRow className="bg-muted/30 font-medium animate-fade-down">
                  <TableCell colSpan={4} className="font-bold">
                    TOTALES ({productTotals.totalProducts} productos):
                  </TableCell>
                  <TableCell colSpan={1} className="text-lg text-primary font-bold">
                    {productTotals.total.toLocaleString("es-PE", {
                      style: "currency",
                      currency: "PEN",
                    })}
                  </TableCell>
                  <TableCell colSpan={3}></TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="col-span-2 w-full flex flex-col gap-2 justify-center items-center py-4">
            <SelectProductDialog form={form}></SelectProductDialog>
            <CustomFormDescription required={true}></CustomFormDescription>
            {form.formState.errors.products && (
              <FormMessage className="text-destructive">{form.formState.errors.products.message}</FormMessage>
            )}
          </div>
        </div>

        <Separator className="col-span-4" /> */}

        {children}
      </form>
    </Form>
  );
}
