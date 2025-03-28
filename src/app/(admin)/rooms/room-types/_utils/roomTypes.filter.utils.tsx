import { CheckCircle2, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { FloorTypeLabels } from "./roomTypes.utils";

// Componentes de icono con estilos integrados para estados
const ActiveIcon: React.FC<{ className?: string }> = ({ className }) => (
  <CheckCircle2 className={cn(className, "text-emerald-500")} />
);

const InactiveIcon: React.FC<{ className?: string }> = ({ className }) => (
  <XCircle className={cn(className, "text-red-500")} />
);

// Generar componentes de icono a partir de FloorTypeLabels
const FloorTypeIcons = Object.fromEntries(
  Object.entries(FloorTypeLabels).map(([floorType, config]) => {
    const IconComponent: React.FC<{ className?: string }> = ({ className }) => {
      const Icon = config.icon;
      return <Icon className={cn(className, config.className)} />;
    };
    return [floorType, IconComponent];
  })
);

/**
 * Filtros facetados para tipos de habitación
 * Pueden ser usados con componentes como DataTable para filtrar por estado y tipo de piso
 */
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
    column: "tipo de piso",
    title: "Tipo de Piso",
    options: Object.entries(FloorTypeLabels).map(([floorType, config]) => ({
      label: config.label,
      value: floorType,
      icon: FloorTypeIcons[floorType],
    })),
  },
];
