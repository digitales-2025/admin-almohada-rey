import { z } from "zod";

import { components } from "@/types/api";
import { SelectOption } from "@/types/form/select-option";

export type ReservationStatus = "PENDING" | "CONFIRMED" | "CHECKED_IN" | "CHECKED_OUT" | "CANCELED";
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
  CONFIRMED: {
    value: "CONFIRMED",
    label: "Confirmado",
  },
};
export type DocumentType = "DNI" | "PASSPORT" | "FOREIGNER_CARD";
export type Reservation = components["schemas"]["Reservation"];
export type DetailedReservation = components["schemas"]["DetailedReservation"];
export type ReservationCustomer = components["schemas"]["Customer"];
export type ReservationUser = components["schemas"]["User"];
export type ReservationRoom = components["schemas"]["Room"];
export type CreateReservationDto = components["schemas"]["CreateReservationDto"];
export type UpdateReservationDto = components["schemas"]["UpdateReservationDto"];
export type ReservationGuestDto = components["schemas"]["GuestDto"];
export type ReservationGuest = components["schemas"]["Guest"];
export type PaginatedResponse = components["schemas"]["PaginatedResponse"];
export type RoomAvailabilityDto = components["schemas"]["RoomAvailabilityDto"];
export type DetailedRoom = components["schemas"]["DetailedRoom"];
export type ReservationStatusAvailableActions = components["schemas"]["ReservationStatusAvailableActions"];
// {
//     customerId: string;
//     roomId: string;
//     userId: string;
//     reservationDate: string;
//     checkInDate: string;
//     checkOutDate: string;
//     status: "PENDING" | "CHECKED_IN" | "CHECKED_OUT" | "CANCELED";
//     origin: string;
//     reason: string;
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
  status: z.enum(["PENDING", "CHECKED_IN", "CHECKED_OUT", "CANCELED", "CONFIRMED"]),
  guests: z
    .array(
      z.object({
        name: z.string().min(1, {
          message: "El nombre es requerido",
        }),
        age: z.coerce.number().optional(),
        documentType: z.enum(["DNI", "PASSPORT", "FOREIGNER_CARD"]),
        documentId: z
          .string({
            required_error: "El número de identidad es requerido",
          })
          .min(1, "El número de identidad es requerido"),
        phone: z.string().optional(),
        email: z.string().optional(),
        birthDate: z.string().optional(),
        additionalInfo: z.string().optional(),
      })
    )
    .optional(),
  origin: z.string().min(1, {
    message: "El origen es requerido",
  }),
  reason: z.string().min(1, {
    message: "El motivo es requerido",
  }),
  observations: z.string().optional(),
}) satisfies z.ZodType<CreateReservationDto>;

export type CreateReservationInput = z.infer<typeof createReservationSchema>;

export const updateReservationSchema = z.object({
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
  status: z.enum(["PENDING", "CHECKED_IN", "CHECKED_OUT", "CANCELED", "CONFIRMED"]),
  guests: z
    .array(
      z
        .object({
          name: z.string().min(1, {
            message: "El nombre es requerido",
          }),
          age: z.coerce.number().optional(),
          documentType: z.enum(["DNI", "PASSPORT", "FOREIGNER_CARD"]).optional(),
          documentId: z.string().optional(),
          phone: z.string().optional(),
          email: z.string().optional(),
          birthDate: z.string().optional(),
          additionalInfo: z.string().optional(),
        })
        .refine(
          (data) => {
            // If documentType is provided, documentId must also be provided
            return data.documentType === undefined || data.documentId !== undefined;
          },
          {
            message: "El número de identidad es requerido cuando se proporciona el tipo de documento",
            path: ["documentId"],
          }
        )
    )
    .optional(),
  origin: z.string().min(1, {
    message: "El origen es requerido",
  }),
  reason: z.string().min(1, {
    message: "El motivo es requerido",
  }),
  observations: z.string().optional(),
}) satisfies z.ZodType<UpdateReservationDto>;

export type UpdateReservationInput = z.infer<typeof updateReservationSchema>;

export const FilterByCustomerSchema = z.object({
  customerId: z.string({
    required_error: "El cliente es requerido",
  }),
});

export type FilterByCustomerInput = z.infer<typeof FilterByCustomerSchema>;

export const FilterByCheckInOutSchema = z.object({
  checkInDate: z.string({
    required_error: "La fecha de check-in es requerida",
  }),
  checkOutDate: z.string().optional(),
});

export type FilterByCheckInOutInput = z.infer<typeof FilterByCheckInOutSchema>;

export const FilterByCustomerCheckInOutSchema = z.object({
  customerId: z.string({
    required_error: "El cliente es requerido",
  }),
  checkInDate: z.string({
    required_error: "La fecha de check-in es requerida",
  }),
  checkOutDate: z.string().optional(),
});

export type FilterByCustomerCheckInOutInput = z.infer<typeof FilterByCustomerCheckInOutSchema>;
