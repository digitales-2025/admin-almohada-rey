import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReauth from "@/utils/baseQuery";
import { Payment, PaymentDetail, PaymentDetailMethod, SummaryPayment } from "../_types/payment";

interface GetPaymentByIdProps {
  id: string;
}

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

    //Obtener todos los pagos
    getAllPayments: build.query<SummaryPayment[], void>({
      query: () => ({
        url: "/payments",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Payment"],
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
  useRemovePaymentDetailMutation,
} = paymentsApi;
