import { ProductType } from "../../products/_types/products";

export enum WarehouseType {
  COMMERCIAL = "COMMERCIAL",
  INTERNAL_USE = "INTERNAL_USE",
  DEPOSIT = "DEPOSIT",
}

export type Warehouse = {
  id: string;
  code: string;
  type: WarehouseType;
  stock: StockWarehouse[];
};

export type StockWarehouse = {
  id: string;
  code: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  product: {
    id: string;
    name: string;
    type: ProductType;
    code?: string;
    unitCost?: number;
  };
};

export type SummaryWarehouse = {
  id: string;
  code: string;
  type: WarehouseType;
  quantityProducts: number;
  totalCost: number;
};
