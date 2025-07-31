import { Globe2, Plane, UserSquare2 } from "lucide-react";

import { EnumConfig, TypedEnumConfig } from "@/types/enum/enum-ui.config";
import { DocumentType } from "../_schemas/reservation.schemas";

export const documentTypeStatusConfig: Record<DocumentType, TypedEnumConfig<DocumentType>> = {
  DNI: {
    value: "DNI",
    name: "DNI",
    backgroundColor: "bg-blue-50",
    textColor: "text-blue-600",
    hoverBgColor: "hover:bg-blue-100",
    borderColor: "border-blue-600",
    hoverBorderColor: "hover:border-blue-600",
    icon: UserSquare2,
  },
  FOREIGNER_CARD: {
    value: "FOREIGNER_CARD",
    name: "CE",
    backgroundColor: "bg-indigo-50",
    textColor: "text-indigo-600",
    hoverBgColor: "hover:bg-indigo-100",
    borderColor: "border-indigo-600",
    hoverBorderColor: "hover:border-indigo-600",
    icon: Plane,
  },
  PASSPORT: {
    value: "PASSPORT",
    name: "Pasaporte",
    backgroundColor: "bg-emerald-50",
    textColor: "text-emerald-600",
    hoverBgColor: "hover:bg-emerald-100",
    borderColor: "border-emerald-600",
    hoverBorderColor: "hover:border-emerald-600",
    icon: Globe2,
  },
};

export const getDocumentTypeConfig: (documentType: DocumentType) => EnumConfig = (documentType: DocumentType) => {
  return documentTypeStatusConfig[documentType];
};
