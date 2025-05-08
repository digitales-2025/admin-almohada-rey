import { ProductType } from "../../products/_types/products";

// Stock mínimo para productos comerciales (de venta)
const MIN_STOCK_COMMERCIAL = 15;
// Stock mínimo para productos de uso interno
const MIN_STOCK_INTERNAL = 25;

// Función auxiliar para determinar el stock mínimo según tipo de almacén
export const getMinStockThreshold = (warehouseType?: ProductType): number => {
  return warehouseType === ProductType.COMMERCIAL ? MIN_STOCK_COMMERCIAL : MIN_STOCK_INTERNAL;
};
