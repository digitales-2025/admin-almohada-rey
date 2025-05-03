import { createApi } from "@reduxjs/toolkit/query/react";

import { PaginatedResponse } from "@/types/api/paginated-response";
import { BaseApiResponse } from "@/types/api/types";
import { PaginatedQueryParams } from "@/types/query-filters/generic-paginated-query-params";
import baseQueryWithReauth from "@/utils/baseQuery";
import {
  CreateRoomTypeWithImagesDto,
  DeleteRoomTypeDto,
  ReactivateRoomTypeDto,
  RoomType,
  SummaryRoomType,
  TypedFormData,
  UpdateRoomTypeWithImageDto,
} from "../_types/roomTypes";

// Tipos de respuesta base
type RoomTypeResponse = BaseApiResponse<RoomType>;
type RoomTypesResponse = BaseApiResponse<RoomType[]>;
export type PaginatedRoomTypeParams = PaginatedQueryParams<RoomType>;

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

    getPaginatedRoomTypes: build.query<PaginatedResponse<RoomType>, PaginatedRoomTypeParams>({
      query: ({ pagination: { page = 1, pageSize = 10 } }) => ({
        url: "/room-types/paginated",
        method: "GET",
        params: { page, pageSize },
        credentials: "include",
      }),
      providesTags: (result) => [
        { type: "RoomType", id: result?.meta.page },
        ...(result?.data.map(({ id }) => ({ type: "RoomType" as const, id })) ?? []),
      ],
    }),

    getAllSummaryRoomType: build.query<SummaryRoomType[], void>({
      query: () => ({
        url: "/room-types/summary/active",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["RoomType"],
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

    updateMainImage: build.mutation<
      RoomTypeResponse,
      { roomTypeId: string; imageUpdate: { id: string; url: string; isMain: boolean } }
    >({
      query: ({ roomTypeId, imageUpdate }) => ({
        url: `/room-types/${roomTypeId}/update-main-image`,
        method: "PATCH",
        body: { imageUpdate },
        credentials: "include",
      }),
      invalidatesTags: (result, error, { roomTypeId }) => [
        { type: "RoomType", id: roomTypeId },
        { type: "RoomType", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllRoomTypesQuery,
  useGetPaginatedRoomTypesQuery,
  useGetAllSummaryRoomTypeQuery,
  useGetRoomTypeByIdQuery,
  useGetRoomTypeWithImagesByIdQuery,
  useCreateRoomTypeWithImagesMutation,
  useUpdateRoomTypeWithImageMutation,
  useDeleteRoomTypesMutation,
  useReactivateRoomTypesMutation,
  useUpdateMainImageMutation,
} = roomTypeApi;
