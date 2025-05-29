import { Archive, Hotel, ShoppingBag } from "lucide-react";

import { WarehouseType } from "../_types/warehouse";

// Stock mínimo para productos comerciales (de venta)
const MIN_STOCK_COMMERCIAL = 15;
// Stock mínimo para productos de uso interno
const MIN_STOCK_INTERNAL = 25;
// Stock mínimo para productos de depósito
const MIN_STOCK_DEPOSIT = 50;

// Función auxiliar para determinar el stock mínimo según tipo de almacén
export const getMinStockThreshold = (warehouseType?: WarehouseType): number => {
  if (warehouseType === WarehouseType.COMMERCIAL) {
    return MIN_STOCK_COMMERCIAL;
  } else if (warehouseType === WarehouseType.DEPOSIT) {
    return MIN_STOCK_DEPOSIT;
  } else {
    return MIN_STOCK_INTERNAL;
  }
};

export const WarehouseTypeLabels: Record<
  WarehouseType,
  {
    label: string;
    icon: React.ElementType;
    className: string;
  }
> = {
  [WarehouseType.COMMERCIAL]: {
    label: "Comercial",
    icon: ShoppingBag,
    className: "text-blue-600 border-blue-200",
  },
  [WarehouseType.INTERNAL_USE]: {
    label: "Uso Interno",
    icon: Hotel,
    className: "text-emerald-600 border-emerald-200",
  },
  [WarehouseType.DEPOSIT]: {
    label: "Depósito",
    icon: Archive,
    className: "text-amber-600 border-amber-200",
  },
};
