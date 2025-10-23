import { createApi } from "@reduxjs/toolkit/query/react";

import { PaginatedResponse } from "@/types/api/paginated-response";
import { AdvancedPaginationParams } from "@/types/query-filters/advanced-pagination";
import { PaginatedQueryParams } from "@/types/query-filters/generic-paginated-query-params";
import baseQueryWithReauth from "@/utils/baseQuery";
import { Product, ProductType } from "../_types/products";

interface GetProductsByTypeProps {
  type: ProductType;
}

export type PaginatedProductParams = PaginatedQueryParams<Product>;

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Product"],
  endpoints: (build) => ({
    //Crear productos
    createProduct: build.mutation<Product, Partial<Product>>({
      query: (body) => ({
        url: "/product",
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Product"],
    }),
    //Actualizar productos
    updateProduct: build.mutation<Product, Partial<Product> & { id: string }>({
      query: ({ id, ...body }) => ({
        url: `/product/${id}`,
        method: "PATCH",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Product"],
    }),
    //Obtener producto por id
    getProductById: build.query<Product, string>({
      query: (id) => ({
        url: `/product/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),
    //Obtener todos los productos
    getAllProducts: build.query<Product[], void>({
      query: () => ({
        url: "/product",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Product"],
    }),

    getPaginatedProducts: build.query<PaginatedResponse<Product>, PaginatedProductParams | AdvancedPaginationParams>({
      query: (params) => {
        // Detectar si es formato avanzado o formato original
        if ("filters" in params && "sort" in params) {
          // Formato avanzado
          const { pagination, filters, sort, type } = params as AdvancedPaginationParams & {
            type?: ProductType;
          };
          const queryParams: Record<string, any> = {
            page: pagination.page,
            pageSize: pagination.pageSize,
          };

          // Añadir búsqueda si existe
          if (filters?.search) {
            queryParams.search = filters.search;
          }

          // Añadir filtros
          if (filters?.isActive) {
            queryParams.isActive = Array.isArray(filters.isActive) ? filters.isActive.join(",") : filters.isActive;
          }

          if (filters?.type) {
            queryParams.type = Array.isArray(filters.type) ? filters.type.join(",") : filters.type;
          }

          // Añadir tipo específico si existe
          if (type) {
            queryParams.type = type;
          }

          // Añadir ordenamiento
          if (sort?.sortBy) {
            queryParams.sortBy = sort.sortBy;
          }
          if (sort?.sortOrder) {
            queryParams.sortOrder = sort.sortOrder;
          }

          return {
            url: "/product/paginated",
            method: "GET",
            params: queryParams,
            credentials: "include",
          };
        } else {
          // Formato original (compatibilidad hacia atrás)
          const {
            pagination: { page = 1, pageSize = 10 },
            fieldFilters,
          } = params as PaginatedProductParams;
          const queryParams: Record<string, any> = { page, pageSize };

          // Añadir el filtro de tipo si existe
          if (fieldFilters?.type) {
            queryParams.type = fieldFilters.type;
          }

          return {
            url: "/product/paginated",
            method: "GET",
            params: queryParams,
            credentials: "include",
          };
        }
      },
      providesTags: (result) => [
        { type: "Product", id: result?.meta.page },
        ...(result?.data.map(({ id }) => ({ type: "Product" as const, id })) ?? []),
      ],
    }),

    //Obtener productos por tipo
    getProductsByType: build.query<Product[], GetProductsByTypeProps>({
      query: ({ type }) => ({
        url: `/product/all/type/${type}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Product"],
    }),

    //Eliminar productos
    deleteProducts: build.mutation<void, { ids: string[] }>({
      query: (ids) => ({
        url: `/product/remove/all`,
        method: "DELETE",
        body: ids,
        credentials: "include",
      }),
      invalidatesTags: ["Product"],
    }),
    //Activar productos
    reactivateProducts: build.mutation<void, { ids: string[] }>({
      query: (ids) => ({
        url: `/product/reactivate/all`,
        method: "PATCH",
        body: ids,
        credentials: "include",
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useCreateProductMutation,
  useUpdateProductMutation,
  useGetProductByIdQuery,
  useGetAllProductsQuery,
  useGetPaginatedProductsQuery,
  useGetProductsByTypeQuery,
  useDeleteProductsMutation,
  useReactivateProductsMutation,
} = productsApi;
