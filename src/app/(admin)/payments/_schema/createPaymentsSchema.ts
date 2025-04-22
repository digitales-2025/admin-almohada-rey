import { z } from "zod";

import { PaymentDetailMethod } from "../_types/payment";

// Schema para elementos de servicios extra
export const extraServiceSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "El nombre del servicio es obligatorio"),
  quantity: z.number().min(1, "La cantidad debe ser al menos 1"),
  unitPrice: z.number().min(0, "El precio debe ser al menos 0"),
  subtotal: z.number().min(0, "El subtotal debe ser al menos 0"),
});

// Schema principal de pago
export const paymentSchema = z.object({
  paymentDate: z.string().min(1, { message: "La fecha de pago es obligatoria" }),
  observations: z.string().optional(),
  description: z.string().min(1, "La descripción es obligatoria"),
  // Detalles de la habitación (siempre requeridos)
  roomId: z.string().uuid("Por favor ingresa un ID de habitación válido"),
  days: z.number().min(1, "Se registraro el pago de todas las noches"),
  unitPrice: z.number().min(0, "El precio de la habitación debe ser al menos 0"),
  subtotal: z.number().min(0, "El subtotal de la habitación debe ser al menos 0"),
  // Servicios extra (array opcional)
  extraServices: z.array(extraServiceSchema).optional().default([]),
  method: z.nativeEnum(PaymentDetailMethod, {
    errorMap: () => ({ message: "Debes seleccionar un método de pago válido" }),
  }),
  // Monto total (suma de la habitación y todos los servicios extra)
  totalAmount: z.number().min(0, "El monto total debe ser al menos 0"),
});

export const updatePaymentSchema = z.object({
  observations: z.string().optional(),
});

export const roomPaymentDetailSchema = paymentSchema.omit({
  observations: true,
  extraServices: true,
});

export type CreatePaymentSchema = z.infer<typeof paymentSchema>;
export type ExtraServiceItem = z.infer<typeof extraServiceSchema>;
export type UpdatePaymentSchema = z.infer<typeof updatePaymentSchema>;
export type CreateRoomPaymentDetailSchema = z.infer<typeof roomPaymentDetailSchema>;
