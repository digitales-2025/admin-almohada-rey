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

// Función auxiliar para extraer y loguear datos del FormData
const logFormData = (formData: FormData, endpoint: string, method: string, id?: string) => {
  const formDataEntries: Record<string, any> = {};

  // Iteramos por todas las entradas del FormData
  formData.forEach((value, key) => {
    if (value instanceof File) {
      // Si es un archivo, guardamos información específica de archivo
      formDataEntries[key] = {
        tipo: "archivo",
        nombre: value.name,
        tipo_mime: value.type,
        tamaño: `${(value.size / 1024).toFixed(2)} KB`,
      };
    } else {
      // Para otros tipos de datos, los guardamos directamente
      formDataEntries[key] = value;
    }
  });

  // Mostramos los datos en consola con formato
  console.log("======== DATOS ENVIADOS A LA API ========");
  console.log("Endpoint:", endpoint);
  console.log("Método:", method);
  if (id) console.log("ID:", id);
  console.log("Contenido del FormData:", formDataEntries);
  console.log("=========================================");

  return formData; // Devolvemos el mismo FormData para no afectar la petición
};

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
      query: (formData) => {
        // Logueamos los datos del FormData antes de enviarlos
        logFormData(formData, "/room-types/create-with-images", "POST");

        return {
          url: "/room-types/create-with-images",
          method: "POST",
          body: formData,
          credentials: "include",
        };
      },
      invalidatesTags: [{ type: "RoomType", id: "LIST" }],
    }),

    // MUTACIÓN: Actualizar tipo de habitación existente con posibles cambios en imágenes
    updateRoomTypeWithImage: build.mutation<
      RoomTypeResponse,
      { id: string; formData: TypedFormData<UpdateRoomTypeWithImageDto> }
    >({
      query: ({ id, formData }) => {
        // Logueamos los datos del FormData antes de enviarlos, incluyendo el ID
        logFormData(formData, `/room-types/${id}/update-with-images`, "PATCH", id);

        return {
          url: `/room-types/${id}/update-with-images`,
          method: "PATCH",
          body: formData,
          credentials: "include",
        };
      },
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
