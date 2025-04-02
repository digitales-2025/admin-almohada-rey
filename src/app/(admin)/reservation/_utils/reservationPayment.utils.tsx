import { Banknote, Building, CreditCard, Smartphone } from "lucide-react";

import { PaymentDetailMethod } from "../../payment/_types/payment";

// Calcular el número de noches entre check-in y check-out
export const calculateNights = (checkInDate: string | Date, checkOutDate: string | Date) => {
  // Convertir fechas a objetos Date
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  // Normalizar las fechas eliminando el componente de hora
  // Usamos UTC para evitar problemas con cambios de zona horaria
  const normalizedCheckIn = new Date(Date.UTC(checkIn.getFullYear(), checkIn.getMonth(), checkIn.getDate(), 0, 0, 0));

  const normalizedCheckOut = new Date(
    Date.UTC(checkOut.getFullYear(), checkOut.getMonth(), checkOut.getDate(), 0, 0, 0)
  );

  // Calcular la diferencia en milisegundos y convertir a días
  const diffTime = normalizedCheckOut.getTime() - normalizedCheckIn.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};

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
