import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";

import { CustomFormDescription } from "@/components/form/CustomFormDescription";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { socketService } from "@/services/socketService";
import { SelectOption } from "@/types/form/select-option";
import { CreateReservationInput, DetailedRoom } from "../../_schemas/reservation.schemas";
import { FORMSTATICS } from "../../_statics/forms";
import { SearchCustomerCombobox } from "../search/SearchCustomerCombobox";
import { SearchRoomCombobox } from "../search/SearchRoomCombobox";

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
  const filteredRoomOptions = useMemo(() => {
    return roomOptions.filter((room) => !unavailableRoomIds.includes(room.value));
  }, [roomOptions, unavailableRoomIds]);

  // Ref para evitar bucles infinitos
  const selectedRoomIdRef = useRef<string>("");

  // Actualizar la ref cuando cambia la habitación seleccionada
  useEffect(() => {
    const roomId = form.watch("roomId");
    selectedRoomIdRef.current = roomId;
  }, [form]);

  // Función para manejar habitaciones que vuelven a estar disponibles (cancelaciones)
  const handleAvailableRoom = useCallback((roomId: string) => {
    // Remover la habitación de la lista de no disponibles
    setUnavailableRoomIds((prev) => prev.filter((id) => id !== roomId));

    // Si esta habitación está seleccionada actualmente, forzar nueva verificación
    if (roomId === selectedRoomIdRef.current) {
      // Disparar un evento personalizado para forzar verificación
      window.dispatchEvent(
        new CustomEvent("roomAvailabilityChanged", {
          detail: { roomId, action: "freed" },
        })
      );
    }
  }, []);

  // Función para manejar cuando una habitación se vuelve no disponible
  const handleRoomBecameUnavailable = useCallback(
    (roomId: string) => {
      // Si esta habitación está seleccionada, limpiar el campo
      if (roomId === selectedRoomIdRef.current) {
        form.setValue("roomId", "", { shouldValidate: false, shouldDirty: false, shouldTouch: false });
        onRoomSelected(undefined);
      }

      // Añadir a la lista de no disponibles
      setUnavailableRoomIds((prev) => {
        if (prev.includes(roomId)) return prev;
        return [...prev, roomId];
      });
    },
    [form, onRoomSelected]
  );

  // Escuchar los eventos de WebSocket para habitaciones reservadas
  useEffect(() => {
    // Establecer listener para cuando una habitación es reservada
    const unsubscribe = socketService.onNewReservation((reservation) => {
      handleRoomBecameUnavailable(reservation.roomId);
    });

    // Escuchar actualizaciones de reservaciones
    const unsubscribeUpdates = socketService.onReservationUpdated((reservation) => {
      // Si la reservación fue cancelada, liberar la habitación
      if (reservation.status === "CANCELED") {
        handleAvailableRoom(reservation.roomId);
      } else {
        // Para otros cambios de estado, marcar como no disponible
        handleRoomBecameUnavailable(reservation.roomId);
      }
    });

    // Escuchar cambios de disponibilidad general
    const unsubscribeAvailability = socketService.onAvailabilityChanged(() => {
      // Obtener la habitación actualmente seleccionada
      const currentRoomId = selectedRoomIdRef.current;

      // Limpiar todas las habitaciones no disponibles para forzar re-verificación
      setUnavailableRoomIds([]);

      // Si hay una habitación seleccionada, verificar si sigue disponible
      if (currentRoomId) {
        // Disparar evento personalizado para forzar verificación de disponibilidad
        window.dispatchEvent(
          new CustomEvent("roomAvailabilityChanged", {
            detail: { roomId: currentRoomId, action: "refresh" },
          })
        );
      }
    });

    // Limpieza al desmontar
    return () => {
      unsubscribe();
      unsubscribeUpdates();
      unsubscribeAvailability();
    };
  }, [handleAvailableRoom, handleRoomBecameUnavailable]);

  return (
    <>
      <FormItem className="w-full col-span-2 sm:col-span-1">
        <FormLabel>{FORMSTATICS.customerId.label}</FormLabel>
        <FormControl>
          <SearchCustomerCombobox onValueChange={onSearchCustomerFound} className="max-w-none" notFoundAction={true} />
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
          <FormItem className="col-span-2 sm:col-span-1 w-full">
            <FormLabel>{FORMSTATICS.roomId.label}</FormLabel>
            <FormControl>
              <SearchRoomCombobox
                rooms={availableRooms ?? []}
                unavailableRoomIds={unavailableRoomIds}
                defaultValue={field.value}
                className="max-w-none"
                disabled={filteredRoomOptions.length === 0}
                onValueChange={(value, entity) => {
                  form.setValue("roomId", value);
                  onRoomSelected(entity);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
