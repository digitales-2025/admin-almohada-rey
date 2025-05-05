import { createApi } from "@reduxjs/toolkit/query/react";

import { PaginatedResponse } from "@/types/api/paginated-response";
import { PaginatedQueryParams } from "@/types/query-filters/generic-paginated-query-params";
import baseQueryWithReauth from "@/utils/baseQuery";
import { Room, RoomStatus } from "../_types/room";

export interface StatusRoomDto {
  status: RoomStatus;
}

export type PaginatedRoomParams = PaginatedQueryParams<Room>;

export const roomsApi = createApi({
  reducerPath: "roomsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Rooms"],
  endpoints: (build) => ({
    //Crear habitaciones
    createRoom: build.mutation<Room, Partial<Room>>({
      query: (body) => ({
        url: "/rooms",
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Rooms"],
    }),
    //Actualizar habitaciones
    updateRoom: build.mutation<Room, Partial<Room> & { id: string }>({
      query: ({ id, ...body }) => ({
        url: `/rooms/${id}`,
        method: "PATCH",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Rooms"],
    }),
    // Actualizar estado de habitación
    updateRoomStatus: build.mutation<Room, { id: string; statusDto: StatusRoomDto }>({
      query: ({ id, statusDto }) => ({
        url: `/rooms/${id}/status`,
        method: "PATCH",
        body: statusDto,
        credentials: "include",
      }),
      invalidatesTags: ["Rooms"],
    }),
    //Obtener habitación por id
    getRoomById: build.query<Room, string>({
      query: (id) => ({
        url: `/rooms/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result, error, id) => [{ type: "Rooms", id }],
    }),
    //Obtener todos los habitaciones
    getAllRooms: build.query<Room[], void>({
      query: () => ({
        url: "/rooms",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Rooms"],
    }),

    getPaginatedRooms: build.query<PaginatedResponse<Room>, PaginatedRoomParams>({
      query: ({ pagination: { page = 1, pageSize = 10 } }) => ({
        url: "/rooms/paginated",
        method: "GET",
        params: { page, pageSize },
        credentials: "include",
      }),
      providesTags: (result) => [
        { type: "Rooms", id: result?.meta.page },
        ...(result?.data.map(({ id }) => ({ type: "Rooms" as const, id })) ?? []),
      ],
    }),
    //Eliminar habitaciones
    deleteRooms: build.mutation<void, { ids: string[] }>({
      query: (ids) => ({
        url: `/rooms/remove/all`,
        method: "DELETE",
        body: ids,
        credentials: "include",
      }),
      invalidatesTags: ["Rooms"],
    }),
    //Activar habitaciones
    reactivateRooms: build.mutation<void, { ids: string[] }>({
      query: (ids) => ({
        url: `/rooms/reactivate/all`,
        method: "PATCH",
        body: ids,
        credentials: "include",
      }),
      invalidatesTags: ["Rooms"],
    }),
  }),
});

export const {
  useCreateRoomMutation,
  useUpdateRoomMutation,
  useUpdateRoomStatusMutation,
  useGetRoomByIdQuery,
  useGetAllRoomsQuery,
  useGetPaginatedRoomsQuery,
  useDeleteRoomsMutation,
  useReactivateRoomsMutation,
} = roomsApi;
