import { createApi } from "@reduxjs/toolkit/query/react";

import { PaginatedResponse } from "@/types/api/paginated-response";
import { AdvancedPaginationParams } from "@/types/query-filters/advanced-pagination";
import { PaginatedQueryParams } from "@/types/query-filters/generic-paginated-query-params";
import baseQueryWithReauth from "@/utils/baseQuery";
import { StockWarehouse, SummaryWarehouse, Warehouse } from "../_types/warehouse";

export type PaginatedWarehouseParams = PaginatedQueryParams<SummaryWarehouse>;

interface GetWarehouseByIdProps {
  id: string;
  movementId?: string;
}

interface GetProductsStockByTypeProps {
  type: string;
  paymentDetailId?: string;
}

export const warehouseApi = createApi({
  reducerPath: "warehouseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Warehouse"],
  endpoints: (build) => ({
    //Obtener producto por id
    getWarehouseById: build.query<Warehouse, GetWarehouseByIdProps>({
      query: ({ id, movementId }) => ({
        url: `/warehouse/${id}${movementId ? `?movementId=${movementId}` : ""}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Warehouse"],
    }),
    //Obtener todos los productos
    getAllWarehouses: build.query<SummaryWarehouse[], void>({
      query: () => ({
        url: "/warehouse",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Warehouse"],
    }),

    getPaginatedWarehouses: build.query<
      PaginatedResponse<SummaryWarehouse>,
      PaginatedWarehouseParams | AdvancedPaginationParams
    >({
      query: (params) => {
        // Detectar si es formato avanzado o formato original
        if ("filters" in params && "sort" in params) {
          // Formato avanzado
          const { pagination, filters, sort } = params as AdvancedPaginationParams;
          const queryParams: Record<string, any> = {
            page: pagination.page,
            pageSize: pagination.pageSize,
          };

          // Añadir búsqueda si existe
          if (filters?.search) {
            queryParams.search = filters.search;
          }

          // Añadir filtros
          if (filters?.type) {
            queryParams.type = Array.isArray(filters.type) ? filters.type.join(",") : filters.type;
          }

          // Añadir ordenamiento
          if (sort?.sortBy) {
            queryParams.sortBy = sort.sortBy;
          }
          if (sort?.sortOrder) {
            queryParams.sortOrder = sort.sortOrder;
          }

          return {
            url: "/warehouse/paginated",
            method: "GET",
            params: queryParams,
            credentials: "include",
          };
        } else {
          // Formato original (compatibilidad hacia atrás)
          const {
            pagination: { page = 1, pageSize = 10 },
          } = params as PaginatedWarehouseParams;
          return {
            url: "/warehouse/paginated",
            method: "GET",
            params: { page, pageSize },
            credentials: "include",
          };
        }
      },
      providesTags: (result) => [
        { type: "Warehouse", id: result?.meta.page },
        ...(result?.data.map(({ id }) => ({ type: "Warehouse" as const, id })) ?? []),
      ],
    }),

    // Nuevo endpoint para obtener almacenes por tipo
    getWarehousesByType: build.query<SummaryWarehouse, { type: string }>({
      query: ({ type }) => ({
        url: `/warehouse/all/type/${type}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Warehouse"],
    }),

    // Endpint para obtener el stock de productos por tipo
    getProductsStockByType: build.query<StockWarehouse[], GetProductsStockByTypeProps>({
      query: ({ type, paymentDetailId }) => ({
        url: `/warehouse/stock/product/${type}${paymentDetailId ? `?paymentDetailId=${paymentDetailId}` : ""}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Warehouse"],
    }),

    // Nuevo endpoint para descargar el Excel de stock del almacén
    downloadWarehouseStockExcel: build.query<Blob, string>({
      query: (id) => ({
        url: `/warehouse/${id}/excel`,
        method: "GET",
        credentials: "include",
        responseHandler: (response: Response) => response.blob(),
      }),
    }),
  }),
});

export const {
  useGetAllWarehousesQuery,
  useGetWarehouseByIdQuery,
  useGetPaginatedWarehousesQuery,
  useGetWarehousesByTypeQuery,
  useGetProductsStockByTypeQuery,
  useDownloadWarehouseStockExcelQuery,
  useLazyDownloadWarehouseStockExcelQuery,
} = warehouseApi;
