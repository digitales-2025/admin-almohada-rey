import { CheckCircle2, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { UserRolTypeLabels } from "./users.utils";

// Componentes de icono con estilos integrados
const ActiveIcon: React.FC<{ className?: string }> = ({ className }) => (
  <CheckCircle2 className={cn(className, "text-emerald-500")} />
);

const InactiveIcon: React.FC<{ className?: string }> = ({ className }) => (
  <XCircle className={cn(className, "text-red-500")} />
);

// Generar componentes de icono a partir de UserRolTypeLabels
const RoleIcons = Object.fromEntries(
  Object.entries(UserRolTypeLabels).map(([role, config]) => {
    const IconComponent: React.FC<{ className?: string }> = ({ className }) => {
      const Icon = config.icon;
      return <Icon className={cn(className, config.className)} />;
    };
    return [role, IconComponent];
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
  // Filtro para roles generado dinámicamente
  {
    column: "rol",
    title: "Rol",
    options: Object.entries(UserRolTypeLabels).map(([role, config]) => ({
      label: config.label,
      value: role,
      icon: RoleIcons[role],
    })),
  },
];
