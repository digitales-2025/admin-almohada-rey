// reservationApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";

import { socketService } from "@/services/socketService";
import { PaginatedResponse } from "@/types/api/paginated-response";
import { BaseApiResponse } from "@/types/api/types";
import { AdvancedPaginationParams } from "@/types/query-filters/advanced-pagination";
import { PaginatedQueryParams } from "@/types/query-filters/generic-paginated-query-params";
import baseQueryWithReauth from "@/utils/baseQuery";
import { CreateExtendStay, CreateLateCheckout } from "../_schemas/extension-reservation.schemas";
import {
  CreateReservationInput,
  DetailedReservation,
  DetailedRoom,
  ReasonResponse,
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
type RemoveLateCheckoutReduxResponse = BaseApiResponse<Reservation>;

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
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          // Esperar a que la mutación se complete
          await queryFulfilled;

          // Invalidar tags después de un pequeño delay para asegurar que el backend haya procesado
          setTimeout(() => {
            dispatch(reservationApi.util.invalidateTags(["Reservation", "Payment"]));
          }, 500); // 500ms delay
        } catch {
          // Si hay error, no invalidar
        }
      },
    }),

    applyLateCheckout: build.mutation<ApplyLateCheckoutReduxResponse, { id: string; data: CreateLateCheckout }>({
      query: ({ id, data }) => ({
        url: `/reservation/${id}/late-checkout`,
        method: "PATCH",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Reservation", id }, "Reservation", "RoomAvailability"],
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          setTimeout(() => {
            dispatch(reservationApi.util.invalidateTags(["Payment"]));
          }, 500);
        } catch {
          // Si hay error, no invalidar
        }
      },
    }),

    removeLateCheckout: build.mutation<RemoveLateCheckoutReduxResponse, string>({
      query: (id) => ({
        url: `/reservation/${id}/late-checkout`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Reservation", id }, "Reservation", "RoomAvailability"],
      async onQueryStarted(_id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          setTimeout(() => {
            dispatch(reservationApi.util.invalidateTags(["Payment"]));
          }, 500);
        } catch {
          // Si hay error, no invalidar
        }
      },
    }),

    extendStay: build.mutation<ExtendStayReduxResponse, { id: string; data: CreateExtendStay }>({
      query: ({ id, data }) => ({
        url: `/reservation/${id}/extend-stay`,
        method: "PATCH",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Reservation", id }, "Reservation", "RoomAvailability"],
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          setTimeout(() => {
            dispatch(reservationApi.util.invalidateTags(["Payment"]));
          }, 500);
        } catch {
          // Si hay error, no invalidar
        }
      },
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
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          setTimeout(() => {
            dispatch(reservationApi.util.invalidateTags(["Payment"]));
          }, 500);
        } catch {
          // Si hay error, no invalidar
        }
      },
    }),
    deactivateReservations: build.mutation<BaseApiResponse<UpdateManyResponse>, UpdateManyDto>({
      query: (dto) => ({
        url: `/reservation/deactivate`,
        method: "DELETE",
        body: dto,
        credentials: "include",
      }),
      invalidatesTags: ["Reservation"],
      async onQueryStarted(_dto, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          setTimeout(() => {
            dispatch(reservationApi.util.invalidateTags(["Payment"]));
          }, 500);
        } catch {
          // Si hay error, no invalidar
        }
      },
    }),

    reactivateReservations: build.mutation<BaseApiResponse<UpdateManyResponse>, UpdateManyDto>({
      query: (dto) => ({
        url: `/reservation/reactivate`,
        method: "PATCH",
        body: dto,
        credentials: "include",
      }),
      invalidatesTags: ["Reservation"],
      async onQueryStarted(_dto, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          setTimeout(() => {
            dispatch(reservationApi.util.invalidateTags(["Payment"]));
          }, 500);
        } catch {
          // Si hay error, no invalidar
        }
      },
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

    getPaginatedReservations: build.query<PaginatedResponse<DetailedReservation>, AdvancedPaginationParams>({
      query: ({ pagination, filters, sort }) => ({
        url: "/reservation/paginated",
        method: "GET",
        params: {
          page: pagination.page,
          pageSize: pagination.pageSize,
          ...(filters?.search && { search: filters.search }),
          ...(filters?.isActive && {
            isActive: Array.isArray(filters.isActive) ? filters.isActive.join(",") : filters.isActive,
          }),
          ...(filters?.isPendingDeletePayment && {
            isPendingDeletePayment: Array.isArray(filters.isPendingDeletePayment)
              ? filters.isPendingDeletePayment
                  .map((value) => (value === "payment_to_delete" ? "true" : value))
                  .join(",")
              : filters.isPendingDeletePayment === "payment_to_delete"
                ? "true"
                : filters.isPendingDeletePayment,
          }),
          ...(filters?.status && { status: Array.isArray(filters.status) ? filters.status.join(",") : filters.status }),
          // Filtros adicionales del FilterReservationDialog
          ...(filters?.customerId && { customerId: filters.customerId }),
          ...(filters?.checkInDate && { checkInDate: filters.checkInDate }),
          ...(filters?.checkOutDate && { checkOutDate: filters.checkOutDate }),
          ...(sort?.sortBy && { sortBy: sort.sortBy }),
          ...(sort?.sortOrder && { sortOrder: sort.sortOrder }),
        },
        credentials: "include",
      }),
      providesTags: (result) => [
        { type: "Reservation", id: "PAGINATED" },
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

    getAllReasons: build.query<ReasonResponse[], void>({
      query: () => ({
        url: "/reservation/all/reasons",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Reservation"],
    }),
  }),
});

// WebSocket listeners para mantener sincronizado RTK Query en tiempo real
export const setupReservationWebsockets = (dispatch: any) => {
  socketService.connect();

  // Control para evitar bucles
  let isUpdating = false;
  let isAvailabilityUpdating = false;
  const updateTimeout = 1000; // 1 segundo de cooldown
  const availabilityTimeout = 2000; // 2 segundos de cooldown para disponibilidad

  // Definimos los handlers primero para poder referenciarlos después
  const handleNewReservation = (reservation: DetailedReservation) => {
    if (isUpdating) return;

    isUpdating = true;

    // Actualización optimista: agregar directamente al cache sin invalidar tags
    const updateCache = (draft: any) => {
      if (draft?.data && Array.isArray(draft.data)) {
        // Solo agregar si no existe ya
        const exists = draft.data.some((r: DetailedReservation) => r.id === reservation.id);
        if (!exists) {
          draft.data.unshift(reservation);
          if (draft.meta) {
            draft.meta.total += 1;
          }
        }
      }
    };

    // Actualizar solo la primera página (sin filtros)
    dispatch(
      reservationApi.util.updateQueryData(
        "getPaginatedReservations",
        { pagination: { page: 1, pageSize: 10 }, filters: {}, sort: {} },
        updateCache
      )
    );

    // NO invalidar tags de RoomAvailability para evitar bucles
    // Solo invalidar el tag específico de la nueva reservación
    dispatch(reservationApi.util.invalidateTags([{ type: "Reservation", id: reservation.id }]));

    // Resetear el flag después del timeout
    setTimeout(() => {
      isUpdating = false;
    }, updateTimeout);
  };

  const handleUpdatedReservation = (reservation: DetailedReservation) => {
    if (isUpdating) return;

    isUpdating = true;

    // Actualización optimista: actualizar directamente en el cache
    const updateReservationInQuery = (draft: any) => {
      if (draft?.data && Array.isArray(draft.data)) {
        const index = draft.data.findIndex((r: DetailedReservation) => r.id === reservation.id);
        if (index !== -1) {
          draft.data[index] = reservation;
        }
      }
    };

    // Actualizar solo la primera página (sin filtros)
    dispatch(
      reservationApi.util.updateQueryData(
        "getPaginatedReservations",
        { pagination: { page: 1, pageSize: 10 }, filters: {}, sort: {} },
        updateReservationInQuery
      )
    );

    // Solo invalidar el tag específico de la reservación actualizada
    dispatch(reservationApi.util.invalidateTags([{ type: "Reservation", id: reservation.id }]));

    setTimeout(() => {
      isUpdating = false;
    }, updateTimeout);
  };

  const handleDeletedReservation = ({ id }: { id: string }) => {
    if (isUpdating) return;

    isUpdating = true;

    // Actualización optimista: remover directamente del cache
    const removeReservationFromQuery = (draft: any) => {
      if (draft?.data && Array.isArray(draft.data)) {
        const index = draft.data.findIndex((r: DetailedReservation) => r.id === id);
        if (index !== -1) {
          draft.data.splice(index, 1);
          if (draft.meta) {
            draft.meta.total -= 1;
          }
        }
      }
    };

    // Actualizar solo la primera página (sin filtros)
    dispatch(
      reservationApi.util.updateQueryData(
        "getPaginatedReservations",
        { pagination: { page: 1, pageSize: 10 }, filters: {}, sort: {} },
        removeReservationFromQuery
      )
    );

    // Solo invalidar el tag específico de la reservación eliminada
    dispatch(reservationApi.util.invalidateTags([{ type: "Reservation", id: id }]));

    setTimeout(() => {
      isUpdating = false;
    }, updateTimeout);
  };

  const handleAvailabilityChanged = () => {
    // Evitar bucles con debouncing
    if (isAvailabilityUpdating) return;

    isAvailabilityUpdating = true;

    // Invalidar tags de disponibilidad para forzar re-verificación
    dispatch(reservationApi.util.invalidateTags(["RoomAvailability", "Rooms"]));

    // Resetear el flag después del timeout
    setTimeout(() => {
      isAvailabilityUpdating = false;
    }, availabilityTimeout);
  };

  const handleRoomAvailabilityChecked = () => {
    // Evitar bucles con debouncing
    if (isAvailabilityUpdating) return;

    isAvailabilityUpdating = true;

    // Invalidar tags de disponibilidad
    dispatch(reservationApi.util.invalidateTags(["RoomAvailability"]));

    // Resetear el flag después del timeout
    setTimeout(() => {
      isAvailabilityUpdating = false;
    }, availabilityTimeout);
  };

  const handleCheckoutAvailabilityChecked = () => {
    // NO invalidar tags para evitar bucles
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
  useRemoveLateCheckoutMutation,
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
  useGetAllReasonsQuery,
} = reservationApi;
