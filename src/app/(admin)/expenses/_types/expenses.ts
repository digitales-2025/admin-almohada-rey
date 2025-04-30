import { components } from "@/types/api";

/**
 * Enums y types para GASTOS (Expenses)
 */

// Enum y type para categoría de gasto
export enum ExpenseCategoryEnum {
  FIXED = "FIXED",
  VARIABLE = "VARIABLE",
  OTHER = "OTHER",
}
export type ExpenseCategoryType = keyof typeof ExpenseCategoryEnum; // "FIXED" | "VARIABLE" | "OTHER"

// Enum y type para método de pago
export enum ExpensePaymentMethodEnum {
  CASH = "CASH",
  TRANSFER = "TRANSFER",
  CARD = "CARD",
}
export type ExpensePaymentMethodType = keyof typeof ExpensePaymentMethodEnum; // "CASH" | "TRANSFER" | "CARD"

// Enum y type para tipo de documento
export enum ExpenseDocumentTypeEnum {
  RECEIPT = "RECEIPT",
  INVOICE = "INVOICE",
  OTHER = "OTHER",
}
export type ExpenseDocumentTypeType = keyof typeof ExpenseDocumentTypeEnum; // "RECEIPT" | "INVOICE" | "OTHER"

/**
 * Tipos para GASTOS (Expenses)
 */

// Entidad de gasto (respuesta de la API)
export type HotelExpense = components["schemas"]["HotelExpenseEntity"];

// DTO generado por OpenAPI
type CreateHotelExpenseDtoApi = components["schemas"]["CreateHotelExpenseDto"];

// Nuevo tipo usando Omit y tus types
export type CreateHotelExpenseDto = Omit<CreateHotelExpenseDtoApi, "category" | "paymentMethod" | "documentType"> & {
  category: ExpenseCategoryType;
  paymentMethod: ExpensePaymentMethodType;
  documentType?: ExpenseDocumentTypeType;
};

// DTO para actualizar gasto
type UpdateHotelExpenseDtoApi = components["schemas"]["UpdateHotelExpenseDto"];

export type UpdateHotelExpenseDto = Omit<UpdateHotelExpenseDtoApi, "category" | "paymentMethod" | "documentType"> & {
  category?: ExpenseCategoryType;
  paymentMethod?: ExpensePaymentMethodType;
  documentType?: ExpenseDocumentTypeType;
};

// DTO para eliminar gastos
export type DeleteHotelExpenseDto = components["schemas"]["DeleteHotelExpenseDto"];
