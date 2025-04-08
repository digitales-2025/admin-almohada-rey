import { createApi } from "@reduxjs/toolkit/query/react";

import { PaginatedResponse } from "@/types/api/paginated-response";
import { BaseApiResponse } from "@/types/api/types";
import { PaginatedQueryParams } from "@/types/query-filters/generic-paginated-query-params";
import baseQueryWithReauth from "@/utils/baseQuery";
// import { CreateReservationResponse } from "../_actions/reservation.action";
import {
  CreateReservationInput,
  DetailedReservation,
  DetailedRoom,
  Reservation,
  ReservationStatus,
  RoomAvailabilityDto,
  UpdateReservationInput,
} from "../_schemas/reservation.schemas";
import { AvailabilityParams, GenericAvailabilityParams } from "../_types/room-availability-query-params";

type CreateReservationReduxResponse = BaseApiResponse<Reservation>;
type UpdateReservationReduxResponse = BaseApiResponse<Reservation>;
export type PaginatedReservationParams = PaginatedQueryParams<Reservation>;

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
    updateReservation: build.mutation<
      UpdateReservationReduxResponse,
      {
        id: string;
        data: UpdateReservationInput;
      }
    >({
      query: ({ id, data }) => ({
        url: `/reservation/${id}`,
        method: "PATCH",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Reservation"],
    }),
    //Change transitions status
    transitionReservationStatus: build.mutation<
      UpdateReservationReduxResponse,
      {
        id: string;
        status: ReservationStatus;
      }
    >({
      query: ({ id, status }) => ({
        url: `/transition-status/${id}`,
        method: "PATCH",
        body: { status },
        credentials: "include",
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Reservation", id }],
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
    getPaginatedReservations: build.query<PaginatedResponse<DetailedReservation>, PaginatedReservationParams>({
      query: ({ pagination: { page = 1, pageSize = 10 }, fieldFilters }) => ({
        url: "/reservation/paginated",
        method: "GET",
        params: { page, pageSize, ...fieldFilters },
        credentials: "include",
      }),
      providesTags: (result) => [
        { type: "Reservation", id: result?.meta.page },
        ...(result?.data?.map(({ id }) => ({ type: "Reservation" as const, id })) ?? []),
      ],
    }),
    //Obtener todas las reservaciones paginadas
    getReservationsInTimeInterval: build.query<DetailedReservation[], GenericAvailabilityParams>({
      query: ({ checkInDate, checkOutDate }) => ({
        url: `/reservation/reservations-in-interval`,
        method: "GET",
        params: { checkInDate, checkOutDate },
        credentials: "include",
      }),
      providesTags: (result) =>
        result
          ? [
              { type: "Reservation", id: "TIME_INTERVAL" },
              ...(result.map(({ id }) => ({ type: "Reservation" as const, id })) || []),
            ]
          : [{ type: "Reservation", id: "TIME_INTERVAL" }],
    }),
    //Obtener todas las habitaciones disponibles en reservaciones
    getAllAvailableRooms: build.query<DetailedRoom[], GenericAvailabilityParams>({
      query: ({ checkInDate, checkOutDate }) => {
        return {
          url: `/reservation/available-rooms`,
          method: "GET",
          params: { checkInDate, checkOutDate },
          credentials: "include",
        };
      },
    }),
    getAllAvailableRoomsForUpdate: build.query<
      DetailedRoom[],
      GenericAvailabilityParams & {
        reservationId?: string;
      }
    >({
      query: ({ checkInDate, checkOutDate, reservationId }) => {
        return {
          url: `/reservation/available-rooms`,
          method: "GET",
          params: { checkInDate, checkOutDate, forUpdate: true, reservationId },
          credentials: "include",
        };
      },
    }),
    //Check room availability
    getRoomAvailability: build.query<RoomAvailabilityDto, AvailabilityParams>({
      query: ({ roomId, checkInDate, checkOutDate }) => ({
        url: "/reservation/check-availability",
        method: "GET",
        params: {
          roomId,
          checkInDate,
          checkOutDate,
        },
        credentials: "include",
      }),
    }),

    //Check room availability
    getRoomAvailabilityForUpdate: build.query<
      RoomAvailabilityDto,
      AvailabilityParams & {
        reservationId?: string;
      }
    >({
      query: ({ roomId, checkInDate, checkOutDate, reservationId }) => ({
        url: "/reservation/check-availability",
        method: "GET",
        params: {
          roomId,
          checkInDate,
          checkOutDate,
          forUpdate: true,
          reservationId,
        },
        credentials: "include",
      }),
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
  useUpdateReservationMutation,
  useTransitionReservationStatusMutation,
  useGetReservationByIdQuery,
  useGetAllReservationsQuery,
  useGetPaginatedReservationsQuery,
  useGetRoomAvailabilityQuery,
  useGetRoomAvailabilityForUpdateQuery,
  useGetAllAvailableRoomsQuery,
  useGetAllAvailableRoomsForUpdateQuery,
  useGetReservationsInTimeIntervalQuery,
} = reservationApi;
