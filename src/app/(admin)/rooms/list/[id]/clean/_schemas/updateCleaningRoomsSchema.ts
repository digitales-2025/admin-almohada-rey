import * as z from "zod";

export const roomCleaningSchema = z.object({
  date: z.string().min(1, { message: "La fecha de limpieza es obligatoria" }),
  staffName: z.string({
    required_error: "El nombre de quien realizó la limpieza es obligatorio",
    invalid_type_error: "El nombre debe ser un texto válido",
  }),
  observations: z.string().optional(),
});
export type UpdateRoomCleaningSchema = z.infer<typeof roomCleaningSchema>;
