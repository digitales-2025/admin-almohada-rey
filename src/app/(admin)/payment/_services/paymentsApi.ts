import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReauth from "@/utils/baseQuery";
import { Payment } from "../_types/payment";

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
  }),
});

export const { useCreatePaymentMutation } = paymentsApi;
