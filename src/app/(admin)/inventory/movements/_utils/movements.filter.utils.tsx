import { cn } from "@/lib/utils";
import { WarehouseTypeLabels } from "../../warehouse/_utils/warehouses.utils";

// Generar componentes de icono a partir de WarehouseTypeLabels
const warehouseTypeIcons = Object.fromEntries(
  Object.entries(WarehouseTypeLabels).map(([warehouseType, config]) => {
    const IconComponent: React.FC<{ className?: string }> = ({ className }) => {
      const Icon = config.icon;
      return <Icon className={cn(className, config.className)} />;
    };
    return [warehouseType, IconComponent];
  })
);

export const facetedFilters = [
  {
    // Filtro para el tipo de producto
    column: "tipo de Almacén",
    title: "Tipo de Almacén",
    options: Object.entries(WarehouseTypeLabels).map(([warehouseType, config]) => ({
      label: config.label,
      value: warehouseType,
      icon: warehouseTypeIcons[warehouseType],
    })),
  },
];
