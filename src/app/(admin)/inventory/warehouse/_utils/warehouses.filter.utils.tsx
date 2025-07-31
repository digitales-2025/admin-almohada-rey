import { cn } from "@/lib/utils";
import { WarehouseTypeLabels } from "./warehouses.utils";

// Generar componentes de icono a partir de ProductTypeLabels
const WarehouseTypeIcons = Object.fromEntries(
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
    column: "tipo",
    title: "Tipo de Almacén",
    options: Object.entries(WarehouseTypeLabels).map(([warehouseType, config]) => ({
      label: config.label,
      value: warehouseType,
      icon: WarehouseTypeIcons[warehouseType],
    })),
  },
];
