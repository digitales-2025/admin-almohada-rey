import * as z from "zod";

import { RoomStatus } from "../_types/room";

// Schema for status change
export const statusRoomsSchema = z.object({
  status: z.enum([RoomStatus.AVAILABLE, RoomStatus.OCCUPIED, RoomStatus.CLEANING]),
});

export type UpdateStatusRoomsSchema = z.infer<typeof statusRoomsSchema>;

// Schema for cleaning form
export const cleaningSchema = z.object({
  checklist: z.object({
    trashBin: z.boolean(),
    towel: z.boolean(),
    toiletPaper: z.boolean(),
    showerSoap: z.boolean(),
    handSoap: z.boolean(),
    lamp: z.boolean(),
  }),
  date: z.string().min(1, { message: "La fecha del proyecto es obligatoria" }),
  cleanedBy: z
    .string()
    .min(2, {
      message: "El nombre debe tener al menos 2 caracteres",
    })
    .optional(),
  observations: z.string().optional(),
});

export type CleaningStatusRoomsSchema = z.infer<typeof cleaningSchema>;
