import { Hotel, Package, Utensils } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { PaymentDetailFormValues } from "../_schemas/updatePaymentDetailSchema";
import { PaymentDetail } from "../../../_types/payment";

// Definición de tipos de detalle
export const getPaymentDetailTypesConfigs = (iconSize?: string) => {
  const size = iconSize || "h-5 w-5";

  return [
    {
      value: "ROOM",
      label: "Habitación",
      icon: <Hotel className={size} />,
      color: "bg-blue-600", // Azul intenso para habitaciones
      textColor: "text-blue-700", // Color de texto a juego
      bgColor: "bg-blue-50", // Fondo suave complementario
      borderColor: "border-blue-200", // Borde visible pero discreto
    },
    {
      value: "SERVICE",
      label: "Servicio",
      icon: <Utensils className={size} />,
      color: "bg-cyan-600", // Cian para servicios
      textColor: "text-cyan-700", // Color de texto a juego
      bgColor: "bg-cyan-50", // Fondo suave complementario
      borderColor: "border-cyan-200", // Borde visible pero discreto
    },
    {
      value: "PRODUCT",
      label: "Producto",
      icon: <Package className={size} />,
      color: "bg-pink-600", // Rosa para productos
      textColor: "text-pink-700", // Color de texto a juego
      bgColor: "bg-pink-50", // Fondo suave complementario
      borderColor: "border-pink-200", // Borde visible pero discreto
    },
  ];
};

// Para mantener la compatibilidad con código existente
export const PaymentDetailTypesConfigs = getPaymentDetailTypesConfigs();

// Group payment details by date and method
export const groupPaymentDetails = (details: PaymentDetail[]) => {
  const groups: Record<string, PaymentDetail[]> = {};

  details.forEach((detail) => {
    // Usar un separador que no aparezca en fecha ni método
    const key = `${detail.paymentDate}|${detail.method}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(detail);
  });

  return Object.entries(groups).map(([key, items]) => {
    // Dividir la clave usando el nuevo separador
    const [date, method] = key.split("|");
    return {
      key,
      date,
      method,
      items,
      total: items.reduce((sum, item) => sum + item.subtotal, 0),
    };
  });
};

export const calculateSubtotal = (detailForm: UseFormReturn<PaymentDetailFormValues>, watchDetailType: string) => {
  const unitPrice = detailForm.getValues("unitPrice") || 0;
  const quantity = detailForm.getValues("quantity") || 0;
  const days = detailForm.getValues("days") || 0;

  let subtotal = 0;
  if (watchDetailType === "ROOM" && days > 0) {
    subtotal = unitPrice * days;
  } else if ((watchDetailType === "SERVICE" || watchDetailType === "PRODUCT") && quantity > 0) {
    subtotal = unitPrice * quantity;
  } else {
    subtotal = unitPrice;
  }

  detailForm.setValue("subtotal", subtotal);
  return subtotal;
};
