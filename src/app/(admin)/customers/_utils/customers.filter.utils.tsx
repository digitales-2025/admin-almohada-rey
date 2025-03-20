import { CheckCircle2, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { CustomerDocumentTypeLabels, CustomerMaritalStatusLabels } from "./customers.utils";

// Componentes de icono con estilos integrados
const ActiveIcon: React.FC<{ className?: string }> = ({ className }) => (
  <CheckCircle2 className={cn(className, "text-emerald-500")} />
);

const InactiveIcon: React.FC<{ className?: string }> = ({ className }) => (
  <XCircle className={cn(className, "text-red-500")} />
);

// Generar componentes de icono a partir de CustomerMaritalStatusLabels
const CustomerMaritalStatusIcons = Object.fromEntries(
  Object.entries(CustomerMaritalStatusLabels).map(([maritalStatus, config]) => {
    const IconComponent: React.FC<{ className?: string }> = ({ className }) => {
      const Icon = config.icon;
      return <Icon className={cn(className, config.className)} />;
    };
    return [maritalStatus, IconComponent];
  })
);

// Generar componentes de icono a partir de CustomerDocumentTypeLabels
const CustomerDocumentTypeIcons = Object.fromEntries(
  Object.entries(CustomerDocumentTypeLabels).map(([documentType, config]) => {
    const IconComponent: React.FC<{ className?: string }> = ({ className }) => {
      const Icon = config.icon;
      return <Icon className={cn(className, config.className)} />;
    };
    return [documentType, IconComponent];
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
    column: "e. civil",
    title: "Estado Civil",
    options: Object.entries(CustomerMaritalStatusLabels).map(([maritalStatus, config]) => ({
      label: config.label,
      value: maritalStatus,
      icon: CustomerMaritalStatusIcons[maritalStatus],
    })),
  },
  // Filtro para el tipo de documento generado dinámicamente
  {
    column: "tipo",
    title: "Tipo de Documento",
    options: Object.entries(CustomerDocumentTypeLabels).map(([documentType, config]) => ({
      label: config.label,
      value: documentType,
      icon: CustomerDocumentTypeIcons[documentType],
    })),
  },
];
