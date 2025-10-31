import { z } from "zod";

// Zod schema for payment detail validation
export const paymentDetailSchema = z.object({
  paymentDate: z.string().min(1, { message: "La fecha de pago es obligatoria" }),
  description: z.string().min(1, { message: "La descripción es requerida" }),
  method: z.string().min(1, { message: "El método es requerido" }),
  unitPrice: z.number().min(0, { message: "El precio unitario debe ser mayor o igual a 0" }),
  quantity: z.number().nullable(),
  days: z.number().nullable(),
  subtotal: z.number().min(0, { message: "El subtotal debe ser mayor o igual a 0" }),
  // Descuento aplicado solo para detalles de habitación (opcional)
  discount: z.number().min(0, { message: "El descuento debe ser mayor o igual a 0" }).optional(),
  detailType: z.enum(["ROOM", "SERVICE", "PRODUCT", "LATE_CHECKOUT"]),
  productId: z.string().optional(),
  serviceId: z.string().optional(),
  roomId: z.string().optional(),
  stockQuantity: z.number().optional(),
});

export type PaymentDetailFormValues = z.infer<typeof paymentDetailSchema>;

// Reutilizando el esquema existente y seleccionando solo los campos necesarios
export const groupPaymentDetailSchema = paymentDetailSchema.pick({
  paymentDate: true,
  method: true,
});

export type GroupPaymentDetailFormValues = z.infer<typeof groupPaymentDetailSchema>;
