import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: "Ingrese su email",
    })
    .email({
      message: "Email no válido",
    }),
  password: z.string().min(2, "La contraseña debe tener al menos 2 caracteres"),
});
