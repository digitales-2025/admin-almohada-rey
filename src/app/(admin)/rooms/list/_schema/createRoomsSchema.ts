import * as z from "zod";

import { FloorType } from "../_types/room";

export const roomsSchema = z.object({
  number: z.number().min(1, { message: "El número de habitación es requerido" }),
  roomTypeId: z.string().min(1, { message: "El tipo de habitación es requerido" }),
  tv: z.string().min(1, { message: "El tipo de TV es requerido" }),
  area: z.number().min(1, { message: "El área es requerida" }),
  floorType: z.nativeEnum(FloorType, {
    errorMap: () => ({ message: "Debes seleccionar un tipo de piso valido" }),
  }),
});
export type CreateRoomsSchema = z.infer<typeof roomsSchema>;
