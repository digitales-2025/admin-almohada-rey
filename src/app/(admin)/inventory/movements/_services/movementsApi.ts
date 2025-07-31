import { createApi } from "@reduxjs/toolkit/query/react";

import { PaginatedResponse } from "@/types/api/paginated-response";
import { PaginatedQueryParams } from "@/types/query-filters/generic-paginated-query-params";
import baseQueryWithReauth from "@/utils/baseQuery";
import { MovementCreate, Movements, SummaryMovements } from "../_types/movements";

interface GetMovementsByIdProps {
  id: string;
}

export type PaginatedMovementParams = PaginatedQueryParams<SummaryMovements>;

export const movementsApi = createApi({
  reducerPath: "movementsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Movements", "Warehouse"],
  endpoints: (build) => ({
    //Crear movimientos
    createMovements: build.mutation<Movements, Partial<MovementCreate>>({
      query: (body) => ({
        url: "/movements",
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Movements", "Warehouse"],
    }),
    //Actualizar movimientos
    updateMovements: build.mutation<Movements, Partial<Movements> & { id: string }>({
      query: ({ id, ...body }) => ({
        url: `/movements/${id}`,
        method: "PATCH",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Movements", "Warehouse"],
    }),
    //Obtener movimiento por su id
    getMovementsById: build.query<Movements, GetMovementsByIdProps>({
      query: ({ id }) => ({
        url: `/movements/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Movements"],
    }),
    // Obtener movimientos por tipo paginados
    getMovementsByTypePaginated: build.query<PaginatedResponse<SummaryMovements>, PaginatedMovementParams>({
      query: ({ pagination: { page = 1, pageSize = 10 }, fieldFilters }) => {
        const params: Record<string, any> = { page, pageSize };

        // Añadir el filtro de tipo si existe
        if (fieldFilters?.type) {
          params.type = fieldFilters.type;
        }

        return {
          url: "/movements/type/paginated",
          method: "GET",
          params,
          credentials: "include",
        };
      },
      providesTags: (result) => [
        { type: "Movements", id: result?.meta.page },
        ...(result?.data.map(({ id }) => ({ type: "Movements" as const, id })) ?? []),
      ],
    }),

    //Obtener todos los movimientos
    getAllMovements: build.query<SummaryMovements[], void>({
      query: () => ({
        url: "/movements",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Movements"],
    }),
    //Eliminar movimiento
    deleteMovements: build.mutation<string, string>({
      query: (id) => ({
        url: `/movements/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Movements", "Warehouse"],
    }),
  }),
});

export const {
  useCreateMovementsMutation,
  useUpdateMovementsMutation,
  useGetMovementsByIdQuery,
  useGetMovementsByTypePaginatedQuery,
  useGetAllMovementsQuery,
  useDeleteMovementsMutation,
} = movementsApi;
