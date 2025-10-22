import { createApi } from "@reduxjs/toolkit/query/react";

import { PaginatedResponse } from "@/types/api/paginated-response";
import { AdvancedPaginationParams } from "@/types/query-filters/advanced-pagination";
import { PaginatedQueryParams } from "@/types/query-filters/generic-paginated-query-params";
import baseQueryWithReauth from "@/utils/baseQuery";
import { Payment, PaymentDetail, PaymentDetailMethod, RoomPaymentDetails, SummaryPayment } from "../_types/payment";

interface GetPaymentByIdProps {
  id: string;
}

export type PaginatedPaymentParams = PaginatedQueryParams<SummaryPayment>;

export const paymentsApi = createApi({
  reducerPath: "paymentsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Payment"],
  endpoints: (build) => ({
    //Crear pagos
    createPayment: build.mutation<Payment, Partial<Payment>>({
      query: (body) => ({
        url: "/payments",
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Payment"],
    }),

    //Crear detalles de pagos
    createPaymentDetails: build.mutation<Payment, Partial<Payment>>({
      query: (body) => ({
        url: "/payments/detail",
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Payment"],
    }),

    //Actualizar pagos
    updatePayment: build.mutation<Payment, Partial<Payment> & { id: string }>({
      query: ({ id, ...body }) => ({
        url: `/payments/${id}`,
        method: "PATCH",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Payment"],
    }),

    //Actualizar detalle de pago
    updatePaymentDetail: build.mutation<PaymentDetail, Partial<PaymentDetail> & { id: string }>({
      query: ({ id, ...body }) => ({
        url: `/payments/detail/${id}`,
        method: "PATCH",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Payment"],
    }),

    //Actualizar múltiples detalles de pago en lote
    updatePaymentDetailsBatch: build.mutation<
      PaymentDetail,
      {
        paymentDetailIds: string[];
        paymentDate?: string;
        method?: PaymentDetailMethod;
      }
    >({
      query: (body) => ({
        url: `/payments/details/batch`,
        method: "PATCH",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Payment"],
    }),

    //Obtener pago por id
    getPaymentById: build.query<Payment, GetPaymentByIdProps>({
      query: ({ id }) => ({
        url: `/payments/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Payment"],
    }),

    //Obtener detalles de la habitación por id de pago
    getRoomPaymentDetails: build.query<RoomPaymentDetails, GetPaymentByIdProps>({
      query: ({ id }) => ({
        url: `/payments/room/details/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Payment"],
    }),

    //Obtener todos los pagos
    getAllPayments: build.query<SummaryPayment[], void>({
      query: () => ({
        url: "/payments",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Payment"],
    }),

    getPaginatedPayments: build.query<PaginatedResponse<SummaryPayment>, PaginatedPaymentParams>({
      query: ({ pagination: { page = 1, pageSize = 10 } }) => ({
        url: "/payments/paginated/all",
        method: "GET",
        params: { page, pageSize },
        credentials: "include",
      }),
      providesTags: (result) => [
        { type: "Payment", id: result?.meta.page },
        ...(result?.data.map(({ id }) => ({ type: "Payment" as const, id })) ?? []),
      ],
    }),

    // Nuevo endpoint con paginación avanzada
    getAdvancedPaginatedPayments: build.query<PaginatedResponse<SummaryPayment>, AdvancedPaginationParams>({
      query: ({ pagination, filters, sort }) => ({
        url: "/payments/paginated/all",
        method: "GET",
        params: {
          page: pagination.page,
          pageSize: pagination.pageSize,
          ...(filters?.search && { search: filters.search }),
          ...(filters?.status && {
            status: Array.isArray(filters.status) ? filters.status.join(",") : filters.status,
          }),
          ...(filters?.reservationId && { reservationId: filters.reservationId }),
          ...(sort?.sortBy && { sortBy: sort.sortBy }),
          ...(sort?.sortOrder && { sortOrder: sort.sortOrder }),
        },
        credentials: "include",
      }),
      providesTags: (result) => [
        { type: "Payment", id: result?.meta.page },
        ...(result?.data.map(({ id }) => ({ type: "Payment" as const, id })) ?? []),
      ],
    }),

    //Eliminar detalle de pago
    removePaymentDetail: build.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/payments/detail/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Payment"],
    }),
  }),
});

export const {
  useCreatePaymentMutation,
  useCreatePaymentDetailsMutation,
  useUpdatePaymentMutation,
  useUpdatePaymentDetailMutation,
  useUpdatePaymentDetailsBatchMutation,
  useGetPaymentByIdQuery,
  useGetAllPaymentsQuery,
  useGetPaginatedPaymentsQuery,
  useGetAdvancedPaginatedPaymentsQuery,
  useGetRoomPaymentDetailsQuery,
  useRemovePaymentDetailMutation,
} = paymentsApi;
