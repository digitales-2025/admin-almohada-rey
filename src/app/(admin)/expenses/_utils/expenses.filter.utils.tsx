import { Calendar } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  ExpenseCategoryLabels,
  ExpenseDateLabel,
  ExpenseDocumentTypeLabels,
  ExpensePaymentMethodLabels,
} from "./expenses.utils";

// Generar iconos para cada opción de filtro usando los labels
const CategoryIcons = Object.fromEntries(
  Object.entries(ExpenseCategoryLabels).map(([key, config]) => {
    const IconComponent: React.FC<{ className?: string }> = ({ className }) => {
      const Icon = config.icon;
      return <Icon className={cn(className, config.className)} />;
    };
    return [key, IconComponent];
  })
);

const PaymentMethodIcons = Object.fromEntries(
  Object.entries(ExpensePaymentMethodLabels).map(([key, config]) => {
    const IconComponent: React.FC<{ className?: string }> = ({ className }) => {
      const Icon = config.icon;
      return <Icon className={cn(className, config.className)} />;
    };
    return [key, IconComponent];
  })
);

const DocumentTypeIcons = Object.fromEntries(
  Object.entries(ExpenseDocumentTypeLabels).map(([key, config]) => {
    const IconComponent: React.FC<{ className?: string }> = ({ className }) => {
      const Icon = config.icon;
      return <Icon className={cn(className, config.className)} />;
    };
    return [key, IconComponent];
  })
);

// Filtros configurados para gastos
export const facetedFilters = [
  {
    column: "category",
    title: "Categoría",
    options: Object.entries(ExpenseCategoryLabels).map(([key, config]) => ({
      label: config.label,
      value: key,
      icon: CategoryIcons[key],
    })),
  },
  {
    column: "paymentMethod",
    title: "Método de pago",
    options: Object.entries(ExpensePaymentMethodLabels).map(([key, config]) => ({
      label: config.label,
      value: key,
      icon: PaymentMethodIcons[key],
    })),
  },
  {
    column: "documentType",
    title: "Tipo de documento",
    options: Object.entries(ExpenseDocumentTypeLabels).map(([key, config]) => ({
      label: config.label,
      value: key,
      icon: DocumentTypeIcons[key],
    })),
  },
  {
    column: "date",
    title: ExpenseDateLabel.label,
    options: [
      {
        label: "Por fecha",
        value: "date",
        icon: ({ className }: { className?: string }) => (
          <Calendar className={cn(className, ExpenseDateLabel.className)} />
        ),
      },
    ],
  },
];
