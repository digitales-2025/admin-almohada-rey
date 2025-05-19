// reservationApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";

import { socketService } from "@/services/socketService";
import { PaginatedResponse } from "@/types/api/paginated-response";
import { BaseApiResponse } from "@/types/api/types";
import { PaginatedQueryParams } from "@/types/query-filters/generic-paginated-query-params";
import baseQueryWithReauth from "@/utils/baseQuery";
import { CreateExtendStay, CreateLateCheckout } from "../_schemas/extension-reservation.schemas";
import {
  CreateReservationInput,
  DetailedReservation,
  DetailedRoom,
  Reservation,
  ReservationStatus,
  RoomAvailabilityDto,
  UpdateManyDto,
  UpdateManyResponse,
  UpdateReservationInput,
} from "../_schemas/reservation.schemas";
import { AvailabilityParams, GenericAvailabilityParams } from "../_types/room-availability-query-params";

type CreateReservationReduxResponse = BaseApiResponse<Reservation>;
type UpdateReservationReduxResponse = BaseApiResponse<Reservation>;
export type PaginatedReservationParams = PaginatedQueryParams<Reservation>;
type ApplyLateCheckoutReduxResponse = BaseApiResponse<Reservation>;
type ExtendStayReduxResponse = BaseApiResponse<Reservation>;

