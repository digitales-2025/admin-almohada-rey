"use server";

import { GetOneResponse, GetResponse, MutationListResponse, MutationResponse } from "@/types/api/actions-crud";
import { BaseActionOps } from "@/utils/actions/BaseActionOps";
import { Reservation } from "../_schemas/reservation.schemas";

export type CreateReservationResponse = MutationResponse<Reservation>;
export type GetReservationsResponse = GetResponse<Reservation>;
export type GetReservationResponse = GetOneResponse<Reservation>;
export type GetDetailedReservationsRsponse = GetResponse<Reservation>;
export type GetDetailedReservationResponse = GetOneResponse<Reservation>;
export type UpdateReservationsResponse = MutationListResponse<Reservation>;

// export async function getReservations(): Promise<GetReservationsResponse> {
//   try {
//     const [data, error] = await http.get<GetReservationsResponse>("/reservations");
//     if (error) {
//       return {
//         error: typeof error === "object" && error !== null && "message" in error
//         ? String(error.message)
//         : "Error al obtener el stock de todos los almacenes",
//       };
//     }
//     return data;
//   } catch (error) {
//     if (error instanceof Error) {
//       return {
//         error: error.message,
//       };
//     }
//     return {
//       error: "Error desconocido",
//     };
//   }
// }

export class ReservationActions extends BaseActionOps<Reservation> {}
export const reservationActions = new ReservationActions();
