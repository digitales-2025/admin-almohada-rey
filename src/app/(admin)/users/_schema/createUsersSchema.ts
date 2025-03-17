import * as z from "zod";

import { UserRolType } from "../_types/user";

export const usersSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  email: z
    .string()
    .email({ message: "Ingrese un correo electrónico válido" })
    .min(1, { message: "El correo electrónico es obligatorio" }),
  phone: z.string().optional(),
  password: z
    .string()
    .min(6, { message: "Debes generar una contraseña" })
    .regex(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
      message: "La contraseña debe tener al menos una mayúscula, una minúscula y un número",
    }),
  userRol: z.nativeEnum(UserRolType, {
    errorMap: () => ({ message: "Debes seleccionar un rol válido" }),
  }),
});
export type CreateUsersSchema = z.infer<typeof usersSchema>;

// Traer las misma data de usersSchema y omitir el email
export const updateUsersSchema = usersSchema.omit({
  email: true,
  password: true,
});

export type UpdateUsersSchema = z.infer<typeof updateUsersSchema>;
