import * as z from "zod";

import { RoomStatus } from "../_types/room";

// Schema for status change
export const statusRoomsSchema = z.object({
  status: z.enum([RoomStatus.AVAILABLE, RoomStatus.OCCUPIED, RoomStatus.CLEANING, RoomStatus.INCOMPLETE]),
});

export type UpdateStatusRoomsSchema = z.infer<typeof statusRoomsSchema>;

// Schema for cleaning form
export const cleaningSchema = z
  .object({
    checklist: z.object({
      trashBin: z.boolean(),
      towel: z.boolean(),
      toiletPaper: z.boolean(),
      showerSoap: z.boolean(),
      handSoap: z.boolean(),
      lamp: z.boolean(),
    }),
    date: z.string().optional(),
    cleanedBy: z.string().optional(),
    observations: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Verificar si todos los elementos del checklist están marcados como true
    const allChecked = Object.values(data.checklist).every((value) => value === true);

    // Solo validar date y cleanedBy si todos los elementos del checklist están completados
    if (allChecked) {
      // Validar date
      if (!data.date || data.date.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "La fecha del proyecto es obligatoria",
          path: ["date"],
        });
      }

      // Validar cleanedBy
      if (!data.cleanedBy || data.cleanedBy.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "El nombre debe tener al menos 2 caracteres",
          path: ["cleanedBy"],
        });
      }
    }
  });

export type CleaningStatusRoomsSchema = z.infer<typeof cleaningSchema>;

export const updateAmenities = z.object({
  checklist: z.object({
    trashBin: z.boolean(),
    towel: z.boolean(),
    toiletPaper: z.boolean(),
    showerSoap: z.boolean(),
    handSoap: z.boolean(),
    lamp: z.boolean(),
  }),
});

export type UpdateAmenitiesSchema = z.infer<typeof updateAmenities>;
