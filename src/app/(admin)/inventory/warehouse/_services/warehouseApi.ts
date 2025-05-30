import { createApi } from "@reduxjs/toolkit/query/react";

import { PaginatedResponse } from "@/types/api/paginated-response";
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

    getPaginatedWarehouses: build.query<PaginatedResponse<SummaryWarehouse>, PaginatedWarehouseParams>({
      query: ({ pagination: { page = 1, pageSize = 10 } }) => ({
        url: "/warehouse/paginated",
        method: "GET",
        params: { page, pageSize },
        credentials: "include",
      }),
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
