import { CreditCard, DollarSign, File, FileText, Receipt, Tag } from "lucide-react";

import { ExpenseCategoryEnum, ExpenseDocumentTypeEnum, ExpensePaymentMethodEnum } from "../_types/expenses";

// Labels y estilos para categoría de gasto
export const ExpenseCategoryLabels: Record<
  ExpenseCategoryEnum,
  { label: string; icon: React.ElementType; className: string }
> = {
  [ExpenseCategoryEnum.FIXED]: {
    label: "Fijo",
    icon: Tag,
    className: "text-green-700 border-green-200",
  },
  [ExpenseCategoryEnum.VARIABLE]: {
    label: "Variable",
    icon: DollarSign,
    className: "text-yellow-700 border-yellow-200",
  },
  [ExpenseCategoryEnum.OTHER]: {
    label: "Otro",
    icon: FileText,
    className: "text-gray-700 border-gray-200",
  },
};

// Labels y estilos para método de pago
export const ExpensePaymentMethodLabels: Record<
  ExpensePaymentMethodEnum,
  { label: string; icon: React.ElementType; className: string }
> = {
  [ExpensePaymentMethodEnum.CASH]: {
    label: "Efectivo",
    icon: DollarSign,
    className: "text-green-700 border-green-200",
  },
  [ExpensePaymentMethodEnum.TRANSFER]: {
    label: "Transferencia",
    icon: CreditCard,
    className: "text-blue-700 border-blue-200",
  },
  [ExpensePaymentMethodEnum.CARD]: {
    label: "Tarjeta",
    icon: CreditCard,
    className: "text-purple-700 border-purple-200",
  },
};

// Labels y estilos para tipo de documento
export const ExpenseDocumentTypeLabels: Record<
  ExpenseDocumentTypeEnum,
  { label: string; icon: React.ElementType; className: string }
> = {
  [ExpenseDocumentTypeEnum.RECEIPT]: {
    label: "Boleta",
    icon: Receipt,
    className: "text-orange-700 border-orange-200",
  },
  [ExpenseDocumentTypeEnum.INVOICE]: {
    label: "Factura",
    icon: FileText,
    className: "text-blue-700 border-blue-200",
  },
  [ExpenseDocumentTypeEnum.OTHER]: {
    label: "Otro",
    icon: File,
    className: "text-gray-700 border-gray-200",
  },
};
