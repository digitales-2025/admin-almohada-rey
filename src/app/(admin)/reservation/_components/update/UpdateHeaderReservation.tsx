"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";

import { CustomFormDescription } from "@/components/form/CustomFormDescription";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { socketService } from "@/services/socketService";
import { SelectOption } from "@/types/form/select-option";
import { DetailedReservation, DetailedRoom, UpdateReservationInput } from "../../_schemas/reservation.schemas";
import { UPDATE_FORMSTATICS } from "../../_statics/forms";
import { documentTypeStatusConfig } from "../../_types/document-type.enum.config";
import { SearchRoomCombobox } from "../search/SearchRoomCombobox";

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

  // Ref para evitar bucles infinitos
  const selectedRoomIdRef = useRef<string>(reservation.roomId);

  // Crear una versión filtrada de roomOptions que excluye las habitaciones no disponibles
  // Pero siempre incluir la habitación actual de la reserva
  const filteredRoomOptions = useMemo(() => {
    return roomOptions.filter((room) => !unavailableRoomIds.includes(room.value) || room.value === reservation.roomId);
  }, [roomOptions, unavailableRoomIds, reservation.roomId]);

  // Crear opciones de cliente (solo el cliente actual) - memoizado
  const customerOptions = useMemo(
    () => [
      {
        label:
          reservation.customer.name +
          " " +
          documentTypeStatusConfig[reservation.customer.documentType].name +
          ` (${reservation.customer.documentNumber})`,
        value: reservation.customerId,
      },
    ],
    [
      reservation.customer.name,
      reservation.customer.documentType,
      reservation.customer.documentNumber,
      reservation.customerId,
    ]
  );

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
      // Si la habitación que se acaba de reservar es la misma que estamos editando, ignorar
      if (roomId === reservation.roomId) return;

      // Si esta habitación está seleccionada, volver a la original
      if (roomId === selectedRoomIdRef.current && roomId !== reservation.roomId) {
        form.setValue("roomId", reservation.roomId);
        onRoomSelected(reservation.room);
      }

      // Añadir a la lista de no disponibles
      setUnavailableRoomIds((prev) => {
        if (prev.includes(roomId)) return prev;
        return [...prev, roomId];
      });
    },
    [form, onRoomSelected, reservation]
  );

  // Escuchar los eventos de WebSocket para habitaciones reservadas
  useEffect(() => {
    // Establecer listener para cuando una habitación es reservada
    const unsubscribe = socketService.onNewReservation((newReservation) => {
      // No bloquear la habitación actual si es de la misma reservación
      if (newReservation.id === reservation.id) return;
      handleRoomBecameUnavailable(newReservation.roomId);
    });

    // Escuchar actualizaciones de reservaciones
    const unsubscribeUpdates = socketService.onReservationUpdated((updatedReservation) => {
      // No bloquear la habitación actual si es de la misma reservación
      if (updatedReservation.id === reservation.id) return;

      // Si la reservación fue cancelada, liberar la habitación
      if (updatedReservation.status === "CANCELED") {
        handleAvailableRoom(updatedReservation.roomId);
      } else {
        // Para otros cambios de estado, marcar como no disponible
        handleRoomBecameUnavailable(updatedReservation.roomId);
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
  }, [handleAvailableRoom, handleRoomBecameUnavailable, reservation]);

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
              <SearchRoomCombobox
                rooms={availableRooms ?? []}
                unavailableRoomIds={unavailableRoomIds}
                alwaysAvailableRoomIds={[reservation.roomId]} // Siempre incluir la habitación original
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
