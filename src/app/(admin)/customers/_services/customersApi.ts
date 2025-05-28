import { createApi } from "@reduxjs/toolkit/query/react";

import { PaginatedResponse } from "@/types/api/paginated-response";
import { PaginatedQueryParams } from "@/types/query-filters/generic-paginated-query-params";
import baseQueryWithReauth from "@/utils/baseQuery";
import { ApiCustomer, Customer, HistoryCustomer, ResponseApiCustomer } from "../_types/customer";
import { ReservationStatus } from "../../reservation/_schemas/reservation.schemas";

interface GetHistoryCustomerByIdProps {
  id: string;
  year?: string;
  status?: ReservationStatus;
}

interface ImportCustomersResponse {
  statusCode: number;
  message: string;
  data: {
    total: number;
    successful: number;
    failed: number;
    skipped: number;
    errors: Array<{
      row: number;
      data: Record<string, unknown>;
      error: string;
      type: "error" | "duplicate";
    }>;
  };
}

export type PaginateCustomerParams = PaginatedQueryParams<Customer>;

interface ImportCustomersRequest {
  file: File;
  continueOnError?: boolean;
}

export const customersApi = createApi({
  reducerPath: "customersApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Customer"],
  endpoints: (build) => ({
    //Crear clientes
    createCustomer: build.mutation<Customer, Partial<Customer>>({
      query: (body) => ({
        url: "/customers",
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Customer"],
    }),
    //Actualizar clientes
    updateCustomer: build.mutation<Customer, Partial<Customer> & { id: string }>({
      query: ({ id, ...body }) => ({
        url: `/customers/${id}`,
        method: "PATCH",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Customer"],
    }),
    //Obtener cliente por id
    getCustomerById: build.query<Customer, string>({
      query: (id) => ({
        url: `/customers/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result, error, id) => [{ type: "Customer", id }],
    }),
    //Obtener historial de clientes por id
    getHistoryCustomerById: build.query<HistoryCustomer, GetHistoryCustomerByIdProps>({
      query: ({ id, year, status }) => {
        let url = `/customers/history/booking/${id}`;
        const params = new URLSearchParams();

        if (year !== undefined) {
          params.append("year", year.toString());
        }

        if (status !== undefined) {
          params.append("status", status);
        }

        const queryString = params.toString();
        if (queryString) {
          url += `?${queryString}`;
        }

        return {
          url,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["Customer"],
    }),

    //Obtener todos los clientes
    getAllCustomers: build.query<Customer[], void>({
      query: () => ({
        url: "/customers",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Customer"],
    }),

    getPaginatedCustomers: build.query<PaginatedResponse<Customer>, PaginateCustomerParams>({
      query: ({ pagination: { page = 1, pageSize = 10 } }) => ({
        url: "/customers/paginated",
        method: "GET",
        params: { page, pageSize },
        credentials: "include",
      }),
      providesTags: (result) => [
        { type: "Customer", id: result?.meta.page },
        ...(result?.data.map(({ id }) => ({ type: "Customer" as const, id })) ?? []),
      ],
    }),

    //Eliminar clientes
    deleteCustomers: build.mutation<void, { ids: string[] }>({
      query: (ids) => ({
        url: `/customers/remove/all`,
        method: "DELETE",
        body: ids,
        credentials: "include",
      }),
      invalidatesTags: ["Customer"],
    }),
    //Activar clientes
    reactivateCustomers: build.mutation<void, { ids: string[] }>({
      query: (ids) => ({
        url: `/customers/reactivate/all`,
        method: "PATCH",
        body: ids,
        credentials: "include",
      }),
      invalidatesTags: ["Customer"],
    }),
    //BUscar clientes por numero de documento de identidad
    searchCustomersByDocumentId: build.query<ApiCustomer[], string>({
      query: (documentId) => ({
        url: `/customers/searchByDocNumber?docNumber=${documentId}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result) => (result ? result.map(({ id }) => ({ type: "Customer", id })) : ["Customer"]),
    }),

    // Importar clientes desde archivo Excel
    importCustomers: build.mutation<ImportCustomersResponse, ImportCustomersRequest>({
      query: ({ file, continueOnError = false }) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("continueOnError", String(continueOnError));

        return {
          url: "/customers/import",
          method: "POST",
          body: formData,
          credentials: "include",
          // Importante: no establecer Content-Type, lo hará automáticamente para FormData
        };
      },
      invalidatesTags: ["Customer"],
    }),
    // Descargar plantilla para importar clientes
    downloadCustomerTemplate: build.query<Blob, void>({
      query: () => ({
        url: "/customers/import/template",
        method: "GET",
        responseHandler: async (response: Response) => await response.blob(),
        credentials: "include",
      }),
    }),

    // Obtener datos de cliente por DNI desde API de Perú
    getCustomerDataByDni: build.query<ResponseApiCustomer, string>({
      query: (dni) => ({
        url: `/customers/dni/${dni}`,
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useGetCustomerByIdQuery,
  useGetHistoryCustomerByIdQuery,
  useGetAllCustomersQuery,
  useGetPaginatedCustomersQuery,
  useDeleteCustomersMutation,
  useReactivateCustomersMutation,
  useSearchCustomersByDocumentIdQuery,
  useImportCustomersMutation,
  useLazyDownloadCustomerTemplateQuery,
  useGetCustomerDataByDniQuery,
} = customersApi;
