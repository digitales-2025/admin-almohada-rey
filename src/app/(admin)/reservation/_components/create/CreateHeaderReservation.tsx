import { useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { CustomFormDescription } from "@/components/form/CustomFormDescription";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { socketService } from "@/services/socketService";
import { SelectOption } from "@/types/form/select-option";
import { CreateReservationInput, DetailedRoom } from "../../_schemas/reservation.schemas";
import { FORMSTATICS } from "../../_statics/forms";
import { CreateCustomersReservationsSheet } from "../create-customers/CreateCustomersReservationsSheet";
import { SearchCustomerCombobox } from "../search/SearchCustomerCombobox";

interface CreateHeaderReservationProps {
  form: UseFormReturn<CreateReservationInput>;
  availableRooms: DetailedRoom[] | undefined;
  onRoomSelected: (room: DetailedRoom | undefined) => void;
  onSearchCustomerFound: (customerIdCardNumber: string, customer: unknown) => void;
  roomOptions: SelectOption<string>[];
}

export default function CreateHeaderReservation({
  form,
  availableRooms,
  onRoomSelected,
  onSearchCustomerFound,
  roomOptions,
}: CreateHeaderReservationProps) {
  // Estado local para seguir las habitaciones que ya no están disponibles
  const [unavailableRoomIds, setUnavailableRoomIds] = useState<string[]>([]);

  // Crear una versión filtrada de roomOptions que excluye las habitaciones no disponibles
  const filteredRoomOptions = roomOptions.filter((room) => !unavailableRoomIds.includes(room.value));

  // Escuchar los eventos de WebSocket para habitaciones reservadas
  useEffect(() => {
    // Verificar si hay una habitación seleccionada
    const selectedRoomId = form.watch("roomId");

    // Función para manejar habitaciones que ya no están disponibles
    const handleUnavailableRoom = (roomId: string) => {
      if (roomId === selectedRoomId) {
        // Deseleccionar la habitación silenciosamente
        form.setValue("roomId", "");
        onRoomSelected(undefined);

        // Añadir la habitación a la lista de no disponibles
        setUnavailableRoomIds((prev) => [...prev, roomId]);
      }
    };

    // Establecer listener para cuando una habitación es reservada
    const unsubscribe = socketService.onNewReservation((reservation) => {
      handleUnavailableRoom(reservation.roomId);
    });

    // También escuchar actualizaciones de reservaciones
    const unsubscribeUpdates = socketService.onReservationUpdated((reservation) => {
      handleUnavailableRoom(reservation.roomId);
    });

    // Limpieza al desmontar
    return () => {
      unsubscribe();
      unsubscribeUpdates();
    };
  }, [form, onRoomSelected]);

  return (
    <>
      <FormItem className="w-full col-span-2 sm:col-span-1">
        <FormLabel>{FORMSTATICS.customerId.label}</FormLabel>
        <FormControl>
          <SearchCustomerCombobox
            onValueChange={onSearchCustomerFound}
            className="max-w-none"
            notFoundAction={<CreateCustomersReservationsSheet />}
          />
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
          <FormItem className=" col-span-2 sm:col-span-1 w-full">
            <FormLabel>{FORMSTATICS.roomId.label}</FormLabel>
            <FormControl>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between capitalize truncate",
                        !field.value && "text-muted-foreground"
                      )}
                      disabled={filteredRoomOptions.length === 0}
                    >
                      {field.value && filteredRoomOptions.some((room) => room.value === field.value)
                        ? filteredRoomOptions.find((room) => room.value === field.value)?.label
                        : FORMSTATICS.roomId.placeholder}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder={FORMSTATICS.roomId.placeholder} className="h-9" />
                    <CommandList>
                      {filteredRoomOptions.length === 0 ? (
                        <CommandEmpty>No hay habitaciones disponibles</CommandEmpty>
                      ) : (
                        <CommandGroup>
                          {filteredRoomOptions.map((room) => (
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
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
