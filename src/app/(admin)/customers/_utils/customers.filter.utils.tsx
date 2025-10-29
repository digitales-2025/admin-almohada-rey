import { Ban, CheckCircle, CheckCircle2, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { CustomerDocumentTypeLabels, CustomerMaritalStatusLabels } from "./customers.utils";

// Componentes de icono con estilos integrados
const ActiveIcon: React.FC<{ className?: string }> = ({ className }) => (
  <CheckCircle2 className={cn(className, "text-emerald-500")} />
);

const InactiveIcon: React.FC<{ className?: string }> = ({ className }) => (
  <XCircle className={cn(className, "text-red-500")} />
);

const BlacklistIcon: React.FC<{ className?: string }> = ({ className }) => (
  <Ban className={cn(className, "text-red-600")} />
);

const NormalIcon: React.FC<{ className?: string }> = ({ className }) => (
  <CheckCircle className={cn(className, "text-blue-500")} />
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
    column: "estado", // ID de la columna existente
    title: "Estado",
    options: [
      {
        label: "Activo",
        value: "true", // Enviar como string al backend
        icon: ActiveIcon,
      },
      {
        label: "Inactivo",
        value: "false", // Enviar como string al backend
        icon: InactiveIcon,
      },
    ],
  },
  {
    // Filtro para el estado civil generado dinámicamente
    column: "e. civil", // ID de la columna existente
    title: "Estado Civil",
    options: Object.entries(CustomerMaritalStatusLabels).map(([maritalStatus, config]) => ({
      label: config.label,
      value: maritalStatus,
      icon: CustomerMaritalStatusIcons[maritalStatus],
    })),
  },
  // Filtro para el tipo de documento generado dinámicamente
  {
    column: "tipo", // ID de la columna existente
    title: "Tipo de Documento",
    options: Object.entries(CustomerDocumentTypeLabels).map(([documentType, config]) => ({
      label: config.label,
      value: documentType,
      icon: CustomerDocumentTypeIcons[documentType],
    })),
  },
  // Filtro para lista negra
  {
    column: "lista negra", // ID de la columna existente
    title: "Lista Negra",
    options: [
      {
        label: "Lista Negra",
        value: "true", // Enviar como string al backend
        icon: BlacklistIcon,
      },
      {
        label: "Normal",
        value: "false", // Enviar como string al backend
        icon: NormalIcon,
      },
    ],
  },
];
