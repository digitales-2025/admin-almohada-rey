export type Product = {
  id: string;
  code: string;
  name: string;
  unitCost: number;
  type: ProductType;
  isActive: boolean;
};

export enum ProductType {
  COMMERCIAL = "COMMERCIAL",
  INTERNAL_USE = "INTERNAL_USE",
}
