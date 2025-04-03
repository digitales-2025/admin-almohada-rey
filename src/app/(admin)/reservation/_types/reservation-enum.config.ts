import { CalendarCheck, CalendarMinus, CalendarPlus, CalendarX, Clock } from "lucide-react";

import { EnumConfig } from "@/types/enum/enum-ui.config";
import { ReservationStatus } from "../_schemas/reservation.schemas";

export const reservationStatusConfig: Record<ReservationStatus, EnumConfig> = {
  PENDING: {
    name: "Pendiente",
    backgroundColor: "bg-[#FFF0D0]",
    backgroundColorIntense: "bg-[#E65100]",
    textColor: "text-[#E65100]",
    hoverBgColor: "hover:bg-[#FFE0B2]",
    borderColor: "border-[#F57C00]",
    hoverBorderColor: "hover:border-[#F57C00]",
    icon: Clock,
  },
  CONFIRMED: {
    name: "Confirmado",
    backgroundColor: "bg-[#E0F7FA]",
    backgroundColorIntense: "bg-[#00838F]",
    textColor: "text-[#00838F]",
    hoverBgColor: "hover:bg-[#B2EBF2]",
    borderColor: "border-[#0097A7]",
    hoverBorderColor: "hover:border-[#0097A7]",
    icon: CalendarCheck,
  },
  CHECKED_IN: {
    name: "Check-in",
    backgroundColor: "bg-[#E0F2E0]",
    backgroundColorIntense: "bg-[#2E7D32]",
    textColor: "text-[#2E7D32]",
    hoverBgColor: "hover:bg-[#C8E6C9]",
    borderColor: "border-[#388E3C]",
    hoverBorderColor: "hover:border-[#388E3C]",
    icon: CalendarPlus,
  },
  CHECKED_OUT: {
    name: "Check-out",
    backgroundColor: "bg-[#D6EDFF]",
    backgroundColorIntense: "bg-[#0D47A1]",
    textColor: "text-[#0D47A1]",
    hoverBgColor: "hover:bg-[#BBDEFB]",
    borderColor: "border-[#1976D2]",
    hoverBorderColor: "hover:border-[#1976D2]",
    icon: CalendarMinus,
  },
  CANCELED: {
    name: "Cancelado",
    backgroundColor: "bg-[#FFDEE0]",
    backgroundColorIntense: "bg-[#B71C1C]",
    textColor: "text-[#B71C1C]",
    hoverBgColor: "hover:bg-[#FFCDD2]",
    borderColor: "border-[#D32F2F]",
    hoverBorderColor: "hover:border-[#D32F2F]",
    icon: CalendarX,
  },
};
