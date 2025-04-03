import { z } from "zod";

import { PaymentDetailMethod } from "../_types/payment";

// Schema for extra service items
export const extraServiceSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Service name is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unitPrice: z.number().min(0, "Price must be at least 0"),
  subtotal: z.number().min(0, "Subtotal must be at least 0"),
});

// Main payment schema
export const paymentSchema = z.object({
  paymentDate: z.string().min(1, { message: "La fecha de pago es obligatoria" }),
  observations: z.string().optional(),
  description: z.string().min(1, "Descripción es obligatoria"),
  // Room details (always required)
  roomId: z.string().uuid("Please enter a valid room ID"),
  days: z.number().min(1, "Days must be at least 1"),
  unitPrice: z.number().min(0, "Room price must be at least 0"),
  subtotal: z.number().min(0, "Room subtotal must be at least 0"),
  // Extra services (optional array)
  extraServices: z.array(extraServiceSchema).optional().default([]),
  method: z.nativeEnum(PaymentDetailMethod, {
    errorMap: () => ({ message: "Debes seleccionar un método de pago valido" }),
  }),
  // Total amount (sum of room and all extra services)
  totalAmount: z.number().min(0, "Total amount must be at least 0"),
});

export type CreatePaymentSchema = z.infer<typeof paymentSchema>;
export type ExtraServiceItem = z.infer<typeof extraServiceSchema>;
