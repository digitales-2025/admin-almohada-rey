import { PackageMinus, PackagePlus } from "lucide-react";

import { MovementsType } from "../_types/movements";

export const movementsTypeConfig = {
  INPUT: {
    value: MovementsType.INPUT,
    name: "Ingreso",
    backgroundColor: "bg-emerald-50 dark:bg-emerald-900",
    textColor: "text-emerald-700 dark:text-emerald-200",
    hoverBgColor: "hover:bg-emerald-100 dark:hover:bg-emerald-800",
    borderColor: "border-emerald-600 dark:border-emerald-700",
    hoverBorderColor: "hover:border-emerald-600 dark:hover:border-emerald-700",
    icon: PackagePlus,
    importantBgColor: "bg-emerald-100 dark:bg-emerald-800",
    backgroundColorImportant: "bg-emerald-800 dark:bg-emerald-200",
    opacity: "bg-emerald-100/50 dark:bg-emerald-800/50",
  },
  OUTPUT: {
    value: MovementsType.OUTPUT,
    name: "Salida",
    backgroundColor: "bg-red-50 dark:bg-red-900",
    textColor: "text-red-700 dark:text-red-200",
    hoverBgColor: "hover:bg-red-100 dark:hover:bg-red-800",
    borderColor: "border-red-600 dark:border-red-700",
    hoverBorderColor: "hover:border-red-600",
    icon: PackageMinus,
    importantBgColor: "bg-red-100 dark:bg-red-800",
    backgroundColorImportant: "bg-red-100 dark:bg-red-800",
    opacity: "bg-red-100/50 dark:bg-red-800/50",
  },
};
