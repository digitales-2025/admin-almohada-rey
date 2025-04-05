import { components } from "@/types/api";
import { PaymentDetailMethod, PaymentDetailType, PaymentStatus } from "../../payment/_types/payment";
import { ReservationStatus } from "../../reservation/_schemas/reservation.schemas";

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
  email?: string;
  birthDate?: string;
  maritalStatus: CustomerMaritalStatus;
  companyName?: string;
  ruc?: string;
  companyAddress?: string;
  isActive: boolean;
};

export type HistoryCustomer = {
  id: string;
  name: string;
  reservations: CustomerReservation[];
};

export type CustomerReservation = {
  id: string;
  reservationDate: Date;
  checkInDate: Date;
  checkOutDate: Date;
  guests: JSON; // Usar el tipo JsonValue de Prisma en lugar de string
  reason: string;
  numberGuests: number;
  observations?: string;
  status: ReservationStatus;
  room: {
    id: string;
    number: number;
    RoomTypes: {
      id: string;
      name: string;
      price: number;
    };
  };
  payment: {
    id: string;
    date: string;
    amount: number;
    amountPaid: number;
    paymentDetail: {
      id: string;
      paymentDate: string;
      description: string;
      type: PaymentDetailType;
      method: PaymentDetailMethod;
      status: PaymentStatus;
      unitPrice: number;
      subtotal: number;
      quantity?: number;
      service?: {
        id: string;
        name: string;
      };
      days?: number;
      room?: {
        id: string;
        number: number;
        RoomTypes: {
          id: string;
          name: string;
        };
      };
    }[];
  };
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

export type ApiCustomer = components["schemas"]["Customer"];
