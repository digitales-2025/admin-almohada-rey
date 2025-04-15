import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReauth from "@/utils/baseQuery";
import { Payment, SummaryPayment } from "../_types/payment";

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
  }),
});

export const {
  useCreatePaymentMutation,
  useCreatePaymentDetailsMutation,
  useUpdatePaymentMutation,
  useGetPaymentByIdQuery,
  useGetAllPaymentsQuery,
} = paymentsApi;
