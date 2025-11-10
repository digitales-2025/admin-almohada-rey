import * as React from "react";
import { CheckCircle2, Users, XCircle } from "lucide-react";

import { DetailedRoom } from "@/app/(admin)/reservation/_schemas/reservation.schemas";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { FloorTypeLabels, getRoomTypeKey, RoomStatusLabels, RoomTypeLabels } from "./rooms.utils";

// Componentes de icono con estilos integrados
const ActiveIcon: React.FC<{ className?: string }> = ({ className }) => (
  <CheckCircle2 className={cn(className, "text-emerald-500")} />
);

const InactiveIcon: React.FC<{ className?: string }> = ({ className }) => (
  <XCircle className={cn(className, "text-red-500")} />
);

// Generar componentes de icono a partir de RoomStatusLabels
const RoomStatusIcons = Object.fromEntries(
  Object.entries(RoomStatusLabels).map(([roomStatus, config]) => {
    const IconComponent: React.FC<{ className?: string }> = ({ className }) => {
      const Icon = config.icon;
      return <Icon className={cn(className, config.className)} />;
    };
    return [roomStatus, IconComponent];
  })
);

const FloorTypeIcons = Object.fromEntries(
  Object.entries(FloorTypeLabels).map(([floorType, config]) => {
    const IconComponent: React.FC<{ className?: string }> = ({ className }) => {
      const Icon = config.icon;
      return <Icon className={cn(className, config.className)} />;
    };
    return [floorType, IconComponent];
  })
);

export const facetedFilters = [
  {
    column: "estado", // ID de la columna (no el título)
    title: "Estado",
    options: [
      {
        label: "Activo",
        value: "true", // Para isActive = true
        icon: ActiveIcon,
      },
      {
        label: "Inactivo",
        value: "false", // Para isActive = false
        icon: InactiveIcon,
      },
    ],
  },
  {
    // Filtro para la disponibilidad generado dinámicamente
    column: "disponibilidad", // ID de la columna
    title: "Disponibilidad",
    options: Object.entries(RoomStatusLabels).map(([roomStatus, config]) => ({
      label: config.label,
      value: roomStatus,
      icon: RoomStatusIcons[roomStatus],
    })),
  },
  {
    // Filtro para el tipo de piso generado dinamicamente
    column: "piso", // ID de la columna
    title: "Piso",
    options: Object.entries(FloorTypeLabels).map(([floorType, config]) => ({
      label: config.label,
      value: floorType,
      icon: FloorTypeIcons[floorType],
    })),
  },
];

// Componente para renderizar el contenido personalizado de cada opción
export interface RoomTypeOptionProps {
  label: string;
  className?: string;
}

export const RoomTypeOption = ({ label, className }: RoomTypeOptionProps) => {
  const typeKey = getRoomTypeKey(label);
  const { icon: Icon, className: iconClass } = RoomTypeLabels[typeKey];

  return (
    <div className="flex items-center gap-2">
      <Icon className={`${iconClass} h-4 w-4`} />
      <span className={`${className} text-sm`}>{label}</span>
    </div>
  );
};

/**
 * Capitaliza la primera letra de un string
 */
function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Genera un string o ReactNode simple para el label del botón del combobox de habitaciones
 * @param room - La habitación a mostrar
 * @returns String o ReactNode con el label formateado
 */
export function createRoomComboboxLabelString(room: DetailedRoom): string {
  const roomNumber = room?.number ?? 0;
  const roomType = room?.RoomTypes?.name ?? "Sin tipo";
  const roomPrice = room?.RoomTypes?.price ?? 0;
  const roomCapacity = room?.RoomTypes?.guests ?? 0;

  // Capitalizar el tipo de habitación (usar el nombre original)
  const roomTypeLabel = capitalize(roomType);

  return `${roomNumber} - ${roomTypeLabel} (${roomCapacity} huéspedes) - ${roomPrice.toLocaleString("es-PE", {
    style: "currency",
    currency: "PEN",
  })}`;
}

/**
 * Genera un componente React para el label de una habitación en un combobox
 * Diseño innovador y moderno que respeta el UX/UI del sistema
 * @param room - La habitación a mostrar
 * @returns Componente React con el label formateado
 */
export function createRoomComboboxLabel(room: DetailedRoom): React.ReactNode {
  const roomNumber = room?.number ?? 0;
  const roomType = room?.RoomTypes?.name ?? "Sin tipo";
  const roomPrice = room?.RoomTypes?.price ?? 0;
  const roomCapacity = room?.RoomTypes?.guests ?? 0;
  const roomStatus = room?.status;

  // Solo normalizar para obtener el icono
  const typeKey = getRoomTypeKey(roomType);
  const roomTypeConfig = RoomTypeLabels[typeKey];
  const RoomTypeIcon = roomTypeConfig?.icon || XCircle;

  // Usar el nombre original capitalizado para el label
  const roomTypeLabel = capitalize(roomType);

  // Obtener configuración del estado de la habitación
  const statusConfig = roomStatus ? RoomStatusLabels[roomStatus] : null;
  const StatusIcon = statusConfig?.icon || XCircle;
  const statusLabel = statusConfig?.label || "Sin estado";

  return (
    <div className="flex items-start gap-3 w-full min-w-0 py-0.5">
      {/* Icono del tipo de habitación - elemento visual destacado */}
      <div
        className={cn(
          "flex items-center justify-center w-9 h-9 rounded-full border-2 flex-shrink-0",
          roomTypeConfig?.className || "border-muted"
        )}
      >
        <RoomTypeIcon className="h-4 w-4" />
      </div>

      {/* Contenido principal */}
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        {/* Primera fila: Número y tipo de habitación */}
        <div className="flex items-center gap-2 w-full min-w-0">
          <span className="text-sm text-foreground truncate flex-1 min-w-0 font-medium">
            Habitación {roomNumber} - {roomTypeLabel}
          </span>
        </div>

        {/* Segunda fila: Capacidad, precio y estado */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground whitespace-nowrap">{roomCapacity}</span>
          </div>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs text-foreground font-medium whitespace-nowrap">
            {roomPrice.toLocaleString("es-PE", {
              style: "currency",
              currency: "PEN",
            })}
          </span>
          {statusConfig && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">•</span>
              <Badge
                variant="outline"
                size="sm"
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-md border-0 flex-shrink-0",
                  statusConfig.className
                )}
              >
                <StatusIcon className="h-3 w-3 flex-shrink-0" />
                <span className="text-xs font-medium leading-none">{statusLabel}</span>
              </Badge>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
