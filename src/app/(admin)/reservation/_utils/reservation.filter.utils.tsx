import { CheckCircle2, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { reservationStatusConfig } from "../_types/reservation-enum.config";

// Componentes de icono con estilos integrados
const ActiveIcon: React.FC<{ className?: string }> = ({ className }) => (
  <CheckCircle2 className={cn(className, "text-emerald-500")} />
);

const InactiveIcon: React.FC<{ className?: string }> = ({ className }) => (
  <XCircle className={cn(className, "text-red-500")} />
);

const ReservationStatusIcons = Object.fromEntries(
  Object.entries(reservationStatusConfig).map(([reservationStatus, config]) => {
    const IconComponent: React.FC<{ className?: string }> = ({ className }) => {
      const Icon = config.icon;
      return <Icon className={cn(className, config.textColor)} />;
    };
    return [reservationStatus, IconComponent];
  })
);

export const facetedFilters = [
  {
    column: "isActive",
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
    column: "E. Reserva",
    title: "Status de Reserva",
    options: Object.entries(reservationStatusConfig).map(([reservationStatus, config]) => ({
      label: config.name,
      value: reservationStatus,
      icon: ReservationStatusIcons[reservationStatus],
    })),
  },
];
