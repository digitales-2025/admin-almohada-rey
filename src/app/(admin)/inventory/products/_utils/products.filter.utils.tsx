import { cn } from "@/lib/utils";
import { ProductTypeLabels } from "./products.utils";

// Generar componentes de icono a partir de CustomerDocumentTypeLabels
const CustomerDocumentTypeIcons = Object.fromEntries(
  Object.entries(ProductTypeLabels).map(([documentType, config]) => {
    const IconComponent: React.FC<{ className?: string }> = ({ className }) => {
      const Icon = config.icon;
      return <Icon className={cn(className, config.className)} />;
    };
    return [documentType, IconComponent];
  })
);

export const facetedFilters = [
  {
    column: "tipo",
    title: "Tipo de Producto",
    options: Object.entries(ProductTypeLabels).map(([documentType, config]) => ({
      label: config.label,
      value: documentType,
      icon: CustomerDocumentTypeIcons[documentType],
    })),
  },
];
