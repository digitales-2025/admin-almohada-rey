import { Banknote, Building, Clock, CreditCard, Edit3, IdCard, Phone, Smartphone, User } from "lucide-react";

import { cn } from "@/lib/utils";
import { PaymentDetailMethod } from "../../payments/_types/payment";

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
    PENDING_PAYMENT: "Pago Pendiente",
  };

  return (
    methodLabels[method] ||
    method
      .replace("_", " ")
      .replace(/([A-Z])/g, " $1")
      .trim()
  );
};
// Nueva función auxiliar para obtener sólo la clase de color del icono
export const getMethodIconColor = (method: PaymentDetailMethod): string => {
  switch (method) {
    case PaymentDetailMethod.CASH:
      return "text-green-500";
    case PaymentDetailMethod.CREDIT_CARD:
      return "text-blue-500";
    case PaymentDetailMethod.DEBIT_CARD:
      return "text-cyan-500";
    case PaymentDetailMethod.TRANSFER:
      return "text-violet-500";
    case PaymentDetailMethod.YAPE:
      return "text-purple-500";
    case PaymentDetailMethod.PLIN:
      return "text-sky-500";
    case PaymentDetailMethod.PAYPAL:
      return "text-blue-700";
    case PaymentDetailMethod.IZI_PAY:
      return "text-red-600";
    case PaymentDetailMethod.PENDING_PAYMENT:
      return "text-amber-500";
    default:
      return "";
  }
};

export const getMethodIcon = (method: PaymentDetailMethod, colored?: boolean) => {
  // Determinar la clase de color basada en el método si colored es true
  const colorClass = colored ? getMethodIconColor(method) : "";

  switch (method) {
    case PaymentDetailMethod.CASH:
      return <Banknote className={cn("h-6 w-6", colorClass)} />;
    case PaymentDetailMethod.CREDIT_CARD:
    case PaymentDetailMethod.DEBIT_CARD:
      return <CreditCard className={cn("h-6 w-6", colorClass)} />;
    case PaymentDetailMethod.TRANSFER:
      return <Building className={cn("h-6 w-6", colorClass)} />;
    case PaymentDetailMethod.YAPE:
    case PaymentDetailMethod.PLIN:
    case PaymentDetailMethod.PAYPAL:
    case PaymentDetailMethod.IZI_PAY:
      return <Smartphone className={cn("h-6 w-6", colorClass)} />;
    case PaymentDetailMethod.PENDING_PAYMENT:
      return <Clock className={cn("h-6 w-6", colorClass)} />;
    default:
      return <CreditCard className={cn("h-6 w-6", colorClass)} />;
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
      return "from-sky-400 to-sky-600";
    case "PAYPAL":
      return "from-blue-500 to-blue-700";
    case "IZI_PAY":
      return "from-red-500 to-red-700";
    case "PENDING_PAYMENT":
      return "from-amber-400 to-yellow-600";
    default:
      return "from-gray-500 to-gray-600";
  }
};

// Pasos para el formulario de huésped
export const steps = [
  { id: "personal", title: "Datos Personales", icon: <User className="h-5 w-5" /> },
  { id: "document", title: "Documento", icon: <IdCard className="h-5 w-5" /> },
  { id: "contact", title: "Contacto", icon: <Phone className="h-5 w-5" /> },
  { id: "additional", title: "Adicional", icon: <Edit3 className="h-5 w-5" /> },
];
