import { createApi } from "@reduxjs/toolkit/query/react";

import { PaginatedResponse, PaginationParams } from "@/types/api/paginated-response";
import { BaseApiResponse } from "@/types/api/types";
import baseQueryWithReauth from "@/utils/baseQuery";
// import { CreateReservationResponse } from "../_actions/reservation.action";
import { CreateReservationInput, DetailedReservation, Reservation } from "../_schemas/reservation.schemas";

type CreateReservationReduxResponse = BaseApiResponse<Reservation>;

export const reservationApi = createApi({
  reducerPath: "reservationApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Reservation"],
  endpoints: (build) => ({
    //Crear reservación
    createReservation: build.mutation<CreateReservationReduxResponse, CreateReservationInput>({
      query: (body) => ({
        url: "/reservation",
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Reservation"],
    }),
    //Actualizar reservación
    updateReservation: build.mutation<Reservation, Partial<Reservation> & { id: string }>({
      query: ({ id, ...body }) => ({
        url: `/reservation/${id}`,
        method: "PATCH",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Reservation"],
    }),
    //Obtener reservación por id
    getReservationById: build.query<Reservation, string>({
      query: (id) => ({
        url: `/reservation/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result, error, id) => [{ type: "Reservation", id }],
    }),
    //Obtener todas las reservaciones
    getAllReservations: build.query<Reservation[], void>({
      query: () => ({
        url: "/reservation",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Reservation"],
    }),
    //Obtener todas las reservaciones paginadas
    getPaginatedReservations: build.query<PaginatedResponse<DetailedReservation>, PaginationParams>({
      query: ({ page = 1, pageSize = 10 }) => ({
        url: "/reservation/paginated",
        method: "GET",
        params: { page, pageSize },
        credentials: "include",
      }),
      providesTags: (result) => [
        { type: "Reservation", id: result?.meta.page },
        ...(result?.data?.map(({ id }) => ({ type: "Reservation" as const, id })) ?? []),
      ],
    }),
    //Eliminar reservaciones
    deleteReservations: build.mutation<void, { ids: string[] }>({
      query: (ids) => ({
        url: `/reservation/remove/all`,
        method: "DELETE",
        body: ids,
        credentials: "include",
      }),
      invalidatesTags: ["Reservation"],
    }),
    //Activar reservaciones
    reactivateReservations: build.mutation<void, { ids: string[] }>({
      query: (ids) => ({
        url: `/reservation/reactivate/all`,
        method: "PATCH",
        body: ids,
        credentials: "include",
      }),
      invalidatesTags: ["Reservation"],
    }),
  }),
});

export const {
  useCreateReservationMutation,
  useGetReservationByIdQuery,
  useGetAllReservationsQuery,
  useGetPaginatedReservationsQuery,
} = reservationApi;
