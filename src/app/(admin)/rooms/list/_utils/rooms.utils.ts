import {
  BedDouble,
  BedSingle,
  Check,
  ConciergeBell,
  CookingPot,
  Droplets,
  Grid2x2,
  HandMetal,
  Home,
  Hotel,
  Lamp,
  ShowerHeadIcon as Shower,
  Toilet,
  Trash2,
  TriangleAlert,
  Waves,
} from "lucide-react";

import { CleaningChecklist, FloorType, RoomStatus } from "../_types/room";

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
  [RoomStatus.INCOMPLETE]: {
    label: "Incompleta",
    icon: TriangleAlert,
    className: "text-amber-700 border-amber-200",
  },
};

export const FloorTypeLabels: Record<
  FloorType,
  {
    label: string;
    icon: React.ElementType;
    className: string;
  }
> = {
  [FloorType.LAMINATING]: {
    label: "Laminado",
    icon: Grid2x2,
    className: "text-amber-700 border-amber-200",
  },
  [FloorType.CARPETING]: {
    label: "Alfombra",
    icon: Waves,
    className: "text-purple-700 border-purple-200",
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

// Versión con soporte para modo oscuro
export const getRoomTypeBgColor = (typeName: string): string => {
  const typeKey = getRoomTypeKey(typeName);

  // Color para modo claro y oscuro
  switch (typeKey) {
    case "matrimonial":
      return "bg-pink-500 dark:bg-pink-500";
    case "dobleFamiliar":
      return "bg-indigo-500 dark:bg-indigo-500";
    case "dobleSimple":
      return "bg-blue-500 dark:bg-blue-500";
    case "simple":
      return "bg-cyan-500 dark:bg-cyan-500";
    case "suite":
      return "bg-amber-500 dark:bg-amber-500";
    case "default":
    default:
      return "bg-slate-500 dark:bg-slate-500";
  }
};

export const getChecklistIcon = (item: keyof CleaningChecklist) => {
  switch (item) {
    case "trashBin":
      return Trash2;
    case "towel":
      return Droplets;
    case "toiletPaper":
      return Toilet;
    case "showerSoap":
      return Shower;
    case "handSoap":
      return HandMetal;
    case "lamp":
      return Lamp;
    default:
      return Check;
  }
};

export const getChecklistLabel = (item: keyof CleaningChecklist) => {
  switch (item) {
    case "trashBin":
      return "Papelera";
    case "towel":
      return "Toallas";
    case "toiletPaper":
      return "Papel higiénico";
    case "showerSoap":
      return "Jabón de ducha";
    case "handSoap":
      return "Jabón de manos";
    case "lamp":
      return "Lámpara";
    default:
      return item;
  }
};
