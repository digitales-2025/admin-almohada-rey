import * as React from "react";
import { Ban, CheckCircle, CheckCircle2, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ApiCustomer } from "../_types/customer";
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

/**
 * Genera un string o ReactNode simple para el label del botón del combobox
 * Si está en blacklist, retorna un componente con texto tachado y rojo
 * @param customer - El customer a mostrar
 * @returns String o ReactNode con el label formateado
 */
export function createCustomerComboboxLabelString(customer: ApiCustomer): string | React.ReactNode {
  const name = customer?.name ?? "Sin nombre";
  const documentNumber = customer?.documentNumber ?? "Sin documento";
  const documentType = customer?.documentType;

  // Obtener configuración del tipo de documento usando las utils existentes
  const documentTypeConfig = documentType ? CustomerDocumentTypeLabels[documentType] : null;
  const documentTypeLabel = documentTypeConfig?.label || "Sin tipo";

  // Verificar si está en blacklist
  const isBlacklist = !!customer?.isBlacklist;
  const labelText = `${name} - ${documentTypeLabel}: ${documentNumber}`;

  // Si está en blacklist, retornar componente con línea tachada roja
  if (isBlacklist) {
    return <span className="line-through decoration-destructive decoration-2">{labelText}</span>;
  }

  return labelText;
}

/**
 * Genera un componente React para el label de un customer en un combobox
 * Diseño innovador y moderno que respeta el UX/UI del sistema
 * @param customer - El customer a mostrar
 * @returns Componente React con el label formateado
 */
export function createCustomerComboboxLabel(customer: ApiCustomer): React.ReactNode {
  const name = customer?.name ?? "Sin nombre";
  const documentNumber = customer?.documentNumber ?? "Sin documento";
  const documentType = customer?.documentType;

  // Obtener configuración del tipo de documento usando las utils existentes
  const documentTypeConfig = documentType ? CustomerDocumentTypeLabels[documentType] : null;
  const DocumentIcon = documentTypeConfig?.icon || XCircle;
  const documentTypeLabel = documentTypeConfig?.label || "Sin tipo";

  // Verificar si está en blacklist - verificación robusta
  const isBlacklist = !!customer?.isBlacklist;

  return (
    <div className="flex items-start gap-3 w-full min-w-0 py-0.5">
      {/* Icono del tipo de documento - elemento visual destacado */}
      <div
        className={cn(
          "flex items-center justify-center w-9 h-9 rounded-full border-2 flex-shrink-0",
          documentTypeConfig?.className || "border-muted"
        )}
      >
        <DocumentIcon className="h-4 w-4" />
      </div>

      {/* Contenido principal */}
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        {/* Primera fila: Nombre del cliente */}
        <div className="flex items-center gap-2 w-full min-w-0">
          <span className="text-sm text-foreground truncate flex-1 min-w-0 font-medium">{name}</span>
        </div>

        {/* Segunda fila: Tipo y número de documento */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground whitespace-nowrap">{documentTypeLabel}</span>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs text-foreground font-medium whitespace-nowrap">{documentNumber}</span>
          {isBlacklist && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">•</span>
              <Badge
                variant="destructive"
                size="sm"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border-0 flex-shrink-0"
              >
                <Ban className="h-3 w-3 flex-shrink-0 text-white" />
                <span className="text-xs font-medium leading-none">Lista Negra</span>
              </Badge>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
