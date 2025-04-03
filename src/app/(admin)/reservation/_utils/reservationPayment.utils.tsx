import { Banknote, Building, CreditCard, Smartphone } from "lucide-react";

import { PaymentDetailMethod } from "../../payment/_types/payment";

export const getPaymentMethodLabel = (method: string): string => {
  const methodLabels: Record<string, string> = {
    CASH: "Efectivo",
    CREDIT_CARD: "Tarjeta de Crédito",
    DEBIT_CARD: "Tarjeta de Débito",
    TRANSFER: "Transferencia Bancaria",
    YAPE: "Yape",
    PLIN: "Plin",
    PAYPAL: "PayPal",
    IZI_PAY: "Izi Pay",
  };

  return (
    methodLabels[method] ||
    method
      .replace("_", " ")
      .replace(/([A-Z])/g, " $1")
      .trim()
  );
};

export const getMethodIcon = (method: PaymentDetailMethod) => {
  switch (method) {
    case PaymentDetailMethod.CASH:
      return <Banknote className="h-6 w-6" />;
    case PaymentDetailMethod.CREDIT_CARD:
    case PaymentDetailMethod.DEBIT_CARD:
      return <CreditCard className="h-6 w-6" />;
    case PaymentDetailMethod.TRANSFER:
      return <Building className="h-6 w-6" />;
    case PaymentDetailMethod.YAPE:
    case PaymentDetailMethod.PLIN:
    case PaymentDetailMethod.PAYPAL:
    case PaymentDetailMethod.IZI_PAY:
      return <Smartphone className="h-6 w-6" />;
    default:
      return <CreditCard className="h-6 w-6" />;
  }
};

export const getMethodColor = (method: PaymentDetailMethod) => {
  switch (method) {
    case "CASH":
      return "from-green-500 to-emerald-600";
    case "CREDIT_CARD":
      return "from-blue-500 to-indigo-600";
    case "DEBIT_CARD":
      return "from-cyan-500 to-blue-600";
    case "TRANSFER":
      return "from-violet-500 to-purple-600";
    case "YAPE":
      return "from-purple-500 to-fuchsia-600";
    case "PLIN":
      return "from-fuchsia-500 to-pink-600";
    case "PAYPAL":
      return "from-blue-500 to-blue-700";
    case "IZI_PAY":
      return "from-orange-500 to-amber-600";
    default:
      return "from-gray-500 to-gray-600";
  }
};
