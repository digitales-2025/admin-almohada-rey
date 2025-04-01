import * as z from "zod";

export const roomsSchema = z.object({
  number: z.number().min(1, { message: "El número de habitación es requerido" }),
  roomTypeId: z.string().min(1, { message: "El tipo de habitación es requerido" }),
});
export type CreateRoomsSchema = z.infer<typeof roomsSchema>;
