export type AvailabilityParams = {
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
};

export type AvailabilityFormUpdateParams = {
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  reservationId: string;
};

export type GenericAvailabilityParams = {
  checkInDate: string;
  checkOutDate: string;
};

export type GenericAvailabilityFormUpdateParams = {
  checkInDate: string;
  checkOutDate: string;
  reservationId: string;
};

export type BookingFormData = {
  checkInDate: string;
  checkOutDate: string;
  roomId?: string;
};
