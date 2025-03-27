import { z } from "zod";

import { components } from "@/types/api";
import { SelectOption } from "@/types/form/select-option";

export type ReservationStatus = "PENDING" | "CHECKED_IN" | "CHECKED_OUT" | "CANCELED";
export const reservationStatusSelectOptions: Record<ReservationStatus, SelectOption<ReservationStatus>> = {
  PENDING: {
    value: "PENDING",
    label: "Pendiente",
  },
  CHECKED_IN: {
    value: "CHECKED_IN",
    label: "Check-in",
  },
  CHECKED_OUT: {
    value: "CHECKED_OUT",
    label: "Check-out",
  },
  CANCELED: {
    value: "CANCELED",
    label: "Cancelado",
  },
};
export type DocumentType = "DNI" | "PASSPORT" | "FOREIGNER_CARD";
export type Reservation = components["schemas"]["Reservation"];
export type DetailedReservation = components["schemas"]["DetailedReservation"];
export type ReservationCustomer = components["schemas"]["Customer"];
export type ReservationUser = components["schemas"]["User"];
export type ReservationRoom = components["schemas"]["Room"];
export type CreateReservationDto = components["schemas"]["CreateReservationDto"];
export type ReservationGuestDto = components["schemas"]["GuestDto"];
export type ReservationGuest = components["schemas"]["Guest"];
export type PaginatedResponse = components["schemas"]["PaginatedResponse"];
export type RoomAvailabilityDto = components["schemas"]["RoomAvailabilityDto"];
// {
//     customerId: string;
//     roomId: string;
//     userId: string;
//     reservationDate: string;
//     checkInDate: string;
//     checkOutDate: string;
//     status: "PENDING" | "CHECKED_IN" | "CHECKED_OUT" | "CANCELED";
//     guests?: components["schemas"]["GuestDto"][];
//     observations?: string;
// }
export const createReservationSchema = z.object({
  customerId: z.string({
    required_error: "El cliente es requerido",
  }),
  roomId: z.string({
    required_error: "La habitación es requerida",
  }),
  userId: z.string({
    required_error: "El usuario es requerido",
  }),
  reservationDate: z.string({
    required_error: "La fecha de reserva es requerida",
  }),
  checkInDate: z.string({
    required_error: "La fecha de check-in es requerida",
  }),
  checkOutDate: z.string({
    required_error: "La fecha de check-out es requerida",
  }),
  status: z.enum(["PENDING", "CHECKED_IN", "CHECKED_OUT", "CANCELED"]),
  guests: z
    .array(
      z.object({
        name: z.string(),
        age: z.number().optional(),
        documentId: z.string().optional(),
        documentType: z.enum(["DNI", "PASSPORT", "FOREIGNER_CARD"]).optional(),
        phone: z.string().optional(),
        email: z.string().optional(),
        birthDate: z.string().optional(),
        additionalInfo: z.string().optional(),
      })
    )
    .optional(),
  observations: z.string().optional(),
}) satisfies z.ZodType<CreateReservationDto>;

export type CreateReservationInput = z.infer<typeof createReservationSchema>;
