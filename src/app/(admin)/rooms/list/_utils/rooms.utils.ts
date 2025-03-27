import { BedDouble, BedSingle, CalendarCheck2, ConciergeBell, CookingPot, Home, Hotel, Lamp } from "lucide-react";

import { RoomStatus } from "../_types/room";

export const RoomStatusLabels: Record<
  RoomStatus,
  {
    label: string;
    icon: React.ElementType;
    className: string;
  }
> = {
  [RoomStatus.AVAILABLE]: {
    label: "Disponible",
    icon: ConciergeBell,
    className: "text-green-700 border-green-200",
  },
  [RoomStatus.CLEANING]: {
    label: "Limpieza",
    icon: CookingPot,
    className: "text-blue-700 border-blue-200",
  },
  [RoomStatus.OCCUPIED]: {
    label: "Ocupada",
    icon: Lamp,
    className: "text-red-700 border-red-200",
  },
  [RoomStatus.RESERVED]: {
    label: "Reservada",
    icon: CalendarCheck2,
    className: "text-amber-700 border-amber-200",
  },
};

// Tipos de habitación
export type RoomTypeKey = "matrimonial" | "dobleFamiliar" | "dobleSimple" | "simple" | "suite" | "default";

export const RoomTypeLabels: Record<
  RoomTypeKey,
  {
    label: string;
    icon: React.ElementType;
    className: string;
  }
> = {
  matrimonial: {
    label: "Matrimonial",
    icon: BedDouble,
    className: "text-pink-700",
  },
  dobleFamiliar: {
    label: "Doble Familiar",
    icon: BedDouble,
    className: "text-indigo-700",
  },
  dobleSimple: {
    label: "Doble Simple",
    icon: BedDouble,
    className: "text-blue-700",
  },
  simple: {
    label: "Simple",
    icon: BedSingle,
    className: "text-cyan-700",
  },
  suite: {
    label: "Suite",
    icon: Hotel,
    className: "text-amber-700",
  },
  default: {
    label: "Habitación",
    icon: Home,
    className: "text-slate-700",
  },
};

// Función para determinar el tipo de habitación según el nombre
export const getRoomTypeKey = (typeName: string): RoomTypeKey => {
  const normalizedType = typeName?.toLowerCase()?.trim() || "";

  if (normalizedType.includes("matrimonial")) return "matrimonial";
  if (normalizedType.includes("doble") && normalizedType.includes("familiar")) return "dobleFamiliar";
  if (normalizedType.includes("doble") && normalizedType.includes("simple")) return "dobleSimple";
  if (normalizedType.includes("simple")) return "simple";
  if (normalizedType.includes("suite")) return "suite";

  return "default";
};
