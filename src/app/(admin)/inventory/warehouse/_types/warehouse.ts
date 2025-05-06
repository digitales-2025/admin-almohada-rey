import { ProductType } from "../../products/_types/products";

export type Warehouse = {
  id: string;
  type: ProductType;
  stock: StockWarehouse[];
};

export type StockWarehouse = {
  id: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  product: {
    id: string;
    name: string;
    type: ProductType;
  };
};

export type SummaryWarehouse = {
  id: string;
  type: ProductType;
  quantityProducts: number;
  totalCost: number;
};
