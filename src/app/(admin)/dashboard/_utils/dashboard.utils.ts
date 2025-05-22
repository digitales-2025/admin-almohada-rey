import { ExtendedRoomStatus } from "../_types/dashboard";
import { RoomStatus } from "../../rooms/list/_types/room";

// Configuración de colores para los estados con soporte para modo claro/oscuro
export const roomStatusConfig = {
  // Ocupada (rojo)
  [RoomStatus.OCCUPIED]: {
    name: "Ocupada",
    backgroundColor: "bg-red-100 dark:bg-red-950",
    textColor: "text-red-700 dark:text-red-300",
    borderColor: "border-red-500 dark:border-red-600",
    hoverBgColor: "hover:bg-red-200 dark:hover:bg-red-900",
  },

  // Disponible (verde)
  [RoomStatus.AVAILABLE]: {
    name: "Disponible",
    backgroundColor: "bg-green-100 dark:bg-green-950",
    textColor: "text-green-700 dark:text-green-300",
    borderColor: "border-green-500 dark:border-green-600",
    hoverBgColor: "hover:bg-green-200 dark:hover:bg-green-900",
  },

  // Limpieza (azul)
  [RoomStatus.CLEANING]: {
    name: "Limpieza",
    backgroundColor: "bg-blue-100 dark:bg-blue-950",
    textColor: "text-blue-700 dark:text-blue-300",
    borderColor: "border-blue-500 dark:border-blue-600",
    hoverBgColor: "hover:bg-blue-200 dark:hover:bg-blue-900",
  },

  // Mantenimiento (púrpura)
  ["MAINTENANCE"]: {
    name: "Mantenimiento",
    backgroundColor: "bg-purple-100 dark:bg-purple-950",
    textColor: "text-purple-700 dark:text-purple-300",
    borderColor: "border-purple-500 dark:border-purple-600",
    hoverBgColor: "hover:bg-purple-200 dark:hover:bg-purple-900",
  },

  // Incompleta (ámbar)
  [RoomStatus.INCOMPLETE]: {
    name: "Incompleta",
    backgroundColor: "bg-amber-100 dark:bg-amber-950",
    textColor: "text-amber-700 dark:text-amber-300",
    borderColor: "border-amber-500 dark:border-amber-600",
    hoverBgColor: "hover:bg-amber-200 dark:hover:bg-amber-900",
  },

  // Predeterminado (gris)
  DEFAULT: {
    name: "Desconocido",
    backgroundColor: "bg-gray-100 dark:bg-gray-800",
    textColor: "text-gray-700 dark:text-gray-300",
    borderColor: "border-gray-500 dark:border-gray-600",
    hoverBgColor: "hover:bg-gray-200 dark:hover:bg-gray-700",
  },
};

// Función para obtener la configuración completa
export const getRoomStatusConfig = (status: ExtendedRoomStatus) => {
  return roomStatusConfig[status] || roomStatusConfig["DEFAULT"];
};

// Función compatible con el código existente
export const getStatusColor = (status: ExtendedRoomStatus) => {
  const config = getRoomStatusConfig(status);
  return `${config.backgroundColor} ${config.borderColor} ${config.textColor}`;
};

// Función para obtener el texto del estado
export const getStatusText = (status: string) => {
  // Convierte el status a formato utilizado en el objeto de configuración
  const normalizedStatus = status.toUpperCase() as ExtendedRoomStatus;
  const config = roomStatusConfig[normalizedStatus];

  return config ? config.name : status;
};
