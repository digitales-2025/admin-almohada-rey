import { Check, ChevronsUpDown } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { CustomFormDescription } from "@/components/form/CustomFormDescription";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { SelectOption } from "@/types/form/select-option";
import { CreateReservationInput, DetailedRoom } from "../../_schemas/reservation.schemas";
import { FORMSTATICS } from "../../_statics/forms";
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
  return (
    <>
      <FormItem className="w-full col-span-2 sm:col-span-1">
        <FormLabel>{FORMSTATICS.customerId.label}</FormLabel>
        {/* <SearchCustomerCombobox onValueChange={onSearchCustomerFound} /> */}
        <FormControl>
          <SearchCustomerCombobox onValueChange={onSearchCustomerFound} className="max-w-none" />
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
    </>
  );
}
