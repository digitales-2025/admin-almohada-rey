import { cn } from "@/lib/utils";
import { ProductTypeLabels } from "../../products/_utils/products.utils";

// Generar componentes de icono a partir de ProductTypeLabels
const ProductTypeIcons = Object.fromEntries(
  Object.entries(ProductTypeLabels).map(([productType, config]) => {
    const IconComponent: React.FC<{ className?: string }> = ({ className }) => {
      const Icon = config.icon;
      return <Icon className={cn(className, config.className)} />;
    };
    return [productType, IconComponent];
  })
);

export const facetedFilters = [
  {
    // Filtro para el tipo de producto
    column: "tipo de producto",
    title: "Tipo de Producto",
    options: Object.entries(ProductTypeLabels).map(([productType, config]) => ({
      label: config.label,
      value: productType,
      icon: ProductTypeIcons[productType],
    })),
  },
];
