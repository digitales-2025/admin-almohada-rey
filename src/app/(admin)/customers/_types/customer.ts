export type Customer = {
  id: string;
  name: string;
  address: string;
  birthPlace: string;
  country: string;
  department?: string;
  province?: string;
  phone: string;
  occupation: string;
  documentType: CustomerDocumentType;
  documentNumber: string;
  email: string;
  maritalStatus: CustomerMaritalStatus;
  companyName?: string;
  ruc?: string;
  companyAddress?: string;
  isActive: boolean;
};

export enum CustomerDocumentType {
  DNI = "DNI",
  PASSPORT = "PASSPORT",
  FOREIGNER_CARD = "FOREIGNER_CARD",
}

export enum CustomerMaritalStatus {
  SINGLE = "SINGLE",
  MARRIED = "MARRIED",
  DIVORCED = "DIVORCED",
  WIDOWED = "WIDOWED",
}
