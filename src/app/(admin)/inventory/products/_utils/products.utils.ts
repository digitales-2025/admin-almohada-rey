import { Hotel, ShoppingBag } from "lucide-react";

import { ProductType } from "../_types/products";

export const ProductTypeLabels: Record<
  ProductType,
  {
    label: string;
    icon: React.ElementType;
    className: string;
  }
> = {
  [ProductType.COMMERCIAL]: {
    label: "Comercial",
    icon: ShoppingBag,
    className: "text-blue-600 border-blue-200",
  },
  [ProductType.INTERNAL_USE]: {
    label: "Uso Interno",
    icon: Hotel,
    className: "text-emerald-600 border-emerald-200",
  },
};
