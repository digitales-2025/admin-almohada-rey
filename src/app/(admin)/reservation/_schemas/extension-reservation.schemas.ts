import { z } from "zod";

import { PaymentDetailMethod } from "@/app/(admin)/payments/_types/payment";

// Esquema para Late Checkout
export const lateCheckoutSchema = z.object({
  lateCheckoutTime: z.string().min(1, "La hora es requerida"),
  additionalNotes: z.string().optional(),
  paymentMethod: z.nativeEnum(PaymentDetailMethod, {
    errorMap: () => ({ message: "Método de pago inválido" }),
  }),
  paymentDate: z.string().min(1, "La fecha de pago es requerida"),
});

// Esquema para Extend Stay
export const extendStaySchema = z.object({
  newCheckoutDate: z.date({
    required_error: "La fecha de salida es requerida",
    invalid_type_error: "Fecha inválida",
  }),
  additionalNotes: z.string().optional(),
  paymentMethod: z.nativeEnum(PaymentDetailMethod, {
    errorMap: () => ({ message: "Método de pago inválido" }),
  }),
  paymentDate: z.string().min(1, "La fecha de pago es requerida"),
});

// Esquema combinado con discriminador para el tipo de extensión
export const extensionReservationSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("late-checkout"),
    ...lateCheckoutSchema.shape,
  }),
  z.object({
    type: z.literal("extend-stay"),
    ...extendStaySchema.shape,
  }),
]);

// Tipos derivados del esquema
export type LateCheckoutFormValues = z.infer<typeof lateCheckoutSchema>;
export type ExtendStayFormValues = z.infer<typeof extendStaySchema>;
export type ExtensionReservationFormValues = z.infer<typeof extensionReservationSchema>;
