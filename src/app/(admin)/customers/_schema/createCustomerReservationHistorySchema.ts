import { z } from "zod";

export const createCustomerReservationHistorySchema = z.object({
  date: z
    .string()
    .min(1, "La fecha es requerida")
    .refine((date) => {
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime());
    }, "Formato de fecha inválido")
    .refine((date) => {
      const parsedDate = new Date(date);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      return parsedDate <= today;
    }, "Solo se permiten fechas pasadas o de hoy"),
});

export type CustomerReservationHitoryFormData = z.infer<typeof createCustomerReservationHistorySchema>;
