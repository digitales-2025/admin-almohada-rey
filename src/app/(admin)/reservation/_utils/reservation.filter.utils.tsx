import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { reservationStatusConfig } from "../_types/reservation-enum.config";

// Componentes de icono con estilos integrados
const ActiveIcon: React.FC<{ className?: string }> = ({ className }) => (
  <CheckCircle2 className={cn(className, "text-emerald-500")} />
);

const InactiveIcon: React.FC<{ className?: string }> = ({ className }) => (
  <XCircle className={cn(className, "text-red-500")} />
);

const PaymentToDeleteIcon: React.FC<{ className?: string }> = ({ className }) => (
  <AlertTriangle className={cn(className, "text-amber-600")} />
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
    column: "isActive", // ID real de la columna en ReservationTableColumns
    title: "Estado",
    options: [
      {
        label: "Activo",
        value: "true", // Para isActive = true
        icon: ActiveIcon,
      },
      {
        label: "Archivado",
        value: "false", // Para isActive = false
        icon: InactiveIcon,
      },
      {
        label: "Pago por anular",
        value: "payment_to_delete", // Caso especial para isPendingDeletePayment
        icon: PaymentToDeleteIcon,
      },
    ],
  },
  {
    column: "E. Reserva", // ID real de la columna en ReservationTableColumns
    title: "Status de Reserva",
    options: Object.entries(reservationStatusConfig).map(([reservationStatus, config]) => ({
      label: config.name,
      value: reservationStatus,
      icon: ReservationStatusIcons[reservationStatus],
    })),
  },
  // Filtro de fecha para check-in y check-out
  {
    column: "dateRange", // ID especial para el filtro de fecha
    title: "Fechas",
    type: "dateRange" as const,
    options: [], // No se usa para filtros de fecha
    dateRangeConfig: {
      numberOfMonths: 2 as const,
    },
  },
];
