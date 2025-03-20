import { Globe2, Heart, HeartCrack, Plane, Sparkles, Users2, UserSquare2 } from "lucide-react";

import { CustomerDocumentType, CustomerMaritalStatus } from "../_types/customer";

export const CustomerMaritalStatusLabels: Record<
  CustomerMaritalStatus,
  {
    label: string;
    icon: React.ElementType;
    className: string;
  }
> = {
  [CustomerMaritalStatus.SINGLE]: {
    label: "Soltero(a)",
    icon: Sparkles,
    className: "text-purple-700 border-purple-200",
  },
  [CustomerMaritalStatus.MARRIED]: {
    label: "Casado(a)",
    icon: Heart,
    className: "text-pink-700 border-pink-200",
  },
  [CustomerMaritalStatus.DIVORCED]: {
    label: "Divorciado(a)",
    icon: HeartCrack,
    className: "text-amber-700 border-amber-200",
  },
  [CustomerMaritalStatus.WIDOWED]: {
    label: "Viudo(a)",
    icon: Users2,
    className: "text-slate-700 border-slate-200",
  },
};

export const CustomerDocumentTypeLabels: Record<
  CustomerDocumentType,
  {
    label: string;
    icon: React.ElementType;
    className: string;
  }
> = {
  [CustomerDocumentType.DNI]: {
    label: "DNI",
    icon: UserSquare2,
    className: "text-blue-700 border-blue-200",
  },
  [CustomerDocumentType.PASSPORT]: {
    label: "Pasaporte",
    icon: Plane,
    className: "text-emerald-700 border-emerald-200",
  },
  [CustomerDocumentType.FOREIGNER_CARD]: {
    label: "Carnet de Extranjería",
    icon: Globe2,
    className: "text-indigo-700 border-indigo-200",
  },
};
