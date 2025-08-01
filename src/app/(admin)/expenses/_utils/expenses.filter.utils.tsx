import { cn } from "@/lib/utils";
import { ExpenseCategoryLabels, ExpenseDocumentTypeLabels, ExpensePaymentMethodLabels } from "./expenses.utils";

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
    column: "categoría",
    title: "Categoría",
    options: Object.entries(ExpenseCategoryLabels).map(([key, config]) => ({
      label: config.label,
      value: key,
      icon: CategoryIcons[key],
    })),
  },
  {
    column: "Método de pago",
    title: "Método de pago",
    options: Object.entries(ExpensePaymentMethodLabels).map(([key, config]) => ({
      label: config.label,
      value: key,
      icon: PaymentMethodIcons[key],
    })),
  },
  {
    column: "Tipo de documento",
    title: "Tipo de documento",
    options: Object.entries(ExpenseDocumentTypeLabels).map(([key, config]) => ({
      label: config.label,
      value: key,
      icon: DocumentTypeIcons[key],
    })),
  },
];
