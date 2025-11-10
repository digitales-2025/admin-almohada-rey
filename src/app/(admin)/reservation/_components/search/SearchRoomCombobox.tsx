"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  createRoomComboboxLabel,
  createRoomComboboxLabelString,
} from "@/app/(admin)/rooms/list/_utils/rooms.filter.utils";
import { RTKUseQueryHookResult, SearchCombobox } from "@/components/form/RemoteSearchCombobox";
import { cn } from "@/lib/utils";
import { DetailedRoom } from "../../_schemas/reservation.schemas";

type SearchRoomComboboxProps = {
  onValueChange: (value: string, entity?: DetailedRoom) => void;
  defaultValue?: string;
  className?: string;
  rooms: DetailedRoom[];
  unavailableRoomIds?: string[];
  disabled?: boolean;
  alwaysAvailableRoomIds?: string[]; // Habitaciones que siempre deben estar disponibles (ej: habitación original)
};

type ComboboxItem<T> = {
  value: string;
  label: string | React.ReactNode;
  entity: T;
  keywords?: string[];
};

export function SearchRoomCombobox({
  onValueChange,
  defaultValue,
  className,
  rooms,
  unavailableRoomIds = [],
  disabled = false,
  alwaysAvailableRoomIds = [],
}: SearchRoomComboboxProps) {
  const [value, setValue] = useState(defaultValue);
  const [label, setLabel] = useState<string | React.ReactNode>("Selecciona una habitación");

  // Filtrar habitaciones no disponibles, pero siempre incluir las habitaciones que deben estar siempre disponibles
  const availableRooms = useMemo(() => {
    return rooms.filter((room) => !unavailableRoomIds.includes(room.id) || alwaysAvailableRoomIds.includes(room.id));
  }, [rooms, unavailableRoomIds, alwaysAvailableRoomIds]);

  // Sincronizar el valor cuando cambia defaultValue (desde el formulario)
  useEffect(() => {
    if (defaultValue !== value) {
      setValue(defaultValue);
      if (defaultValue) {
        const room = availableRooms.find((r) => r.id === defaultValue);
        if (room) {
          setLabel(createRoomComboboxLabelString(room));
        } else {
          setLabel("Selecciona una habitación");
        }
      } else {
        setLabel("Selecciona una habitación");
      }
    }
  }, [defaultValue, value, availableRooms]);

  // Actualizar label cuando cambia el valor seleccionado
  useEffect(() => {
    if (value && availableRooms.length > 0) {
      const room = availableRooms.find((r) => r.id === value);
      if (room) {
        setLabel(createRoomComboboxLabelString(room));
      }
    } else if (!value) {
      setLabel("Selecciona una habitación");
    }
  }, [value, availableRooms]);

  const mapToComboboxItem = useCallback((room: DetailedRoom): ComboboxItem<DetailedRoom> => {
    // Generar keywords para la búsqueda basados en los datos de la habitación
    const roomNumber = room?.number ?? 0;
    const roomType = room?.RoomTypes?.name ?? "Sin tipo";
    const roomPrice = room?.RoomTypes?.price ?? 0;
    const roomCapacity = room?.RoomTypes?.guests ?? 0;
    const roomStatus = room?.status ?? "";

    // Crear keywords para buscar por número, tipo, precio, capacidad, estado
    const keywords = [
      roomNumber.toString(),
      roomType.toLowerCase(),
      roomType,
      roomPrice.toString(),
      roomCapacity.toString(),
      roomStatus.toLowerCase(),
      `habitación ${roomNumber}`,
      `habitacion ${roomNumber}`,
    ];

    return {
      value: room.id,
      label: createRoomComboboxLabel(room),
      entity: room,
      keywords,
    };
  }, []);

  const mapToComboboxItems = useCallback(
    (roomsList: DetailedRoom[]) => roomsList.map((room) => mapToComboboxItem(room)),
    [mapToComboboxItem]
  );

  const items = useMemo(() => mapToComboboxItems(availableRooms), [availableRooms, mapToComboboxItems]);

  // Crear un query state simulado para el SearchCombobox
  const queryStateData: RTKUseQueryHookResult<DetailedRoom[], Error> = {
    data: availableRooms,
    isLoading: false,
    isLoadingError: false,
    isError: false,
    error: undefined,
    refetch: () => {},
  };

  return (
    <SearchCombobox<DetailedRoom>
      queryState={queryStateData}
      className={cn(className || "max-w-90")}
      items={items}
      value={value}
      label={label}
      onSelect={(value, label, entity) => {
        setValue(value ?? "");
        // Si el entity es un DetailedRoom, generar un string simple para el botón
        const labelToSet: string =
          entity && typeof entity === "object" && "id" in entity
            ? createRoomComboboxLabelString(entity as DetailedRoom)
            : typeof label === "string"
              ? label
              : "Selecciona una habitación";
        setLabel(labelToSet);
        onValueChange(value, entity as DetailedRoom);
      }}
      searchPlaceholder="Busca una habitación..."
      noResultsMsg="No hay habitaciones disponibles"
      selectItemMsg="Selecciona una habitación"
      disabled={disabled || availableRooms.length === 0}
    />
  );
}
