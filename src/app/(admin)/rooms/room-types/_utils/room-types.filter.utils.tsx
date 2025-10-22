import { CheckCircle2, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";

// Componentes de icono con estilos integrados
const ActiveIcon: React.FC<{ className?: string }> = ({ className }) => (
  <CheckCircle2 className={cn(className, "text-emerald-500")} />
);

const InactiveIcon: React.FC<{ className?: string }> = ({ className }) => (
  <XCircle className={cn(className, "text-red-500")} />
);

export const facetedFilters = [
  {
    column: "estado", // ID de la columna (no el título)
    title: "Estado",
    options: [
      {
        label: "Activo",
        value: "true", // Para isActive = true
        icon: ActiveIcon,
      },
      {
        label: "Inactivo",
        value: "false", // Para isActive = false
        icon: InactiveIcon,
      },
    ],
  },
];
