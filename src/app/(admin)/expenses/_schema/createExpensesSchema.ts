import * as z from "zod";

import { ExpenseCategoryEnum, ExpenseDocumentTypeEnum, ExpensePaymentMethodEnum } from "../_types/expenses";

// Schema para crear gasto
export const createExpenseSchema = z.object({
  description: z.string().min(2, { message: "La descripción es obligatoria" }),
  category: z.nativeEnum(ExpenseCategoryEnum, {
    errorMap: () => ({ message: "Selecciona una categoría válida" }),
  }),
  paymentMethod: z.nativeEnum(ExpensePaymentMethodEnum, {
    errorMap: () => ({ message: "Selecciona un método de pago válido" }),
  }),
  amount: z.number().min(0.01, { message: "El monto debe ser mayor a 0" }),
  date: z.string().min(8, { message: "La fecha es obligatoria" }),
  documentType: z.nativeEnum(ExpenseDocumentTypeEnum).optional(),
  documentNumber: z.string().max(50, { message: "Máximo 50 caracteres" }).optional(),
});
export type CreateExpenseSchema = z.infer<typeof createExpenseSchema>;

// Schema específico para actualizar gasto
export const updateExpenseSchema = z.object({
  description: z.string().min(2).optional(),
  category: z.nativeEnum(ExpenseCategoryEnum).optional(),
  paymentMethod: z.nativeEnum(ExpensePaymentMethodEnum).optional(),
  amount: z.number().min(0.01, { message: "El monto debe ser mayor a 0" }).optional(),
  date: z.string().min(8).optional(),
  documentType: z.nativeEnum(ExpenseDocumentTypeEnum).optional(),
  documentNumber: z.string().max(50).optional(),
  dataDocument: z.boolean().default(false),
});

export type UpdateExpenseSchema = z.infer<typeof updateExpenseSchema>;
