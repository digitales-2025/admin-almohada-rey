import { z } from "zod";

import { PaymentDetailMethod } from "../_types/payment";

// Definir el esquema para validación
export const extraServiceSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "El nombre del servicio es obligatorio"),
  category: z.string(),
  quantity: z.number().min(1, "La cantidad debe ser al menos 1"),
  unitPrice: z.number().min(0, "El precio debe ser al menos 0"),
  subtotal: z.number().min(0, "El subtotal debe ser al menos 0"),
});

export const paymentDetailSchema = z.object({
  paymentDate: z.string().min(1, { message: "La fecha de pago es obligatoria" }),
  description: z.string().min(1, "La descripción es obligatoria"),
  type: z.literal("EXTRA_SERVICE"),
  method: z.nativeEnum(PaymentDetailMethod, {
    errorMap: () => ({ message: "Debes seleccionar un método de pago valido" }),
  }),
  extraServices: z.array(extraServiceSchema),
  totalAmount: z.number().min(0, "El monto total debe ser al menos 0"),
});

export type CreatePaymentDetailSchema = z.infer<typeof paymentDetailSchema>;
export type CreateExtraServiceItem = z.infer<typeof extraServiceSchema>;
