import { cn } from "@/lib/utils";
import { PaymentStatusLabels } from "./payments.utils";

// Generar componentes de icono a partir de CustomerDocumentTypeLabels
const PaymentStatusIcons = Object.fromEntries(
  Object.entries(PaymentStatusLabels).map(([paymentStatus, config]) => {
    const IconComponent: React.FC<{ className?: string }> = ({ className }) => {
      const Icon = config.icon;
      return <Icon className={cn(className, config.className)} />;
    };
    return [paymentStatus, IconComponent];
  })
);

export const facetedFilters = [
  {
    // Filtro para el estado de pago
    column: "estado", // ID de la columna (no el título)
    title: "Estado de Pago",
    options: Object.entries(PaymentStatusLabels).map(([paymentStatus, config]) => ({
      label: config.label,
      value: paymentStatus, // Mantener como string (no necesita conversión)
      icon: PaymentStatusIcons[paymentStatus],
    })),
  },
];
