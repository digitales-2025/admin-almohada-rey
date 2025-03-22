import { z } from "zod";

// Definir el esquema de validación
export const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  email: z.string().email().optional(),
  phone: z.string().min(5, {
    message: "Número de teléfono inválido.",
  }),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
