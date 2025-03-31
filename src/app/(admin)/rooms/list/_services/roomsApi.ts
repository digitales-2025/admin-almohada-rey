import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReauth from "@/utils/baseQuery";
import { Room, RoomStatus } from "../_types/room";

export interface StatusRoomDto {
  status: RoomStatus;
}

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
  useDeleteRoomsMutation,
  useReactivateRoomsMutation,
} = roomsApi;
