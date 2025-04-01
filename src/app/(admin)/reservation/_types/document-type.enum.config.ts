import { IdCard } from "lucide-react";

import { EnumConfig, TypedEnumConfig } from "@/types/enum/enum-ui.config";
import { DocumentType } from "../_schemas/reservation.schemas";

export const documentTypeStatusConfig: Record<DocumentType, TypedEnumConfig<DocumentType>> = {
  DNI: {
    value: "DNI",
    name: "DNI",
    backgroundColor: "bg-[#E0F2FE]",
    textColor: "text-[#0284C7]",
    hoverBgColor: "hover:bg-[#BAE6FD]",
    borderColor: "border-[#0284C7]",
    hoverBorderColor: "hover:border-[#0284C7]",
    icon: IdCard,
  },
  FOREIGNER_CARD: {
    value: "FOREIGNER_CARD",
    name: "CE",
    backgroundColor: "bg-[#FFE1E6]",
    textColor: "text-[#E11D48]",
    hoverBgColor: "hover:bg-[#FFC2CC]",
    borderColor: "border-[#E11D48]",
    hoverBorderColor: "hover:border-[#E11D48]",
    icon: IdCard,
  },
  PASSPORT: {
    value: "PASSPORT",
    name: "Pasaporte",
    backgroundColor: "bg-[#DCFCE7]",
    textColor: "text-[#16A34A]",
    hoverBgColor: "hover:bg-[#BBF7D0]",
    borderColor: "border-[#16A34A]",
    hoverBorderColor: "hover:border-[#16A34A]",
    icon: IdCard,
  },
};

export const getDocumentTypeConfig: (documentType: DocumentType) => EnumConfig = (documentType: DocumentType) => {
  return documentTypeStatusConfig[documentType];
};
