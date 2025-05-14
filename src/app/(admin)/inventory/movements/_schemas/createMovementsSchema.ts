import { z } from "zod";

import { ExpenseDocumentType } from "../_types/movements";
import { ProductType } from "../../products/_types/products";

// Schema para un producto individual
const productMovementsSchema = z.object({
  productId: z.string().nonempty("El ID del producto es requerido"),
  quantity: z
    .number()
    .positive("La cantidad debe ser un número positivo")
    .multipleOf(0.01, "La cantidad debe tener máximo 2 decimales"),
  unitCost: z
    .number()
    .positive("El costo unitario debe ser mayor que cero")
    .multipleOf(0.01, "El costo unitario debe tener máximo 2 decimales"),
});

// Schema base para los datos comunes
const baseSchema = {
  description: z
    .string()
    .min(5, "La descripción debe tener al menos 5 caracteres")
    .max(200, "La descripción no puede exceder los 200 caracteres"),
  dateMovement: z
    .string({ message: "La fecha del movimiento es obligatoria" })
    .min(1, { message: "La fecha del movimiento es obligatoria" })
    .optional(),
  productType: z
    .nativeEnum(ProductType, {
      required_error: "El tipo de producto es obligatorio",
      invalid_type_error: "Tipo de producto inválido",
    })
    .optional(),
  movementDetail: z.array(productMovementsSchema).min(1, "Debe seleccionar al menos un producto"),
};

// Schema principal para el movimiento de inventario
export const inventoryMovementSchema = z.discriminatedUnion("hasPaymentReceipt", [
  // Caso cuando hasPaymentReceipt es true
  z.object({
    ...baseSchema,
    hasPaymentReceipt: z.literal(true),
    type: z.nativeEnum(ExpenseDocumentType, {
      required_error: "El tipo de comprobante es obligatorio",
      invalid_type_error: "Tipo de comprobante inválido",
    }),
    documentNumber: z.string().min(2, "El número de comprobante debe tener al menos 2 caracteres"),
  }),
  // Caso cuando hasPaymentReceipt es false
  z.object({
    ...baseSchema,
    hasPaymentReceipt: z.literal(false),
    type: z
      .nativeEnum(ExpenseDocumentType, {
        invalid_type_error: "Tipo de comprobante inválido",
      })
      .optional(),
    documentNumber: z.string().optional(),
  }),
]);

// Tipo derivado del schema
export type CreateInventoryMovement = z.infer<typeof inventoryMovementSchema>;
