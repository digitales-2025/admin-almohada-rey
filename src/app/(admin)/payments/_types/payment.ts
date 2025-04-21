export type Payment = {
  id: string;
  code: string;
  date: string;
  amount: number;
  missingDays?: number;
  paymentDays?: number;
  amountPaid: number;
  status: PaymentStatus;
  observations?: string;
  reservationId?: string;
  reservation: {
    id: string;
    checkInDate: Date;
    checkOutDate: Date;
    customer: {
      id: string;
      name: string;
    };
  };
  paymentDetail: PaymentDetail[];
  paymentId?: string;
};

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
}

export type PaymentDetail = {
  id?: string;
  paymentDate: string;
  description: string;
  type: PaymentDetailType;
  method: PaymentDetailMethod;
  status?: PaymentStatus;
  unitPrice: number;
  subtotal: number;
  quantity?: number;
  product?: {
    id: string;
    name: string;
  };
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
  productId?: string;
  serviceId?: string;
  roomId?: string;
};

export enum PaymentDetailType {
  ROOM_RESERVATION = "ROOM_RESERVATION",
  EXTRA_SERVICE = "EXTRA_SERVICE",
}

export enum PaymentDetailMethod {
  CASH = "CASH",
  CREDIT_CARD = "CREDIT_CARD",
  DEBIT_CARD = "DEBIT_CARD",
  TRANSFER = "TRANSFER",
  YAPE = "YAPE",
  PLIN = "PLIN",
  PAYPAL = "PAYPAL",
  IZI_PAY = "IZI_PAY",
}

export type SummaryPayment = {
  id: string;
  code: string;
  date: string;
  amount: number;
  amountPaid: number;
  status: PaymentStatus;
  reservation: {
    customer: {
      id: string;
      name: string;
    };
  };
};

export interface CategoryItemPayment {
  id: string;
  name: string;
  price: number;
  code: string;
  description?: string;
}

export interface CategoryPayment {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  items: CategoryItemPayment[];
}
