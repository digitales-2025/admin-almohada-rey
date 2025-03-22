import { z } from "zod";

export const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(1, {
      message: "La contraseña actual es requerida.",
    }),
    newPassword: z
      .string()
      .min(8, {
        message: "La contraseña debe tener al menos 8 caracteres.",
      })
      .refine(
        (password) => {
          return /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password);
        },
        {
          message: "La contraseña debe incluir al menos una mayúscula, un número y un carácter especial.",
        }
      ),
    confirmPassword: z.string().min(1, {
      message: "Confirme su nueva contraseña.",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  });

export type PasswordFormValues = z.infer<typeof passwordFormSchema>;
