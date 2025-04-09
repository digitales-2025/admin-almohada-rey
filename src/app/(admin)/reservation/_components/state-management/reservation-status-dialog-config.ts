import { CalendarCheck, CalendarMinus, HandCoins, Hourglass, LucideIcon, TicketX } from "lucide-react";

import { ReservationStatus } from "../../_schemas/reservation.schemas";

type DialogConfig = {
  title: string;
  description: string;
  buttonLabel: string;
  icon: LucideIcon;
};
export const DIALOG_DICTIONARY: Record<ReservationStatus, DialogConfig> = {
  CANCELED: {
    title: "¿Estás seguro?",
    description: `Esta acción cancelará la reserva para el `,
    buttonLabel: "Cancelar reserva",
    icon: TicketX,
  },
  CHECKED_IN: {
    title: "¿Estás seguro?",
    description: `Esta acción marcará la reserva como check-in para el `,
    buttonLabel: "Marcar Check-in",
    icon: CalendarCheck,
  },
  CHECKED_OUT: {
    title: "¿Estás seguro?",
    description: `Esta acción marcará la reserva como check-out para el `,
    buttonLabel: "Marcar Check-out",
    icon: CalendarMinus,
  },
  CONFIRMED: {
    title: "¿Estás seguro?",
    description: `Esta acción confirmará la reserva para el `,
    buttonLabel: "Pagar y Confirmar",
    icon: HandCoins,
  },
  PENDING: {
    title: "¿Estás seguro?",
    description: `Esta acción marcará la reserva como pendiente para el `,
    buttonLabel: "Marcar como pendiente",
    icon: Hourglass,
  },
};
