import * as z from "zod";

import { CreateRoomTypeWithImagesDto } from "../_types/roomTypes";

/**
 * Validador personalizado para archivos
 */
const fileValidator = (message?: string) =>
  z.custom<File>((val) => val instanceof File, { message: message || "El archivo es obligatorio" });

/**
 * Esquema para la creación de tipos de habitación
 */
export const createRoomTypeSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  nameEn: z.string().optional(),
  guests: z.number().positive({ message: "El número de huéspedes debe ser positivo" }),
  price: z.number().positive({ message: "El precio debe ser positivo" }),
  description: z.string().min(10, { message: "La descripción debe tener al menos 10 caracteres" }),
  descriptionEn: z.string().min(10, { message: "La descripción en inglés debe tener al menos 10 caracteres" }),
  bed: z.string().min(1, { message: "La descripción de la cama es obligatoria" }),
  bedEn: z.string().optional(),
  images: z.array(fileValidator("Cada imagen debe ser un archivo válido")).min(1, {
    message: "Debes subir al menos una imagen",
  }),
}) satisfies z.ZodType<CreateRoomTypeWithImagesDto>;

export type CreateRoomTypeSchema = z.infer<typeof createRoomTypeSchema>;

export const updateRoomTypeSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }).optional(),
  nameEn: z.string().optional(),
  guests: z.number().positive({ message: "El número de huéspedes debe ser positivo" }).optional(),
  price: z.number().positive({ message: "El precio debe ser positivo" }).optional(),
  description: z.string().min(10, { message: "La descripción debe tener al menos 10 caracteres" }).optional(),
  descriptionEn: z
    .string()
    .min(10, { message: "La descripción en inglés debe tener al menos 10 caracteres" })
    .optional(),
  bed: z.string().min(1, { message: "La descripción de la cama es obligatoria" }).optional(),
  bedEn: z.string().optional(),
  newImage: fileValidator("La imagen debe ser un archivo válido").optional(),
  imageUpdate: z
    .object({
      id: z.string(),
      url: z.string(),
      isMain: z.boolean(),
    })
    .optional(),
});

export type UpdateRoomTypeSchema = z.infer<typeof updateRoomTypeSchema>;

/**
 * Esquema para la eliminación de tipos de habitación
 */
export const deleteRoomTypeSchema = z.object({
  ids: z.array(z.string()).min(1, { message: "Debes seleccionar al menos un tipo de habitación" }),
});

export type DeleteRoomTypeSchema = z.infer<typeof deleteRoomTypeSchema>;

/**
 * Esquema para la reactivación de tipos de habitación
 */
export const reactivateRoomTypeSchema = z.object({
  ids: z.array(z.string()).min(1, { message: "Debes seleccionar al menos un tipo de habitación para reactivar" }),
});

export type ReactivateRoomTypeSchema = z.infer<typeof reactivateRoomTypeSchema>;
