import * as z from "zod";

import { CustomerDocumentType, CustomerMaritalStatus } from "../_types/customer";

export const customersSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  address: z.string().min(2, { message: "La dirección debe tener al menos 2 caracteres" }),
  birthPlace: z.string().min(2, { message: "El lugar de nacimiento debe tener al menos 2 caracteres" }),
  birthDate: z.string().optional(),
  country: z.string().min(1, { message: "El país es obligatorio" }),
  province: z.string().optional(),
  department: z.string().optional(),
  phone: z.string().min(1, { message: "El teléfono es obligatorio" }),
  occupation: z.string().min(2, { message: "La ocupación debe tener al menos 2 caracteres" }),
  documentType: z.nativeEnum(CustomerDocumentType, {
    errorMap: () => ({ message: "Debes seleccionar un tipo de documento valido" }),
  }),
  documentNumber: z.string().min(1, { message: "El número de documento es obligatorio" }),
  email: z.string().optional(),
  maritalStatus: z.nativeEnum(CustomerMaritalStatus, {
    errorMap: () => ({ message: "Debes seleccionar un estado civil válido" }),
  }),
  hasCompany: z.boolean().optional(),
  companyName: z.string().optional(),
  ruc: z.string().optional(),
  companyAddress: z.string().optional(),
});
export type CreateCustomersSchema = z.infer<typeof customersSchema>;
