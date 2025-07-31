import * as z from "zod";

import { ProductType } from "../_types/products";

export const productsSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  unitCost: z.number().min(0.01, { message: "El precio es obligatorio" }),
  type: z.nativeEnum(ProductType, {
    errorMap: () => ({ message: "Debes seleccionar un tipo de producto valido" }),
  }),
});
export type CreateProductsSchema = z.infer<typeof productsSchema>;
