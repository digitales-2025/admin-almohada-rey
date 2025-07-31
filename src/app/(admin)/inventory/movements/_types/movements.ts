import { WarehouseType } from "../../warehouse/_types/warehouse";

export type Movements = {
  id: string;
  codeUnique: string;
  dateMovement: string;
  type: MovementsType;
  description: string;
  warehouse: {
    id: string;
    type: WarehouseType;
  };
  typePurchaseOrder?: ExpenseDocumentType;
  documentNumber?: string;
  movementsDetail: MovementsDetail[];
  warehouseId?: string;
  hasPaymentReceipt?: boolean;
};

export type MovementsDetail = {
  id?: string;
  quantity: number;
  unitCost: number;
  subtotal?: number;
  product?: {
    id: string;
    name: string;
    code?: string;
  };
  productId?: string;
};

export enum MovementsType {
  INPUT = "INPUT",
  OUTPUT = "OUTPUT",
}

export enum ExpenseDocumentType {
  RECEIPT = "RECEIPT",
  INVOICE = "INVOICE",
  OTHER = "OTHER",
}

export type SummaryMovements = {
  id: string;
  codeUnique: string;
  dateMovement: string;
  type: MovementsType;
  description: string;
  warehouse: {
    id: string;
    type: WarehouseType;
  };
  typePurchaseOrder?: ExpenseDocumentType;
  documentNumber?: string;
  typeProduct?: WarehouseType;
  hasPaymentAssigned?: boolean;
};

export type MovementCreate = {
  dateMovement: string;
  type: "INPUT" | "OUTPUT";
  description?: string;
  warehouseId: string;
  purchaseId?: string;
  movementDetail: CreateMovementDetailDto[];
  typePurchaseOrder?: ExpenseDocumentType;
  documentNumber?: string;
};

export type CreateMovementDetailDto = {
  quantity: number;
  unitCost: number;
  productId: string;
};

// Define un tipo específico para los productos disponibles
export interface ProductAvailable {
  id: string;
  name: string;
  unitCost: number;
  quantity: number;
}
