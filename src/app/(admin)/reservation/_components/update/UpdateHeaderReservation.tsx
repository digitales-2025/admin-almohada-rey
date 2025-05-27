"use client";

import React, { useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { CustomFormDescription } from "@/components/form/CustomFormDescription";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { socketService } from "@/services/socketService";
import { SelectOption } from "@/types/form/select-option";
import { DetailedReservation, DetailedRoom, UpdateReservationInput } from "../../_schemas/reservation.schemas";
import { UPDATE_FORMSTATICS } from "../../_statics/forms";
import { documentTypeStatusConfig } from "../../_types/document-type.enum.config";

interface UpdateHeaderReservationProps {
  form: UseFormReturn<UpdateReservationInput>;
  availableRooms: DetailedRoom[] | undefined;
  onRoomSelected: (room: DetailedRoom | undefined) => void;
  reservation: DetailedReservation;
  roomOptions: SelectOption<string>[];
}

export default function UpdateHeaderReservation({
  form,
  availableRooms,
  onRoomSelected,
  reservation,
  roomOptions,
}: UpdateHeaderReservationProps) {
  // Estado local para seguir las habitaciones que ya no están disponibles
  const [unavailableRoomIds, setUnavailableRoomIds] = useState<string[]>([]);

  // Crear una versión filtrada de roomOptions que excluye las habitaciones no disponibles
  // Pero siempre incluir la habitación actual de la reserva
  const filteredRoomOptions = roomOptions.filter(
    (room) => !unavailableRoomIds.includes(room.value) || room.value === reservation.roomId
  );

  // Crear opciones de cliente (solo el cliente actual)
  const customerOptions: SelectOption<string>[] = [
    {
      label:
        reservation.customer.name +
        " " +
        documentTypeStatusConfig[reservation.customer.documentType].name +
        ` (${reservation.customer.documentNumber})`,
      value: reservation.customerId,
    },
  ];

  // Escuchar los eventos de WebSocket para habitaciones reservadas
  useEffect(() => {
    // Verificar si hay una habitación seleccionada
    const selectedRoomId = form.watch("roomId");

    // Función para manejar habitaciones que ya no están disponibles
    const handleUnavailableRoom = (roomId: string) => {
      // Si la habitación que se acaba de reservar es la misma que estamos editando, ignorar
      if (roomId === reservation.roomId) return;

      if (roomId === selectedRoomId) {
        // Si es una habitación diferente a la original y ya fue tomada, deseleccionarla
        if (roomId !== reservation.roomId) {
          // Volver a la habitación original
          form.setValue("roomId", reservation.roomId);
          onRoomSelected(reservation.room);
        }

        // Añadir la habitación a la lista de no disponibles
        setUnavailableRoomIds((prev) => [...prev, roomId]);
      }
    };

    // Establecer listener para cuando una habitación es reservada
    const unsubscribe = socketService.onNewReservation((newReservation) => {
      // No bloquear la habitación actual si es de la misma reservación
      if (newReservation.id === reservation.id) return;
      handleUnavailableRoom(newReservation.roomId);
    });

    // También escuchar actualizaciones de reservaciones
    const unsubscribeUpdates = socketService.onReservationUpdated((updatedReservation) => {
      // No bloquear la habitación actual si es de la misma reservación
      if (updatedReservation.id === reservation.id) return;
      handleUnavailableRoom(updatedReservation.roomId);
    });

    // Limpieza al desmontar
    return () => {
      unsubscribe();
      unsubscribeUpdates();
    };
  }, [form, onRoomSelected, reservation]);

  return (
    <>
      <FormField
        control={form.control}
        name="customerId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{UPDATE_FORMSTATICS.customerId.label}</FormLabel>
            <Select disabled onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="w-full text-ellipsis capitalize truncate">
                  <SelectValue placeholder="Seleccione un cliente" className="capitalize" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectGroup>
                  {customerOptions.map((customer) => (
                    <SelectItem className="capitalize" key={customer.value} value={customer.value}>
                      <span>{customer.label}</span>
                    </SelectItem>
                  ))}
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
                      className={cn(
                        "w-full justify-between capitalize truncate",
                        !field.value && "text-muted-foreground"
                      )}
                      disabled={filteredRoomOptions.length === 0}
                    >
                      {field.value
                        ? filteredRoomOptions.find((room) => room.value === field.value)?.label
                        : UPDATE_FORMSTATICS.roomId.placeholder}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder={UPDATE_FORMSTATICS.roomId.placeholder} className="h-9" />
                    <CommandList>
                      {filteredRoomOptions.length === 0 ? (
                        <CommandEmpty>No hay habitaciones disponibles</CommandEmpty>
                      ) : (
                        <CommandGroup>
                          {filteredRoomOptions.map((room) => {
                            // Determinar si esta es la habitación original de la reserva
                            const isOriginalRoom = room.value === reservation.roomId;

                            return (
                              <CommandItem
                                value={room.value}
                                key={room.value}
                                onSelect={() => {
                                  form.setValue("roomId", room.value);
                                  const detailedRoom = availableRooms?.find((r) => r.id === room.value);
                                  onRoomSelected(detailedRoom);
                                }}
                                className={cn(isOriginalRoom && "font-medium")}
                              >
                                {isOriginalRoom ? "🔄 " : ""}
                                {room.label}
                                <Check
                                  className={cn("ml-auto", room.value === field.value ? "opacity-100" : "opacity-0")}
                                />
                              </CommandItem>
                            );
                          })}
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
