import { createApi } from "@reduxjs/toolkit/query/react";

import { BaseApiResponse } from "@/types/api/types";
import baseQueryWithReauth from "@/utils/baseQuery";
import {
  CreateRoomTypeWithImagesDto,
  DeleteRoomTypeDto,
  ReactivateRoomTypeDto,
  RoomType,
  TypedFormData,
  UpdateRoomTypeWithImageDto,
} from "../_types/roomTypes";

// Tipos de respuesta base
type RoomTypeResponse = BaseApiResponse<RoomType>;
type RoomTypesResponse = BaseApiResponse<RoomType[]>;

export const roomTypeApi = createApi({
  reducerPath: "roomTypeApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["RoomType"],
  endpoints: (build) => ({
    getAllRoomTypes: build.query<RoomType[], void>({
      query: () => ({
        url: "/room-types",
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: "RoomType" as const, id })), { type: "RoomType", id: "LIST" }]
          : [{ type: "RoomType", id: "LIST" }],
    }),

    getRoomTypeById: build.query<RoomType, string>({
      query: (id) => ({
        url: `/room-types/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result, error, id) => [{ type: "RoomType", id }],
    }),

    getRoomTypeWithImagesById: build.query<RoomType, string>({
      query: (id) => ({
        url: `/room-types/${id}/with-images`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result, error, id) => [{ type: "RoomType", id }],
    }),

    // MUTACIÓN: Crear nuevo tipo de habitación con imágenes (requiere 5 imágenes)
    createRoomTypeWithImages: build.mutation<RoomTypeResponse, TypedFormData<CreateRoomTypeWithImagesDto>>({
      query: (formData) => ({
        url: "/room-types/create-with-images",
        method: "POST",
        body: formData,
        credentials: "include",
      }),
      invalidatesTags: [{ type: "RoomType", id: "LIST" }],
    }),

    // MUTACIÓN: Actualizar tipo de habitación existente con posibles cambios en imágenes
    updateRoomTypeWithImage: build.mutation<
      RoomTypeResponse,
      { id: string; formData: TypedFormData<UpdateRoomTypeWithImageDto> }
    >({
      query: ({ id, formData }) => ({
        url: `/room-types/${id}/update-with-images`,
        method: "PATCH",
        body: formData,
        credentials: "include",
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "RoomType", id },
        { type: "RoomType", id: "LIST" },
      ],
    }),

    deleteRoomTypes: build.mutation<RoomTypesResponse, DeleteRoomTypeDto>({
      query: (body) => ({
        url: `/room-types/remove/all`,
        method: "DELETE",
        body,
        credentials: "include",
      }),
      invalidatesTags: [{ type: "RoomType", id: "LIST" }],
    }),

    reactivateRoomTypes: build.mutation<RoomTypesResponse, ReactivateRoomTypeDto>({
      query: (body) => ({
        url: `/room-types/reactivate/all`,
        method: "PATCH",
        body,
        credentials: "include",
      }),
      invalidatesTags: [{ type: "RoomType", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllRoomTypesQuery,
  useGetRoomTypeByIdQuery,
  useGetRoomTypeWithImagesByIdQuery,
  useCreateRoomTypeWithImagesMutation,
  useUpdateRoomTypeWithImageMutation,
  useDeleteRoomTypesMutation,
  useReactivateRoomTypesMutation,
} = roomTypeApi;
