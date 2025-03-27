import { CalendarMinus, CalendarPlus, CalendarX, Clock } from "lucide-react";

import { EnumConfig } from "@/types/enum/enum-ui.config";
import { ReservationStatus } from "../_schemas/reservation.schemas";

export const reservationStatusConfig: Record<ReservationStatus, EnumConfig> = {
  PENDING: {
    name: "Pendiente",
    backgroundColor: "bg-[#FFF3E0]",
    textColor: "text-[#F57C00]",
    hoverBgColor: "hover:bg-[#FFE0B2]",
    borderColor: "border-[#F57C00]",
    hoverBorderColor: "hover:border-[#F57C00]",
    icon: Clock,
  },
  CHECKED_IN: {
    name: "Check-in",
    backgroundColor: "bg-[#E8F5E9]",
    textColor: "text-[#388E3C]",
    hoverBgColor: "hover:bg-[#C8E6C9]",
    borderColor: "border-[#388E3C]",
    hoverBorderColor: "hover:border-[#388E3C]",
    icon: CalendarPlus,
  },
  CHECKED_OUT: {
    name: "Check-out",
    backgroundColor: "bg-[#E3F2FD]",
    textColor: "text-[#1976D2]",
    hoverBgColor: "hover:bg-[#BBDEFB]",
    borderColor: "border-[#1976D2]",
    hoverBorderColor: "hover:border-[#1976D2]",
    icon: CalendarMinus,
  },
  CANCELED: {
    name: "Cancelado",
    backgroundColor: "bg-[#FFEBEE]",
    textColor: "text-[#D32F2F]",
    hoverBgColor: "hover:bg-[#FFCDD2]",
    borderColor: "border-[#D32F2F]",
    hoverBorderColor: "hover:border-[#D32F2F]",
    icon: CalendarX,
  },
};