export const reservationApi = createApi({
  reducerPath: "reservationApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Reservation", "RoomAvailability", "Rooms", "Payment"],
  endpoints: (build) => ({
    createReservation: build.mutation<CreateReservationReduxResponse, CreateReservationInput>({
      query: (body) => ({
        url: "/reservation",
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Reservation"],
    }),

    updateReservation: build.mutation<UpdateReservationReduxResponse, { id: string; data: UpdateReservationInput }>({
      query: ({ id, data }) => ({
        url: `/reservation/${id}`,
        method: "PATCH",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Reservation"],
    }),

    applyLateCheckout: build.mutation<ApplyLateCheckoutReduxResponse, { id: string; data: CreateLateCheckout }>({
      query: ({ id, data }) => ({
        url: `/reservation/${id}/late-checkout`,
        method: "PATCH",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Reservation", id }, "Reservation", "RoomAvailability"],
    }),

    extendStay: build.mutation<ExtendStayReduxResponse, { id: string; data: CreateExtendStay }>({
      query: ({ id, data }) => ({
        url: `/reservation/${id}/extend-stay`,
        method: "PATCH",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Reservation", id }, "Reservation", "RoomAvailability"],
    }),

    transitionReservationStatus: build.mutation<
      UpdateReservationReduxResponse,
      { id: string; status: ReservationStatus }
    >({
      query: ({ id, status }) => ({
        url: `/reservation/transition-status/${id}`,
        method: "PATCH",
        body: { status },
        credentials: "include",
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Reservation", id },
        "Rooms", // Añadir este tag para invalidar todas las consultas con providesTags: ["Rooms"]
      ],
    }),
    deactivateReservations: build.mutation<BaseApiResponse<UpdateManyResponse>, UpdateManyDto>({
      query: (dto) => ({
        url: `/reservation/deactivate`,
        method: "DELETE",
        body: dto,
        credentials: "include",
      }),
      invalidatesTags: ["Reservation", "Payment"],
    }),

    reactivateReservations: build.mutation<BaseApiResponse<UpdateManyResponse>, UpdateManyDto>({
      query: (dto) => ({
        url: `/reservation/reactivate`,
        method: "PATCH",
        body: dto,
        credentials: "include",
      }),
      invalidatesTags: ["Reservation"],
    }),

    getReservationById: build.query<Reservation, string>({
      query: (id) => ({
        url: `/reservation/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result, error, id) => [{ type: "Reservation", id }],
    }),

    getAllReservations: build.query<Reservation[], void>({
      query: () => ({
        url: "/reservation",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Reservation"],
    }),

    getPaginatedReservations: build.query<PaginatedResponse<DetailedReservation>, PaginatedReservationParams>({
      query: ({ pagination: { page = 1, pageSize = 10 }, fieldFilters }) => ({
        url: "/reservation/paginated",
        method: "GET",
        params: { page, pageSize, ...fieldFilters },
        credentials: "include",
      }),
      providesTags: (result) => [
        { type: "Reservation", id: result?.meta.page },
        ...(result?.data.map(({ id }) => ({ type: "Reservation" as const, id })) ?? []),
      ],
    }),

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

    getAllAvailableRooms: build.query<DetailedRoom[], GenericAvailabilityParams>({
      query: ({ checkInDate, checkOutDate }) => ({
        url: `/reservation/available-rooms`,
        params: { checkInDate, checkOutDate },
      }),
      providesTags: (_, __, { checkInDate, checkOutDate }) => [
        { type: "RoomAvailability", id: `GLOBAL_${checkInDate}_${checkOutDate}` },
      ],
    }),

    getAllAvailableRoomsForUpdate: build.query<DetailedRoom[], GenericAvailabilityParams & { reservationId?: string }>({
      query: ({ checkInDate, checkOutDate, reservationId }) => ({
        url: `/reservation/available-rooms`,
        method: "GET",
        params: { checkInDate, checkOutDate, forUpdate: true, reservationId },
        credentials: "include",
      }),
      providesTags: ["RoomAvailability"],
    }),

    getRoomAvailability: build.query<RoomAvailabilityDto, AvailabilityParams>({
      query: ({ roomId, checkInDate, checkOutDate }) => ({
        url: "/reservation/check-availability",
        params: { roomId, checkInDate, checkOutDate },
      }),
      providesTags: (_, __, { roomId, checkInDate, checkOutDate }) => [
        { type: "RoomAvailability", id: `${roomId}_${checkInDate}_${checkOutDate}` },
      ],
    }),

    getRoomAvailabilityForUpdate: build.query<RoomAvailabilityDto, AvailabilityParams & { reservationId?: string }>({
      query: ({ roomId, checkInDate, checkOutDate, reservationId }) => ({
        url: "/reservation/check-availability",
        method: "GET",
        params: { roomId, checkInDate, checkOutDate, forUpdate: true, reservationId },
        credentials: "include",
      }),
      providesTags: (result, error, arg) => [
        { type: "RoomAvailability", id: `${arg.roomId}-${arg.checkInDate}-${arg.checkOutDate}-${arg.reservationId}` },
      ],
    }),

    checkExtendedCheckoutAvailability: build.query<{ isAvailable: boolean }, { id: string; newCheckoutDate: string }>({
      query: ({ id, newCheckoutDate }) => ({
        url: `/reservation/${id}/check-extended-checkout`,
        method: "GET",
        params: { newCheckoutDate },
        credentials: "include",
      }),
    }),
  }),
});

// WebSocket listeners para mantener sincronizado RTK Query en tiempo real
export const setupReservationWebsockets = (dispatch: any) => {
  socketService.connect();

  // Definimos los handlers primero para poder referenciarlos después
  const handleNewReservation = (reservation: DetailedReservation) => {
    dispatch(
      reservationApi.util.invalidateTags([
        { type: "Reservation", id: "ALL" },
        { type: "Reservation", id: reservation.id },
        {
          type: "RoomAvailability",
          id: `${reservation.roomId}_${reservation.checkInDate}_${reservation.checkOutDate}`,
        },
      ])
    );
  };

  const handleUpdatedReservation = (reservation: DetailedReservation) => {
    dispatch(
      reservationApi.util.invalidateTags([
        { type: "Reservation", id: reservation.id },
        {
          type: "RoomAvailability",
          id: `${reservation.roomId}_${reservation.checkInDate}_${reservation.checkOutDate}`,
        },
      ])
    );
  };

  const handleDeletedReservation = ({ id }: { id: string }) => {
    dispatch(reservationApi.util.invalidateTags([{ type: "Reservation", id }]));
  };

  const handleAvailabilityChanged = ({ checkInDate, checkOutDate }: { checkInDate: string; checkOutDate: string }) => {
    dispatch(
      reservationApi.util.invalidateTags([{ type: "RoomAvailability", id: `GLOBAL_${checkInDate}_${checkOutDate}` }])
    );
  };

  const handleRoomAvailabilityChecked = ({
    roomId,
    checkInDate,
    checkOutDate,
  }: {
    roomId: string;
    checkInDate: string;
    checkOutDate: string;
    isAvailable: boolean;
    timestamp: string;
  }) => {
    dispatch(
      reservationApi.util.invalidateTags([{ type: "RoomAvailability", id: `${roomId}_${checkInDate}_${checkOutDate}` }])
    );
  };

  const handleCheckoutAvailabilityChecked = ({
    roomId,
    originalCheckoutDate,
    newCheckoutDate,
  }: {
    roomId: string;
    originalCheckoutDate: string;
    newCheckoutDate: string;
    isAvailable: boolean;
    timestamp: string;
  }) => {
    dispatch(
      reservationApi.util.invalidateTags([
        { type: "RoomAvailability", id: `${roomId}_${originalCheckoutDate}_${newCheckoutDate}` },
        "RoomAvailability",
      ])
    );
  };

  // Registramos los listeners usando tus métodos existentes
  socketService.onNewReservation(handleNewReservation);
  socketService.onReservationUpdated(handleUpdatedReservation);
  socketService.onReservationDeleted(handleDeletedReservation);
  socketService.onAvailabilityChanged(handleAvailabilityChanged);
  socketService.onRoomAvailabilityChecked(handleRoomAvailabilityChecked);
  socketService.onCheckoutAvailabilityChecked(handleCheckoutAvailabilityChecked);

  // Limpieza usando el método genérico off
  return () => {
    socketService.off("newReservation", handleNewReservation);
    socketService.off("reservationUpdated", handleUpdatedReservation);
    socketService.off("reservationDeleted", handleDeletedReservation);
    socketService.off("availabilityChanged", handleAvailabilityChanged);
    socketService.off("roomAvailabilityChecked", handleRoomAvailabilityChecked);
    socketService.off("checkoutAvailabilityChecked", handleCheckoutAvailabilityChecked);
  };
};

export const requestReservationsInTimeInterval = (checkInDate: string, checkOutDate: string) => {
  socketService.requestReservationsInInterval(checkInDate, checkOutDate);
};

export const {
  useCreateReservationMutation,
  useUpdateReservationMutation,
  useApplyLateCheckoutMutation,
  useExtendStayMutation,
  useTransitionReservationStatusMutation,
  useGetReservationByIdQuery,
  useGetAllReservationsQuery,
  useGetPaginatedReservationsQuery,
  useGetRoomAvailabilityQuery,
  useGetRoomAvailabilityForUpdateQuery,
  useGetAllAvailableRoomsQuery,
  useGetAllAvailableRoomsForUpdateQuery,
  useGetReservationsInTimeIntervalQuery,
  useDeactivateReservationsMutation,
  useReactivateReservationsMutation,
  useCheckExtendedCheckoutAvailabilityQuery,
} = reservationApi;
