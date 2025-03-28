import { CheckCircle2, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { getRoomTypeKey, RoomStatusLabels, RoomTypeLabels } from "./rooms.utils";

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

export const facetedFilters = [
  {
    column: "estado",
    title: "Estado",
    options: [
      {
        label: "Activo",
        value: true,
        icon: ActiveIcon,
      },
      {
        label: "Inactivo",
        value: false,
        icon: InactiveIcon,
      },
    ],
  },
  {
    // Filtro para el estado civil generado dinámicamente
    column: "disponibilidad",
    title: "Disponibilidad",
    options: Object.entries(RoomStatusLabels).map(([roomStatus, config]) => ({
      label: config.label,
      value: roomStatus,
      icon: RoomStatusIcons[roomStatus],
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
      <span className={className}>{label}</span>
    </div>
  );
};
