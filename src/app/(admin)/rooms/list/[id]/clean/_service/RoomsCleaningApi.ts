import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReauth from "@/utils/baseQuery";
import { RoomCleaning } from "../_types/roomCleaning";

export const roomsCleaningApi = createApi({
  reducerPath: "roomsCleaningApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Room Cleaning"],
  endpoints: (build) => ({
    //Crear historial de limpieza de habitaciones
    createRoomCleaning: build.mutation<RoomCleaning, Partial<RoomCleaning>>({
      query: (body) => ({
        url: "/room-cleaning",
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Room Cleaning"],
    }),
    //Actualizar historial de limpieza de habitaciones
    updateRoomCleaning: build.mutation<RoomCleaning, Partial<RoomCleaning> & { id: string }>({
      query: ({ id, ...body }) => ({
        url: `/room-cleaning/${id}`,
        method: "PATCH",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Room Cleaning"],
    }),
    //Obtener historial de limpieza de habitación por id
    getRoomCleaningById: build.query<RoomCleaning, string>({
      query: (id) => ({
        url: `/room-cleaning/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result, error, id) => [{ type: "Room Cleaning", id }],
    }),
    //Obtener todos los historiales de limpieza de habitaciones
    getAllRoomsCleaning: build.query<RoomCleaning[], void>({
      query: () => ({
        url: "/room-cleaning",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Room Cleaning"],
    }),
    // Obtener todos los historiales de limpieza de habitaciones por id de habitación
    getAllRoomsCleaningByRoomId: build.query<RoomCleaning[], string>({
      query: (roomId) => ({
        url: `/room-cleaning/room/${roomId}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Room Cleaning"],
    }),
  }),
});

export const {
  useCreateRoomCleaningMutation,
  useGetAllRoomsCleaningByRoomIdQuery,
  useGetAllRoomsCleaningQuery,
  useGetRoomCleaningByIdQuery,
  useUpdateRoomCleaningMutation,
} = roomsCleaningApi;
