import { z } from "zod";

export const editServiceSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  description: z
    .string()
    .min(1, "La descripción es requerida")
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(500, "La descripción no puede exceder 500 caracteres"),
  price: z.number().min(0, "El precio no puede ser negativo").max(999999.99, "El precio no puede exceder 999,999.99"),
});

export type EditServiceSchema = z.infer<typeof editServiceSchema>;
